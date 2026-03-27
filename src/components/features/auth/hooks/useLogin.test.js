import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setAccessToken } from '@/components/features/auth/lib/auth-storage';
import { login } from '@/components/features/auth/services/auth.service';
import { useToast } from '@/providers/ToastProvider';

import { useLogin } from './useLogin';

// Mock cÃ¡c module cá»§a Next.js vÃ  services
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

    // Setup máº·c Ä‘á»‹nh cho cÃ¡c mock
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

  describe('Khá»Ÿi táº¡o (Initial State)', () => {
    it('nÃªn khá»Ÿi táº¡o state vá»›i cÃ¡c giÃ¡ trá»‹ máº·c Ä‘á»‹nh khi localStorage trá»‘ng', () => {
      const { result } = renderHook(() => useLogin());

      expect(result.current.form).toEqual({
        email: '',
        password: '',
        rememberMe: false,
      });
      expect(result.current.errors).toEqual({});
    });

    it('nÃªn khá»Ÿi táº¡o state vá»›i dá»¯ liá»‡u tá»« localStorage náº¿u Ä‘Ã£ lÆ°u thÃ´ng tin Ä‘Äƒng nháº­p', () => {
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

  describe('Xá»­ lÃ½ sá»± kiá»‡n (Actions)', () => {
    it('nÃªn cáº­p nháº­t form state khi gá»i handleChange cho text input', () => {
      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'new@example.com', type: 'text' },
        });
      });

      expect(result.current.form.email).toBe('new@example.com');
    });

    it('nÃªn cáº­p nháº­t form state khi gá»i handleChange cho checkbox', () => {
      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.handleChange({
          target: { name: 'rememberMe', checked: true, type: 'checkbox' },
        });
      });

      expect(result.current.form.rememberMe).toBe(true);
    });

    it('nÃªn xÃ³a lá»—i cá»§a field tÆ°Æ¡ng á»©ng khi ngÆ°á»i dÃ¹ng thay Ä‘á»•i giÃ¡ trá»‹ field Ä‘Ã³', async () => {
      const { result } = renderHook(() => useLogin());

      // Giáº£ láº­p case cÃ³ lá»—i trÆ°á»›c Ä‘Ã³
      act(() => {
        result.current.handleSubmit({ preventDefault: vi.fn() });
      });
      expect(result.current.errors.email).toBeDefined();

      // Thay Ä‘á»•i giÃ¡ trá»‹ email
      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'a@gmail.com', type: 'text' },
        });
      });

      expect(result.current.errors.email).toBe('');
    });
  });

  describe('Kiá»ƒm tra há»£p lá»‡ (Validation)', () => {
    it('nÃªn bÃ¡o lá»—i náº¿u email hoáº·c password trá»‘ng khi submit', async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.errors.email).toBe('Email is required');
      expect(result.current.errors.password).toBe('Password is required');
      expect(login).not.toHaveBeenCalled();
    });

    it('nÃªn bÃ¡o lá»—i náº¿u Ä‘á»‹nh dáº¡ng email khÃ´ng Ä‘Ãºng', async () => {
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
    it('nÃªn Ä‘Äƒng nháº­p thÃ nh cÃ´ng, lÆ°u token vÃ  Ä‘iá»u hÆ°á»›ng khi dá»¯ liá»‡u há»£p lá»‡', async () => {
      login.mockResolvedValue('fake-token');
      const { result } = renderHook(() => useLogin());

      // Äiá»n form
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

    it('nÃªn lÆ°u thÃ´ng tin vÃ o localStorage náº¿u chá»n rememberMe', async () => {
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

    it('nÃªn xÃ³a thÃ´ng tin khá»i localStorage náº¿u KHÃ”NG chá»n rememberMe', async () => {
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

    it('nÃªn hiá»ƒn thá»‹ lá»—i khi API login tháº¥t báº¡i', async () => {
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
