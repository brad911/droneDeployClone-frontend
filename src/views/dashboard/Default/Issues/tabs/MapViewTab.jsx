import { Box, Typography } from '@mui/material';

export default function MapViewTab() {
  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        bgcolor: '#e0e0e0',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h6">Map View (Mapbox Placeholder)</Typography>
    </Box>
  );
}
