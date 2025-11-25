import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';
import Breadcrumbs from '../../../../../ui-component/extended/Breadcrumbs';
import {
  IconBuildingCog,
  IconCopyXFilled,
  IconDroneOff,
  IconReport,
} from '@tabler/icons-react';
import axiosInstance from 'utils/axios.config';
import PhotoDialog from './PhotoDialogue';
import { useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { set } from 'lodash-es';
import { enqueueSnackbar } from 'notistack';
import DPRDocument from './DPRDocument';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
dayjs.extend(utc);
const weatherOptions = [
  { value: 'sunny', label: 'Sunny' },
  { value: 'cloudy', label: 'Cloudy' },
  { value: 'windy', label: 'Windy' },
  { value: 'rainy', label: 'Rainy' },
];

const statusOptions = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'planned', label: 'Planned Further' },
];

const DprForm = () => {
  // 🔹 Project details
  const project = useSelector((state) => state.project);
  // 🔹 Dates
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [logo, setLogo] = useState(null);
  // 🔹 Core form data
  const [weather, setWeather] = useState('');
  const [manpower, setManpower] = useState([]);
  const [material, setMaterial] = useState([]);
  const [machinery, setMachinery] = useState([]);
  const [activity, setActivity] = useState([]);
  const [contactID, setContactID] = useState('');
  const [activities, setActivities] = useState([
    { name: '', quantity: '', unit: '', status: '', cost: '' },
  ]);
  const [photos, setPhotos] = useState([]);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  // 🔹 Dynamic lists
  const [hinderances, setHinderances] = useState(['']);
  const [milestonesList, setMilestonesList] = useState(['']);
  const [qualityList, setQualityList] = useState(['']);
  const [safetyList, setSafetyList] = useState(['']);
  const [team, setTeam] = useState([]);
  const endpoints = [
    { key: 'manPower', label: 'Manpower' },
    { key: 'machinery', label: 'Machinery' },
    { key: 'material', label: 'Material' },
    { key: 'activity', label: 'Activity' },
  ];
  const [selectedEndpoints, setSelectedEndpoints] = useState(
    endpoints.reduce((acc, ep) => ({ ...acc, [ep.key]: true }), {}), // all selected by default
  );
  const handleToggle = (key) => {
    setSelectedEndpoints((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  // 🔹 Custom fields (object)
  const [newField, setNewField] = useState('');
  const [customFields, setCustomFields] = useState({});

  // 🔹 Fetch project members
  const [projectMembers, setProjectMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axiosInstance.get('/project-members/query', {
          params: { projectId: project.id, limit: 50 },
        });

        setProjectMembers(res.data?.data?.results || []);
      } catch (err) {
        console.error('Error fetching project members:', err);
      }
    };
    fetchMembers();
  }, [project.id]);

  // 🔹 Fetch resources when dates change
  useEffect(() => {
    if (!from || !to) return;

    const fetchResources = async () => {
      try {
        const results = {};

        const endpointsToFetch = Object.keys(selectedEndpoints).filter(
          (k) => selectedEndpoints[k],
        );

        for (const ep of endpointsToFetch) {
          const res = await axiosInstance.get(`/${ep}`, {
            params: {
              projectId: project.id,
              startDate: from,
              endDate: to,
              limit: 1000,
              page: 1,
            },
          });
          results[ep] = res.data?.data?.results || [];
        }

        setManpower(results.manPower || []);
        setMachinery(results.machinery || []);
        setMaterial(results.material || []);
        setActivity(results.activity || []);
      } catch (err) {
        console.error('❌ Error fetching resources:', err);
      }
    };

    fetchResources();
  }, [from, to, selectedEndpoints]);

  const fetchProjectMembers = async () => {
    try {
      const res = await axiosInstance.get('/project-members/query', {
        params: { projectId: project.id, limit: 1000 },
      });
      const results = res.data?.data?.results || [];
      console.log(res.data?.data?.results[0]);
      setProjectMembers(results);
      setTeam(results.map((m) => `${m.userId.firstName} ${m.userId.lastName}`));
    } catch (e) {
      console.error('Error fetching project members:', e);
    }
  };
  useEffect(() => {
    fetchProjectMembers();
  }, []);

  // 🔹 Helpers for dynamic text arrays
  const addItem = (setter) => setter((prev) => [...prev, '']);
  const updateItem = (setter, index, value) =>
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  const removeItem = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  // 🔹 Activities
  const handleActivityChange = (idx, key, value) => {
    const updated = [...activities];
    updated[idx][key] = value;
    setActivities(updated);
  };
  const addActivity = () =>
    setActivities([
      ...activities,
      { name: '', quantity: '', unit: '', status: '', cost: '' },
    ]);

  // 🔹 Photos
  const handleAddPhoto = (photoObj) => setPhotos((prev) => [...prev, photoObj]);

  // 🔹 Custom field logic
  const handleAddField = () => {
    if (newField.trim() && !customFields[newField]) {
      setCustomFields((prev) => ({ ...prev, [newField]: '' }));
      setNewField('');
    }
  };
  const handleCustomFieldChange = (key, value) => {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Submit handler
  const handleSubmit = async () => {
    console.log(customFields, '<===== custom fields');
    const payload = {
      projectContractId: contactID,
      projectName: project.name,
      projectLocation: project.location,
      projectId: project.id,
      from,
      to,
      weather,
      manpower,
      machinery,
      material,
      activities,
      hinderances,
      milestones: milestonesList,
      qualityObservations: qualityList,
      safetyRemarks: safetyList,
      photos,
      customFields,
      activity,
      logo,
      projectMembers: team,
    };

    console.log('📦 Final DPR Payload:', payload);

    // 🧠 Generate the PDF in-memory
    const blob = await pdf(<DPRDocument payload={payload} />).toBlob();

    // 💾 Trigger browser download
    // Format filename: DPR_projectName_YYYYMMDD_HHMM.pdf
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');

    const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}`;

    const filename = `DPR_${project.name}_${datePart}_${timePart}.pdf`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const pageLinks = [
    { title: 'Projects', to: '/project', icon: IconDroneOff },
    {
      title: project.name,
      to: `/project/${project.id}/View`,
      icon: IconBuildingCog,
    },
    { title: 'Progress Report', icon: IconReport },
  ];
  const handleDelete = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Validate MIME type (must start with "image/")
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Only image files are allowed (PNG, JPG, JPEG, etc.)', {
        variant: 'error',
      });
      e.target.value = ''; // clear invalid file input
      return;
    }

    // ✅ Optional: validate file size (example: max 3MB)
    const maxSizeMB = 3;
    if (file.size > maxSizeMB * 1024 * 1024) {
      enqueueSnackbar(`Image size must be under ${maxSizeMB} MB`, {
        variant: 'warning',
      });
      e.target.value = '';
      return;
    }

    // ✅ If valid, set the logo
    setLogo(file);
    enqueueSnackbar('Logo uploaded successfully!', {
      variant: 'success',
    });
  };
  return (
    <MainCard>
      <Box>
        <Typography variant="h1" gutterBottom>
          Generate Progress Report
        </Typography>
        <Breadcrumbs links={pageLinks} card custom rightAlign={false} />
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Fill in the details for today's progress report
      </Typography>

      {/* --- Project Details --- */}
      <Grid
        container
        spacing={2}
        sx={{
          mb: 2,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          p: 2,
          alignItems: 'center',
        }}
      >
        <Grid item xs={12} md={4}>
          <TextField label="Project" value={project.name} fullWidth disabled />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Location"
            value={project.location}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Contract ID"
            value={contactID}
            fullWidth
            onChange={(e) => setContactID(e.target.value)}
            // disabled
          />
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid item xs={12} md={6}>
            <DatePicker
              sx={{ width: 220 }}
              label="From"
              value={from ? dayjs(from) : null}
              onChange={(newValue) =>
                setFrom(newValue ? dayjs.utc(newValue).toISOString() : '')
              }
              // For format in v6+ use `format`; in older might still be `inputFormat`
              inputFormat="DD‑MM‑YYYY"
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              sx={{ width: 220 }}
              label="To"
              value={to ? dayjs(to) : null}
              onChange={(newValue) =>
                setTo(newValue ? dayjs.utc(newValue).toISOString() : '')
              }
              inputFormat="DD‑MM‑YYYY"
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </LocalizationProvider>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ minWidth: 220 }}>
            <InputLabel id="project-team-label">Project Team</InputLabel>
            <Select
              labelId="project-team-label"
              label="Project Team" // ensures the label reserves space
              multiple
              value={team} // should be an array of strings
              onChange={(e) => setTeam(e.target.value)}
              renderValue={(selected) => selected.join(', ')} // display comma-separated values
            >
              {projectMembers.map((m, i) => (
                <MenuItem
                  key={i}
                  value={`${m?.userId?.firstName} ${m?.userId?.lastName}`}
                >
                  {m?.userId?.firstName} {m?.userId?.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* ✅ Project Logo Upload */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {logo ? (
              <Box
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  overflow: 'hidden',
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                }}
              >
                <img
                  src={URL.createObjectURL(logo)}
                  alt="Project Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  border: '1px dashed #bbb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#777',
                  flexShrink: 0,
                }}
              >
                No Logo
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Project Logo
              </Typography>
              <Button
                component="label"
                variant="outlined"
                size="small"
                startIcon={<CloudUploadIcon />}
              >
                {logo ? 'Change Logo' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoChange}
                />
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid
          container
          spacing={2}
          alignItems="center"
          style={{ marginBottom: 16 }}
        >
          {/* Heading */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Import From:
            </Typography>
          </Grid>

          {/* Checkboxes */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                flexWrap="wrap"
              >
                {endpoints.map((ep) => (
                  <FormControlLabel
                    key={ep.key}
                    control={
                      <Checkbox
                        checked={selectedEndpoints[ep.key]}
                        onChange={() => handleToggle(ep.key)}
                      />
                    }
                    label={ep.label}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* --- Weather --- */}
      <Box sx={{ mb: 2, minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel id="weather-label">Weather Condition</InputLabel>
          <Select
            labelId="weather-label"
            value={weather}
            label="Weather Conditions"
            onChange={(e) => setWeather(e.target.value)}
          >
            {weatherOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* List fetched resources */}
      <Box sx={{ mt: 2 }}>
        {Array.isArray(activity) && activity.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h4" sx={{ mb: 1 }}>
              Activity Progress
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Cost</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activity.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell>{m.createdAt?.split('T')[0] || '-'}</TableCell>
                      <TableCell>{m.name || '-'}</TableCell>
                      <TableCell>{m.quantity || '-'}</TableCell>
                      <TableCell>{m.unit || '-'}</TableCell>
                      <TableCell>{m.cost || '-'}</TableCell>
                      <TableCell>
                        {m.status ? m.status.replace('_', ' ') : '-'}
                      </TableCell>
                      <TableCell>
                        {/* populated reference */}
                        {m.assignedTo?.firstName +
                          ' ' +
                          m.assignedTo.lastName || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        {/* 🧍‍♂️ Manpower Section */}
        {Array.isArray(manpower) && manpower.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h4" sx={{ mb: 1 }}>
              Manpower
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Manpower</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Trade</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Allocated</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Occupied</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Idle</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {manpower.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell>{m.createdAt.split('T')[0] || '-'}</TableCell>
                      <TableCell>{m.manPower || '-'}</TableCell>
                      <TableCell>{m.supplier || '-'}</TableCell>
                      <TableCell>{m.trade || '-'}</TableCell>
                      <TableCell>{m.allocated ?? '-'}</TableCell>
                      <TableCell>{m.occupied ?? '-'}</TableCell>
                      <TableCell>{m.idle ?? '-'}</TableCell>
                      <TableCell>{m.remarks || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {/* 🚜 Machinery Section */}
        {Array.isArray(machinery) && machinery.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h4" sx={{ mb: 1 }}>
              Machinery
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Machinery</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Allocated</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Occupied</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Idle</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Maintenance</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {machinery.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell>{m.createdAt.split('T')[0] || '-'}</TableCell>
                      <TableCell>{m.machinery || '-'}</TableCell>
                      <TableCell>{m.supplier || '-'}</TableCell>
                      <TableCell>{m.allocated ?? '-'}</TableCell>
                      <TableCell>{m.occupied ?? '-'}</TableCell>
                      <TableCell>{m.idle ?? '-'}</TableCell>
                      <TableCell>{m.maintainance ?? '-'}</TableCell>
                      <TableCell>{m.remarks || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {/* 🧱 Material Section */}
        {Array.isArray(material) && material.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h4" sx={{ mb: 1 }}>
              Material
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Material</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Received</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Used</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {material.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell>{m.createdAt.split('T')[0] || '-'}</TableCell>
                      <TableCell>{m.material || '-'}</TableCell>
                      <TableCell>{m.supplier || '-'}</TableCell>
                      <TableCell>{m.unit || '-'}</TableCell>
                      <TableCell>{m.received ?? '-'}</TableCell>
                      <TableCell>{m.used ?? '-'}</TableCell>
                      <TableCell>{m.balance ?? '-'}</TableCell>
                      <TableCell>{m.remarks || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>

      {/* --- Hinderances / Milestones / Remarks --- */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h3" sx={{ mb: 1 }}>
        Work Summary
      </Typography>

      {[
        { title: 'Hindrances', state: hinderances, setter: setHinderances },
        {
          title: 'Key Milestones',
          state: milestonesList,
          setter: setMilestonesList,
        },
        {
          title: 'Quality Observations',
          state: qualityList,
          setter: setQualityList,
        },
        { title: 'Safety Remarks', state: safetyList, setter: setSafetyList },
      ].map(({ title, state, setter }, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Typography variant="h4">{title}</Typography>
          {state.map((item, i) => (
            <Stack direction="row" spacing={1} key={i} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                value={item}
                onChange={(e) => updateItem(setter, i, e.target.value)}
                placeholder={`Enter ${title.toLowerCase()}`}
              />
              <Button color="error" onClick={() => removeItem(setter, i)}>
                Remove
              </Button>
            </Stack>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addItem(setter)}
            sx={{ mt: 1 }}
          >
            Add {title}
          </Button>
        </Box>
      ))}

      {/* --- Photos --- */}
      <Button
        variant="outlined"
        onClick={() => setPhotoDialogOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Photos
      </Button>
      <PhotoDialog
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        onAdd={handleAddPhoto}
      />

      {photos.length > 0 && (
        <Stack
          direction="row"
          flexWrap="wrap"
          spacing={2}
          useFlexGap
          justifyContent="flex-start"
        >
          {photos.length > 0 && (
            <Stack
              direction="row"
              flexWrap="wrap"
              spacing={2}
              useFlexGap
              justifyContent="flex-start"
            >
              {photos.map((p, i) => (
                <Paper
                  key={i}
                  elevation={3}
                  sx={{
                    width: 160,
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    textAlign: 'center',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  {/* Delete Button */}
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(i)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                    }}
                  >
                    <IconCopyXFilled fontSize="small" color="red" />
                  </IconButton>

                  {/* Image */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 120,
                      overflow: 'hidden',
                      bgcolor: '#f9f9f9',
                    }}
                  >
                    <img
                      src={URL.createObjectURL(p.file)}
                      alt={p.caption || `photo-${i}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  {/* Caption */}
                  <Box sx={{ p: 1.2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: '#333',
                        wordBreak: 'break-word',
                        fontSize: '0.85rem',
                      }}
                    >
                      {p.caption || 'No caption'}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      )}

      {/* --- Custom Fields --- */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Create New Field"
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          sx={{ flex: 1, mr: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleAddField}
          disabled={!newField.trim()}
        >
          Add +
        </Button>
      </Box>

      {Object.entries(customFields).map(([key, value]) => (
        <TextField
          key={key}
          label={key}
          value={value}
          onChange={(e) => handleCustomFieldChange(key, e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
      ))}

      {/* --- Submit --- */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </MainCard>
  );
};

export default DprForm;
