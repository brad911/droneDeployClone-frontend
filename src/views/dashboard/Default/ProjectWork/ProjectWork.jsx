import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import dayjs from 'dayjs';
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
  Divider,
  Button,
  Alert,
  CircularProgress,
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
import * as toGeoJSON from '@tmcw/togeojson';

// Import mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken =
  import.meta.env.VITE_MAPBOX_API_KEY ||
  'pk.eyJ1IjoiaGlyYWtyYWoiLCJhIjoiY21icXd5eHRnMDNtaTJxczcxd2RmbTZwOCJ9.P6kpsuLMDdeK2DIMJZMrmw';

const pageLinks = [
  { title: 'Projects', to: '/project', icon: IconDroneOff },
  { title: 'Project Name', icon: IconBuildingCog },
  { title: 'Exterior(Map View)', icon: IconLiveViewFilled },
];

export default function ProjectWork() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [layers, setLayers] = useState({
    orthomosaic: true,
    annotations: true,
  });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [historicalDates, setHistoricalDates] = useState([]);
  const [workDayData, setWorkDayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tileLoading, setTileLoading] = useState(false);
  const projectId = useSelector((state) => state.project.selectedProjectId);
  const token = useSelector((state) => state.auth.token);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    if (!mapboxgl.accessToken) {
      setError('Mapbox API key is not configured.');
      return;
    }

    const mapboxMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [72.5714, 23.0225],
      zoom: 15,
      attributionControl: false,
      preserveDrawingBuffer: true,
      minZoom: 10,
      maxZoom: 22,
    });

    mapboxMap.on('load', () => {
      mapRef.current = mapboxMap;
      setIsMapLoaded(true);
      setError(null);
      mapboxMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
    });

    mapboxMap.on('error', (e) => {
      console.error('Mapbox error:', e);
      setError('Failed to load map. Please check your internet connection.');
    });

    mapboxMap.on('sourcedata', (e) => {
      if (e.sourceId.includes('ortho-') && e.isSourceLoaded) {
        setTileLoading(false);
      }
    });

    return () => {
      if (mapboxMap && mapboxMap.remove) {
        mapboxMap.remove();
      }
      mapRef.current = null;
      setIsMapLoaded(false);
    };
  }, []);

  // Fetch work days data
  useEffect(() => {
    if (!projectId) return;

    const fetchWorkDays = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get('/work-day', {
          params: { projectId, status: 'completed' },
          headers: { Authorization: token },
        });

        const completed = res.data?.data?.results || [];
        setHistoricalDates(completed.map((w) => w.name));
        setWorkDayData(completed);

        if (completed.length > 0) {
          setSelectedDate(completed[0].name);
        } else {
          setError('No completed work days found for this project.');
        }
      } catch (err) {
        console.error('Failed to fetch work days:', err);
        setError(
          err.response?.data?.message ||
            'Failed to load project data. Please try again.',
        );
        setHistoricalDates([]);
        setWorkDayData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkDays();
  }, [projectId, token]);

  // Handle layer changes and map updates
  useEffect(() => {
    if (!selectedDate || !mapRef.current || !isMapLoaded || !workDayData.length)
      return;

    const workDay = workDayData.find((w) => w.name === selectedDate);
    if (!workDay) return;

    cleanupLayers(workDay.id);

    if (layers.orthomosaic && workDay.tileBaseUrl) {
      setTileLoading(true);
      addTileLayer(workDay);
    }

    if (layers.annotations && workDay.kmlFile) {
      addKmlLayer(workDay);
    }

    if (workDay.tileBounds) {
      fitToBounds(workDay.tileBounds);
    }
  }, [selectedDate, isMapLoaded, layers, workDayData]);

  const cleanupLayers = (workDayId) => {
    const map = mapRef.current;
    if (!map) return;

    const layerIds = [
      `ortho-${workDayId}`,
      `kml-${workDayId}-line`,
      `kml-${workDayId}-fill`,
      `bounds-box-line`,
      `bounds-box-fill`,
    ];

    layerIds.forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });

    const sourceIds = [`ortho-${workDayId}`, `kml-${workDayId}`, `bounds-box`];

    sourceIds.forEach((id) => {
      if (map.getSource(id)) map.removeSource(id);
    });
  };

  const addTileLayer = (workDay) => {
    const map = mapRef.current;
    if (!map || !workDay.tileBaseUrl) return;

    const orthoId = `ortho-${workDay.id}`;

    try {
      map.addSource(orthoId, {
        type: 'raster',
        tiles: [`${workDay.tileBaseUrl}/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: workDay.tileZoomMin || 10,
        maxzoom: workDay.tileZoomMax || 22,
      });

      map.addLayer({
        id: orthoId,
        type: 'raster',
        source: orthoId,
        paint: {
          'raster-opacity': layers.orthomosaic ? 1 : 0,
        },
      });

      if (workDay.tileBounds) {
        addBoundsLayer(workDay.tileBounds);
      }
    } catch (err) {
      console.error('Failed to add tile layer:', err);
      setError('Failed to load orthomosaic tiles.');
      setTileLoading(false);
    }
  };

  const addBoundsLayer = (bounds) => {
    const map = mapRef.current;
    if (!map) return;

    const { north, south, east, west } = bounds;

    const boundsGeoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [west, south],
                [east, south],
                [east, north],
                [west, north],
                [west, south],
              ],
            ],
          },
        },
      ],
    };

    try {
      map.addSource('bounds-box', {
        type: 'geojson',
        data: boundsGeoJSON,
      });

      map.addLayer({
        id: 'bounds-box-line',
        type: 'line',
        source: 'bounds-box',
        paint: {
          'line-color': '#00274d',
          'line-width': 3,
        },
      });

      map.addLayer({
        id: 'bounds-box-fill',
        type: 'fill',
        source: 'bounds-box',
        paint: {
          'fill-color': '#00274d',
          'fill-opacity': 0.1,
        },
      });
    } catch (err) {
      console.error('Failed to add bounds layer:', err);
    }
  };

  const fitToBounds = (bounds) => {
    const map = mapRef.current;
    if (!map) return;

    const { north, south, east, west } = bounds;
    map.fitBounds(
      [
        [west, south],
        [east, north],
      ],
      {
        padding: 50,
        maxZoom: 18,
      },
    );
  };

  const addKmlLayer = async (workDay) => {
    const map = mapRef.current;
    if (!map || !workDay.kmlFile) return;

    const kmlId = `kml-${workDay.id}`;

    try {
      const kmlUrl = `https://infrax-hirakraj.s3.amazonaws.com/kml/${workDay.projectId}/${workDay.kmlFile}`;
      const res = await fetch(kmlUrl);

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const kmlText = await res.text();
      const parser = new DOMParser();
      const kmlDom = parser.parseFromString(kmlText, 'text/xml');

      const parseError = kmlDom.querySelector('parsererror');
      if (parseError) throw new Error('Invalid KML format');

      const geojson = toGeoJSON.kml(kmlDom);

      if (geojson.features?.length > 0) {
        map.addSource(kmlId, {
          type: 'geojson',
          data: geojson,
        });

        map.addLayer({
          id: `${kmlId}-line`,
          type: 'line',
          source: kmlId,
          paint: {
            'line-color': '#ff0000',
            'line-width': 2,
          },
        });

        map.addLayer({
          id: `${kmlId}-fill`,
          type: 'fill',
          source: kmlId,
          paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.3,
          },
          filter: ['==', '$type', 'Polygon'],
        });
      }
    } catch (err) {
      console.error('Failed to load KML:', err);
      setError('Failed to load annotations.');
    }
  };

  const handleLayerChange = (event) => {
    setLayers((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  if (!projectId) {
    return (
      <MainCard>
        <Alert severity="warning">
          No project selected. Please select a project first.
        </Alert>
      </MainCard>
    );
  }

  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h1" gutterBottom>
          Exterior (Map View)
        </Typography>
        <Button
          variant="contained"
          onClick={() => setUploadModalOpen(true)}
          disabled={loading}
        >
          Upload New
        </Button>
      </Box>

      <CreateWorkDayModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      <Breadcrumbs links={pageLinks} card custom rightAlign={false} />
      <Divider sx={{ my: 2 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" height="calc(100vh - 200px)" gap={2}>
        <Box sx={{ width: '300px', pr: 2, overflowY: 'auto' }}>
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
                  disabled={loading}
                />
              }
              label="Orthomosaic"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={layers.annotations}
                  onChange={handleLayerChange}
                  name="annotations"
                  disabled={loading}
                />
              }
              label="Annotations (KML)"
            />
          </FormGroup>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Historical Data</InputLabel>
            <Select
              value={selectedDate}
              onChange={handleDateChange}
              label="Historical Data"
              disabled={loading || historicalDates.length === 0}
            >
              {historicalDates.map((date) => (
                <MenuItem key={date} value={date}>
                  {dayjs(date).format('DD-MM-YYYY')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!loading && historicalDates.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No historical data available for this project.
            </Alert>
          )}
        </Box>

        <Box
          ref={mapContainer}
          sx={{
            flex: 1,
            borderRadius: 2,
            overflow: 'hidden',
            height: '100%',
            position: 'relative',
            border: '1px solid #e0e0e0',
          }}
        >
          {tileLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.2)',
                zIndex: 1000,
              }}
            >
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Loading tiles...
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </MainCard>
  );
}
