import { useState, useEffect, useContext, createContext } from 'react';
import { authService } from '../services/auth';
// Named import
// OR if you prefer default import:
// import authService from '../services/auth'; // Default import
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // Initialize authentication state
  useEffect(() => {
    console.log('🔍 Auth Provider - Initializing...');
    checkAuth();
  }, []);

  // Prevent navigation loops
  useEffect(() => {
    if (!initialized) return; // Don't redirect until initialized
    
    const currentPath = router.pathname;
    console.log('🔍 Auth Effect - User:', !!user, 'Path:', currentPath, 'Loading:', loading);
    
    // Prevent redirect loops
    if (loading) return;
    
    // If user is authenticated and on login page, redirect to dashboard
    if (user && currentPath === '/login') {
      console.log('🔄 Authenticated user on login page, redirecting to dashboard');
      const redirectTo = router.query.from || '/dashboard';
      router.replace(redirectTo); // Use replace instead of push to avoid history
    }
  }, [user, loading, initialized, router.pathname]);

  // Periodic session validation (only when user is authenticated)
  useEffect(() => {
    if (user && initialized) {
      const interval = setInterval(async () => {
        try {
          const isValid = await authService.validateSession();
          if (!isValid) {
            console.log('🔒 Session invalid, logging out');
            await logout();
          }
        } catch (error) {
          console.error('❌ Session validation error:', error);
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [user, initialized]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Check if we have a valid token
      const token = document.cookie.includes('accessToken');
      
      if (token) {
        console.log('🔍 Token found, checking authentication...');
        const userData = await authService.getCurrentUser();
        
        console.log('✅ Authentication successful:', userData);
        setUser(userData);
      } else {
        console.log('ℹ️ No authentication token found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Authentication check failed:', error);
      setUser(null);
      
      // Clear any invalid auth data
      localStorage.removeItem('adminUser');
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      console.log('🔐 useAuth: Attempting admin login...');
      
      // Check if authService is available
      if (!authService || typeof authService.login !== 'function') {
        console.error('❌ authService is not properly imported:', authService);
        throw new Error('Authentication service is not available');
      }
      
      const { user: userData } = await authService.login(credentials);
      
      setUser(userData);
      
      console.log('✅ useAuth: Login successful:', userData);
      toast.success(`Welcome back, ${userData.firstName}!`);
      
      // Don't redirect here - let the useEffect handle it to prevent loops
      return { success: true };
    } catch (error) {
      console.error('❌ useAuth: Login failed:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      console.log('👋 useAuth: Logging out...');
      await authService.logout();
      
      setUser(null);
      toast.success('Logged out successfully');
      
      // Force redirect to login
      router.replace('/login');
    } catch (error) {
      console.error('❌ useAuth: Logout error:', error);
      
      // Force clear local state even if backend call fails
      setUser(null);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.role === 'admin';
  };

  const value = {
    user,
    login,
    logout,
    loading,
    initialized,
    isAuthenticated: !!user,
    hasPermission,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};