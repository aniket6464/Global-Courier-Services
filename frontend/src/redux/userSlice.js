import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null, // Stores the current user's information
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.currentUser = action.payload; // Sets currentUser to the user data from the payload
    },
    signOut: (state) => {
      state.currentUser = null; // Clears currentUser data
    },
    updateUser: (state, action) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload, // Merges existing currentUser data with updates from payload
        };
      }
    },
  },
});

export const { signIn, signOut, updateUser } = userSlice.actions;
export default userSlice.reducer;
