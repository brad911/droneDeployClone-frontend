import axios from '../../utils/axios.config';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { setCredentials, logout } from '../slices/authSlice';
import { toast } from 'react-toastify';

export const loginUser = createAsyncThunk(
  'loginUser',
  async (data, thunkAPI) => {
    try {
      delete data.submit;
      thunkAPI.dispatch(loginUserStart()); // Dispatch the start action
      // Make your API request here, e.g., using fetch or axios
      const response = await axios.post(`/auth/login`, data);
      console.log(response.data, 'data from api');
      if (response.status === 200) {
        thunkAPI.dispatch(loginUserInProgress(response.data));
        thunkAPI.dispatch(loginUserSuccess());
        return true;
      }
      // thunkAPI.dispatch(createLoginUserSuccess(response.data)); // Dispatch the success action
      // thunkAPI.dispatch(createPostUserSuccess(response));

      // return response;
      return false;
    } catch (error) {
      console.error(error, '<==== eeee');
      toast.error(error?.response?.data?.message);
    }
  },
);

export const userLogout = createAsyncThunk(
  'logoutUser',
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(logoutUser());
      toast.success('Successfully Logged Out');
      return;
    } catch (e) {
      console.log(e, '<==== e');
      if (e.response.data.message !== null)
        toast.error(e.response.data.message);
      return false;
    }
  },
);
