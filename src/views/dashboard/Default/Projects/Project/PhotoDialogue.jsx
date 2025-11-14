// src/views/pages/project/dialogs/PhotoDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';

const PhotoDialog = ({ open, onClose, onAdd }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState(null);

  const handleAdd = () => {
    if (file) onAdd({ file, caption });
    setFile(null);
    setCaption('');
    setPreview(null);
    onClose();
  };

  // Generate preview URL
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Photo</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* File Selector */}
          <Button variant="outlined" component="label">
            Choose Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>

          {/* IMAGE PREVIEW */}
          {preview && (
            <Box
              sx={{
                width: '100%',
                height: 250,
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f9f9f9',
              }}
            >
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}

          {/* Caption */}
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
