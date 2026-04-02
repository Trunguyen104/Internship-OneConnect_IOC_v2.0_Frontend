import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setAccessToken } from '@/components/features/auth/lib/auth-storage';
import { login } from '@/components/features/auth/services/auth.service';
import { useToast } from '@/providers/ToastProvider';

import { useLogin } from './useLogin';

// Mock các module của Next.js và services
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/components/features/auth/services/auth.service', () => ({
  login: vi.fn(),
}));

vi.mock('@/components/features/auth/lib/auth-storage', () => ({
  setAccessToken: vi.fn(),
}));

vi.mock('@/providers/ToastProvider', () => ({
  useToast: vi.fn(),
}));

describe('useLogin Hook', () => {
  const mockPush = vi.fn();
  const mockToast = {
    success: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mặc định cho các mock
    useRouter.mockReturnValue({ push: mockPush });
    useToast.mockReturnValue(mockToast);

    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: vi.fn((key) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        }),
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });

    window.localStorage.clear();
  });

  describe('Khởi tạo (Initial State)', () => {
    it('nên khởi tạo state với các giá trị mặc định khi localStorage trống', () => {
      const { result } = renderHook(() => useLogin());

      expect(result.current.form).toEqual({
        email: '',
        password: '',
        rememberMe: false,
      });
      expect(result.current.errors).toEqual({});
    });

    it('nên khởi tạo state với dữ liệu từ localStorage nếu đã lưu thông tin đăng nhập', () => {
      window.localStorage.setItem('rememberEmail', 'test@example.com');
      window.localStorage.setItem('rememberPassword', 'password123');

      const { result } = renderHook(() => useLogin());

      expect(result.current.form).toEqual({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });
    });
  });

  describe('Xử lý sự kiện (Actions)', () => {
    it('nên cập nhật form state khi gọi handleChange cho text input', () => {
      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'new@example.com', type: 'text' },
        });
      });

      expect(result.current.form.email).toBe('new@example.com');
    });

    it('nên cập nhật form state khi gọi handleChange cho checkbox', () => {
      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.handleChange({
          target: { name: 'rememberMe', checked: true, type: 'checkbox' },
        });
      });

      expect(result.current.form.rememberMe).toBe(true);
    });

    it('nên xóa lỗi của field tương ứng khi người dùng thay đổi giá trị field đó', async () => {
      const { result } = renderHook(() => useLogin());

      // Giả lập case có lỗi trước đó
      act(() => {
        result.current.handleSubmit({ preventDefault: vi.fn() });
      });
      expect(result.current.errors.email).toBeDefined();

      // Thay đổi giá trị email
      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'a@gmail.com', type: 'text' },
        });
      });

      expect(result.current.errors.email).toBe('');
    });
  });

  describe('Kiểm tra hợp lệ (Validation)', () => {
    it('nên báo lỗi nếu email hoặc password trống khi submit', async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.errors.email).toBe('Email is required');
      expect(result.current.errors.password).toBe('Password is required');
      expect(login).not.toHaveBeenCalled();
    });

    it('nên báo lỗi nếu định dạng email không đúng', async () => {
      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'invalid-email', type: 'text' },
        });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.errors.email).toBe('Invalid email');
    });
  });

  describe('Submit (handleSubmit)', () => {
    it('nên đăng nhập thành công, lưu token và điều hướng khi dữ liệu hợp lệ', async () => {
      login.mockResolvedValue('fake-token');
      const { result } = renderHook(() => useLogin());

      // Điền form
      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'user@example.com', type: 'text' },
        });
        result.current.handleChange({
          target: { name: 'password', value: 'password123', type: 'text' },
        });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(login).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: false,
      });
      expect(setAccessToken).toHaveBeenCalledWith('fake-token', false);
      expect(mockToast.success).toHaveBeenCalledWith('Login successful');
      expect(mockPush).toHaveBeenCalledWith('/internship-groups');
    });

    it('nên lưu thông tin vào localStorage nếu chọn rememberMe', async () => {
      login.mockResolvedValue('fake-token');
      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'remembered@example.com', type: 'text' },
        });
        result.current.handleChange({
          target: { name: 'password', value: 'securePass', type: 'text' },
        });
        result.current.handleChange({
          target: { name: 'rememberMe', checked: true, type: 'checkbox' },
        });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'rememberEmail',
        'remembered@example.com'
      );
      expect(window.localStorage.setItem).toHaveBeenCalledWith('rememberPassword', 'securePass');
    });

    it('nên xóa thông tin khỏi localStorage nếu KHÔNG chọn rememberMe', async () => {
      login.mockResolvedValue('fake-token');
      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'user@example.com', type: 'text' },
        });
        result.current.handleChange({ target: { name: 'password', value: 'pass', type: 'text' } });
        result.current.handleChange({
          target: { name: 'rememberMe', checked: false, type: 'checkbox' },
        });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('rememberEmail');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('rememberPassword');
    });

    it('nên hiển thị lỗi khi API login thất bại', async () => {
      const errorMessage = 'Invalid email or password';
      login.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'wrong@example.com', type: 'text' },
        });
        result.current.handleChange({
          target: { name: 'password', value: 'wrongpass', type: 'text' },
        });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.errors.password).toBe(errorMessage);
      expect(mockToast.error).toHaveBeenCalledWith('Login failed');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
