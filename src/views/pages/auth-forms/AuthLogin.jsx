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
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../../store/slices/authSlice';

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  const handleLogin = async (values, { setSubmitting }) => {
    delete values.keepLoggedIn;
    try {
      const response = await axios.post('/auth/login', values); // Replace with your real endpoint

      if (response.status === 200) {
        enqueueSnackbar('Login successful!', { variant: 'success' });
        dispatch(
          setCredentials({
            user: response.data.data.user,
            token: response.data.data.tokens.access.token,
          }),
        );
        localStorage.setItem('token', response.data.data.tokens.access.token);
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
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
      email: '',
      password: '',
      keepLoggedIn: true,
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: handleLogin,
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <FormControl
        fullWidth
        sx={{ ...theme.typography.customInput }}
        error={formik.touched.email && Boolean(formik.errors.email)}
      >
        <InputLabel onClick={() => console.log(user)} htmlFor="email">
          Email Address / Username
        </InputLabel>
        <OutlinedInput
          id="email"
          type="email"
          value={formik.values.email}
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          label="Email Address / Username"
        />
      </FormControl>
      {formik.touched.email && formik.errors.email && (
        <Typography color="error" variant="caption">
          {formik.errors.email}
        </Typography>
      )}

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
      </FormControl>
      {formik.touched.password && formik.errors.password && (
        <Typography color="error" variant="caption">
          {formik.errors.password}
        </Typography>
      )}

      <Grid
        container
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.keepLoggedIn}
                onChange={formik.handleChange}
                name="keepLoggedIn"
                color="primary"
              />
            }
            label="Keep me logged in"
          />
        </Grid>
        <Grid item>
          <Typography
            variant="subtitle1"
            component={Link}
            to="/forgot-password"
            color="secondary"
            sx={{ textDecoration: 'none' }}
          >
            Forgot Password?
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            color="secondary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Log In
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
