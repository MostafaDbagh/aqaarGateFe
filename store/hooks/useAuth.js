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
    dispatch(logoutAction());
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

