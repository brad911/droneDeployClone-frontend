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

export default function ForgetPasswordForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('/auth/forget-password', values); // Replace with your real endpoint

      if (response.status === 200) {
        enqueueSnackbar('Email Successufully Send, Check your Inbox!', {
          variant: 'success',
        });
      }
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          'Unable To reset your password, Please try again.',
        { variant: 'error' },
      );
    } finally {
      setSubmitting(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
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
          Email Address
        </InputLabel>
        <OutlinedInput
          id="email"
          type="email"
          value={formik.values.email}
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          label="Email Address"
        />
      </FormControl>
      {formik.touched.email && formik.errors.email && (
        <Typography color="error" variant="caption">
          {formik.errors.email}
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            color="secondary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Forget Password
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
