import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: '',
  location: '',
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.location = action.payload.location;
    },
    clearSelectedProjectId: (state) => {
      state.id = null;
      state.name = '';
      state.location = '';
    },
  },
});

export const { setSelectedProject, clearSelectedProjectId } =
  projectSlice.actions;
export default projectSlice.reducer;
