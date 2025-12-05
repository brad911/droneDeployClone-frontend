// SingleImageViewer.jsx
import { Modal, Box, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SingleImageViewer({ open, image, onClose, onDelete }) {
  const handleDelete = () => {
    if (onDelete && image) {
      onDelete(image);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: '90vw', sm: '70vw', md: '50vw' },
          maxWidth: 800,
          height: { xs: '60vh', sm: '70vh', md: '60vh' },
          maxHeight: 600,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            color: '#fff',
            bgcolor: 'rgba(0,0,0,0.5)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Delete button */}
        {onDelete && (
          <IconButton
            onClick={handleDelete}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 10,
              color: '#fff',
              bgcolor: 'rgba(255,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(255,0,0,0.7)' },
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}

        {/* Image */}
        {image && (
          <Box
            component="img"
            src={image}
            alt="preview"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 2,
            }}
          />
        )}
      </Box>
    </Modal>
  );
}
