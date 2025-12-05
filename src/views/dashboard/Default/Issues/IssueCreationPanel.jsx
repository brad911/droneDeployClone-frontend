import {
  Box,
  Divider,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Avatar,
  IconButton,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from 'yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../../../utils/axios.config';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

export default function IssueCreationPanel({
  coordinates,
  setSelectedPinColor,
  teamMembers,
  projectId,
  selectedWorkDay,
  onClose,
  pinColors,
  setRefresh,
}) {
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
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const removePhoto = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let payload = {
        ...form,
        coordinates: coordinates,
      };

      // Validate the form BEFORE sending
      await issueSchema.validate(payload, { abortEarly: false });

      // Now add required IDs
      payload = {
        ...payload,
        workDayId: selectedWorkDay.id,
        projectId,
      };

      // ---- CREATE FORMDATA ----
      const formData = new FormData();

      // Append all text fields
      Object.keys(payload).forEach((key) => {
        if (key === 'coordinates') {
          formData.append('coordinates', JSON.stringify(payload.coordinates));
        } else if (key !== 'photos') {
          formData.append(key, payload[key]);
        }
      });

      // Append images (assuming form.photos = array of File objects)
      if (payload.photos && payload.photos.length > 0) {
        payload.photos.forEach((file) => {
          formData.append('photos', file);
        });
      }

      // ---- SEND REQUEST ----
      const res = await axiosInstance.post('/issue', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        enqueueSnackbar('Log created successfully!', { variant: 'success' });

        // reset form
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

        onClose?.();
        setRefresh((prev) => !prev);
      }
    } catch (err) {
      if (err.inner) {
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

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: 320,
        mx: 'auto',
        p: 3,
        borderRadius: 3,
        bgcolor: '#fafafa',
        overflowY: 'scroll',
        maxHeight: '62vh',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          onClick={() => console.log(coordinates, '<======= cordinates')}
          variant="h3"
        >
          Create New Log
        </Typography>

        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Type */}
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

        {/* Due Date */}
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
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
        </LocalizationProvider>

        {/* Title */}
        <TextField
          label="Title"
          value={form.title}
          onChange={(e) => handleFormChange('title', e.target.value)}
          fullWidth
          size="small"
        />

        {/* Description */}
        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => handleFormChange('description', e.target.value)}
          fullWidth
          multiline
          size="small"
        />
      </Box>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Priority */}
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

        {/* Category */}
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

        {/* Assignee */}
        <TextField
          select
          label="Assign To"
          value={form.assignedTo}
          onChange={(e) => handleFormChange('assignedTo', e.target.value)}
          fullWidth
          size="small"
        >
          {teamMembers.map((m) => (
            <MenuItem value={m?.userId?.id} key={m?.userId?.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 28, height: 28 }}>
                  {m?.userId?.firstName.charAt(0)}
                </Avatar>
                {m?.userId?.firstName} {m?.userId?.lastName}
              </Box>
            </MenuItem>
          ))}
        </TextField>

        {/* Pin Color */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    bgcolor: c,
                    border: '2px solid #666',
                  }}
                />
                {c}
              </Box>
            </MenuItem>
          ))}
        </TextField>

        {coordinates && (
          <TextField
            label="Selected Coordinates"
            value={`${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`}
            size="small"
            fullWidth
            disabled
            InputProps={{ readOnly: true }}
          />
        )}
      </Box>
      <Button variant="outlined" component="label" sx={{ mb: 2, mt: 2 }}>
        Upload Photos
        <input
          type="file"
          hidden
          multiple
          accept="image/*" // ✅ only allow image files
          onChange={handlePhotoUpload}
        />
      </Button>

      {form.photos.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {form.photos.map((file, index) => {
            // create a preview URL
            const preview = URL.createObjectURL(file);

            return (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={preview} // <-- Use preview here
                  alt={file.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'cover',
                  }}
                  onLoad={() => URL.revokeObjectURL(preview)} // release memory
                />

                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.4)',
                    color: '#fff',
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

      {/* Submit */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {loading === true ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            size="large"
            disabled={loading}
            onClick={handleSubmit}
          >
            Save Log
          </Button>
        )}
      </Box>
    </Paper>
  );
}
