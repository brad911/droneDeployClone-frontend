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

const MaterialModal = ({ open, onClose, data, refresh, projectId }) => {
  const [form, setForm] = useState({
    material: '',
    supplier: '',
    unit: '',
    received: '',
    used: '',
    balance: '',
    quantity: '',
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
        // ✅ Update existing manpower
        let res = await axiosInstance.patch(`/material/${data.id}`, payload);
        if (res.status === 200) {
          enqueueSnackbar('Successully Updated Material ', {
            variant: 'success',
          });
          setForm({
            material: '',
            supplier: '',
            unit: '',
            received: '',
            used: '',
            balance: '',
            quantity: '',
            remarks: '',
          });
        }
      } else {
        // ✅ Create new manpower
        let res = await axiosInstance.post('/material', payload);
        if (res.status === 201) {
          enqueueSnackbar('Successully Created Material ', {
            variant: 'success',
          });
          setForm({
            material: '',
            supplier: '',
            unit: '',
            received: '',
            used: '',
            balance: '',
            quantity: '',
            remarks: '',
          });
        }
      }

      onClose();
      refresh();
    } catch (err) {
      enqueueSnackbar(
        err.response.data ? err.response.data : 'unable to handle request',
        { variant: 'error' },
      );
      console.error('Error saving manpower:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{data ? 'Edit Material' : 'Add Material'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Material Name"
              name="material"
              value={form.material}
              onChange={handleChange}
            ></TextField>
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
              label="Supplier"
              fullWidth
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="number"
              label="Received"
              fullWidth
              name="received"
              value={form.received}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Used"
              fullWidth
              type="number"
              name="used"
              value={form.used}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Balance"
              type="number"
              fullWidth
              name="balance"
              value={form.balance}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Remarks"
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

export default MaterialModal;
