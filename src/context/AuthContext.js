import React, { createContext, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, getUserSession } from '../services/auth';
import { api } from '../services/api';


const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(credentials);
      if (response?.user && response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
      } else {
         setError('Invalid credentials');
      }
    } catch (err) {
       setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutUser();
      localStorage.removeItem('authToken');
      setUser(null);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Logout failed');
    } finally {
        setLoading(false);
    }
  };

  const checkSession = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      return;
    }
    setLoading(true);
     setError(null);
     try {
       const response = await getUserSession(token);
      if (response?.user) {
         setUser(response.user);
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
      }
     } catch (err) {
       localStorage.removeItem('authToken');
       setUser(null);
       setError(err.message || 'Session check failed');
     } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    checkSession,
    isAuthenticated: !!user,
  }), [user, loading, error]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export { AuthProvider, useAuth };

/*
  Test Cases:
    1. Initial state:
        - user should be null
        - loading should be false
        - error should be null
    2. Successful login:
        - login function should call the login API
        - user state should be updated with user data
        - loading should be set to true during login and false after
        - error should be null after successful login
        - isAuthenticated should return true
        - auth token should be stored in localStorage
     3. Unsuccessful login:
        - login function should call the login API
        - user state should remain null
        - loading should be set to true during login and false after
        - error should be updated with an error message
        - isAuthenticated should return false
        - auth token should not be set in localStorage
    4. Successful logout:
        - logout function should clear user data
        - loading should be set to true during logout and false after
        - error should be null after successful logout
        - isAuthenticated should return false
        - auth token should be removed from localStorage
    5. Session check with valid token:
        - checkSession should call the session API and set user
        - loading should be set to true during check and false after
        - error should be null
        - isAuthenticated should return true
    6. Session check with invalid token:
         - checkSession should call the session API and clear user
         - loading should be set to true during check and false after
         - error should be updated with an error message
         - isAuthenticated should return false
         - auth token should be removed from localStorage
   7. Session check with no token:
        - checkSession should set user to null
        - loading should not be set
        - error should be null
        - isAuthenticated should return false
   8. Error handling during network errors:
        - Handle network failures gracefully during all API interactions.
        - error message should be a meaningful user error message
    9. Error handling for token invalidation:
        - Check for and handle token invalidation gracefully
    10.  Check for errors from API with proper user-friendly messages
*/