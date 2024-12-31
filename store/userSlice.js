import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.username = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
