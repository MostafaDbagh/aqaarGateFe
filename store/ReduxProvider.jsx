"use client";
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from './store';
import { authAPI } from '../apis/auth';

export default function ReduxProvider({ children }) {
  useEffect(() => {
    // Initialize auth state from localStorage on app startup
    authAPI.initializeAuthState();
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

