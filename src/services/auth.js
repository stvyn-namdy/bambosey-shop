import api from './api';
import Cookies from 'js-cookie';

export const authService = {
  /**
   * Admin login - connects to your backend /api/auth/login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Admin email
   * @param {string} credentials.password - Admin password
   * @returns {Promise} Authentication response
   */
  login: async (credentials) => {
    try {
      console.log('🔐 AuthService: Starting login request...', { email: credentials.email });
      
      // Make request to your backend API
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        role: 'admin', // Specify admin role for backend validation
      });

      console.log('📥 AuthService: Backend response received:', response.data);

      // Handle different response formats from your backend
      let accessToken, refreshToken, user;
      
      // Format 1: Standard format { accessToken, refreshToken, user }
      if (response.data.accessToken && response.data.user) {
        accessToken = response.data.accessToken;
        refreshToken = response.data.refreshToken;
        user = response.data.user;
      }
      // Format 2: Nested data format { data: { accessToken, user } }
      else if (response.data.data) {
        accessToken = response.data.data.accessToken || response.data.data.token;
        refreshToken = response.data.data.refreshToken || response.data.data.refresh_token;
        user = response.data.data.user || response.data.data.userInfo;
      }
      // Format 3: Token and user at root level { token, user }
      else if (response.data.token && response.data.user) {
        accessToken = response.data.token;
        refreshToken = response.data.refreshToken || response.data.refresh_token;
        user = response.data.user;
      }
      // Format 4: Simple token response { token }
      else if (response.data.token) {
        accessToken = response.data.token;
        refreshToken = response.data.refreshToken;
        // Try to extract user from token or make separate request
        user = response.data.user || await authService.getCurrentUserFromToken(accessToken);
      }
      // Format 5: Direct response is the user with token
      else if (response.data.id && response.data.email) {
        user = response.data;
        accessToken = response.data.token || response.data.accessToken;
        refreshToken = response.data.refreshToken;
      }
      else {
        console.error('❌ Unexpected response format:', response.data);
        throw new Error('Unexpected response format from server');
      }

      console.log('🔍 AuthService: Extracted data:', { 
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUser: !!user,
        userRole: user?.role,
        userEmail: user?.email
      });

      // Validate that we have minimum required data
      if (!accessToken) {
        throw new Error('No access token received from server');
      }

      if (!user) {
        console.warn('⚠️ No user data received, attempting to fetch...');
        try {
          // Try to get user data with the token
          user = await authService.getCurrentUserFromToken(accessToken);
        } catch (error) {
          console.error('❌ Failed to get user data:', error);
          throw new Error('Unable to retrieve user information');
        }
      }

      // Validate user data structure
      const processedUser = {
        id: user.id || user.userId || user._id,
        email: user.email,
        firstName: user.firstName || user.first_name || user.name?.split(' ')[0] || 'Admin',
        lastName: user.lastName || user.last_name || user.name?.split(' ')[1] || 'User',
        role: user.role || user.userRole || 'admin',
        permissions: user.permissions || user.userPermissions || [],
        lastLogin: new Date().toISOString(),
      };

      console.log('👤 AuthService: Processed user:', processedUser);

      // Check admin privileges - handle different role formats
      const userRole = processedUser.role.toLowerCase();
      const isAdmin = userRole === 'admin' || 
                     userRole === 'administrator' || 
                     userRole === 'super_admin' ||
                     userRole === 'superadmin' ||
                     processedUser.permissions.includes('admin') ||
                     processedUser.permissions.includes('admin_access');

      if (!isAdmin) {
        console.error('❌ User is not admin:', { role: processedUser.role, permissions: processedUser.permissions });
        throw new Error('Access denied. Admin privileges required.');
      }

      // Store tokens securely in HTTP-only cookies
      const cookieOptions = { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };

      if (accessToken) {
        Cookies.set('accessToken', accessToken, cookieOptions);
        console.log('🍪 AuthService: Access token stored');
      }
      
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { 
          ...cookieOptions,
          expires: 7 // 7 days
        });
        console.log('🍪 AuthService: Refresh token stored');
      }

      // Store user info (without sensitive data)
      localStorage.setItem('adminUser', JSON.stringify(processedUser));
      console.log('💾 AuthService: User info stored in localStorage');

      console.log('✅ AuthService: Login successful');
      return { user: processedUser, accessToken };

    } catch (error) {
      console.error('❌ AuthService: Login error:', error);
      
      // Clear any partial authentication data
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('adminUser');
      
      // Re-throw with more specific error message
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || error.message;
        
        console.error('📡 AuthService: Response error:', { status, message, data: error.response.data });
        
        if (status === 401) {
          throw new Error('Invalid email or password');
        } else if (status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (status === 404) {
          throw new Error('Login endpoint not found. Check backend configuration.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(message || `Server error (${status})`);
        }
      } else if (error.request) {
        console.error('📡 AuthService: Network error:', error.request);
        throw new Error('Cannot connect to server. Please check your network connection.');
      } else {
        throw error;
      }
    }
  },

  /**
   * Get user data from token (fallback method)
   */
  getCurrentUserFromToken: async (token) => {
    try {
      const tempApi = api;
      tempApi.defaults.headers.Authorization = `Bearer ${token}`;
      
      const response = await tempApi.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Failed to get user from token:', error);
      throw error;
    }
  },

  /**
   * Admin logout - clears tokens and notifies backend
   */
  logout: async () => {
    try {
      console.log('👋 AuthService: Starting logout...');
      
      // Notify backend of logout (optional - don't fail if this fails)
      try {
        await api.post('/auth/logout');
        console.log('📤 AuthService: Backend notified of logout');
      } catch (error) {
        console.warn('⚠️ AuthService: Failed to notify backend of logout:', error.message);
      }
    } catch (error) {
      console.error('❌ AuthService: Logout error:', error);
    } finally {
      // Always clear all authentication data
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('adminUser');
      
      console.log('🧹 AuthService: Authentication data cleared');
      
      // Clear any cached API data
      if (typeof window !== 'undefined') {
        // Force redirect to login
        window.location.href = '/login';
      }
    }
  },

  /**
   * Get current authenticated admin user
   */
  getCurrentUser: async () => {
    try {
      // First check if user info is cached locally
      const cachedUser = localStorage.getItem('adminUser');
      if (cachedUser) {
        const user = JSON.parse(cachedUser);
        
        console.log('👤 AuthService: Found cached user:', user.email);
        
        try {
          // Verify token is still valid by making a test request
          const response = await api.get('/auth/me');
          
          // Update cached user with latest info from backend
          const updatedUser = {
            ...user,
            ...response.data,
            lastVerified: new Date().toISOString(),
          };
          
          localStorage.setItem('adminUser', JSON.stringify(updatedUser));
          return updatedUser;
        } catch (error) {
          console.warn('⚠️ AuthService: Token verification failed, using cached user');
          return user;
        }
      } else {
        // No cached user, fetch from backend
        console.log('🔍 AuthService: No cached user, fetching from backend...');
        
        const response = await api.get('/auth/me');
        const user = response.data;
        
        // Validate admin role
        const userRole = user.role?.toLowerCase();
        const isAdmin = userRole === 'admin' || 
                       userRole === 'administrator' || 
                       userRole === 'super_admin' ||
                       user.permissions?.includes('admin');

        if (!isAdmin) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        localStorage.setItem('adminUser', JSON.stringify(user));
        return user;
      }
    } catch (error) {
      console.error('❌ AuthService: Get current user error:', error);
      // Clear invalid authentication
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('adminUser');
      throw error;
    }
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('🔄 AuthService: Refreshing token...');

      const response = await api.post('/auth/refresh', { 
        refreshToken 
      });
      
      // Handle different response formats
      const accessToken = response.data.accessToken || 
                         response.data.data?.accessToken || 
                         response.data.token;
      const user = response.data.user || response.data.data?.user;
      
      if (!accessToken) {
        throw new Error('No access token in refresh response');
      }
      
      // Update access token
      Cookies.set('accessToken', accessToken, { 
        expires: 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Update cached user info if provided
      if (user) {
        localStorage.setItem('adminUser', JSON.stringify(user));
      }
      
      console.log('✅ AuthService: Token refreshed successfully');
      return accessToken;
    } catch (error) {
      console.error('❌ AuthService: Token refresh error:', error);
      // Clear invalid tokens
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('adminUser');
      throw error;
    }
  },

  /**
   * Verify admin permissions for specific actions
   */
  verifyPermission: async (permission) => {
    try {
      const user = await authService.getCurrentUser();
      
      // Check if user has the required permission
      if (user.permissions && user.permissions.includes(permission)) {
        return true;
      }
      
      // Admin role has all permissions
      if (user.role === 'admin' || user.role === 'super_admin') {
        return true;
      }
      
      // Check with backend for dynamic permissions
      try {
        const response = await api.get(`/auth/verify-permission`, {
          params: { permission }
        });
        
        return response.data.hasPermission;
      } catch (error) {
        console.warn('⚠️ AuthService: Permission check failed, defaulting to false');
        return false;
      }
    } catch (error) {
      console.error('❌ AuthService: Permission verification error:', error);
      return false;
    }
  },

  /**
   * Check if user session is still valid
   */
  validateSession: async () => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        return false;
      }

      // Verify with backend
      await api.get('/auth/validate-session');
      return true;
    } catch (error) {
      console.error('❌ AuthService: Session validation error:', error);
      return false;
    }
  },
};

export default authService;