import { createSlice } from '@reduxjs/toolkit';

const lightTheme = {
  background: '#ffffff',
  text: '#333333',
  primary: '#007bff',
  secondary: '#f8f8f8',
  border: '#e0e0e0',
};

const darkTheme = {
  background: '#1a1a1a',
  text: '#ffffff',
  primary: '#4da6ff',
  secondary: '#2c2c2c',
  border: '#444444',
};

const initialState = {
  mode: 'light',
  colors: lightTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.mode = action.payload;
      state.colors = action.payload === 'dark' ? darkTheme : lightTheme;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
