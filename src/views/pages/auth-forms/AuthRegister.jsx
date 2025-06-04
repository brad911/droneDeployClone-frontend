import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../../../utils/axios.config';
import { useSnackbar } from 'notistack';

// material-ui
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

export default function AuthRegister() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    delete values.confirmPassword;
    delete values.terms;
    try {
      const response = await axios.post('/user', values); // Replace with your API endpoint
      if (response.status === 201)
        enqueueSnackbar('Registration successful!', { variant: 'success' });
      navigate('/login');
      enqueueSnackbar('Verify Your Email To Login', { variant: 'success' });
      resetForm();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      organization: '',
      role: '',
      designation: '',
      gender: '',
      password: '',
      confirmPassword: '',
      terms: true,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      organization: Yup.string().required('Organization is required'),
      role: Yup.string().required('Role is required'),
      designation: Yup.string().required('Designation is required'),
      gender: Yup.string().required('Gender is required'),
      password: Yup.string()
        .min(6, 'Minimum 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm your password'),
      terms: Yup.boolean().oneOf(
        [true],
        'You must accept the terms and conditions',
      ),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        container
        direction="column"
        spacing={2}
        sx={{ justifyContent: 'center' }}
      >
        <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Sign up with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <FormControl
          fullWidth
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          sx={theme.typography.customInput}
        >
          <InputLabel>First Name</InputLabel>
          <OutlinedInput
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="First Name"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <FormHelperText>{formik.errors.firstName}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl
          fullWidth
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          sx={theme.typography.customInput}
        >
          <InputLabel>Last Name</InputLabel>
          <OutlinedInput
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Last Name"
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <FormHelperText>{formik.errors.lastName}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      <FormControl
        fullWidth
        error={formik.touched.email && Boolean(formik.errors.email)}
        sx={theme.typography.customInput}
      >
        <InputLabel>Email Address</InputLabel>
        <OutlinedInput
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Email Address"
        />
        {formik.touched.email && formik.errors.email && (
          <FormHelperText>{formik.errors.email}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={
          formik.touched.organization && Boolean(formik.errors.organization)
        }
        sx={theme.typography.customInput}
      >
        <InputLabel>Organization</InputLabel>
        <OutlinedInput
          name="organization"
          value={formik.values.organization}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Organization"
        />
        {formik.touched.organization && formik.errors.organization && (
          <FormHelperText>{formik.errors.organization}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={formik.touched.role && Boolean(formik.errors.role)}
        sx={theme.typography.customSelect}
      >
        <InputLabel>Role</InputLabel>
        <Select
          name="role"
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Role"
        >
          <MenuItem value="client">Client</MenuItem>
          <MenuItem value="contractor">Contractor</MenuItem>
          <MenuItem value="consultant">Consultant</MenuItem>
        </Select>
        {formik.touched.role && formik.errors.role && (
          <FormHelperText>{formik.errors.role}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={formik.touched.designation && Boolean(formik.errors.designation)}
        sx={theme.typography.customInput}
      >
        <InputLabel>Designation</InputLabel>
        <OutlinedInput
          name="designation"
          value={formik.values.designation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Designation"
        />
        {formik.touched.designation && formik.errors.designation && (
          <FormHelperText>{formik.errors.designation}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={formik.touched.gender && Boolean(formik.errors.gender)}
        sx={theme.typography.customSelect}
      >
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={formik.values.gender}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Gender"
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
        {formik.touched.gender && formik.errors.gender && (
          <FormHelperText>{formik.errors.gender}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={formik.touched.password && Boolean(formik.errors.password)}
        sx={theme.typography.customInput}
      >
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Password"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        {formik.touched.password && formik.errors.password && (
          <FormHelperText>{formik.errors.password}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={
          formik.touched.confirmPassword &&
          Boolean(formik.errors.confirmPassword)
        }
        sx={theme.typography.customInput}
      >
        <InputLabel>Confirm Password</InputLabel>
        <OutlinedInput
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Confirm Password"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <FormHelperText>{formik.errors.confirmPassword}</FormHelperText>
        )}
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            name="terms"
            checked={formik.values.terms}
            onChange={formik.handleChange}
            color="primary"
          />
        }
        label={
          <Typography variant="subtitle1">
            Agree with&nbsp;
            <Typography variant="subtitle1" component={Link} to="#">
              Terms & Conditions
            </Typography>
          </Typography>
        }
      />
      {formik.touched.terms && formik.errors.terms && (
        <FormHelperText error>{formik.errors.terms}</FormHelperText>
      )}

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
          >
            Sign up
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
