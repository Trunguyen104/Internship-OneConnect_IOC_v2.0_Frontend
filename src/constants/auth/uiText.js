export const AUTH_UI = {
  LOGIN: {
    TITLE: 'Login',
    WELCOME: 'Welcome back! Please enter your login information',
    BUTTON: 'Login',
    REMEMBER_EMAIL: 'Remember email',
    REMEMBER_LOGIN: 'Remember login',
    FORGOT_PASSWORD_LINK: 'Forgot password?',
    COPYRIGHT: '© 2026 Internship OneConnect',
  },
  FORGOT_PASSWORD: {
    TITLE: 'Forgot Password',
    DESC: 'Enter your verification email',
    BUTTON: 'Send reset request',
    BUTTON_LOADING: 'Sending...',
    SUCCESS_TEXT: 'Reset password link sent',
    BACK_TO_LOGIN: 'Back to login',
  },
  RESET_PASSWORD: {
    TITLE: 'Reset Password',
    DESC: 'Enter your new password below',
    BUTTON: 'Reset password',
    BUTTON_LOADING: 'Resetting...',
    SUCCESS_TEXT: 'Your password has been reset successfully.',
  },
  LABELS: {
    EMAIL: 'Email',
    PASSWORD: 'Password',
    NEW_PASSWORD: 'New Password',
    CONFIRM_PASSWORD: 'Confirm Password',
    EMAIL_PLACEHOLDER: 'name@university.edu',
    PASSWORD_PLACEHOLDER: '************',
    LOGO: 'IOC Logo',
    MASCOT: 'Mascot',
  },
  BRANDING: {
    TITLE: 'Internship OneConnect',
    DESCRIPTION:
      'Join the internship program to learn from experts, practice real skills and prepare well for your future career.',
  },
};

export const AUTH_MESSAGES = {
  VALIDATION: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Invalid email',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
    PASSWORD_COMPLEXITY: 'Password must contain uppercase, lowercase, digit, and special character',
    CONFIRM_PASSWORD_REQUIRED: 'Confirmation password is required',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  },
  ERROR: {
    API_RESET_REQUEST_FAILED: 'Error requesting password reset. Please try again.',
    API_RESET_FAILED: 'Error resetting password. Please try again or request a new link.',
    RESET_TOKEN_MISSING: 'Invalid or missing reset token.',
  },
  TOAST: {
    LOGIN_SUCCESS: 'Login successful',
    LOGIN_FAILED: 'Login failed',
  },
};

export const API_MESSAGES = {
  ERROR: {
    INVALID_PAYLOAD: 'Invalid request payload',
    SERVICE_UNAVAILABLE: 'Authentication service unavailable',
    UNEXPECTED_RESPONSE: 'Unexpected upstream response',
    SERVER_ERROR: 'Server error',
  },
};
