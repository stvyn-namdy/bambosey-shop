/**
 * Configuration utility to handle environment variables safely
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// App Configuration
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Bam & Bosey Admin',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
};

// Validation function to check if required environment variables are set
export const validateConfig = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
  ];
  
  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    return false;
  }
  
  return true;
};

// Get API URL with fallback
export const getApiUrl = (endpoint = '') => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  if (!baseUrl) {
    console.error('❌ API_URL is not configured');
    return null;
  }
  
  // Remove trailing slash from baseUrl and leading slash from endpoint
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  
  if (cleanEndpoint) {
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }
  
  return cleanBaseUrl;
};

// Debug function for development
export const debugConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Configuration Debug:');
    console.log('- API_URL:', API_CONFIG.BASE_URL);
    console.log('- APP_NAME:', APP_CONFIG.NAME);
    console.log('- ENVIRONMENT:', APP_CONFIG.ENVIRONMENT);
    console.log('- Config Valid:', validateConfig());
  }
};