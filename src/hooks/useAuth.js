import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser, logoutUser, getUserSession } from '../services/auth';


const useAuth = () => {
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    const { user, loading, error, setUser, setError, setLoading } = context;
    
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
          const response = await loginUser(credentials);
            if (response?.user && response.token) {
              localStorage.setItem('authToken', response.token);
             setUser(response.user);
            } else {
              setError('Login failed: Invalid credentials.');
            }
        } catch (err) {
            setError(err.message || 'Login failed.');
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
             setError(err.message || 'Logout failed.');
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
            setError(err.message || 'Session check failed.');
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
    
    return value;
};

export default useAuth;