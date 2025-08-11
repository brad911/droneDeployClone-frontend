import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import geojsonArea from '@mapbox/geojson-area';
import dayjs from 'dayjs';
import * as turf from '@turf/turf';
import {
  Typography,
  Box,
  FormControlLabel,
  FormGroup,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Paper,
  IconButton,
  Fade,
} from '@mui/material';
import {
  IconBuildingCog,
  IconDroneOff,
  IconLiveViewFilled,
  IconX,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import Breadcrumbs from '../../../../ui-component/extended/Breadcrumbs';
import MainCard from 'ui-component/cards/MainCard';
import CreateWorkDayModal from './CreateWorkDayModal';
import axiosInstance from 'utils/axios.config';
import { useSelector } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import { enqueueSnackbar } from 'notistack';
import CommentInput from './CommentInput';
import AreaPopUp from './AreaPopUp';

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
  const drawRef = useRef(null);

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
  const [commentFeatures, setCommentFeatures] = useState([]);
  const [test, setTest] = useState({});
  const [areaPopup, setAreaPopup] = useState({
    open: false,
    area: 0,
    position: { x: 0, y: 0 },
  });
  const [commentInput, setCommentInput] = useState({
    open: false,
    feature: null,
    isEdit: false,
    position: { x: 0, y: 0 },
  });

  const projectId = useSelector((state) => state.project.selectedProjectId);
  const token = useSelector((state) => state.auth.token);

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

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    if (!mapboxgl.accessToken) {
      setError('Mapbox API key is not configured.');
      return;
    }

    const mapboxMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [72.5714, 23.0225],
      zoom: 15,
      attributionControl: false,
      preserveDrawingBuffer: true,
      minZoom: 0,
      maxZoom: 23,
    });

    mapboxMap.on('load', () => {
      mapRef.current = mapboxMap;
      setIsMapLoaded(true);
      setError(null);

      mapboxMap.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      mapboxMap.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-right',
      );

      // Add scale control with custom styling
      const scaleControl = new mapboxgl.ScaleControl({
        unit: 'metric',
        maxWidth: 100,
      });
      mapboxMap.addControl(scaleControl, 'bottom-left');

      // Ensure scale control is visible
      setTimeout(() => {
        const scaleElement = mapboxMap
          .getContainer()
          .querySelector('.mapboxgl-ctrl-scale');
        if (scaleElement) {
          scaleElement.style.display = 'block';
          scaleElement.style.visibility = 'visible';
          scaleElement.style.opacity = '1';
        }
      }, 1000);

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          line_string: true,
          point: true,
          trash: true,
        },
        styles: [
          ,
          {
            id: 'gl-draw-line',
            type: 'line',
            paint: { 'line-color': '#ff0000', 'line-width': 1 },
          },
          {
            id: 'gl-draw-polygon-fill-active',
            type: 'fill',
            filter: [
              'all',
              ['==', '$type', 'Polygon'],
              ['==', 'active', 'true'],
            ],
            paint: {
              'fill-color': '#3bb2d0',
              'fill-outline-color': '#3bb2d0',
              'fill-opacity': 0.3,
            },
          },
          {
            id: 'gl-draw-polygon-fill-inactive',
            type: 'fill',
            filter: [
              'all',
              ['==', '$type', 'Polygon'],
              ['==', 'active', 'false'],
            ],
            paint: {
              'fill-color': '#3bb2d0',
              'fill-outline-color': '#3bb2d0',
              'fill-opacity': 0.2,
            },
          },
          {
            id: 'gl-draw-polygon-stroke-active',
            type: 'line',
            filter: [
              'all',
              ['==', '$type', 'Polygon'],
              ['==', 'active', 'true'],
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#3bb2d0',
              'line-dasharray': [0.2, 2],
              'line-width': 3,
            },
          },
          {
            id: 'gl-draw-polygon-stroke-inactive',
            type: 'line',
            filter: [
              'all',
              ['==', '$type', 'Polygon'],
              ['==', 'active', 'false'],
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#3bb2d0',
              'line-dasharray': [0.2, 2],
              'line-width': 2,
            },
          },
          // Add vertex points styles for better visibility
          {
            id: 'gl-draw-polygon-midpoint',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['==', 'meta', 'midpoint'],
            ],
            paint: {
              'circle-radius': 4,
              'circle-color': '#3bb2d0',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 2,
            },
          },
          {
            id: 'gl-draw-polygon-vertex-active',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['==', 'meta', 'vertex'],
              ['==', 'active', 'true'],
            ],
            paint: {
              'circle-radius': 6,
              'circle-color': '#3bb2d0',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 3,
            },
          },
          {
            id: 'gl-draw-polygon-vertex-inactive',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['==', 'meta', 'vertex'],
              ['==', 'active', 'false'],
            ],
            paint: {
              'circle-radius': 5,
              'circle-color': '#3bb2d0',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 2,
            },
          },
          // Add line vertex styles
          {
            id: 'gl-draw-line-vertex-active',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['==', 'meta', 'vertex'],
              ['==', '$type', 'LineString'],
              ['==', 'active', 'true'],
            ],
            paint: {
              'circle-radius': 6,
              'circle-color': '#3bb2d0',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 3,
            },
          },
          {
            id: 'gl-draw-line-vertex-inactive',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['==', 'meta', 'vertex'],
              ['==', '$type', 'LineString'],
              ['==', 'active', 'false'],
            ],
            paint: {
              'circle-radius': 5,
              'circle-color': '#3bb2d0',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 2,
            },
          },
          // Add point styles
          {
            id: 'gl-draw-point-point-active',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['==', 'meta', 'vertex'],
              ['==', '$type', 'Point'],
              ['==', 'active', 'true'],
            ],
            paint: {
              'circle-radius': 6,
              'circle-color': '#3bb2d0',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 3,
            },
          },
          {
            id: 'gl-draw-point-point-inactive',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['==', 'meta', 'vertex'],
              ['==', '$type', 'Point'],
              ['==', 'active', 'false'],
            ],
            paint: {
              'circle-radius': 5,
              'circle-color': '#3bb2d0',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 2,
            },
          },
        ],
      });

      function updateScale(e) {
        const feature = e.features[0];
        const lengthInKm = turf.length(feature, { units: 'kilometers' });
        const lengthInMeters = lengthInKm * 1000;
        const label = `${lengthInMeters.toFixed(2)} m`;

        // Calculate the midpoint of the line
        const midpoint = turf.along(feature, lengthInKm / 2, {
          units: 'kilometers',
        });

        // Add a symbol layer for the label
        if (mapboxMap.getSource('scale-label')) {
          mapboxMap.getSource('scale-label').setData({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: midpoint.geometry,
                properties: { text: label },
              },
            ],
          });
        } else {
          mapboxMap.addSource('scale-label', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: midpoint.geometry,
                  properties: { text: label },
                },
              ],
            },
          });
          mapboxMap.addLayer({
            id: 'scale-label-layer',
            type: 'symbol',
            source: 'scale-label',
            layout: {
              'text-field': ['get', 'text'],
              'text-size': 14,
              'text-offset': [0, -1.5],
              'text-anchor': 'top',
            },
            paint: {
              'text-color': '#ff0000',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
            },
          });
        }

        // Still keep the snackbar if you want
        enqueueSnackbar(label, { variant: 'success' });
      }

      mapboxMap.addControl(draw, 'top-right');
      drawRef.current = draw;

      // Drawing events
      mapboxMap.on('draw.create', (e) => {
        const feature = e.features[0];
        if (feature.geometry.type === 'LineString') {
          updateScale(e);
        }
        if (feature.geometry.type === 'Polygon') {
          const area = geojsonArea.geometry(feature.geometry);
          const areaKm2 = (area / 1000000).toFixed(2);
          const areaM2 = area.toFixed(2);

          // Get mouse position for popup
          const canvas = mapboxMap.getCanvas();
          const rect = canvas.getBoundingClientRect();
          setAreaPopup({
            open: true,
            area: { km2: areaKm2, m2: areaM2 },
            position: { x: rect.width / 2, y: rect.height / 2 },
          });
        }
        if (feature.geometry.type === 'Point') {
          const canvas = mapboxMap.getCanvas();
          const rect = canvas.getBoundingClientRect();
          // Store the clicked geometry for later use after comment is entered
          setCommentInput({
            open: true,
            feature: {
              geometry: feature.geometry,
            },
            isEdit: false,
            position: { x: rect.width / 2, y: rect.height / 2 },
          });
        }
      });

      mapboxMap.on('draw.update', (e) => {
        const feature = e.features[0];

        if (feature.geometry.type === 'LineString') {
          updateScale(e);
        }
        if (feature.geometry.type === 'Polygon') {
          const area = geojsonArea.geometry(feature.geometry);
          const areaKm2 = (area / 1000000).toFixed(2);
          const areaM2 = area.toFixed(2);

          setAreaPopup({
            open: true,
            area: { km2: areaKm2, m2: areaM2 },
            position: { x: 0, y: 0 },
          });
        }
      });

      mapboxMap.on('click', 'comment-points', (e) => {
        e.preventDefault();
        const feature = e.features[0];
        const canvas = mapboxMap.getCanvas();
        const rect = canvas.getBoundingClientRect();

        console.log('Clicked comment feature:', feature);
        console.log('Feature ID:', feature.id);
        console.log('Feature properties:', feature.properties);

        // Ensure we have a complete comment feature with all necessary properties
        const commentFeature = {
          type: 'Feature',
          geometry: feature.geometry,
          // Use the original feature ID - this is crucial!
          id: feature.id,
          properties: {
            ...feature.properties,
            comment: feature.properties?.comment || '',
            type: 'comment',
            lastEdited: new Date().toISOString(),
          },
        };

        console.log('Complete comment feature for editing:', commentFeature);

        setCommentInput({
          open: true,
          feature: commentFeature,
          isEdit: true,
          position: { x: rect.width / 2, y: rect.height / 2 },
        });
      });

      // Load tiles immediately if we have data
      if (workDayData.length > 0 && selectedDate) {
        const workDay = workDayData.find((w) => w.name === selectedDate);
        if (workDay && workDay.tileBaseUrl) {
          addTileLayer(workDay);
        }
      }
    });

    mapboxMap.on('sourcedata', (e) => {
      if (e.sourceId?.includes('ortho-') && e.isSourceLoaded) {
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

  // Update map layers when date changes
  useEffect(() => {
    if (!selectedDate || !mapRef.current || !isMapLoaded || !workDayData.length)
      return;

    const workDay = workDayData.find((w) => w.name === selectedDate);
    if (!workDay) return;

    console.log(
      'Loading work day:',
      workDay.name,
      'Tile URL:',
      workDay.tileBaseUrl,
    );

    cleanupLayers(workDay.id);
    if (layers.orthomosaic && workDay.tileBaseUrl) {
      setTileLoading(true);
      console.log('Adding tile layer for:', workDay.id);
      addTileLayer(workDay);
    } else {
      console.log(
        'Skipping tile layer - orthomosaic:',
        layers.orthomosaic,
        'tileBaseUrl:',
        !!workDay.tileBaseUrl,
      );
    }

    if (layers.annotations && workDay.kmlFile) {
      // addKmlLayer(workDay); // Implement if needed
    } else {
      // Remove annotation layer if unchecked
      const map = mapRef.current;
      if (map && map.getLayer('annotations')) {
        map.removeLayer('annotations');
      }
      if (map && map.getSource('annotations')) {
        map.removeSource('annotations');
      }
    }

    if (workDay.tileBounds) {
      fitToBounds(workDay.tileBounds);
    }

    // Add comment layer after tiles are loaded
    setTimeout(() => {
      addCommentLayer(commentFeatures);
    }, 500);
  }, [selectedDate, isMapLoaded, layers, workDayData, commentFeatures]);

  const cleanupLayers = (workDayId) => {
    const map = mapRef.current;
    if (!map) return;

    const layerIds = [`ortho-${workDayId}`, 'comment-points'];
    layerIds.forEach((id) => {
      if (map.getLayer(id)) {
        console.log('Removing layer:', id);
        map.removeLayer(id);
      }
    });

    const sourceIds = [`ortho-${workDayId}`, 'comments'];
    sourceIds.forEach((id) => {
      if (map.getSource(id)) {
        console.log('Removing source:', id);
        map.removeSource(id);
      }
    });
  };

  const addTileLayer = (workDay) => {
    const map = mapRef.current;
    if (!map || !workDay.tileBaseUrl) return;
    const orthoId = `ortho-${workDay.id}`;
    try {
      // Remove existing source and layer if they exist
      if (map.getLayer(orthoId)) map.removeLayer(orthoId);
      if (map.getSource(orthoId)) map.removeSource(orthoId);

      map.addSource(orthoId, {
        type: 'raster',
        tiles: [`${workDay.tileBaseUrl}/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 18,
        maxzoom: 24,
      });

      const firstDrawLayerId = map
        .getStyle()
        .layers.find((l) => l.id.startsWith('gl-draw-')).id;
      // Add the raster layer without specific ordering to ensure it's visible
      map.addLayer(
        {
          id: orthoId,
          type: 'raster',
          source: orthoId,
          paint: {
            'raster-opacity': layers.orthomosaic ? 1 : 0,
            'raster-brightness-min': 0,
            'raster-brightness-max': 1,
          },
        },
        firstDrawLayerId,
      );

      console.log('Raster layer added:', orthoId, 'URL:', workDay.tileBaseUrl);

      // Debug: Check if layer is actually visible
      setTimeout(() => {
        const layer = map.getLayer(orthoId);
        const source = map.getSource(orthoId);
        console.log('Layer check:', {
          layerExists: !!layer,
          sourceExists: !!source,
          layerVisible: map.getLayoutProperty(orthoId, 'visibility') !== 'none',
          paintOpacity: map.getPaintProperty(orthoId, 'raster-opacity'),
        });
      }, 1000);

      setTileLoading(false);
    } catch (err) {
      console.error('Error adding tile layer:', err);
      setError('Failed to load orthomosaic tiles.');
      setTileLoading(false);
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
      { padding: 50, maxZoom: 18 },
    );
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

  const addCommentLayer = (features) => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    console.log('Updating comment layer with features:', features);

    // Always remove existing comment layer and source first
    // if (map.getLayer('comment-points')) {
    //   console.log('Removing existing comment layer');
    //   map.removeLayer('comment-points');
    // }
    // if (map.getSource('comments')) {
    //   console.log('Removing existing comment source');
    //   map.removeSource('comments');
    // }

    // Only add new layer if there are features
    console.log('checking features ', features);
    if (features && features.length > 0) {
      console.log('Adding new comment layer with', features.length, 'features');

      map.addSource('comments', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      });

      map.addLayer({
        id: 'comment-points',
        type: 'symbol',
        source: 'comments',
        layout: {
          'icon-image': 'marker-15',
          'icon-size': 1.5,
          'text-field': ['get', 'comment'],
          'text-offset': [0, 1.5],
          'text-anchor': 'top',
        },
        paint: {
          'text-size': 1,
          'text-color': '#000',
          'text-halo-color': '#fff',
          'text-halo-width': 2,
        },
      });

      // Ensure comment layer is above other layers
      const commentLayer = map.getLayer('comment-points');
      if (commentLayer) {
        console.log(
          'Comment layer added successfully with ID:',
          commentLayer.id,
        );
      }
    } else {
      console.log('No features to display, comment layer removed');
    }

    // Force map to refresh
    if (map.isStyleLoaded()) {
      map.triggerRepaint();
    }

    console.log('Comment layer update complete');
  };

  const handleDeleteComment = (feature) => {
    console.log('=== COMMENT DELETION DEBUG ===');
    console.log('Attempting to delete comment', feature);
    console.log('Current commentFeatures:', commentFeatures);
    console.log(commentFeatures[0].properties.comment);
    console.log(feature.properties.comment);
    const updated = commentFeatures.filter((f) => {
      return f.properties.id !== feature.properties.id; // keep only if coords differ
    });

    console.log('Updated commentFeatures after deletion:', updated);

    // Update state first
    setCommentFeatures(updated);

    // Force refresh the comment layer
    refreshCommentLayer();

    setCommentInput({
      open: false,
      feature: null,
      isEdit: false,
      position: { x: 0, y: 0 },
    });

    console.log('=== END DELETION DEBUG ===');
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

      <Box display="flex" height="calc(100vh - 200px)" gap={2}>
        <Box sx={{ width: '300px', pr: 2, overflowY: 'auto' }}>
          <Typography
            onClick={() => {
              console.log(commentFeatures, '<=== comment features');
            }}
            variant="h3"
            gutterBottom
          >
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
              value={selectedDate || ''}
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
            '& .mapboxgl-ctrl-scale': {
              border: '2px solid #333',
              borderTop: 'none',
              color: '#333',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: '2px 6px',
              fontSize: '12px',
              fontWeight: 'bold',
            },
          }}
        >
          <AreaPopUp areaPopup={areaPopup} setAreaPopup={setAreaPopup} />
        </Box>
        <CommentInput
          addCommentLayer={addCommentLayer}
          setCommentFeatures={setCommentFeatures}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          commentFeatures={commentFeatures}
          handleDeleteComment={handleDeleteComment}
        />
      </Box>
    </MainCard>
  );
}
