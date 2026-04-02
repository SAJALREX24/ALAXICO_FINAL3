/**
 * Validation utilities for Alaxico forms
 * Industry-standard validation for Indian market
 */

// ============= PHONE VALIDATION =============
/**
 * Validates Indian phone number
 * Must be 10 digits starting with 6, 7, 8, or 9
 */
export const validatePhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

export const formatPhone = (phone) => {
  // Remove all non-digits
  return phone.replace(/\D/g, '').slice(0, 10);
};

export const getPhoneError = (phone) => {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return 'Phone number must be 10 digits';
  }
  if (cleanPhone.length > 10) {
    return 'Phone number cannot exceed 10 digits';
  }
  if (!/^[6-9]/.test(cleanPhone)) {
    return 'Phone number must start with 6, 7, 8, or 9';
  }
  if (!validatePhone(cleanPhone)) {
    return 'Please enter a valid Indian phone number';
  }
  return '';
};

// ============= EMAIL VALIDATION =============
/**
 * Validates email address
 */
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

export const getEmailError = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

// ============= PIN CODE VALIDATION =============
/**
 * Validates Indian PIN code
 * Must be 6 digits, cannot start with 0
 */
export const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode.trim());
};

export const formatPincode = (pincode) => {
  return pincode.replace(/\D/g, '').slice(0, 6);
};

export const getPincodeError = (pincode) => {
  if (!pincode || pincode.trim() === '') {
    return 'PIN code is required';
  }
  const cleanPincode = pincode.replace(/\D/g, '');
  if (cleanPincode.length < 6) {
    return 'PIN code must be 6 digits';
  }
  if (cleanPincode.startsWith('0')) {
    return 'PIN code cannot start with 0';
  }
  if (!validatePincode(cleanPincode)) {
    return 'Please enter a valid PIN code';
  }
  return '';
};

// ============= NAME VALIDATION =============
/**
 * Validates name fields
 * Only letters, spaces, and common punctuation
 */
export const validateName = (name, minLength = 2, maxLength = 50) => {
  const nameRegex = /^[a-zA-Z\s.'-]+$/;
  const trimmedName = name.trim();
  return trimmedName.length >= minLength && 
         trimmedName.length <= maxLength && 
         nameRegex.test(trimmedName);
};

export const getNameError = (name, fieldName = 'Name', minLength = 2) => {
  if (!name || name.trim() === '') {
    return `${fieldName} is required`;
  }
  const trimmedName = name.trim();
  if (trimmedName.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  if (trimmedName.length > 50) {
    return `${fieldName} cannot exceed 50 characters`;
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
    return `${fieldName} can only contain letters, spaces, and basic punctuation`;
  }
  return '';
};

// ============= BUSINESS NAME VALIDATION =============
/**
 * Validates business name
 * Allows letters, numbers, spaces, and common business punctuation
 */
export const validateBusinessName = (name) => {
  const businessNameRegex = /^[a-zA-Z0-9\s.,'&()-]+$/;
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && 
         trimmedName.length <= 100 && 
         businessNameRegex.test(trimmedName);
};

export const getBusinessNameError = (name) => {
  if (!name || name.trim() === '') {
    return 'Business name is required';
  }
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return 'Business name must be at least 2 characters';
  }
  if (trimmedName.length > 100) {
    return 'Business name cannot exceed 100 characters';
  }
  if (!/^[a-zA-Z0-9\s.,'&()-]+$/.test(trimmedName)) {
    return 'Business name contains invalid characters';
  }
  return '';
};

// ============= CITY VALIDATION =============
export const validateCity = (city) => {
  const cityRegex = /^[a-zA-Z\s-]+$/;
  const trimmedCity = city.trim();
  return trimmedCity.length >= 2 && 
         trimmedCity.length <= 50 && 
         cityRegex.test(trimmedCity);
};

export const getCityError = (city) => {
  if (!city || city.trim() === '') {
    return 'City is required';
  }
  const trimmedCity = city.trim();
  if (trimmedCity.length < 2) {
    return 'City name must be at least 2 characters';
  }
  if (!/^[a-zA-Z\s-]+$/.test(trimmedCity)) {
    return 'City name can only contain letters';
  }
  return '';
};

// ============= ADDRESS VALIDATION =============
export const validateAddress = (address) => {
  const trimmedAddress = address.trim();
  return trimmedAddress.length >= 10 && trimmedAddress.length <= 200;
};

export const getAddressError = (address) => {
  if (!address || address.trim() === '') {
    return 'Address is required';
  }
  if (address.trim().length < 10) {
    return 'Please enter a complete address (at least 10 characters)';
  }
  if (address.trim().length > 200) {
    return 'Address cannot exceed 200 characters';
  }
  return '';
};

// ============= GST VALIDATION =============
/**
 * Validates Indian GST number
 * Format: 22AAAAA0000A1Z5
 */
export const validateGST = (gst) => {
  if (!gst || gst.trim() === '') return true; // Optional field
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst.toUpperCase().trim());
};

export const getGSTError = (gst) => {
  if (!gst || gst.trim() === '') return ''; // Optional
  if (!validateGST(gst)) {
    return 'Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)';
  }
  return '';
};

// ============= INPUT SANITIZATION =============
/**
 * Sanitizes text input to prevent XSS
 * Removes HTML tags and dangerous characters
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove null bytes
    .replace(/\0/g, '')
    .trim();
};

/**
 * Sanitizes input but preserves basic formatting
 * For message/description fields
 */
export const sanitizeMessage = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove null bytes
    .replace(/\0/g, '')
    .trim();
};

// ============= QUANTITY VALIDATION =============
export const validateQuantity = (quantity) => {
  const num = parseInt(quantity, 10);
  return !isNaN(num) && num > 0 && num <= 10000;
};

export const getQuantityError = (quantity) => {
  if (!quantity) {
    return 'Quantity is required';
  }
  const num = parseInt(quantity, 10);
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }
  if (num <= 0) {
    return 'Quantity must be greater than 0';
  }
  if (num > 10000) {
    return 'For orders above 10,000 units, please contact us directly';
  }
  return '';
};

// ============= FORM VALIDATION HELPER =============
/**
 * Validates entire form and returns errors object
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = `${rules.label || field} is required`;
    } else if (value && rules.validator) {
      const error = rules.validator(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};

/**
 * Check if form has any errors
 */
export const hasErrors = (errors) => {
  return Object.values(errors).some(error => error !== '');
};

export default {
  validatePhone,
  formatPhone,
  getPhoneError,
  validateEmail,
  getEmailError,
  validatePincode,
  formatPincode,
  getPincodeError,
  validateName,
  getNameError,
  validateBusinessName,
  getBusinessNameError,
  validateCity,
  getCityError,
  validateAddress,
  getAddressError,
  validateGST,
  getGSTError,
  sanitizeInput,
  sanitizeMessage,
  validateQuantity,
  getQuantityError,
  validateForm,
  hasErrors
};
