import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';

const DuplicateDialogue = ({
  open,
  duplicating,
  selectedProject,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !duplicating && onClose()}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Duplicate Project</DialogTitle>
      <DialogContent>
        <Typography>
          You are about to duplicate <strong>{selectedProject?.name}</strong>.
          This will create a copy of the project with all related data.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={duplicating}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          disabled={duplicating}
          startIcon={duplicating ? <CircularProgress size={18} /> : null}
        >
          {duplicating ? 'Duplicating...' : 'Duplicate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuplicateDialogue;
