import { createSlice } from "@reduxjs/toolkit";

const navigationSlice = createSlice({
  name: "navigation",
  initialState: {
    isVisible: true,
    navExpand: true,
  },
  reducers: {
    setNavigationVisibility: (state, action) => {
      state.isVisible = action.payload;
    },
    setNavExpand: (state, action) => {
      state.navExpand = action.payload;
    },
  },
});

export const { setNavigationVisibility, setNavExpand } =
  navigationSlice.actions;
export default navigationSlice.reducer;
