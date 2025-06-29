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
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as Yup from 'yup';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router';
import { useDropzone } from 'react-dropzone';
import { IconCloudUpload } from '@tabler/icons-react';

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
  const theme = useTheme();
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <Box sx={{ p: 5, maxWidth: 500 }}>
      <Typography variant="h3" mb={2}>
        Create New Project
      </Typography>
      <Formik
        initialValues={{ name: '', team: [], startDate: null, endDate: null }}
        validationSchema={ProjectSchema}
        onSubmit={(values) => {
          onSubmit({ ...values, file });
          navigate('/project/1');
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            {/* Project Name */}
            <FormControl
              fullWidth
              sx={{ ...theme.typography.customInput, mb: 2 }}
            >
              <InputLabel>Project Name</InputLabel>
              <OutlinedInput
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
            </FormControl>
            {/* Project Location */}
            <FormControl
              fullWidth
              sx={{ ...theme.typography.customInput, mb: 2 }}
            >
              <InputLabel>Project Location</InputLabel>
              <OutlinedInput
                fullWidth
                name="location"
                label="Project Location"
                value={values.location || ''}
                onChange={(e) => setFieldValue('location', e.target.value)}
              />
            </FormControl>

            {/* Start & End Date */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction="row" spacing={2} mb={2}>
                <DatePicker
                  label="Start Date"
                  value={values.startDate}
                  onChange={(val) => setFieldValue('startDate', val)}
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

            {/* Team Input */}
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel>Invite Team Member (press Enter to add)</InputLabel>
              <OutlinedInput
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
                sx={{ mb: 1 }}
              />
            </FormControl>
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

            {/* File Dropzone */}
            {/* Project Location */}
            <FormControl
              fullWidth
              sx={{ ...theme.typography.customInput, mb: 2 }}
            >
              <InputLabel>Project Location</InputLabel>
              <OutlinedInput
                fullWidth
                name="location"
                label="Project Location"
                value={values.location || ''}
                onChange={(e) => setFieldValue('location', e.target.value)}
              />
            </FormControl>

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
            <Button
              color="secondary"
              variant="contained"
              type="submit"
              fullWidth
            >
              Create Project
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateProjectForm;
