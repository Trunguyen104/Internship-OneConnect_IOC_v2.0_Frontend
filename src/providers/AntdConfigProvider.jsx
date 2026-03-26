'use client';

import { App, ConfigProvider } from 'antd';
import React, { useMemo } from 'react';

const readCssVar = (name) => {
  if (typeof window === 'undefined') return undefined;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || undefined;
};

const hexToRgba = (hex, alpha = 1) => {
  const normalized = String(hex || '')
    .trim()
    .replace('#', '');

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return undefined;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const readAntdCssTokens = () => {
  if (typeof window === 'undefined') return null;

  const colorPrimary = readCssVar('--color-primary');
  return {
    colorPrimary,
    colorPrimaryHover: readCssVar('--color-primary-hover'),
    colorInfo: readCssVar('--color-info'),
    colorSuccess: readCssVar('--color-success'),
    colorWarning: readCssVar('--color-warning'),
    colorError: readCssVar('--color-danger'),
    controlOutline: hexToRgba(colorPrimary, 0.1),
  };
};

/**
 * AntdConfigProvider thống nhất giao diện Ant Design với Tailwind CSS của dự án.
 * Đồng bộ màu sắc theo CSS variables trong `src/app/globals.css` (single source of truth),
 * Font chữ (Be Vietnam Pro) và Bo góc (12px).
 */
export const AntdConfigProvider = ({ children }) => {
  const cssTokens = readAntdCssTokens() || {};

  const token = useMemo(
    () => ({
      ...cssTokens,
      fontFamily: '"Be Vietnam Pro", system-ui, sans-serif',
      borderRadius: 12,
      controlHeight: 40,
    }),
    [cssTokens]
  );

  return (
    <ConfigProvider
      theme={{
        token,
        components: {
          Button: {
            fontWeight: 600,
            borderRadius: 12,
            controlHeight: 44,
          },
          Input: {
            controlHeight: 44,
            borderRadius: 12,
          },
          Select: {
            controlHeight: 44,
            borderRadius: 12,
          },
          Modal: {
            borderRadiusLG: 24, // Rounded-3xl
          },
          Card: {
            borderRadiusLG: 24,
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
};

export default AntdConfigProvider;
