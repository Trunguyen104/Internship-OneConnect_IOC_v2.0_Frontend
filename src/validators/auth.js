export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'EMAIL_REQUIRED';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'EMAIL_INVALID';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return 'PASSWORD_REQUIRED';
  }
  return null;
};

export const validateLogin = (values) => {
  const errors = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};
