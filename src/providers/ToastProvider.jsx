'use client';

import { ConfigProvider, notification } from 'antd';
import { createContext, useContext } from 'react';

const ToastContext = createContext(null);

const COLOR_BG = 'linear-gradient(135deg,#6253e1, #04befe)';

export function ToastProvider({ children }) {
  const [api, contextHolder] = notification.useNotification();

  const toast = {
    success: (title, description) =>
      api.success({
        title: title,
        description,
        showProgress: true,
        duration: 5,
      }),
    error: (title, description) =>
      api.error({
        title: title,
        description,
        showProgress: true,
      }),
    info: (title, description) =>
      api.info({
        title: title,
        description,
        showProgress: true,
      }),
    warning: (title, description) =>
      api.warning({
        title: title,
        description,
        showProgress: true,
      }),
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Notification: {
            progressBg: COLOR_BG,
          },
        },
      }}
    >
      <ToastContext.Provider value={toast}>
        {contextHolder}
        {children}
      </ToastContext.Provider>
    </ConfigProvider>
  );
}

export const useToast = () => useContext(ToastContext);
