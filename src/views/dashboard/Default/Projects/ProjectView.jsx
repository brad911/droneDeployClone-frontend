import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Box, Button, Stack } from '@mui/material';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const ProjectView = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  useEffect(() => {
    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [77.209, 28.6139], // New Delhi coords
      zoom: 10,
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add draw control
    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
      },
    });
    mapRef.current.addControl(drawRef.current, 'top-left');

    // Cleanup on unmount
    return () => {
      mapRef.current.remove();
    };
  }, []);

  const handleAddMarker = () => {
    if (!mapRef.current) return;
    const marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat(mapRef.current.getCenter())
      .addTo(mapRef.current);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* <Box ref={mapContainerRef} sx={{ width: '100%', height: '100%' }} />

      <Stack
        direction="row"
        spacing={2}
        sx={{ position: 'absolute', top: 20, left: 20, zIndex: 1000 }}
      >
        <Button variant="contained" onClick={handleAddMarker}>
          Add Marker
        </Button>
        <Button
          variant="outlined"
          onClick={() => drawRef.current?.changeMode('draw_polygon')}
        >
          Draw Polygon
        </Button>
        <Button
          variant="outlined"
          onClick={() => drawRef.current?.changeMode('draw_line_string')}
        >
          Draw Line
        </Button>
        <Button
          variant="outlined"
          onClick={() => drawRef.current?.changeMode('draw_point')}
        >
          Draw Point
        </Button>
        <Button
          color="error"
          variant="outlined"
          onClick={() => drawRef.current?.trash()}
        >
          Delete
        </Button>
      </Stack> */}
    </Box>
  );
};

export default ProjectView;
