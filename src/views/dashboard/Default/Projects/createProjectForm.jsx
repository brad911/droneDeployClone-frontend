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
import axios from 'axios';
import { useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';

const ProjectSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
  description: Yup.string().required('Project Description is required'),
  team: Yup.array().of(Yup.string().email('Invalid email')),
  location: Yup.string().required('Location  is required'),
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
  const [uploadProgress, setUploadProgress] = useState(0);
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
    setUploadProgress(0);

    // If there's no file, create project normally
    if (!file) {
      try {
        const response = await axiosInstance.post('/project', values, {
          headers: {
            Authorization: token,
          },
        });

        const newProjectId = response.data?.data?._id;
        navigate(newProjectId ? `/project/${newProjectId}/View` : '/project');
        if (response.status === 201) {
          enqueueSnackbar('Successfully Created Project', {
            variant: 'success',
          });
        }
        return;
      } catch (e) {
        setError(
          e.response?.data?.message || e.message || 'Failed to create project',
        );
        setLoading(false);
        return;
      }
    }

    // Attach file metadata for backend presigned URL
    values.file = {
      filename: file.name,
      contentType: file.type,
      size: file.size,
    };

    try {
      // Create project and get upload info
      const response = await axiosInstance.post('/project', values, {
        headers: {
          Authorization: token,
        },
      });
      if (file !== null) {
        const uploadResponse = response.data.data;
        let newProjectId =
          uploadResponse?.project?.id || response.data?.data?._id;
        // Single file upload (PUT to presigned S3 URL)
        if (uploadResponse.upload?.uploadType === 'single') {
          await axios.put(uploadResponse.upload.url, file, {
            headers: {
              'Content-Type': file.type,
            },
            onUploadProgress: (event) => {
              const percent = Math.round((event.loaded * 100) / event.total);
              setUploadProgress(percent);
            },
          });
        }

        // Multipart upload
        else if (uploadResponse.upload?.uploadType === 'multipart') {
          const { parts, uploadId, key, partSize } = uploadResponse.upload;

          // Split file into chunks
          const chunks = [];
          let start = 0;
          while (start < file.size) {
            const end = Math.min(start + partSize, file.size);
            chunks.push(file.slice(start, end));
            start = end;
          }

          // Upload each part and collect ETags
          const etags = [];
          for (let i = 0; i < parts.length; i++) {
            const res = await fetch(parts[i].url, {
              method: 'PUT',
              body: chunks[i],
            });

            if (!res.ok) {
              throw new Error(`Chunk ${i + 1} failed to upload`);
            }

            const etag = res.headers.get('ETag')?.replace(/"/g, '');
            etags.push({ PartNumber: parts[i].partNumber, ETag: etag });

            const percent = Math.round(((i + 1) / parts.length) * 100);
            setUploadProgress(percent);
          }

          // Complete multipart upload
          await axiosInstance.post(
            '/work-day/complete-upload',
            {
              projectId: newProjectId,
              name: new Date(),
              key,
              uploadId,
              parts: etags,
            },
            {
              headers: {
                Authorization: token,
              },
            },
          );
        }

        // Notify success
        enqueueSnackbar('Upload successful!', { variant: 'success' });
      }
      enqueueSnackbar('Successfully Created Historical Data', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message ||
          err.message ||
          'Failed to create project',
        { variant: 'error' },
      );
    } finally {
      setLoading(false);
      navigate('/project');
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 5, maxWidth: 500 }}>
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
            <Box mb={2}>
              <TextField
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
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                name="location"
                label="Project Location"
                value={values.location || ''}
                onChange={(e) => setFieldValue('location', e.target.value)}
              />
              {touched.location && errors.location && (
                <Typography color="error" variant="caption">
                  {errors.location}
                </Typography>
              )}
            </Box>

            {/* Start & End Date */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction="row" spacing={2} mb={2}>
                <DatePicker
                  label="Start Date"
                  value={values.startDate}
                  onChange={(val) => setFieldValue('startDate', val)}
                  format="dd-MM-yyyy"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={touched.startDate && Boolean(errors.startDate)}
                      helperText={touched.startDate && errors.startDate}
                    />
                  )}
                />
                <DatePicker
                  label="End Date"
                  value={values.endDate}
                  onChange={(val) => setFieldValue('endDate', val)}
                  format="dd-MM-yyyy"
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
            <Box mb={2}>
              <TextField
                fullWidth
                name="description"
                label="Project Description"
                value={values.description || ''}
                onChange={(e) => setFieldValue('description', e.target.value)}
              />
              {touched.description && errors.description && (
                <Typography color="error" variant="caption">
                  {errors.description}
                </Typography>
              )}
            </Box>

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
                justifyContent: 'center',
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
                Drag & drop a .zip file or click below to browse
              </Typography>
              <Button variant="outlined">Browse Files</Button>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {file.name}
                </Typography>
              )}
              {loading && uploadProgress > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    justifyContent: 'center',
                    alignContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption">
                    Uploading... {uploadProgress}%
                  </Typography>
                  <Box sx={{ width: '100%' }}>
                    <Stack spacing={1}>
                      <Box sx={{ width: '100%' }}>
                        <Box
                          sx={{
                            height: 4,
                            bgcolor: '#eee',
                            borderRadius: 2,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${uploadProgress}%`,
                              height: '100%',
                              bgcolor: 'primary.main',
                              transition: 'width 0.2s',
                            }}
                          />
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
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
