import { configureStore } from "@reduxjs/toolkit";
import avatarReducer from "./avatarSlice";
import themeReducer from "./themeSlice";
import navigationReducer from "./navigationSlice";
import loadingReducer from "./loadingSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    avatar: avatarReducer,
    theme: themeReducer,
    navigation: navigationReducer,
    loading: loadingReducer,
    user: userReducer,
  },
});
