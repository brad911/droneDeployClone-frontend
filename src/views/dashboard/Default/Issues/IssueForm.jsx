import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../../../utils/axios.config';
import { useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import * as Yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const IssueForm = ({
  open = false,
  onClose,
  selectedWorkDay,
  teamMembers,
  projectId,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    dueDate: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    priority: '',
    category: '',
    assignedTo: '',
    coordinates: null,
    pinColor: '',
    photos: [],
  });

  const pinColors = [
    '#FF0000', // Red
    '#00A2FF', // Blue
    '#00C853', // Green
    '#FFD600', // Yellow
    '#FF6D00', // Orange
    '#AA00FF', // Purple
    '#E91E63', // Pink
    '#795548', // Brown
    '#607D8B', // Slate
    '#000000', // Black
  ];

  const issueSchema = Yup.object().shape({
    dueDate: Yup.string().required('Date is required'),
    title: Yup.string()
      .trim()
      .required('Title is required')
      .max(100, 'Title cannot exceed 100 characters'),
    description: Yup.string()
      .trim()
      .required('Description is required')
      .max(500, 'Description cannot exceed 500 characters'),
    priority: Yup.string().required('Priority is required'),
    category: Yup.string().required('Category is required'),
    assignedTo: Yup.string().required('Assignee is required'),
    pinColor: Yup.string().required('Pin color is required'),

    coordinates: Yup.object()
      .shape({
        lat: Yup.number().required(),
        lng: Yup.number().required(),
      })
      .required('Please select a location on the map'),
  });
  const [selectedPinColor, setSelectedPinColor] = useState(null);

  const logType = ['issue', 'task'];
  const categories = [
    'architecture',
    'structure',
    'MEPF',
    'safety',
    'quality',
    'other',
  ];
  const priorities = ['low', 'medium', 'high'];

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await issueSchema.validate(form, { abortEarly: false });

      console.log('Submitting form:', form);
      const payload = { ...form, workDayId: selectedWorkDay.id, projectId };
      console.log(payload, '<==== wow');
      const res = await axiosInstance.post('/issue', payload);
      console.log(res, '<==== submitted');
      if (res.status === 201) {
        enqueueSnackbar('Log created successfully!', { variant: 'success' });
        setForm({
          dueDate: new Date().toISOString().split('T')[0],
          title: '',
          description: '',
          priority: '',
          category: '',
          assignedTo: '',
          coordinates: null,
          pinColor: '',
          photos: [],
        });
      }
      onClose();
    } catch (err) {
      if (err.inner) {
        // Yup validation errors array
        err.inner.forEach((e) => {
          enqueueSnackbar(e.message, { variant: 'error' });
        });
      } else {
        enqueueSnackbar('Error creating Log', { variant: 'error' });
        console.error(err);
      }
    }
    setLoading(false);
  };

  // ----------------------------
  // ⭐ Fetch first workday
  // ----------------------------

  // ----------------------------
  // ⭐ Initialize Mapbox with orthomosaic tiles
  // ----------------------------
  useEffect(() => {
    if (!open || !selectedWorkDay || !selectedPinColor) return;
    const timeout = setTimeout(() => {
      if (mapRef.current || !mapContainerRef.current) return;

      const bounds = [
        [selectedWorkDay.tileBounds.west, selectedWorkDay.tileBounds.south],
        [selectedWorkDay.tileBounds.east, selectedWorkDay.tileBounds.north],
      ];

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // minimal style
        bounds: bounds,
        fitBoundsOptions: { padding: 20 },
        minZoom: 15,
        maxZoom: 21,
      });

      mapRef.current.on('load', () => {
        mapRef.current.addSource('ortho', {
          type: 'raster',
          tiles: [`${selectedWorkDay.tileBaseUrl}/{z}/{x}/{y}.png`],
          tileSize: 256,
          minzoom: 15,
          maxzoom: 21,
        });

        mapRef.current.addLayer({
          id: 'ortho-layer',
          type: 'raster',
          source: 'ortho',
        });

        mapRef.current.fitBounds(bounds, { padding: 20 });
      });

      mapRef.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new mapboxgl.Marker({ color: selectedPinColor })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);
        }
        setForm((prev) => ({ ...prev, coordinates: { lat, lng } }));
      });
    }, 150);

    return () => {
      clearTimeout(timeout);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [open, selectedWorkDay, selectedPinColor]);

  return (
    <Modal open={open} onClose={onClose} sx={{ overflow: 'scroll' }}>
      <Box
        sx={{
          outline: 'none',
          width: 700,
          maxWidth: '90vw',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          mx: 'auto',
          mt: '3%',
          p: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          New Log
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Form fields */}
          <TextField
            select
            label="Type"
            value={form.type}
            onChange={(e) => handleFormChange('type', e.target.value)}
            fullWidth
            size="small"
          >
            {logType.map((m) => (
              <MenuItem key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due Date"
              format="DD-MM-YYYY"
              value={form.dueDate ? dayjs(form.dueDate, 'YYYY-MM-DD') : null}
              onChange={(newValue) =>
                handleFormChange(
                  'dueDate',
                  newValue ? newValue.format('YYYY-MM-DD') : '',
                )
              }
              minDate={dayjs()}
              slotProps={{
                textField: { fullWidth: true, size: 'small' },
              }}
            />
          </LocalizationProvider>

          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            fullWidth
            multiline
            minRows={2}
            size="small"
          />

          <TextField
            select
            label="Priority"
            value={form.priority}
            onChange={(e) => handleFormChange('priority', e.target.value)}
            fullWidth
            size="small"
          >
            {priorities.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Category"
            value={form.category}
            onChange={(e) => handleFormChange('category', e.target.value)}
            fullWidth
            size="small"
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Assign To"
            value={form.assignedTo}
            onChange={(e) => handleFormChange('assignedTo', e.target.value)}
            fullWidth
            size="small"
          >
            {teamMembers.map((m) => (
              <MenuItem key={m?.userId?.id} value={m?.userId?.id}>
                {m?.userId?.firstName} {m?.userId?.lastName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Pin Color"
            value={form.pinColor}
            onChange={(e) => {
              setSelectedPinColor(e.target.value);
              handleFormChange('pinColor', e.target.value);
            }}
            fullWidth
            size="small"
          >
            {pinColors.map((c) => (
              <MenuItem key={c} value={c}>
                <Box
                  sx={{
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    bgcolor: c,
                    display: 'inline-block',
                    mr: 1,
                    border: '1px solid #ccc',
                  }}
                />
                {c}
              </MenuItem>
            ))}
          </TextField>
          {/* Mapbox */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Select Coordinates on Map
            </Typography>
            <Box
              ref={mapContainerRef}
              sx={{
                height: 250,
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid #ccc',
              }}
            />
          </Box>

          {form.coordinates && (
            <TextField
              label="Selected Coordinates"
              value={`${form.coordinates.lat.toFixed(6)}, ${form.coordinates.lng.toFixed(6)}`}
              size="small"
              fullWidth
              InputProps={{ readOnly: true }}
            />
          )}

          {/* Photo Upload */}
          <Button variant="outlined" component="label">
            Attach Photos
            <input type="file" hidden multiple onChange={handlePhotoUpload} />
          </Button>

          {form.photos.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {form.photos.map((file, index) => {
                const previewURL = URL.createObjectURL(file);
                return (
                  <Paper
                    key={index}
                    elevation={2}
                    sx={{
                      width: 90,
                      height: 90,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 1,
                    }}
                  >
                    <img
                      src={previewURL}
                      alt="preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                      }}
                      onClick={() => removePhoto(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                );
              })}
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleSubmit}
            >
              Save Log
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default IssueForm;
