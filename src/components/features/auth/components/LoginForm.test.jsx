import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LoginForm from './LoginForm';

/**
 * Mocking Next.js Link to isolate component testing without requiring a router context.
 */
vi.mock('next/link', () => ({
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe('LoginForm Component', () => {
  const mockProps = {
    form: {
      email: '',
      password: '',
      rememberMe: false,
    },
    errors: {},
    onChange: vi.fn(),
    onSubmit: vi.fn((e) => e.preventDefault()),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Happy Path: Rendering', () => {
    it('should render all form elements with initial values', () => {
      render(<LoginForm {...mockProps} />);

      // Email field (accessible via label after our A11y fix in Input component)
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveValue('');
      expect(emailInput).toHaveAttribute('type', 'email');

      // Password field
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Checkbox
      const rememberMeCheckbox = screen.getByLabelText(/remember login/i);
      expect(rememberMeCheckbox).toBeInTheDocument();
      expect(rememberMeCheckbox.checked).toBe(false);

      // Forgot password link
      const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
      expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');

      // Submit button
      const submitButton = screen.getByRole('button', { name: /login/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should render correct values from props', () => {
      const filledForm = {
        email: 'user@test.edu',
        password: 'password123',
        rememberMe: true,
      };
      render(<LoginForm {...mockProps} form={filledForm} />);

      expect(screen.getByLabelText(/email/i)).toHaveValue('user@test.edu');
      expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
      expect(screen.getByLabelText(/remember login/i).checked).toBe(true);
    });
  });

  describe('User Interactions', () => {
    it('should call onChange for every keystroke in email and password fields', async () => {
      const user = userEvent.setup();
      render(<LoginForm {...mockProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'a');
      expect(mockProps.onChange).toHaveBeenCalled();

      await user.type(passwordInput, 'p');
      expect(mockProps.onChange).toHaveBeenCalledTimes(2);
    });

    it('should call onChange when the remember me checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginForm {...mockProps} />);

      const checkbox = screen.getByLabelText(/remember login/i);
      await user.click(checkbox);

      expect(mockProps.onChange).toHaveBeenCalled();
    });

    it('should call onSubmit when clicking the submit button', async () => {
      const user = userEvent.setup();
      render(<LoginForm {...mockProps} />);

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      expect(mockProps.onSubmit).toHaveBeenCalled();
    });
  });

  describe('Edge Cases: Error Display', () => {
    it('should display error messages when error props are provided', () => {
      const errors = {
        email: 'Email is invalid',
        password: 'Password too short',
      };
      render(<LoginForm {...mockProps} errors={errors} />);

      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
      expect(screen.getByText('Password too short')).toBeInTheDocument();
    });

    it('should not display error messages when errors are empty', () => {
      render(<LoginForm {...mockProps} />);

      const errorSpans = screen.queryAllByText(/Email is invalid|Password too short/i);
      expect(errorSpans).toHaveLength(0);
    });
  });

  describe('Accessibility Review', () => {
    it('should have basic accessibility landmarks', () => {
      render(<LoginForm {...mockProps} />);

      // Form landmark
      expect(screen.getByRole('button', { name: /login/i }).closest('form')).toBeInTheDocument();

      // Inputs should be accessible via labels
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });
});
