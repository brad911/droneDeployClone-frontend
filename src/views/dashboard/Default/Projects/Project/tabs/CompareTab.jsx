import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  useTheme,
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@mui/material';
import { ReactCompareSlider } from 'react-compare-slider';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1IjoiaGlyYWtyYWoiLCJhIjoiY21icXd5eHRnMDNtaTJxczcxd2RmbTZwOCJ9.P6kpsuLMDdeK2DIMJZMrmw';

const mockMapSnapshots = new Array(10).fill(null).map((_, i) => ({
  id: i,
  label: `Day ${i + 1}`,
  center: [72.5714 + i * 0.1, 23.0225 + i * 0.1],
  zoom: 10 + (i % 3),
}));

const MapBoxInstance = ({ center, zoom, mapStyle }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapStyle,
      center,
      zoom,
    });

    return () => map.remove();
  }, [center, zoom, mapStyle]);

  return <Box ref={containerRef} sx={{ width: '100%', height: '100%' }} />;
};

export default function CompareMapsTab() {
  const [firstMap, setFirstMap] = useState(mockMapSnapshots[0]);
  const [secondMap, setSecondMap] = useState(mockMapSnapshots[1]);
  const theme = useTheme();

  const handleSelect = (type, id) => {
    const snap = mockMapSnapshots.find((s) => s.id === id);
    if (type === 'first') setFirstMap(snap);
    else setSecondMap(snap);
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 5 },
    desktop: { breakpoint: { max: 1536, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Compare Progress
      </Typography>
      <Box sx={{ mt: 4, mb: 4, height: 100 }}>
        <Carousel
          responsive={responsive}
          centerMode
          infinite
          autoPlay
          autoPlaySpeed={5000}
          itemClass="carousel-item-padding-40-px"
        >
          {mockMapSnapshots.map((snap, index) => (
            <Card
              key={snap.id}
              sx={{
                mx: 1,
                borderColor: theme.palette.primary,
                borderRadius: 2,
                border: 1,
                boxShadow: 6,
                height: '80px',
              }}
            >
              <CardContent>
                <Typography align="center" variant="subtitle1">
                  {snap.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Carousel>
      </Box>
      {/* Selection Inputs */}
      <Box display="flex" gap={2} mb={3}>
        <FormControl fullWidth>
          <Select
            value={firstMap.id}
            onChange={(e) => handleSelect('first', e.target.value)}
          >
            {mockMapSnapshots.map((snap) => (
              <MenuItem key={snap.id} value={snap.id}>
                {snap.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <Select
            value={secondMap.id}
            onChange={(e) => handleSelect('second', e.target.value)}
          >
            {mockMapSnapshots.map((snap) => (
              <MenuItem key={snap.id} value={snap.id}>
                {snap.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Map Compare Slider */}
      <Box mb={5} borderRadius={2} overflow="hidden" sx={{ height: 400 }}>
        <ReactCompareSlider
          itemOne={
            <Box sx={{ width: '100%', height: '100%' }}>
              <MapBoxInstance
                center={firstMap.center}
                zoom={firstMap.zoom}
                mapStyle="mapbox://styles/mapbox/streets-v11"
              />
            </Box>
          }
          itemTwo={
            <Box sx={{ width: '100%', height: '100%' }}>
              <MapBoxInstance
                center={secondMap.center}
                zoom={secondMap.zoom}
                mapStyle="mapbox://styles/mapbox/satellite-v9"
              />
            </Box>
          }
          style={{ height: '100%' }}
        />
      </Box>

      {/* Snapshot Carousel */}
    </Box>
  );
}
