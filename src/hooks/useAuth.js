import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import authService from '@/services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        // Check for token in cookies first (more secure)
        let token = Cookies.get('accessToken');
        
        // Fallback to localStorage if cookie not found
        if (!token) {
          token = localStorage.getItem('accessToken');
          // If found in localStorage, move it to cookie
          if (token) {
            Cookies.set('accessToken', token, { 
              expires: 1,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });
          }
        }
        
        const userData = localStorage.getItem('adminUser');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('✅ Auth: User authenticated from stored session');
        } else {
          console.log('❌ Auth: No valid session found');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Auth: Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
        // Clear potentially corrupted data
        Cookies.remove('accessToken');
        localStorage.removeItem('adminUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      console.log('🔐 Auth: Attempting login with:', credentials.email);
      
      // Use the real auth service instead of demo
      const result = await authService.login(credentials);
      
      if (result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        console.log('✅ Auth: Login successful');
        return result.user;
      }
    } catch (error) {
      console.error('❌ Auth: Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Auth: Starting logout...');
      
      // Clear authentication data
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('adminUser');
      
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('🧹 Auth: Authentication data cleared');
      
      // Only redirect if not already on access page
      if (router.pathname !== '/admin/access') {
        await router.push('/admin/access');
      }
    } catch (error) {
      console.error('❌ Auth: Logout error:', error);
      // Force clear even if there's an error
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};