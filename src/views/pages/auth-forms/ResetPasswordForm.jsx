import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import axios from '../../../utils/axios.config';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Box,
} from '@mui/material';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axiosInstance from '../../../utils/axios.config';
import { useLocation } from 'react-router-dom';

// ===============================|| JWT - LOGIN ||=============================== //

export default function ResetPasswordForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const { enqueueSnackbar } = useSnackbar();
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{12,}$/;

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const token = query.get('token');

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      console.log(token, '<==== wew');
      const ResetPasswordResponse = await axiosInstance.post(
        '/auth/reset-password',
        values, // request body
        {
          params: { token }, // query string -> ?token=...
        },
      );
      if (ResetPasswordResponse.status === 200) {
        enqueueSnackbar('Password has been succcessfully changed!', {
          variant: 'success',
        });
        navigate('/login');
      }
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Login failed. Please try again.',
        { variant: 'error' },
      );
    } finally {
      setSubmitting(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Password is required')
        .matches(
          passwordRegex,
          'Password must be at least 12 characters and include an uppercase letter, a number, and a special character (@!#$%^&*)',
        ),
      confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
    onSubmit: handleLogin,
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <FormControl
        fullWidth
        sx={{ ...theme.typography.customInput }}
        error={formik.touched.password && Boolean(formik.errors.password)}
      >
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {formik.touched.password && formik.errors.password && (
          <Typography color="error" variant="caption">
            {formik.errors.password}
          </Typography>
        )}
      </FormControl>
      <FormControl
        fullWidth
        sx={{ ...theme.typography.customInput }}
        error={formik.touched.password && Boolean(formik.errors.password)}
      >
        <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
        <OutlinedInput
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.confirmPassword}
          name="confirmPassword"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="confirmPassword"
        />
      </FormControl>
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <Typography color="error" variant="caption">
          {formik.errors.confirmPassword}
        </Typography>
      )}

      <Grid
        container
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      ></Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            color="secondary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Reset Password
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
