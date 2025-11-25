// File: ResolveIssueModal.jsx

import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
} from '@mui/material';
import { useState, useEffect } from 'react';

export default function ResolveIssueModal({
  open,
  onClose,
  issue,
  onUpdateStatus,
}) {
  const [status, setStatus] = useState(issue?.status || 'open');

  useEffect(() => {
    if (issue) setStatus(issue.status);
  }, [issue]);

  if (!issue) return null;

  const handleSubmit = () => {
    onUpdateStatus({
      id: issue.id,
      status,
      resolvedAt: new Date(),
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          p: 3,
          width: 400,
          mx: 'auto',
          mt: 10,
          borderRadius: 3,
        }}
      >
        <Typography variant="h3" fontWeight={700} mb={2}>
          Resolve Issue
        </Typography>

        <Typography variant="body2" mb={2}>
          <strong>Issue:</strong> {issue.title}
        </Typography>

        <TextField
          fullWidth
          select
          label="Update Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="inProgress">In Progress</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </TextField>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Save Changes
        </Button>
      </Paper>
    </Modal>
  );
}
