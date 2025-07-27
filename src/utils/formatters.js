/**
 * Formatting utilities for consistent data display across the application
 */

// Currency formatting
export const formatCurrency = (amount, currency = 'CAD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Number formatting
export const formatNumber = (number, locale = 'en-US') => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat(locale).format(number);
};

// Compact number formatting (1.2K, 1.5M, etc.)
export const formatCompactNumber = (number, locale = 'en-US') => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  return `${Number(value).toFixed(decimals)}%`;
};

// Date formatting
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  
  try {
    return new Intl.DateTimeFormat('en-US', formatOptions).format(new Date(date));
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

// Date and time formatting
export const formatDateTime = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  
  try {
    return new Intl.DateTimeFormat('en-US', formatOptions).format(new Date(date));
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return '';
  }
};

// Time formatting
export const formatTime = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  
  try {
    return new Intl.DateTimeFormat('en-US', formatOptions).format(new Date(date));
  } catch (error) {
    console.error('Time formatting error:', error);
    return '';
  }
};

// Relative time formatting (2 hours ago, 3 days ago, etc.)
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
    
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
      }
    }
    
    return 'just now';
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '';
  }
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Format as +1 (XXX) XXX-XXXX for US numbers with country code
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Return original if not a standard US format
  return phoneNumber;
};

// Address formatting
export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.city && address.state) {
    parts.push(`${address.city}, ${address.state}`);
  } else if (address.city) {
    parts.push(address.city);
  } else if (address.state) {
    parts.push(address.state);
  }
  if (address.zipCode) parts.push(address.zipCode);
  if (address.country && address.country !== 'US') parts.push(address.country);
  
  return parts.join(', ');
};

// SKU formatting
export const formatSKU = (sku) => {
  if (!sku) return '';
  return sku.toUpperCase();
};

// Order number formatting
export const formatOrderNumber = (orderNumber) => {
  if (!orderNumber) return '';
  return `#${orderNumber}`;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Text truncation
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Title case formatting
export const toTitleCase = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Slug formatting (for URLs)
export const formatSlug = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Credit card number formatting
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  
  // Remove all non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  // Add spaces every 4 digits
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Stock status formatting
export const formatStockStatus = (quantity, lowStockThreshold = 10) => {
  if (quantity === 0) {
    return { status: 'Out of Stock', color: 'red', variant: 'danger' };
  }
  
  if (quantity <= lowStockThreshold) {
    return { status: 'Low Stock', color: 'yellow', variant: 'warning' };
  }
  
  return { status: 'In Stock', color: 'green', variant: 'success' };
};

// Rating formatting (for reviews)
export const formatRating = (rating, maxRating = 5) => {
  if (rating === null || rating === undefined) return '0.0';
  
  return Math.min(Math.max(rating, 0), maxRating).toFixed(1);
};

// Duration formatting (for shipping times, etc.)
export const formatDuration = (days) => {
  if (days === null || days === undefined || days < 0) return '';
  
  if (days === 0) return 'Same day';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  
  if (weeks === 1 && remainingDays === 0) return '1 week';
  if (weeks === 1) return `1 week ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
  if (remainingDays === 0) return `${weeks} weeks`;
  
  return `${weeks} weeks ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
};