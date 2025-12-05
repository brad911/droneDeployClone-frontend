import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';

export default function UploadImageModal({
  open,
  onClose,
  onFilesSelected,
  onUpload,
  selectedFiles,
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: true,
    onDrop: (files) => onFilesSelected({ target: { files } }),
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: 'white',
          p: 2,
          width: 350,
          mx: 'auto',
          mt: '20vh',
          borderRadius: 1,
        }}
      >
        <Typography fontWeight={600} mb={2}>
          Upload Photos
        </Typography>

        {/* Dropzone Area */}
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 1,
            p: 2,
            textAlign: 'center',
            mb: 2,
            cursor: 'pointer',
            bgcolor: isDragActive ? '#f0f0f0' : 'transparent',
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="caption" color="text.secondary">
            {isDragActive
              ? 'Drop the files here ...'
              : 'Drag & drop images here, or click to select'}
          </Typography>
        </Box>

        {/* Selected Images Previews */}
        {selectedFiles.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              mb: 2,
              minHeight: 60,
            }}
          >
            {selectedFiles.map((file, idx) => (
              <Box
                key={idx}
                sx={{
                  position: 'relative',
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid #ddd',
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Remove Button */}
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    bgcolor: 'rgba(255,255,255,0.7)',
                    p: 0.5,
                  }}
                  onClick={() => {
                    const updated = selectedFiles.filter((_, i) => i !== idx);
                    onFilesSelected({ target: { files: updated } });
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Upload & Cancel */}
        <Box display="flex" gap={1}>
          <Button variant="contained" fullWidth onClick={onUpload}>
            Upload
          </Button>
          <Button variant="outlined" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
