import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCurrentUser, 
  selectCurrentToken, 
  selectIsAuthenticated, 
  selectIsAgent,
  selectUserDisplayName,
  setCredentials,
  updateUserRole,
  logout as logoutAction
} from '../slices/authSlice';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for authentication state from Redux
 * @returns {Object} Auth state and methods
 */
export const useAuthState = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAgent = useSelector(selectIsAgent);
  const displayName = useSelector(selectUserDisplayName);

  const login = (userData, authToken) => {
    dispatch(setCredentials({ user: userData, token: authToken }));
  };

  const logout = () => {
    // Clear Redux state
    dispatch(logoutAction());
    
    // Clear localStorage (client-side only)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivityTime');
      } catch (error) {
        console.warn('Failed to clear localStorage on logout:', error);
      }
      
      // Clear cookies
      try {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      } catch (error) {
        console.warn('Failed to clear cookies on logout:', error);
      }
    }
    
    // Navigate to home
    router.push('/');
  };

  const changeRole = (role) => {
    dispatch(updateUserRole(role));
  };

  return {
    user,
    token,
    isAuthenticated,
    isAgent,
    displayName,
    login,
    logout,
    changeRole,
  };
};

