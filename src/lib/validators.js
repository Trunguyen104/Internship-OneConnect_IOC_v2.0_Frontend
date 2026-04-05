export const REGEX = {
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  PHONE: /^0[35789]\d{8}$/,
  TAX_CODE: /^\d{10}$|^\d{10}-\d{3}$|^\d{10}-\d{2}-\d{3}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  URL: /^https?:\/\/.+/i,
  // Name should only contain letters (including Vietnamese), spaces, and '
  // No numbers or special characters like @, #, $, etc.
  NAME: /^[\p{L}\s']{2,100}$/u,
};

export const isHttpUrl = (value) => {
  if (!value) return true;
  return REGEX.URL.test(value);
};

export const isEmail = (value) => {
  if (!value) return true;
  return REGEX.EMAIL.test(value);
};

export const isPhoneNumber = (value) => {
  if (!value) return true;
  return REGEX.PHONE.test(value);
};

export const isTaxCode = (value) => {
  if (!value) return true;
  return REGEX.TAX_CODE.test(value);
};

export const isDate = (value) => {
  if (!value) return true;
  return REGEX.DATE.test(value);
};

export const isName = (value) => {
  if (!value) return true;
  return REGEX.NAME.test(value);
};

/**
 * Modern Validator Factory for Ant Design Form Rules
 * Provides consistently "tight" validation with descriptive messages
 */
export const validate = {
  required: (message) => ({ required: true, message }),

  email: (message = 'Invalid email format') => ({
    pattern: REGEX.EMAIL,
    message,
  }),

  phone: (
    message = 'Invalid phone number (must be 10 digits starting with 03, 05, 07, 08, 09)'
  ) => ({
    pattern: REGEX.PHONE,
    message,
  }),

  name: (message = 'Name must only contain letters and spaces') => ({
    pattern: REGEX.NAME,
    message,
  }),

  taxCode: (message = 'Invalid tax code format') => ({
    pattern: REGEX.TAX_CODE,
    message,
  }),

  url: (message = 'Invalid URL format') => ({
    validator: (_, value) => {
      if (!value || isHttpUrl(value)) return Promise.resolve();
      return Promise.reject(new Error(message));
    },
  }),

  length: (min, max, message) => ({
    min,
    max,
    message: message || `Length must be between ${min} and ${max} characters`,
  }),
};
