/**
 * Validation utilities for form inputs and data validation
 */

// Email validation
export const validateEmail = (email) => {
  if (!email) return { isValid: false, error: 'Email is required' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
};

// Password validation
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = options;
  
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters long` };
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, error: null };
};

// Phone number validation
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return { isValid: false, error: 'Phone number is required' };
  
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Check for valid US phone number (10 or 11 digits)
  if (digits.length === 10 || (digits.length === 11 && digits[0] === '1')) {
    return { isValid: true, error: null };
  }
  
  return { isValid: false, error: 'Please enter a valid phone number' };
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true, error: null };
};

// Number validation
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false, fieldName = 'Value' } = options;
  
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (integer && !Number.isInteger(num)) {
    return { isValid: false, error: `${fieldName} must be a whole number` };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} must be no more than ${max}` };
  }
  
  return { isValid: true, error: null };
};

// Price validation
export const validatePrice = (price, fieldName = 'Price') => {
  return validateNumber(price, {
    min: 0,
    fieldName,
  });
};

// SKU validation
export const validateSKU = (sku) => {
  if (!sku) return { isValid: false, error: 'SKU is required' };
  
  // SKU should be alphanumeric with optional hyphens and underscores
  const skuRegex = /^[A-Za-z0-9_-]+$/;
  
  if (!skuRegex.test(sku)) {
    return { isValid: false, error: 'SKU can only contain letters, numbers, hyphens, and underscores' };
  }
  
  if (sku.length < 2) {
    return { isValid: false, error: 'SKU must be at least 2 characters long' };
  }
  
  if (sku.length > 50) {
    return { isValid: false, error: 'SKU must be no more than 50 characters long' };
  }
  
  return { isValid: true, error: null };
};

// URL validation
export const validateURL = (url, fieldName = 'URL') => {
  if (!url) return { isValid: false, error: `${fieldName} is required` };
  
  try {
    new URL(url);
    return { isValid: true, error: null };
  } catch {
    return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
  }
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    fieldName = 'File',
  } = options;
  
  if (!file) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { isValid: false, error: `${fieldName} must be smaller than ${maxSizeMB}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes.map(type => type.split('/')[1]).join(', ');
    return { isValid: false, error: `${fieldName} must be one of: ${allowedExtensions}` };
  }
  
  return { isValid: true, error: null };
};

// Date validation
export const validateDate = (date, options = {}) => {
  const { min, max, fieldName = 'Date' } = options;
  
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
  }
  
  if (min && dateObj < new Date(min)) {
    return { isValid: false, error: `${fieldName} must be after ${new Date(min).toLocaleDateString()}` };
  }
  
  if (max && dateObj > new Date(max)) {
    return { isValid: false, error: `${fieldName} must be before ${new Date(max).toLocaleDateString()}` };
  }
  
  return { isValid: true, error: null };
};

// Credit card validation (basic Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) {
    return { isValid: false, error: 'Card number is required' };
  }
  
  // Remove all non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) {
    return { isValid: false, error: 'Card number must be between 13 and 19 digits' };
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEvenPosition = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    
    if (isEvenPosition) {
      digit *= 2;
      if (digit > 9) {
        digit = digit % 10 + 1;
      }
    }
    
    sum += digit;
    isEvenPosition = !isEvenPosition;
  }
  
  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Please enter a valid card number' };
  }
  
  return { isValid: true, error: null };
};

// Text length validation
export const validateTextLength = (text, options = {}) => {
  const { min = 0, max = Infinity, fieldName = 'Text' } = options;
  
  if (!text) text = '';
  
  if (text.length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters long` };
  }
  
  if (text.length > max) {
    return { isValid: false, error: `${fieldName} must be no more than ${max} characters long` };
  }
  
  return { isValid: true, error: null };
};

// Array validation
export const validateArray = (array, options = {}) => {
  const { minLength = 0, maxLength = Infinity, fieldName = 'Items' } = options;
  
  if (!Array.isArray(array)) {
    return { isValid: false, error: `${fieldName} must be an array` };
  }
  
  if (array.length < minLength) {
    return { isValid: false, error: `Must have at least ${minLength} ${fieldName.toLowerCase()}` };
  }
  
  if (array.length > maxLength) {
    return { isValid: false, error: `Must have no more than ${maxLength} ${fieldName.toLowerCase()}` };
  }
  
  return { isValid: true, error: null };
};

// Inventory validation
export const validateInventory = (quantity, options = {}) => {
  const { allowNegative = false, maxQuantity = 10000 } = options;
  
  const result = validateNumber(quantity, {
    min: allowNegative ? undefined : 0,
    max: maxQuantity,
    integer: true,
    fieldName: 'Quantity',
  });
  
  return result;
};

// Percentage validation
export const validatePercentage = (value, fieldName = 'Percentage') => {
  return validateNumber(value, {
    min: 0,
    max: 100,
    fieldName,
  });
};

// Validation helper that runs multiple validations
export const validateField = (value, validations = []) => {
  for (const validation of validations) {
    const result = validation(value);
    if (!result.isValid) {
      return result;
    }
  }
  
  return { isValid: true, error: null };
};

// Form validation helper
export const validateForm = (data, schema) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, validations] of Object.entries(schema)) {
    const result = validateField(data[field], validations);
    if (!result.isValid) {
      errors[field] = result.error;
      isValid = false;
    }
  }
  
  return { isValid, errors };
};