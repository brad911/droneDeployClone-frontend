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
  Button,
} from '@mui/material';
import Breadcrumbs from '../../../../ui-component/extended/Breadcrumbs';
import {
  IconBuildingCog,
  IconDroneOff,
  IconLiveViewFilled,
} from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import CreateWorkDayModal from './CreateWorkDayModal';
import axiosInstance from 'utils/axios.config';
import { useSelector } from 'react-redux';
mapboxgl.accessToken =
  'pk.eyJ1IjoiaGlyYWtyYWoiLCJhIjoiY21icXd5eHRnMDNtaTJxczcxd2RmbTZwOCJ9.P6kpsuLMDdeK2DIMJZMrmw';

const pageLinks = [
  { title: 'Projects', to: '/project', icon: IconDroneOff },
  { title: 'Project Name', icon: IconBuildingCog },
  { title: 'Exterior(Map View)', icon: IconLiveViewFilled }, // No `to` makes it the current page
];

export default function ViewTab() {
  const mapContainer = useRef(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [layers, setLayers] = useState({
    orthomosaic: true,
    asBuiltOverlay: false,
    annotations: false,
    measurements: false,
  });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [historicalDates, setHistoricalDates] = useState([]);
  const projectId = useSelector((state) => state.project.selectedProjectId);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [72.5714, 23.0225],
      zoom: 10,
    });
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (!projectId) return;
    const fetchWorkDays = async () => {
      try {
        const res = await axiosInstance.get('/work-day', {
          params: { projectId, status: 'completed' },
          headers: { Authorization: token },
        });
        const completed = (res.data.data?.results || []).filter(
          (w) => w.status === 'completed' && (w.projectId === projectId || w.projectId?.id === projectId)
        );
        setHistoricalDates(completed.map((w) => w.name));
        if (completed.length > 0 && !completed.find((w) => w.name === selectedDate)) {
          setSelectedDate(completed[0].name);
        }
      } catch (err) {
        setHistoricalDates([]);
      }
    };
    fetchWorkDays();
    // eslint-disable-next-line
  }, [projectId]);

  const handleLayerChange = (event) => {
    setLayers((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleUploadSave = (form) => {
    // For now, just log and close
    console.log('Upload Zone Data:', form);
    setUploadModalOpen(false);
  };

  return (
    <MainCard>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Breadcrumb */}
        <Typography variant="h1" gutterBottom>
          Exterior (Map View)
        </Typography>
        {/* Upload + Status */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setUploadModalOpen(true)}
          >
            Upload New
          </Button>

          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <CreateWorkDayModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        // onSave={handleUploadSave}
      />
      <Breadcrumbs
        links={pageLinks}
        card={true}
        custom={true}
        rightAlign={false}
      />
      <Divider sx={{ my: 2 }} />

      {/* Main Layout */}
      <Box
        sx={{
          display: 'flex',
          height: 'calc(100vh - 150px)',
          maxHeight: '100%',
        }}
      >
        {/* Left Panel */}
        <Box sx={{ width: '20%', pr: 3, overflowY: 'auto', height: '100%' }}>
          <Typography variant="h2" mb={2}>
            Project Details
          </Typography>
          <Divider sx={{ my: 1 }} />
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
          <Typography variant="h3" gutterBottom>
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
          <Divider sx={{ my: 1 }} />
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
                {historicalDates.length === 0 ? (
                  <MenuItem value="">No Data</MenuItem>
                ) : (
                  historicalDates.map((date) => (
                    <MenuItem key={date} value={date}>
                      {date}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Right Panel - Map */}
        <Box
          ref={mapContainer}
          sx={{
            width: '80%',
            borderRadius: 2,
            overflow: 'hidden',
            height: '80%',
          }}
        />
      </Box>
    </MainCard>
  );
}
