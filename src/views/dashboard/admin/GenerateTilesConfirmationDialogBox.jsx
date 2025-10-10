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
  const [maxZoom, setMaxZoom] = useState(18);

  const handleZoomChange = (_, value) => {
    setMaxZoom(value);
  };

  const handleProceed = () => {
    handleConfirmGenerateTiles(maxZoom);
  };

  return (
    <Dialog
      open={confirmDialog.open}
      onClose={generateTilesLoading ? undefined : handleCancelGenerateTiles}
      aria-labelledby="generate-tiles-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 420,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle
        id="generate-tiles-dialog-title"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          fontWeight: 600,
          fontSize: '1.1rem',
          mb: 2,
        }}
      >
        🧱 Generate Raster Tiles
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {generateTilesLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Loader />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mt: 2,
                mb: 1,
              }}
            >
              Starting background job...
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6,
                maxWidth: 300,
                mx: 'auto',
              }}
            >
              Your raster tile generation has started. You can track progress in
              the <strong>“Comment”</strong> section of this workday.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
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
                }}
              >
                <IconPhotoEdit size={26} />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                >
                  This process may take few hours depending on image size. Once
                  started, it will run safely in the background — you can
                  monitor progress in the comment box.
                </Typography>
              </Box>
            </Box>

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
            '&:hover': { bgcolor: 'error.50' },
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
            '&:hover': { bgcolor: 'secondary.light', color: 'black' },
          }}
        >
          {generateTilesLoading ? 'Starting...' : 'Start Job'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateTilesConfirmationBox;
