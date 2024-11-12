import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    isVisible: true
  },
  reducers: {
    setNavigationVisibility: (state, action) => {
      state.isVisible = action.payload;
    }
  }
});

export const { setNavigationVisibility } = navigationSlice.actions;
export default navigationSlice.reducer; 