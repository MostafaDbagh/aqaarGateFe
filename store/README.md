# Redux Store - Authentication System

## 📁 Structure

```
store/
├── index.js              # Main exports
├── store.js              # Store configuration
├── ReduxProvider.jsx     # Client-side Redux Provider component
├── slices/
│   └── authSlice.js      # Authentication slice (state, actions, selectors)
└── hooks/
    ├── index.js          # Hooks exports
    └── useAuth.js        # useAuthState hook
```

## 🚀 Features

- ✅ **Redux Toolkit** - Modern Redux with simplified setup
- ✅ **Authentication State** - User, token, role management
- ✅ **Custom Hooks** - Easy access to auth state
- ✅ **Type-safe** - Clean selectors and actions
- ✅ **SSR Compatible** - Works with Next.js server components

## 📦 Installation

Already installed:
```bash
npm install @reduxjs/toolkit react-redux
```

## 🎯 Usage

### Using Auth State in Components

```jsx
import { useAuthState } from '@/store/hooks/useAuth';

function MyComponent() {
  const { 
    user,                    // User object
    token,                   // Auth token
    isAuthenticated,         // Boolean
    isAgent,                 // Boolean
    displayName,             // String
    login,                   // Function
    logout,                  // Function
    changeRole               // Function
  } = useAuthState();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {displayName}!</p>
          {isAgent && <button>Agent Features</button>}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login(userData, token)}>Login</button>
      )}
    </div>
  );
}
```

### Dispatching Auth Actions

```jsx
import { useDispatch } from 'react-redux';
import { setCredentials, updateUserRole, logout } from '@/store';

function AuthComponent() {
  const dispatch = useDispatch();

  const handleLogin = (user, token) => {
    dispatch(setCredentials({ user, token }));
  };

  const handleRoleChange = (newRole) => {
    dispatch(updateUserRole(newRole));
  };

  const handleLogout = () => {
    dispatch(logout());
  };
}
```

### Using Selectors Directly

```jsx
import { useSelector } from 'react-redux';
import { 
  selectCurrentUser, 
  selectIsAgent, 
  selectIsAuthenticated 
} from '@/store';

function MyComponent() {
  const user = useSelector(selectCurrentUser);
  const isAgent = useSelector(selectIsAgent);
  const isAuth = useSelector(selectIsAuthenticated);
}
```

## 🔄 Auth Flow

### Login Flow
1. User submits login form
2. API call to `/auth/signin`
3. On success, dispatch `setCredentials({ user, token })`
4. Redux updates state
5. Components re-render with new state

### Logout Flow
1. User clicks logout
2. Dispatch `logout()` action
3. Redux clears auth state
4. Navigate to home page

### Role Change Flow
1. User clicks "Make Me Agent"
2. Dispatch `updateUserRole('agent')`
3. Redux updates user role and isAgent flag
4. Components re-render showing agent features immediately

## 🎨 Testing

Visit `/dev-tools` to:
- ✅ View current Redux state
- ✅ Quick login as User or Agent
- ✅ Change roles on the fly
- ✅ Test authentication UI

## 📊 State Shape

```javascript
{
  auth: {
    user: {
      _id: "user-id",
      username: "john_doe",
      email: "john@example.com",
      role: "agent",  // or "user"
    },
    token: "jwt-token-here",
    isAuthenticated: true,
    isAgent: true,
  }
}
```

## 🔧 Configuration

### Store Config (store/store.js)
```javascript
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
});
```

**Note:** State is managed in memory only. For persistence, use the browser's localStorage directly in auth API functions.

## 🎯 Integration Points

### Components Using Redux:
- `components/headers/DashboardNav.jsx` - User dropdown menu
- `components/headers/Header1.jsx` - Add Property button
- `app/layout.jsx` - Root provider
- `app/dev-tools/page.jsx` - Dev testing page

### API Integration:
- `apis/auth.js` - Saves user/token to localStorage (synced with Redux)
- Redux auto-hydrates from localStorage on app start

## 📝 Future Enhancements

- [ ] Add user API mutations (update profile, change password)
- [ ] Add role-based route protection
- [ ] Add loading states for auth operations
- [ ] Add error handling middleware
- [ ] Add Redux DevTools configuration
- [ ] Add TypeScript types for better DX

## 🐛 Debugging

Check Redux state in browser:
1. Install Redux DevTools Extension
2. Open DevTools → Redux tab
3. View state tree and action history

Console logs added in:
- `DashboardNav` - Shows current user from Redux
- Components log auth state on mount

## 🔐 Security Notes

- Tokens are stored in both localStorage and cookies (via auth API)
- Redux state is in-memory only (cleared on page refresh)
- For production, implement proper persistence strategy
- Sensitive operations should still verify on backend
- Client-side role checks are for UI only, not security

