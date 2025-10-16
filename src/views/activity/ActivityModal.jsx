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
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../utils/axios.config';
import { enqueueSnackbar } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ActivityModal = ({
  open,
  onClose,
  projectId,
  user,
  onCreated,
  onUpdated,
  activity,
}) => {
  const isEdit = Boolean(activity);
  const theme = useTheme();

  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: '',
    cost: '',
    assignedTo: '',
    status: '',
    startedAt: null,
    endedAt: null,
  });

  const [checklist, setChecklist] = useState([{ description: '' }]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 For templates
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isTemplate, setIsTemplate] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

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

  // 🔹 Fetch available templates
  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const res = await axiosInstance.get(`/activity`, {
        params: {
          projectId,
          isTemplate: true,
        },
      });
      setTemplates(res.data?.data.results || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  // 🔹 Load checklist items from a selected template only
  const handleTemplateSelect = async (templateId) => {
    setSelectedTemplate(templateId);
    if (!templateId) return;
    try {
      const res = await axiosInstance.get(`/activity-checklist`, {
        params: { activityId: templateId, limit: 100 },
      });
      const items = res.data?.data?.results || [];
      setChecklist(
        items.length > 0
          ? items.map((i) => ({ description: i.description }))
          : [{ description: '' }],
      );
    } catch (err) {
      console.error('Error loading checklist template:', err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTeamMembers();
      if (!isEdit) fetchTemplates();

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
          startedAt: activity.startedAt ? dayjs(activity.startedAt) : null,
          endedAt: activity.endedAt ? dayjs(activity.endedAt) : null,
        });
      } else {
        setForm({
          name: '',
          quantity: '',
          unit: '',
          cost: '',
          assignedTo: '',
          status: '',
          startedAt: null,
          endedAt: null,
        });
        setChecklist([{ description: '' }]);
        setSelectedTemplate('');
        setIsTemplate(false);
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
      const payload = {
        name: form.name,
        quantity: form.quantity,
        unit: form.unit,
        cost: form.cost,
        status: form.status,
        assignedTo: form.assignedTo,
        startedAt: form.startedAt ? form.startedAt.toISOString() : null,
        endedAt: form.endedAt ? form.endedAt.toISOString() : null,
        activityChecklist: checklist,
        projectId,
        isTemplate,
      };

      if (isEdit) {
        await axiosInstance.patch(`/activity/${activity._id}`, payload);
        if (onUpdated) onUpdated();
      } else {
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid
            container
            justifyContent={'space-around'}
            spacing={2}
            sx={{ mt: 1 }}
          >
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
              <FormControl>
                <InputLabel>Status</InputLabel>
                <Select
                  sx={{ minWidth: 220 }}
                  name="status"
                  value={form.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="planned">Planned</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="delayed">Delayed</MenuItem>
                  <MenuItem value="planned_further">Planned Further</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                label="Start Date"
                value={form.startedAt}
                onChange={(newValue) =>
                  setForm((s) => ({ ...s, startedAt: newValue }))
                }
                format="DD-MM-YYYY"
                slotProps={{
                  textField: { sx: theme.typography.muiDate },
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                label="End Date"
                value={form.endedAt}
                onChange={(newValue) =>
                  setForm((s) => ({ ...s, endedAt: newValue }))
                }
                format="DD-MM-YYYY"
                slotProps={{
                  textField: { sx: theme.typography.muiDate },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={{ minWidth: 220 }}
                select
                label="Assign To"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                disabled={loadingMembers}
                fullWidth
              >
                {teamMembers.length > 0 ? (
                  teamMembers.map((member) => {
                    const userObj = member?.userId;
                    const uid = userObj?.id;
                    const label = `${userObj?.firstName || ''} ${
                      userObj?.lastName || ''
                    }`;
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
        </LocalizationProvider>

        {/* ✅ Checklist Section */}
        {!isEdit && (
          <Grid container spacing={2} justifyContent={'space-around'}>
            <Grid
              width={'90%'}
              item
              mt={2}
              spacing={2}
              flex
              justifyContent={'center'}
            >
              <FormControl sx={{ mb: 2, width: '100%' }}>
                <InputLabel>Use Existing Checklist</InputLabel>
                <Select
                  value={selectedTemplate}
                  label="Use Existing Checklist"
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  disabled={loadingTemplates}
                >
                  <MenuItem value="">None</MenuItem>
                  {templates.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name || `Template #${t.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid
              item
              sx={{ px: 3, pb: 2, width: '100%' }}
              justifyContent={'left'}
            >
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
            </Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isTemplate}
                  onChange={(e) => setIsTemplate(e.target.checked)}
                />
              }
              label="Save this checklist as a reusable template"
              sx={{ mt: 2 }}
            />
          </Grid>
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
