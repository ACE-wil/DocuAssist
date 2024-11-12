import { configureStore } from '@reduxjs/toolkit';
import avatarReducer from './avatarSlice';
import themeReducer from './themeSlice';
import navigationReducer from './navigationSlice';

export const store = configureStore({
  reducer: {
    avatar: avatarReducer,
    theme: themeReducer,
    navigation: navigationReducer,
  },
});

