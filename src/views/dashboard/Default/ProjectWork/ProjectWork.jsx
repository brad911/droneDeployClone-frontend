/* eslint-disable react-hooks/exhaustive-deps */
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
} from '@mui/material';
import {
  IconBuildingCog,
  IconDroneOff,
  IconLiveViewFilled,
} from '@tabler/icons-react';
import Breadcrumbs from '../../../../ui-component/extended/Breadcrumbs';
import MainCard from 'ui-component/cards/MainCard';
import CreateWorkDayModal from './CreateWorkDayModal';
import axiosInstance from 'utils/axios.config';
import { useSelector } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { enqueueSnackbar } from 'notistack';
import CommentInput from './CommentInput';
import ColorPickerControl from './colorPickerControl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const pageLinks = [
  { title: 'Projects', to: '/project', icon: IconDroneOff },
  { title: 'Project Name', icon: IconBuildingCog },
  { title: 'Exterior(Map View)', icon: IconLiveViewFilled },
];

const popUpContent = ({ label, createdBy, createdAt }) => {
  return `
    <div style="
      font-family: 'Arial', sans-serif;
      background-color: #fff;
      border: 1px solid #B3D3F0; /* secondary200 */
      border-radius: 8px;
      overflow: hidden;
      width: 200px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    ">
      <!-- Header -->
      <div style="
        background-color: #2563EB; /* primaryMain */
        color: #fff;
        font-weight: 600;
        font-size: 13px;
        padding: 8px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        ${label}
      </div>
      
      <!-- Body -->
      <div style="
        padding: 6px 8px;
        background-color: #D6E6F5; /* secondaryLight */
        display: flex;
        justify-content: space-between;
        font-size: 8px;
        color: #1F3F66; /* secondary800 */
      ">
        <span>${createdBy}</span>
        <span style="color: #666;">
          ${new Date(createdAt).toLocaleDateString()} ${new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  `;
};

const readInfoFromFeature = (properties, label) => {
  let user;
  let date;
  console.log(properties, '<===== props');
  if (properties.createdBy) {
    user = properties.createdBy;
  } else {
    user = JSON.parse(properties.user_createdBy);
  }
  if (properties.createdAt) {
    date = properties.createdAt;
  } else {
    date = properties.user_createdAt;
  }
  console.log(user, '<=======user');
  console.log(date, '<=======daet');
  return {
    createdBy: `${user.firstName} ${user.lastName}`,
    createdAt: new Date(date),
    label,
  };
};

