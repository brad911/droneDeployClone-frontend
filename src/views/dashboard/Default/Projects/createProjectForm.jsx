import { useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Box,
  Button,
  Typography,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Paper,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as Yup from 'yup';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router';
import { useDropzone } from 'react-dropzone';
import { IconCloudUpload } from '@tabler/icons-react';
import axiosInstance from '../../../../utils/axios.config';
import { useSelector } from 'react-redux';

const ProjectSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
  team: Yup.array().of(Yup.string().email('Invalid email')),

  startDate: Yup.date()
    .nullable()
    .test(
      'start-required-if-end',
      'Start date is required if end date is set',
      function (value) {
        const { endDate } = this.parent;
        if (endDate && !value) {
          return this.createError({
            message: 'Start date is required if end date is set',
          });
        }
        return true;
      },
    ),

  endDate: Yup.date()
    .nullable()
    .test(
      'end-required-if-start',
      'End date is required if start date is set',
      function (value) {
        const { startDate } = this.parent;
        if (startDate && !value) {
          return this.createError({
            message: 'End date is required if start date is set',
          });
        }
        return true;
      },
    ),
});
const CreateProjectForm = ({ onSubmit }) => {
  const [emailInput, setEmailInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('location', values.location || '');
      formData.append('description', values.location || ''); // adjust if you want a separate description
      formData.append('startDate', values.startDate || '');
      formData.append('endDate', values.endDate || '');
      if (file) formData.append('file', file);
      values.team.forEach((email, idx) =>
        formData.append(`team[${idx}]`, email),
      );
      const response = await axiosInstance.post('/project', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });
      const newProjectId = response.data?.data?._id || response.data?._id;
      if (newProjectId) {
        navigate(`/project/${newProjectId}/View`);
      } else {
        navigate('/project');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to create project',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 5, maxWidth: 500 }}>
      <Typography variant="h2" mb={2}>
        Create New Project
      </Typography>
      <Formik
        initialValues={{
          name: '',
          team: [],
          startDate: null,
          endDate: null,
          description: '',
          location: '',
        }}
        validationSchema={ProjectSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              name="name"
              label="Project Name"
              value={values.name}
              onChange={(e) => setFieldValue('name', e.target.value)}
              error={touched.name && Boolean(errors.name)}
            />
            {touched.name && errors.name && (
              <Typography color="error" variant="caption">
                {errors.name}
              </Typography>
            )}

            <TextField
              sx={{ mb: 2 }}
              fullWidth
              name="location"
              label="Project Location"
              value={values.location || ''}
              onChange={(e) => setFieldValue('location', e.target.value)}
            />

            {/* Start & End Date */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction="row" spacing={2} mb={2}>
                <DatePicker
                  label="Start Date"
                  value={values.startDate}
                  onChange={(val) => setFieldValue('startDate', val)}
                  renderInput={(params) => (
                    <Box
                      sx={{ '& .MuiInputBase-root': { borderRadius: '30px' } }}
                    >
                      <TextField
                        {...params}
                        fullWidth
                        error={touched.startDate && Boolean(errors.startDate)}
                        helperText={touched.startDate && errors.startDate}
                      />
                    </Box>
                  )}
                />
                <DatePicker
                  label="End Date"
                  value={values.endDate}
                  onChange={(val) => setFieldValue('endDate', val)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={touched.endDate && Boolean(errors.endDate)}
                      helperText={touched.endDate && errors.endDate}
                    />
                  )}
                />
              </Stack>
            </LocalizationProvider>

            <TextField
              sx={{ mb: 2 }}
              fullWidth
              name="description"
              label="Project Description"
              value={values.description || ''}
              onChange={(e) => setFieldValue('description', e.target.value)}
            />

            {/* Team Input */}
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              label="Invite Team Member (press Enter to add)"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && emailInput) {
                  e.preventDefault();
                  setFieldValue('team', [...values.team, emailInput]);
                  setEmailInput('');
                }
              }}
            />
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
              {values.team.map((email, index) => (
                <Chip
                  key={index}
                  label={email}
                  onDelete={() => {
                    const updated = [...values.team];
                    updated.splice(index, 1);
                    setFieldValue('team', updated);
                  }}
                />
              ))}
            </Stack>

            {/* Enhanced Dropzone */}
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: 4,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
                mb: 2,
              }}
            >
              <input {...getInputProps()} />
              <IconCloudUpload />
              <Typography variant="h6" gutterBottom>
                Upload Supporting File
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Drag & drop a file or click below to browse
              </Typography>
              <Button
                variant="outlined"
                onClick={() =>
                  document.querySelector('input[type="file"]').click()
                }
              >
                Browse Files
              </Button>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {file.name}
                </Typography>
              )}
            </Box>

            {/* Submit */}
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              color="primary"
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default CreateProjectForm;
