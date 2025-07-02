import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  IconButton,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';
import Breadcrumbs from '../../../../../ui-component/extended/Breadcrumbs';
import { IconBuildingCog, IconDroneOff, IconReport } from '@tabler/icons-react';

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
  // Placeholder project details
  const [project, setProject] = useState({
    name: '',
    location: '',
    contractId: '',
    team: [],
  });
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  });
  const [weather, setWeather] = useState('');
  const [manpower, setManpower] = useState('');
  const [material, setMaterial] = useState('');
  const [machinery, setMachinery] = useState('');
  const [activities, setActivities] = useState([
    { name: '', quantity: '', status: '' },
  ]);
  const [issues, setIssues] = useState('');
  const [milestones, setMilestones] = useState('');
  const [remarks, setRemarks] = useState('');
  const [newField, setNewField] = useState('');
  const [fields, setFields] = useState([]);

  // Handlers
  const handleActivityChange = (idx, key, value) => {
    const updated = [...activities];
    updated[idx][key] = value;
    setActivities(updated);
  };
  const handleAddActivity = () => {
    setActivities([...activities, { name: '', quantity: '', status: '' }]);
  };
  const handleAddField = () => {
    if (newField.trim()) {
      setFields([...fields, newField.trim()]);
      setNewField('');
    }
  };

  const pageLinks = [
    { title: 'Projects', to: '/project', icon: IconDroneOff },
    { title: 'Project Name', to: '/project/1', icon: IconBuildingCog },
    { title: 'Progress Report', icon: IconReport }, // No `to` makes it the current page
  ];
  return (
    <MainCard>
      <Box>
        <Typography variant="h1" gutterBottom>
          Generate Progress Report
        </Typography>
        <Breadcrumbs
          links={pageLinks}
          card={true}
          custom={true}
          rightAlign={false}
        />
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Fill in the details for today's progress report
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        {/* Project Details */}
        <Grid
          container
          spacing={2}
          sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}
        >
          <Grid item xs={12} md={4}>
            <TextField
              label="Project"
              value={project.name}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Project Location"
              value={project.location}
              fullWidth
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Contract ID/Project number"
              value={project.contractId}
              fullWidth
              sx={{ mb: 1 }}
            />
          </Grid>
          {/* Swapped Position: Date comes before Team */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 1, width: 220 }}>
              <InputLabel id="project-team-label">Project Team</InputLabel>
              <Select
                labelId="project-team-label"
                label="Project Team"
                multiple
                value={project.team}
                onChange={(e) =>
                  setProject((prev) => ({ ...prev, team: e.target.value }))
                }
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="alice@example.com">alice@example.com</MenuItem>
                <MenuItem value="bob@example.com">bob@example.com</MenuItem>
                <MenuItem value="carol@example.com">carol@example.com</MenuItem>
                <MenuItem value="dave@example.com">dave@example.com</MenuItem>
              </Select>
            </FormControl>

            {/* Show selected team members below */}
            {project.team.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {project.team.map((member, idx) => (
                  <Chip key={idx} label={member} />
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>

        {/* Weather Conditions */}
        <Box sx={{ mb: 2 }}>
          <FormControlSelect
            captionLabel="Weather Conditions"
            currencies={weatherOptions}
            selected={weather}
            formState={''}
            textPrimary={null}
            textSecondary={null}
            iconPrimary={null}
            iconSecondary={null}
          />
        </Box>

        {/* Manpower, Material, Machinery */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Manpower"
              value={manpower}
              onChange={(e) => setManpower(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Machinery"
              value={machinery}
              onChange={(e) => setMachinery(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Activity Progress */}
        <Box sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Activity Progress
          </Typography>
          {activities.map((activity, idx) => (
            <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Activity Name"
                  value={activity.name}
                  onChange={(e) =>
                    handleActivityChange(idx, 'name', e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Quantity"
                  value={activity.quantity}
                  onChange={(e) =>
                    handleActivityChange(idx, 'quantity', e.target.value)
                  }
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={activity.status}
                    onChange={(e) =>
                      handleActivityChange(idx, 'status', e.target.value)
                    }
                    inputComponent={({ inputRef, ...props }) => (
                      <select
                        ref={inputRef}
                        {...props}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          background: 'none',
                        }}
                      >
                        <option value=""></option>
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddActivity}
            sx={{ mt: 1 }}
          >
            Add Activity
          </Button>
        </Box>

        {/* Issues & Challenges */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Issues & Challenges"
            value={issues}
            onChange={(e) => setIssues(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            placeholder="Describe any issues or challenges encountered"
          />
        </Box>

        {/* Key Milestones & Remarks */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Key Milestones Achieved"
              value={milestones}
              onChange={(e) => setMilestones(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              InputProps={{
                endAdornment: <Button size="small">add Photo options</Button>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Observation or Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
          </Grid>
        </Grid>

        {/* Create New Field */}
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

        {/* Editable fields list */}
        {fields.length > 0 && (
          <Stack spacing={2} sx={{ mb: 2 }}>
            {fields.map((field, idx) => (
              <TextField
                key={idx}
                fullWidth
                label={`Custom Field ${idx + 1}`}
                value={field}
                onChange={(e) => {
                  const updated = [...fields];
                  updated[idx] = e.target.value;
                  setFields(updated);
                }}
              />
            ))}
          </Stack>
        )}

        {/* Submit Button */}
        <Button variant="contained" color="primary" fullWidth>
          Submit Daily Progress Report
        </Button>
      </Box>
    </MainCard>
  );
};

export default DprForm;
