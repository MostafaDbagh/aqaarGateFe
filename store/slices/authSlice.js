import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAgent: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = !!token; // Only authenticated if there's a token
      state.isAgent = user?.role === 'agent';
    },
    updateUserRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload;
        state.isAgent = action.payload === 'agent';
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAgent = false;
    },
  },
});

export const { setCredentials, updateUserRole, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAgent = (state) => state.auth.isAgent;
export const selectUserDisplayName = (state) => 
  state.auth.user?.username || state.auth.user?.name || 'Guest';

