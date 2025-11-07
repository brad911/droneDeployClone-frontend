import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';

const EditProjectModal = ({
  open,
  onClose,
  onSave,
  selectedProject,
  saving,
}) => {
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (selectedProject) {
      setForm({
        name: selectedProject.name || '',
        location: selectedProject.location || '',
        description: selectedProject.description || '',
        startDate: selectedProject.startDate
          ? selectedProject.startDate.split('T')[0]
          : '',
        endDate: selectedProject.endDate
          ? selectedProject.endDate.split('T')[0]
          : '',
      });
    }
  }, [selectedProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Project</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Project Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={18} /> : null}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectModal;
