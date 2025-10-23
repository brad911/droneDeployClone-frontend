import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import axiosInstance from '../../../../utils/axios.config';
import { enqueueSnackbar } from 'notistack';

const MachineryModal = ({ open, onClose, data, refresh, projectId }) => {
  const [form, setForm] = useState({
    machinery: '',
    supplier: '',
    allocated: '',
    occupied: '',
    idle: '',
    maintainance: '',
    remarks: '',
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, projectId };

      if (data) {
        const res = await axiosInstance.patch(`/machinery/${data.id}`, payload);
        if (res.status === 200) {
          enqueueSnackbar('Successfully updated machinery', {
            variant: 'success',
          });
        }
      } else {
        const res = await axiosInstance.post('/machinery', payload);
        if (res.status === 201) {
          enqueueSnackbar('Successfully created machinery', {
            variant: 'success',
          });
        }
      }

      refresh();
      onClose();
      setForm({
        category: '',
        supplier: '',
        status: '',
        quantity: '',
        remarks: '',
      });
    } catch (err) {
      enqueueSnackbar(err.response?.data || 'Unable to handle request', {
        variant: 'error',
      });
      console.error('Error saving machinery:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{data ? 'Edit Machinery' : 'Add Machinery'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              label="Machinery Name"
              fullWidth
              name="machinery"
              value={form.machinery}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Supplier"
              fullWidth
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Allocated"
              type="number"
              fullWidth
              name="allocated"
              value={form.allocated}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Occupied"
              fullWidth
              type="number"
              name="occupied"
              value={form.occupied}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="idle"
              fullWidth
              type="number"
              name="idle"
              value={form.idle}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Maintainance"
              fullWidth
              type="number"
              name="maintainance"
              value={form.maintainance}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="remarks"
              fullWidth
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {data ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MachineryModal;
