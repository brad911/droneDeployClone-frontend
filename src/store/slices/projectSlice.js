import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedProjectId: null,
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setSelectedProjectId: (state, action) => {
            state.selectedProjectId = action.payload;
        },
        clearSelectedProjectId: (state) => {
            state.selectedProjectId = null;
        },
    },
});

export const { setSelectedProjectId, clearSelectedProjectId } = projectSlice.actions;
export default projectSlice.reducer; 