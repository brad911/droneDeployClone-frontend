import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: '',
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
    clearSelectedProjectId: (state) => {
      state.id = null;
      state.name = '';
    },
  },
});

export const { setSelectedProject, clearSelectedProjectId } =
  projectSlice.actions;
export default projectSlice.reducer;
