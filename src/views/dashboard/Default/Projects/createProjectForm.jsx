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
} from '@mui/material';
import * as Yup from 'yup';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useTheme } from '@emotion/react';

// Validation schema
const ProjectSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
  team: Yup.array().of(Yup.string().email('Invalid email')),
});

const CreateProjectForm = ({ onSubmit }) => {
  const [emailInput, setEmailInput] = useState('');
  const [file, setFile] = useState(null);
  const theme = useTheme();

  return (
    <Box sx={{ p: 5, maxWidth: 500 }}>
      <Typography variant="h3" mb={2}>
        Create New Project
      </Typography>
      <Formik
        initialValues={{ name: '', team: [] }}
        validationSchema={ProjectSchema}
        onSubmit={(values) => {
          onSubmit({ ...values, file });
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            {/* Project Name */}
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">
                Project Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                fullWidth
                name="name"
                label="Project Name"
                value={values.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                sx={{ mb: 2 }}
              />
            </FormControl>
            {/* Project Name */}
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">
                Project's Location
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                fullWidth
                name="name"
                label="Project Name"
                value={values.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                sx={{ mb: 2 }}
              />
            </FormControl>

            {/* Invite Team Members (Multi-email) */}
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="teamInvite">
                Invite Team Member (press Enter to add)
              </InputLabel>
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

            {/* File Upload */}
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{ mb: 2 }}
            >
              {file ? file.name : 'Upload File'}
              <input
                type="file"
                hidden
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </Button>

            {/* Submit Button */}
            <Box mt={3}>
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                fullWidth
              >
                Create Project
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateProjectForm;
