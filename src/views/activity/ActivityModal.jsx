import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
  Typography,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../utils/axios.config';
import { enqueueSnackbar } from 'notistack';

const ActivityModal = ({
  open,
  onClose,
  projectId,
  user,
  onCreated,
  onUpdated,
  activity, // optional -> when provided, modal is in "edit" mode
}) => {
  const isEdit = Boolean(activity);

  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: '',
    cost: '',
    assignedTo: '',
  });

  // checklist only used during create flow
  const [checklist, setChecklist] = useState([{ description: '' }]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTeamMembers = async () => {
    try {
      setLoadingMembers(true);
      const res = await axiosInstance.get(`project-members/query`, {
        params: { projectId, limit: 100 },
      });
      setTeamMembers(res.data?.data?.results || res?.data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTeamMembers();
      // if editing, prefill form
      if (isEdit) {
        setForm({
          name: activity.name ?? '',
          quantity: activity.quantity ?? '',
          unit: activity.unit ?? '',
          cost: activity.cost ?? '',
          status: activity.status ?? '',
          assignedTo:
            typeof activity.assignedTo === 'string'
              ? activity.assignedTo
              : activity.assignedTo?._id || activity.assignedTo?.id || '',
        });
      } else {
        // reset create form
        setForm({
          name: '',
          quantity: '',
          unit: '',
          cost: '',
          assignedTo: '',
          status: '',
        });
        setChecklist([{ description: '' }]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activity]);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleChecklistChange = (i, value) => {
    const updated = [...checklist];
    updated[i].description = value;
    setChecklist(updated);
  };

  const handleAddChecklist = () =>
    setChecklist((c) => [...c, { description: '' }]);
  const handleRemoveChecklist = (i) =>
    setChecklist((c) => c.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (isEdit) {
        const payload = {
          name: form.name,
          quantity: form.quantity,
          unit: form.unit,
          cost: form.cost,
          status: form.status,
          assignedTo: form.assignedTo,
          activityChecklist: checklist,
          projectId,
        };
        // update activity
        await axiosInstance.patch(`/activity/${activity._id}`, payload);
        if (onUpdated) onUpdated();
      } else {
        // create activity
        const payload = {
          name: form.name,
          quantity: form.quantity,
          unit: form.unit,
          cost: form.cost,
          status: form.status,
          assignedTo: form.assignedTo,
          activityChecklist: checklist,
          projectId,
        };
        const res = await axiosInstance.post('/activity', payload);
        if (res.status === 201) {
          enqueueSnackbar('Activity created successfully', {
            variant: 'success',
          });
        }
        if (onCreated) onCreated();
      }
      onClose();
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || 'Failed to submit activity',
        { variant: 'error' },
      );
      console.error('Error submitting activity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit Activity' : 'Create Activity'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Quantity"
              fullWidth
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Unit"
              fullWidth
              name="unit"
              value={form.unit}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Cost"
              fullWidth
              name="cost"
              type="number"
              value={form.cost}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Status"
              fullWidth
              name="status"
              value={form.status}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Assign To"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              disabled={loadingMembers}
              fullWidth
              sx={{ minWidth: '220px' }}
            >
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => {
                  const userObj = member?.userId;
                  console.log('member:', member);
                  const uid = userObj?.id;
                  const label = `${userObj?.firstName || ''} ${userObj?.lastName || ''}`;
                  return (
                    <MenuItem key={uid} value={uid}>
                      {label}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem disabled>
                  {loadingMembers ? 'Loading members...' : 'No members'}
                </MenuItem>
              )}
            </TextField>
          </Grid>
        </Grid>

        {/* Checklist only for create flow */}
        {!isEdit && (
          <>
            <Box mt={2}>
              <Typography variant="subtitle1">Checklist</Typography>
              {checklist.map((item, i) => (
                <Grid
                  container
                  alignItems="center"
                  spacing={1}
                  key={i}
                  sx={{ mt: 1 }}
                >
                  <Grid item xs={10}>
                    <TextField
                      fullWidth
                      placeholder={`Checklist item ${i + 1}`}
                      value={item.description}
                      onChange={(e) => handleChecklistChange(i, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveChecklist(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button
                variant="text"
                startIcon={<AddIcon />}
                sx={{ mt: 1 }}
                onClick={handleAddChecklist}
              >
                Add Checklist Item
              </Button>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <CircularProgress size={20} />
          ) : isEdit ? (
            'Update'
          ) : (
            'Create'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityModal;
