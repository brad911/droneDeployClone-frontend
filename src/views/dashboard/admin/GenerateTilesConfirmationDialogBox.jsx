import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
} from '@mui/material';
import { IconPhotoEdit } from '@tabler/icons-react';
import Loader from 'ui-component/Loader';

const GenerateTilesConfirmationBox = ({
  confirmDialog,
  generateTilesLoading,
  handleCancelGenerateTiles,
  handleConfirmGenerateTiles,
}) => {
  const [maxZoom, setMaxZoom] = useState(18); // ✅ Default value

  const handleZoomChange = (_, value) => {
    setMaxZoom(value);
  };

  const handleProceed = () => {
    handleConfirmGenerateTiles(maxZoom); // ✅ Pass zoom to parent function
  };

  return (
    <Dialog
      open={confirmDialog.open}
      onClose={generateTilesLoading ? undefined : handleCancelGenerateTiles}
      aria-labelledby="generate-tiles-dialog-title"
      aria-describedby="generate-tiles-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle
        id="generate-tiles-dialog-title"
        sx={{
          bgcolor: 'primary.light',
          color: 'warning.contrastText',
          fontWeight: 600,
          fontSize: '1.1rem',
        }}
      >
        ⚠️ Confirmation
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {generateTilesLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <IconPhotoEdit sx={{ color: 'primary.light', fontSize: 32 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Generating Tiles...
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              Please wait while we process your request. This may take several
              minutes.
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
              <Loader />
            </Box>
          </Box>
        ) : (
          <>
            <Box
              sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mt: 2 }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.5,
                }}
              >
                <IconPhotoEdit sx={{ color: 'primary.light', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: 'text.primary',
                  }}
                >
                  Time-Intensive Operation
                </Typography>
                <Typography
                  variant="body1"
                  id="generate-tiles-dialog-description"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  This tile generation process will take at least{' '}
                  <strong>10 minutes</strong> to complete. The system will
                  process your data in the background.
                </Typography>
              </Box>
            </Box>

            {/* 🔧 Zoom Selector */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Maximum Zoom Level: <strong>{maxZoom}</strong>
              </Typography>
              <Slider
                value={maxZoom}
                onChange={handleZoomChange}
                min={10}
                max={24}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={handleCancelGenerateTiles}
          variant="outlined"
          disabled={generateTilesLoading}
          sx={{
            color: 'error.main',
            borderColor: 'error.main',
            fontWeight: 500,
            px: 3,
            py: 1,
            '&:hover': {
              bgcolor: 'error.50',
              borderColor: 'error.dark',
            },
            '&:disabled': {
              color: 'grey.400',
              borderColor: 'grey.300',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleProceed}
          variant="contained"
          disabled={generateTilesLoading}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 500,
            px: 3,
            py: 1,
            '&:hover': {
              bgcolor: 'secondary.light',
              color: 'black',
            },
            '&:focus': {
              bgcolor: 'primary.main',
            },
            '&:disabled': {
              bgcolor: 'grey.300',
              color: 'grey.500',
            },
          }}
        >
          {generateTilesLoading ? 'Processing...' : 'Proceed'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateTilesConfirmationBox;
