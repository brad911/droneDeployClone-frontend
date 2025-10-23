import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
} from '@mui/material';
import axiosInstance from '../../../../utils/axios.config';
import { enqueueSnackbar } from 'notistack';

const ManPowerModal = ({ open, onClose, data, refresh, projectId }) => {
  const [form, setForm] = useState({
    manPower: 'skilled',
    supplier: '',
    trade: '',
    allocated: '',
    occupied: '',
    idle: '',
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
        let res = await axiosInstance.patch(`/manPower/${data.id}`, payload);
        if (res.status === 200) {
          enqueueSnackbar('Successully updated Man Power ', {
            variant: 'success',
          });
          setForm({
            manPower: 'skilled',
            supplier: '',
            trade: '',
            allocated: '',
            occupied: '',
            idle: '',
            remarks: '',
          });
        }
      } else {
        // ✅ Create new manpower
        let res = await axiosInstance.post('/manPower', payload);
        if (res.status === 201) {
          enqueueSnackbar('Successully Created Man Power ', {
            variant: 'success',
          });
          setForm({
            manPower: 'skilled',
            supplier: '',
            trade: '',
            allocated: '',
            occupied: '',
            idle: '',
            remarks: '',
          });
        }
      }

      refresh();
      onClose();
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
      <DialogTitle>{data ? 'Edit Man Power' : 'Add Man Power'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              sx={{ minWidth: 220 }}
              select
              fullWidth
              label="Man Power"
              name="manPower"
              value={form.manPower}
              onChange={handleChange}
            >
              <MenuItem value="skilled">Skilled</MenuItem>
              <MenuItem value="unskilled">Unskilled</MenuItem>
            </TextField>
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
              label="Trade"
              fullWidth
              name="trade"
              value={form.trade}
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
          <Grid item xs={6}>
            <TextField
              label="Occupied"
              type="number"
              fullWidth
              name="occupied"
              value={form.occupied}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Idle"
              type="number"
              fullWidth
              name="idle"
              value={form.idle}
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

export default ManPowerModal;
