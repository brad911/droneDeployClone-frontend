import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';

const DeleteDialogue = ({
  open,
  deleting,
  selectedProject,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !deleting && onClose()}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Delete Project</DialogTitle>
      <DialogContent>
        <Typography>
          You are about to delete <strong>{selectedProject?.name}</strong>. This
          action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={deleting}
          startIcon={deleting ? <CircularProgress size={18} /> : null}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialogue;
