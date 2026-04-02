// Form Validation Utilities for Alaxico

// Validation patterns
const PATTERNS = {
  // Name: allows letters, spaces, dots, apostrophes (for names like "Dr. John O'Brien")
  name: /^[a-zA-Z\s.']+$/,
  // Indian phone: 10 digits, optionally starting with +91 or 0
  phone: /^(?:\+91[-\s]?)?(?:0)?[6-9]\d{9}$/,
  // Email: standard email pattern
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Business/Organization name: letters, numbers, spaces, common punctuation
  businessName: /^[a-zA-Z0-9\s.,&'()-]+$/,
  // City: letters and spaces only
  city: /^[a-zA-Z\s]+$/,
  // Alphanumeric with spaces (for products interested, etc.)
  alphanumericWithSpaces: /^[a-zA-Z0-9\s,.-]+$/,
};

// Error messages
const ERROR_MESSAGES = {
  name: {
    required: 'Name is required',
    invalid: 'Name should only contain letters',
    minLength: 'Name must be at least 2 characters',
    maxLength: 'Name cannot exceed 50 characters',
  },
  phone: {
    required: 'Phone number is required',
    invalid: 'Please enter a valid 10-digit Indian phone number',
  },
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
  },
  businessName: {
    required: 'Business/Organization name is required',
    invalid: 'Business name contains invalid characters',
    minLength: 'Business name must be at least 2 characters',
    maxLength: 'Business name cannot exceed 100 characters',
  },
  city: {
    required: 'City is required',
    invalid: 'City should only contain letters',
    minLength: 'City must be at least 2 characters',
    maxLength: 'City cannot exceed 50 characters',
  },
  quantity: {
    required: 'Quantity is required',
    invalid: 'Please enter a valid quantity',
    min: 'Quantity must be at least 1',
  },
  required: 'This field is required',
};

// Validation functions
export const validators = {
  // Validate name (contact person, full name, etc.)
  name: (value, fieldLabel = 'Name') => {
    if (!value || !value.trim()) {
      return { isValid: false, error: `${fieldLabel} is required` };
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return { isValid: false, error: `${fieldLabel} must be at least 2 characters` };
    }
    if (trimmed.length > 50) {
      return { isValid: false, error: `${fieldLabel} cannot exceed 50 characters` };
    }
    if (!PATTERNS.name.test(trimmed)) {
      return { isValid: false, error: `${fieldLabel} should only contain letters` };
    }
    return { isValid: true, error: null };
  },

  // Validate phone number (Indian format)
  phone: (value) => {
    if (!value || !value.trim()) {
      return { isValid: false, error: ERROR_MESSAGES.phone.required };
    }
    // Remove all spaces and dashes for validation
    const cleaned = value.replace(/[\s-]/g, '');
    if (!PATTERNS.phone.test(cleaned)) {
      return { isValid: false, error: ERROR_MESSAGES.phone.invalid };
    }
    return { isValid: true, error: null };
  },

  // Validate email
  email: (value) => {
    if (!value || !value.trim()) {
      return { isValid: false, error: ERROR_MESSAGES.email.required };
    }
    if (!PATTERNS.email.test(value.trim())) {
      return { isValid: false, error: ERROR_MESSAGES.email.invalid };
    }
    return { isValid: true, error: null };
  },

  // Validate business/organization name
  businessName: (value, fieldLabel = 'Business name') => {
    if (!value || !value.trim()) {
      return { isValid: false, error: `${fieldLabel} is required` };
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return { isValid: false, error: `${fieldLabel} must be at least 2 characters` };
    }
    if (trimmed.length > 100) {
      return { isValid: false, error: `${fieldLabel} cannot exceed 100 characters` };
    }
    if (!PATTERNS.businessName.test(trimmed)) {
      return { isValid: false, error: `${fieldLabel} contains invalid characters` };
    }
    return { isValid: true, error: null };
  },

  // Validate city
  city: (value) => {
    if (!value || !value.trim()) {
      return { isValid: false, error: ERROR_MESSAGES.city.required };
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return { isValid: false, error: ERROR_MESSAGES.city.minLength };
    }
    if (trimmed.length > 50) {
      return { isValid: false, error: ERROR_MESSAGES.city.maxLength };
    }
    if (!PATTERNS.city.test(trimmed)) {
      return { isValid: false, error: ERROR_MESSAGES.city.invalid };
    }
    return { isValid: true, error: null };
  },

  // Validate quantity
  quantity: (value) => {
    if (!value) {
      return { isValid: false, error: ERROR_MESSAGES.quantity.required };
    }
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      return { isValid: false, error: ERROR_MESSAGES.quantity.invalid };
    }
    if (num < 1) {
      return { isValid: false, error: ERROR_MESSAGES.quantity.min };
    }
    return { isValid: true, error: null };
  },

  // Validate required field (generic)
  required: (value, fieldLabel = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return { isValid: false, error: `${fieldLabel} is required` };
    }
    return { isValid: true, error: null };
  },

  // Validate products interested (optional, but if provided should be valid)
  productsInterested: (value) => {
    if (!value || !value.trim()) {
      return { isValid: true, error: null }; // Optional field
    }
    const trimmed = value.trim();
    if (trimmed.length > 500) {
      return { isValid: false, error: 'Products interested cannot exceed 500 characters' };
    }
    if (!PATTERNS.alphanumericWithSpaces.test(trimmed)) {
      return { isValid: false, error: 'Please use only letters, numbers, and basic punctuation' };
    }
    return { isValid: true, error: null };
  },

  // Validate message (optional, but if provided should have reasonable length)
  message: (value) => {
    if (!value || !value.trim()) {
      return { isValid: true, error: null }; // Optional field
    }
    if (value.trim().length > 1000) {
      return { isValid: false, error: 'Message cannot exceed 1000 characters' };
    }
    return { isValid: true, error: null };
  },
};

// Format phone number for display
export const formatPhoneNumber = (value) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // If starts with 91 and has 12 digits, format as +91 XXXXX XXXXX
  if (digits.startsWith('91') && digits.length >= 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7, 12)}`;
  }
  
  // If 10 digits, format as XXXXX XXXXX
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  
  // Return as-is if incomplete
  return value;
};

// Restrict input to only allow certain characters
export const inputFilters = {
  // Only allow letters and spaces
  nameOnly: (value) => value.replace(/[^a-zA-Z\s.']/g, ''),
  
  // Only allow digits, +, spaces, and dashes for phone
  phoneOnly: (value) => value.replace(/[^0-9+\s-]/g, ''),
  
  // Only allow letters and spaces for city
  cityOnly: (value) => value.replace(/[^a-zA-Z\s]/g, ''),
  
  // Allow alphanumeric and common business characters
  businessNameOnly: (value) => value.replace(/[^a-zA-Z0-9\s.,&'()-]/g, ''),
};

// Validate entire form and return all errors
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];
    const value = formData[field];
    
    for (const rule of rules) {
      const result = rule.validator(value, rule.label);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        break;
      }
    }
  });

  return { isValid, errors };
};

export default validators;
