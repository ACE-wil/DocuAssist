import { configureStore } from '@reduxjs/toolkit';
import avatarReducer from './avatarSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    avatar: avatarReducer,
    theme: themeReducer,
  },
});