export default function ProjectWork() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [layers, setLayers] = useState({
    orthomosaic: true,
    annotations: true,
    showComments: true,
    showPolygons: true,
    showLineString: true,
  });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [historicalDates, setHistoricalDates] = useState([]);
  const [workDayData, setWorkDayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorkDay, setSelectedWorkDay] = useState({});
  const [error, setError] = useState(null);
  const [tileLoading, setTileLoading] = useState(false);
  const [commentFeatures, setCommentFeatures] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#2563EB');
  const [selectedOpacity, setSelectedOpacity] = useState(0.5);
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
        setSelectedWorkDay(completed[0]);
        setWorkDayData(completed);

        if (completed.length > 0) {
          setSelectedDate(completed[0].name);
          //adding all the features
          const mapFeaturesResponse = await axiosInstance.get('/mapFeature', {
            params: { workDayId: completed[0].id },
            headers: { Authorization: token },
          });
          if (mapFeaturesResponse.data?.data?.results.length !== 0) {
            setCommentFeatures(mapFeaturesResponse.data?.data?.results);
          }
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
    // 1) Guard: only initialize once + API key check
    if (!mapContainer.current || mapRef.current) return;
    if (!mapboxgl.accessToken) {
      setError('Mapbox API key is not configured.');
      return;
    }

    // 2) Create the map
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

    // --- Helpers --------------------------------------------------------------

    const DEFAULT_COLOR = selectedColor; // fallback colo
    const DEFAULT_OPACITY = selectedOpacity;
    var currentColor = selectedColor; // active drawing color

    var currentOpacity = DEFAULT_OPACITY;

    // Safely set a paint property only if the layer exists
    const safeSetPaint = (layerId, prop, value) => {
      if (mapboxMap.getLayer(layerId)) {
        mapboxMap.setPaintProperty(layerId, prop, value);
      }
    };

    // Apply the currently selected color to *active* draw layers so new drawing uses it
    const applyActiveDrawColor = (color) => {
      // Polygons (active fill + stroke)
      safeSetPaint('gl-draw-polygon-fill-active', 'fill-color', color);
      safeSetPaint('gl-draw-polygon-fill-active', 'fill-outline-color', color);
      safeSetPaint('gl-draw-polygon-stroke-active', 'line-color', color);

      // Lines (active)
      safeSetPaint('gl-draw-line-active', 'line-color', color);

      // Points / vertices shown while drawing
      safeSetPaint('gl-draw-point-mid', 'circle-color', color);
      safeSetPaint('gl-draw-point-vertex-active', 'circle-color', color);
      safeSetPaint('gl-draw-point-active', 'circle-color', color);
    };

    // Build the full style array for Mapbox Draw.
    // - ACTIVE layers use the literal `activeColor` so they change instantly when we call `applyActiveDrawColor`.
    // - INACTIVE layers use the per-feature property `['get','color']` with fallback to DEFAULT_COLOR.
    const buildDrawStyles = (DEFAULT_COLOR, DEFAULT_OPACITY) => {
      const getColor = [
        'coalesce',
        ['get', 'user_color'],
        ['get', 'color'],
        DEFAULT_COLOR,
      ];
      const getOpacity = [
        'coalesce',
        ['get', 'user_opacity'],
        ['get', 'opacity'],
        DEFAULT_OPACITY,
      ];

      return [
        // ✅ Active Polygon Fill (while drawing)
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
          paint: {
            'fill-color': getColor,
            'fill-outline-color': getColor,
            'fill-opacity': getOpacity,
          },
        },
        // ✅ Active Polygon Stroke
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': getColor,
            'line-width': 1,
          },
        },
        // ✅ Active LineString
        {
          id: 'gl-draw-line-active',
          type: 'line',
          filter: [
            'all',
            ['==', '$type', 'LineString'],
            ['==', 'active', 'true'],
          ],
          paint: {
            'line-color': getColor,
            'line-width': 1,
          },
        },

        // ✅ Inactive Polygon Fill
        {
          id: 'gl-draw-polygon-fill-inactive',
          type: 'fill',
          filter: [
            'all',
            ['==', '$type', 'Polygon'],
            ['==', 'active', 'false'],
          ],
          paint: {
            'fill-color': getColor,
            'fill-outline-color': getColor,
            'fill-opacity': getOpacity,
          },
        },
        // ✅ Inactive Polygon Stroke
        {
          id: 'gl-draw-polygon-stroke-inactive',
          type: 'line',
          filter: [
            'all',
            ['==', '$type', 'Polygon'],
            ['==', 'active', 'false'],
          ],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': getColor,
            // 'line-dasharray': [0.2, 2],
            'line-width': 1,
          },
        },
        // ✅ Inactive LineString
        {
          id: 'gl-draw-line-inactive',
          type: 'line',
          filter: [
            'all',
            ['==', '$type', 'LineString'],
            ['==', 'active', 'false'],
          ],
          paint: {
            'line-color': getColor,
            'line-width': 2,
          },
        },
        // ✅ Points (for handles)
        {
          id: 'gl-draw-point-inactive',
          type: 'circle',
          filter: [
            'all',
            ['==', '$type', 'Point'],
            ['!=', 'meta', 'midpoint'],
            ['==', 'active', 'false'],
          ],
          paint: {
            'circle-radius': 4,
            'circle-color': getColor,
          },
        },
        {
          id: 'gl-draw-point-comment',
          type: 'circle',
          filter: [
            'all',
            ['==', 'active', 'false'],
            ['==', 'meta', 'feature'],
            ['==', 'user_type', 'comment'],
          ],
          paint: {
            'circle-radius': 4,
            'circle-color': getColor,
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2,
          },
        },
        // ✅ Active points (handles)
        {
          id: 'gl-draw-point-active',
          type: 'circle',
          filter: [
            'all',
            ['==', '$type', 'Point'],
            ['!=', 'meta', 'midpoint'],
            ['==', 'active', 'true'],
          ],
          paint: {
            'circle-radius': 6, // slightly bigger when active
            'circle-color': getColor,
            'circle-stroke-color': getColor,
            'circle-stroke-width': 2,
          },
        },

        // ✅ Active comment points
        {
          id: 'gl-draw-point-comment-active',
          type: 'circle',
          filter: [
            'all',
            ['==', '$type', 'Point'],
            ['==', 'active', 'true'],
            ['==', 'meta', 'feature'],
            ['==', 'user_type', 'comment'],
          ],
          paint: {
            'circle-radius': 6, // highlight selected comment
            'circle-color': getColor,
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 3,
          },
        },
      ];
    };

    // 3) Map load
    mapboxMap.on('load', () => {
      mapRef.current = mapboxMap;

      setIsMapLoaded(true);
      setError(null);

      // Controls: fullscreen + nav + scale
      mapboxMap.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      mapboxMap.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-right',
      );

      const scaleControl = new mapboxgl.ScaleControl({
        unit: 'metric',
        maxWidth: 100,
      });
      mapboxMap.addControl(scaleControl, 'bottom-left');

      // Force the scale DOM visible (some styles hide it initially)
      setTimeout(() => {
        const el = mapboxMap
          .getContainer()
          .querySelector('.mapboxgl-ctrl-scale');
        if (el) {
          el.style.display = 'block';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        }
      }, 1000);

      // Color picker control: update `currentColor` + repaint ACTIVE draw layers
      const colorControl = new ColorPickerControl((color, opacity) => {
        console.log(color, opacity, '<==== picked');
        currentColor = color || DEFAULT_COLOR;
        currentOpacity = opacity || DEFAULT_OPACITY;
        console.log(currentColor, '<==== current');
        setSelectedColor(color);
        setSelectedOpacity(opacity);
        // applyActiveDrawColor(currentColor);
      });
      mapboxMap.addControl(colorControl, 'top-right');

      // 4) Mapbox Draw with custom styles + userProperties
      const draw = new MapboxDraw({
        userProperties: true, // ✅ allow 'color' (and other) custom properties
        displayControlsDefault: false,
        controls: {
          polygon: true,
          line_string: true,
          point: true,
          trash: true,
        },
        styles: buildDrawStyles(currentColor, currentOpacity),
        // initial paint
      });
      mapboxMap.addControl(draw, 'top-right');
      drawRef.current = draw;

      // Make sure active layers reflect the initial color immediately
      // applyActiveDrawColor(currentColor);

      // ----------------- Draw Events -----------------

      // When a feature is created, persist the color into its properties
      mapboxMap.on('draw.create', async (e) => {
        const workdayId = selectedWorkDay.id;
        e.features.forEach((f) => {
          // draw.setFeatureProperty(f.id, 'color', activeColor);
          draw.setFeatureProperty(f.id, 'color', currentColor);
        });

        const feature = e.features?.[0];
        if (!feature) return;
        if (mapRef.current.__activePopup) {
          mapRef.current.__activePopup.remove();
        }

        if (feature.geometry.type === 'LineString') {
          // updateScale(e);
          if (!feature || feature.geometry.type !== 'LineString') return;
          const lengthInMeters = turf.length(feature, { units: 'meters' });
          const label = `${lengthInMeters.toFixed(2)} m`;
          const customId = `polygon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          feature.properties.createdBy = user;
          feature.properties.createdAt = new Date();
          feature.createdAt = new Date().toISOString;
          feature.properties.comment = label;
          feature.properties.color = currentColor;
          feature.properties.id = customId;
          try {
            const payload = {
              featureType: 'line',
              geometry: feature.geometry,
              properties: feature.properties,
              workDayId: workdayId,
            };
            const saveLine = await axiosInstance.post('/mapFeature', payload, {
              headers: { Authorization: token },
            });
            if (saveLine.status === 201) {
              enqueueSnackbar('Line created ', { variant: 'success' });
            }
            draw.add(feature);
          } catch (e) {
            console.error(e);
          }

          enqueueSnackbar(label, { variant: 'success' });
        }

        if (feature.geometry.type === 'Polygon') {
          const areaM2 = geojsonArea.geometry(feature.geometry).toFixed(2);
          const label = `${areaM2} m²`;
          const customId = `polygon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const coords = turf.centroid(feature).geometry.coordinates; // [lng, lat]
          draw.setFeatureProperty(feature.id, 'id', customId);
          // const rect = mapboxMap.getCanvas().getBoundingClientRect();
          feature.properties.color = currentColor;
          feature.properties.createdAt = new Date();
          feature.properties.createdBy = user;
          feature.properties.areaM2 = areaM2;
          feature.properties.id = customId;
          feature.properties.opacity = currentOpacity;
          try {
            const payload = {
              featureType: 'polygon',
              geometry: feature.geometry,
              properties: feature.properties,
              workDayId: workdayId,
            };
            const savePolygon = await axiosInstance.post(
              '/mapFeature',
              payload,
              { headers: { Authorization: token } },
            );
            if (savePolygon.status === 201) {
              enqueueSnackbar('Polygon created ', { variant: 'success' });
            }
            // 👇 ensure popup runs after map finishes render
            setTimeout(() => {
              const popup = new mapboxgl.Popup({
                closeButton: true,
                offset: 15,
              })
                .setLngLat(coords)
                .setHTML(
                  popUpContent(readInfoFromFeature(feature.properties, label)),
                )
                .addTo(mapRef.current);
              mapRef.current.__activePopup = popup;
              draw.add(feature);
            }, 0);
          } catch (e) {
            console.error(e);
          }
        }

        if (feature.geometry.type === 'Point') {
          const rect = mapboxMap.getCanvas().getBoundingClientRect();
          setCommentInput({
            open: true,
            feature: {
              feature,
              geometry: feature.geometry,
              color: currentColor,
              properties: { color: currentColor }, // also store on comment draft
            },
            isEdit: false,
            position: { x: rect.width / 2, y: rect.height / 2 },
          });
        }
      });

      // On update, we keep the original color (don’t overwrite).
      // If you want to recolor edited features to currentColor, uncomment below:
      mapboxMap.on('draw.update', async (e) => {
        if (mapRef.current.__activePopup) {
          mapRef.current.__activePopup.remove();
        }

        console.log('updating something');
        const workdayId = selectedWorkDay.id;
        const feature = e.features?.[0];
        if (!feature) return;

        // Always apply color update
        e.features.forEach((f) => {
          draw.setFeatureProperty(f.id, 'color', currentColor);
        });

        if (feature?.geometry?.type === 'Polygon') {
          // ✅ Handle Polygon Area
          const area = geojsonArea.geometry(feature.geometry);
          const areaKm2 = (area / 1000000).toFixed(2);
          const areaM2 = area.toFixed(2);
          const coords = turf.centroid(feature).geometry.coordinates;
          mapRef.current.__activePopup = popup;

          feature.properties.color = currentColor;
          feature.properties.areaKm2 = areaKm2;
          feature.properties.areaM2 = areaM2;
          feature.properties.opacity = currentOpacity;
          try {
            const payload = {
              featureType: 'polygon',
              geometry: feature.geometry,
              properties: feature.properties,
              workDayId: workdayId,
            };
            const updatePolygon = await axiosInstance.patch(
              `/mapFeature/propertyId/${feature?.properties.id}`,
              payload,
              { headers: { Authorization: token } },
            );
            if (updatePolygon.status === 200) {
              enqueueSnackbar('Polygon Updated ', { variant: 'success' });
            }
          } catch (err) {
            console.error(err);
          }
        }

        if (feature?.geometry?.type === 'LineString') {
          try {
            // ✅ Get line length in km + meters
            const lengthKm = turf.length(feature, { units: 'kilometers' });
            const lengthM = (lengthKm * 1000).toFixed(2);

            // ✅ Midpoint coordinates
            const midpointCoords = turf.along(feature, lengthKm / 2, {
              units: 'kilometers',
            }).geometry.coordinates;

            // ✅ Save properties
            feature.properties.color = currentColor;
            feature.properties.lengthKm = lengthKm.toFixed(2);
            feature.properties.lengthM = lengthM;

            // ✅ Send update to backend
            const payload = {
              featureType: 'line',
              geometry: feature.geometry,
              properties: feature.properties,
              workDayId: workdayId,
            };

            const updateLine = await axiosInstance.patch(
              `/mapFeature/propertyId/${feature?.properties.id}`,
              payload,
              { headers: { Authorization: token } },
            );

            if (updateLine.status === 200) {
              enqueueSnackbar('Line Updated', { variant: 'success' });
            }
          } catch (err) {
            console.error('Error updating line:', err);
          }
        }
        if (feature?.geometry?.type === 'Point') {
          try {
            // ✅ Extract coordinates
            const [lng, lat] = feature.geometry.coordinates;

            // ✅ Save properties
            feature.properties.color = currentColor;
            feature.properties.coordinates = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

            // ✅ Prepare payload
            const payload = {
              featureType: 'comment',
              geometry: feature.geometry,
              properties: feature.properties,
              workDayId: workdayId,
            };

            // ✅ Send update to backend
            const updatePoint = await axiosInstance.patch(
              `/mapFeature/propertyId/${feature?.properties.id}`,
              payload,
              { headers: { Authorization: token } },
            );

            if (updatePoint.status === 200) {
              enqueueSnackbar('Point Updated', { variant: 'success' });
            }
          } catch (err) {
            console.error('Error updating point:', err);
          }
        }
      });
      mapboxMap.on('draw.delete', async (e) => {
        console.log('on delete');
        if (mapRef.current.__activePopup) {
          mapRef.current.__activePopup.remove();
        }
        const feature = e.features[0];
        console.log('Deleted features:', e.features);
        try {
          const res = await axiosInstance.delete(
            `/mapfeature/propertyId/${feature.properties.id}`,
          );
          if (res.status === 200) {
            enqueueSnackbar('Successfully removed feature', {
              variant: 'success',
            });
          }
        } catch (e) {
          console.error('error removing feature', e);
        }
        // e.features is an array of deleted GeoJSON features
        // you can sync with backend here
      });
      // click handler for lines
      mapboxMap.on('click', (e) => {
        console.log('on click');
        if (mapRef.current.__activePopup) {
          mapRef.current.__activePopup.remove();
        }
        const possibleLayers = [
          // LineString
          'gl-draw-line-inactive',
          'gl-draw-line-inactive.hot',
          'gl-draw-line-active',
          'gl-draw-line-active.hot',
          'gl-draw-line-static',

          // Point
          'gl-draw-point-inactive',
          'gl-draw-point-inactive.hot',
          'gl-draw-point-active',
          'gl-draw-point-active.hot',
          'gl-draw-point-static',

          // Polygon fill
          'gl-draw-polygon-fill-inactive',
          'gl-draw-polygon-fill-inactive.cold',
          'gl-draw-polygon-fill-inactive.hot',
          'gl-draw-polygon-fill-active',
          'gl-draw-polygon-fill-static',

          // Polygon stroke
          'gl-draw-polygon-stroke-inactive',
          'gl-draw-polygon-stroke-inactive.cold',
          'gl-draw-polygon-stroke-active',
          'gl-draw-polygon-stroke-static',
        ];

        const existingLayers = mapboxMap
          .getStyle()
          .layers.map((layer) => layer.id)
          .filter((id) => possibleLayers.includes(id));
        const features = mapboxMap.queryRenderedFeatures(e.point, {
          layers: existingLayers,
        });
        if (!features.length) return;
        const feature = features[0];
        if (
          feature.geometry.type === 'Point' &&
          feature.properties.user_type === 'comment'
        ) {
          console.log(feature, '<==== yeeter');
          // handle comment points
          const coordinates = feature.geometry.coordinates.slice();
          const comment =
            feature.properties?.comment ||
            feature.properties?.user_comment ||
            '';
          const popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              popUpContent(readInfoFromFeature(feature.properties, comment)),
            )
            .addTo(mapboxMap);
          mapRef.current.__activePopup = popup;
        }

        if (feature.geometry.type === 'Polygon') {
          console.log(feature, '<=== featuer agae ');
          const area = geojsonArea.geometry(feature.geometry);
          const label = `${area.toFixed(2)} m²`;
          const coords = turf.centroid(feature).geometry.coordinates;
          // const rect = mapboxMap.getCanvas().getBoundingClientRect();
          new mapboxgl.Popup()
            .setLngLat(coords)
            .setHTML(
              popUpContent(readInfoFromFeature(feature.properties, label)),
            )
            .addTo(mapboxMap);
        }
        if (
          feature.geometry.type === 'LineString'
          //  &&
          // feature.properties.mode !== 'draw_polygon'
        ) {
          console.log(feature, '<==== feature line string selection');

          // Always work in kilometers
          const lengthInKm = turf.length(feature, { units: 'kilometers' });
          const midpointCoords = turf.along(feature, lengthInKm / 2, {
            units: 'kilometers',
          }).geometry.coordinates;

          const lengthInMeters = lengthInKm * 1000;
          const label = `${lengthInMeters.toFixed(2)} m`;

          if (midpointCoords && !midpointCoords.some(Number.isNaN)) {
            const popup = new mapboxgl.Popup()
              .setLngLat(midpointCoords)
              .setHTML(
                popUpContent(readInfoFromFeature(feature.properties, label)),
              )
              .addTo(mapboxMap);
            mapRef.current.__activePopup = popup;
          }

          enqueueSnackbar(`Length: ${lengthInMeters.toFixed(2)} m`, {
            variant: 'success',
          });
        }
      });

      mapboxMap.on('draw.selectionchange', (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          console.log(feature.geometry.type, '<=====randy');
          if (
            feature.geometry.type === 'LineString' &&
            feature.properties.mode !== 'draw_polygon'
          ) {
            console.log(feature, '<==== feature line string selection');

            // Always work in kilometers
            const lengthInKm = turf.length(feature, { units: 'kilometers' });
            const midpointCoords = turf.along(feature, lengthInKm / 2, {
              units: 'kilometers',
            }).geometry.coordinates;

            const lengthInMeters = lengthInKm * 1000;
            const label = `${lengthInMeters.toFixed(2)} m`;

            if (midpointCoords && !midpointCoords.some(Number.isNaN)) {
              const popup = new mapboxgl.Popup()
                .setLngLat(midpointCoords)
                .setHTML(
                  popUpContent(readInfoFromFeature(feature.properties, label)),
                )
                .addTo(mapboxMap);
              mapRef.current.__activePopup = popup;
            }

            enqueueSnackbar(`Length: ${lengthInMeters.toFixed(2)} m`, {
              variant: 'success',
            });
          }
          if (feature.geometry.type === 'Point') {
            console.log(feature, '<============wew');
            const popup = new mapboxgl.Popup()
              .setLngLat(feature.geometry.coordinates)
              .setHTML(
                popUpContent(
                  readInfoFromFeature(
                    feature.properties,
                    feature.properties.comment,
                  ),
                ),
              )
              .addTo(mapboxMap);
            mapRef.current.__activePopup = popup;
          }
        }
      });
    });

    // Tile loading spinner control
    mapboxMap.on('sourcedata', (e) => {
      if (e.sourceId?.includes('ortho-') && e.isSourceLoaded) {
        console.log('on source data remove');
        setTileLoading(false);
      }
    });

    // 5) Cleanup
    return () => {
      if (mapboxMap && mapboxMap.remove) mapboxMap.remove();
      mapRef.current = null;
      setIsMapLoaded(false);
    };
  }, [selectedWorkDay]);

  // Update map layers when date changes
  useEffect(() => {
    if (!selectedDate || !mapRef.current || !isMapLoaded || !workDayData.length)
      return;

    const setMapFeature = async () => {
      const workDay = workDayData.find((w) => w.name === selectedDate);
      if (!workDay) return;

      // 🧹 Cleanup previous layers
      cleanupLayers(workDay.id);

      const draw = drawRef.current;
      // Clear previous features
      draw.deleteAll();
      try {
        // Fetch features for the selected workday
        const { data } = await axiosInstance.get('/mapFeature', {
          params: { workDayId: workDay.id, limit: 100 },
          headers: { Authorization: token },
        });

        const results = data?.data?.results || [];

        // Build FeatureCollection
        const allFeaturesGeoJSON = {
          type: 'FeatureCollection',
          features: results
            .map(({ geometry, properties, createdBy, createdAt }) => {
              if (!geometry) return null;
              return {
                type: 'Feature',
                geometry,
                properties: {
                  ...properties,
                  createdBy: createdBy,
                  createdAt: createdAt,
                  comment: properties?.comment || '',
                  color: properties?.color || DEFAULT_COLOR,
                  message: properties?.message || 'No message set',
                },
              };
            })
            .filter(Boolean),
        };

        // Apply layer filters
        const filteredFeatures = {
          ...allFeaturesGeoJSON,
          features: allFeaturesGeoJSON.features.filter((f) => {
            if (f.geometry.type === 'Point' && layers.showComments) return true;
            if (f.geometry.type === 'LineString' && layers.showLineString)
              return true;
            if (f.geometry.type === 'Polygon' && layers.showPolygons)
              return true;
            return false;
          }),
        };

        // Add filtered features to map
        if (filteredFeatures.features.length) {
          draw.add(filteredFeatures);
          draw.changeMode('simple_select');
        }

        // Handle orthomosaic layer
        if (layers.orthomosaic && workDay.tileBaseUrl) {
          setTileLoading(true);
          addTileLayer(workDay);
        }

        // Fit map to bounds
        if (workDay.tileBounds) {
          fitToBounds(workDay.tileBounds);
        }
      } catch (error) {
        console.error('Error loading map features:', error);
      }
    };

    setMapFeature();
  }, [selectedDate, isMapLoaded, layers, workDayData]);

  const cleanupLayers = (workDayId) => {
    const map = mapRef.current;
    if (!map) return;

    // All dynamic layer IDs we may have added
    const layerIds = [
      `ortho-${workDayId}`, // raster ortho layer
      'all-features-points', // pins
      'all-features-lines', // line strings
      'all-features-polygons', // polygons
      'all-features-polygons-outline', // polygon borders
      'comment-labels', // text labels for pins
    ];

    layerIds.forEach((id) => {
      if (map.getLayer(id)) {
        console.log('Removing layer:', id);
        map.removeLayer(id);
      }
    });

    // Sources we may have added
    const sourceIds = [`ortho-${workDayId}`, 'all-features'];

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
    const update = workDayData.find((item) => item.name === event.target.value);
    setSelectedWorkDay(update);
  };

  const addCommentLayer = (features) => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    console.log('Updating comment layer with features:', features);

    // Always remove existing comment layer and source first
    if (map.getLayer('comment-points')) {
      console.log('Removing existing comment layer');
      map.removeLayer('comment-points');
    }
    if (map.getSource('comments')) {
      console.log('Removing existing comment source');
      map.removeSource('comments');
    }

    // Only add new layer if there are features
    console.log('checking features ', features);
    if (features && features.length > 0 && layers.showComments) {
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
          'text-size': 0.5,
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

  const handleDeleteComment = async (feature) => {
    console.log('=== COMMENT DELETION DEBUG ===');
    console.log('Attempting to delete comment', feature);
    console.log('Current commentFeatures:', commentFeatures);
    console.log(commentFeatures[0].properties.comment);
    console.log(feature.properties.comment);
    const updated = commentFeatures.filter((f) => {
      return f.properties.id !== feature.properties.id; // keep only if coords differ
    });
    try {
      await axiosInstance.delete(
        `/mapFeature/propertyId/${feature.properties.id}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
    } catch (e) {
      console.error(e);
    }
    console.log('Updated commentFeatures after deletion:', updated);

    enqueueSnackbar('Successfully Removed Comment', { variant: 'success' });
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

      <Box display="flex" height="calc(100vh - 320px)" gap={1}>
        <Box sx={{ width: '250px', pr: 2, height: '100%' }}>
          <Typography
            onClick={() => {
              // console.log(commentFeatures, '<=== comment features');
              // console.log(selectedWorkDay.id, '>====== selected workday ID');
              // // console.log(selectedColor, '<=== olor ococococo');
              // console.log(drawRef.current.getAll());
              // console.log(
              //   mapRef.current
              //     .getStyle()
              //     .layers.filter((l) => l.id.includes('draw')),
              // );
              console.log(user, '<============ user');
              const coldFeatures = mapRef.current.querySourceFeatures(
                'mapbox-gl-draw-cold',
              );
              const hotFeatures =
                mapRef.current.querySourceFeatures('mapbox-gl-draw-hot');
              console.log(
                'Cold:',
                coldFeatures.map((f) => f.properties),
              );
              console.log(
                'Hot:',
                hotFeatures.map((f) => f.properties),
              );
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
                  checked={layers.showLineString}
                  onChange={handleLayerChange}
                  name="showLineString"
                  disabled={loading}
                />
              }
              label="Lines"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={layers.showPolygons}
                  onChange={handleLayerChange}
                  name="showPolygons"
                  disabled={loading}
                />
              }
              label="Polygons"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={layers.showComments}
                  onChange={handleLayerChange}
                  name="showComments"
                  disabled={loading}
                />
              }
              label="Comments"
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
        ></Box>
        <CommentInput
          addCommentLayer={addCommentLayer}
          setCommentFeatures={setCommentFeatures}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          commentFeatures={commentFeatures}
          handleDeleteComment={handleDeleteComment}
          workDay={selectedWorkDay}
          drawRef={drawRef.current}
        />
      </Box>
    </MainCard>
  );
}
