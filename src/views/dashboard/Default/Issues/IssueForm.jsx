import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';

const IssueForm = ({ open = false, onClose, onSave }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    priority: '',
    category: '',
    assignee: '',
    photos: [],
  });

  const teamMembers = [
    'John Smith',
    'Sarah Johnson',
    'Alex Lee',
    'Priya Patel',
  ];
  const categories = ['Architecture', 'Structure', 'MEPF', 'Safety', 'Quality'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    setForm((prev) => ({ ...prev, photos: Array.from(e.target.files) }));
  };

  const handleSubmit = () => {
    if (onSave) onSave(form);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          outline: 'none',
          width: 500,
          maxWidth: '90vw',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          mx: 'auto',
          mt: '5%',
          p: 3,
        }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          New Issue
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Scheduled Date"
            type="date"
            value={form.date}
            onChange={(e) => handleFormChange('date', e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Issue Title"
            value={form.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            fullWidth
            size="small"
            multiline
            minRows={2}
          />
          <TextField
            select
            label="Priority"
            value={form.priority}
            onChange={(e) => handleFormChange('priority', e.target.value)}
            fullWidth
            size="small"
          >
            {priorities.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Category"
            value={form.category}
            onChange={(e) => handleFormChange('category', e.target.value)}
            fullWidth
            size="small"
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Assign To"
            value={form.assignee}
            onChange={(e) => handleFormChange('assignee', e.target.value)}
            fullWidth
            size="small"
          >
            {teamMembers.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="outlined" component="label">
            Attach Photos
            <input type="file" hidden multiple onChange={handlePhotoUpload} />
          </Button>

          {form.photos.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {form.photos.map((file, idx) => (
                <Typography key={idx} variant="caption">
                  {file.name}
                </Typography>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save Issue
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default IssueForm;
