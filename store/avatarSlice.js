import { createSlice } from '@reduxjs/toolkit';

const avatarSlice = createSlice({
  name: 'avatar',
  initialState: '/avatar.png',
  reducers: {
    setAvatar: (state, action) => {
      return action.payload;
    },
  },
});

export const { setAvatar } = avatarSlice.actions;
export default avatarSlice.reducer;