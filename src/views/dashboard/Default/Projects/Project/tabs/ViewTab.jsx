import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  Typography,
  Box,
  Stack,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  useTheme,
  Divider,
} from '@mui/material';

mapboxgl.accessToken =
  'pk.eyJ1IjoiaGlyYWtyYWoiLCJhIjoiY21icXd5eHRnMDNtaTJxczcxd2RmbTZwOCJ9.P6kpsuLMDdeK2DIMJZMrmw';

export default function ViewTab() {
  const mapContainer = useRef(null);
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState('2024-03-01');
  const [layers, setLayers] = useState({
    orthomosaic: true,
    asBuiltOverlay: false,
    annotations: false,
    measurements: false,
  });

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [72.5714, 23.0225],
      zoom: 10,
    });

    return () => map.remove();
  }, []);

  const handleLayerChange = (event) => {
    setLayers((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', px: 3, py: 2 }}>
      {/* Left Panel */}
      <Box sx={{ width: '30%', pr: 3, overflowY: 'auto' }}>
        <Typography variant="h5" mb={2}>
          Project Details
        </Typography>

        <Stack spacing={1} mb={3}>
          <Typography>
            <strong>Name:</strong> City Drainage Phase 1
          </Typography>
          <Typography>
            <strong>Capture Date:</strong> 2025-06-25
          </Typography>
          <Typography>
            <strong>Area:</strong> 3.2 sq km
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Layers */}
        <Typography variant="subtitle1" gutterBottom>
          Layers
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={layers.orthomosaic}
                onChange={handleLayerChange}
                name="orthomosaic"
              />
            }
            label="Orthomosaic"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={layers.asBuiltOverlay}
                onChange={handleLayerChange}
                name="asBuiltOverlay"
              />
            }
            label="As-Built Overlay"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={layers.annotations}
                onChange={handleLayerChange}
                name="annotations"
              />
            }
            label="Annotations"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={layers.measurements}
                onChange={handleLayerChange}
                name="measurements"
              />
            }
            label="Measurements"
          />
        </FormGroup>

        {/* Historical Data */}
        <Box mt={3}>
          <FormControl fullWidth>
            <InputLabel id="historical-label">Historical Data</InputLabel>
            <Select
              labelId="historical-label"
              value={selectedDate}
              label="Historical Data"
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <MenuItem value="2024-03-01">March 1, 2024</MenuItem>
              <MenuItem value="2024-06-15">June 15, 2024</MenuItem>
              <MenuItem value="2025-01-05">January 5, 2025</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Right Panel - Map */}
      <Box
        ref={mapContainer}
        sx={{
          width: '70%',
          borderRadius: 2,
          overflow: 'hidden',
          height: '100%',
        }}
      />
    </Box>
  );
}
