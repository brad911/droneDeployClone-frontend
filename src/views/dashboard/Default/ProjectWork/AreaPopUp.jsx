import { Box, Fade, IconButton, Paper, Typography } from '@mui/material';
import { IconX } from '@tabler/icons-react';

const AreaPopUp = ({ areaPopup, setAreaPopup }) => {
  return (
    <Fade in={areaPopup.open}>
      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 2000,
          p: 1.5,
          minWidth: 150,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #3bb2d0',
          borderRadius: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0.5,
          }}
        >
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{ fontSize: '0.875rem' }}
          >
            Area
          </Typography>
          <IconButton
            size="small"
            onClick={() => setAreaPopup({ ...areaPopup, open: false })}
            sx={{ p: 0.5 }}
          >
            <IconX size={14} />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {areaPopup.area.km2} km²
        </Typography>
        <Typography variant="caption" color="textSecondary">
          ({areaPopup.area.m2} m²)
        </Typography>
      </Paper>
    </Fade>
  );
};

export default AreaPopUp;
