// src/views/pages/project/dialogs/PhotoDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { useState } from 'react';

const PhotoDialog = ({ open, onClose, onAdd }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');

  const handleAdd = () => {
    if (file) onAdd({ file, caption });
    setFile(null);
    setCaption('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Photo</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Button variant="outlined" component="label">
            Choose Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
          <TextField
            label="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!file}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhotoDialog;
