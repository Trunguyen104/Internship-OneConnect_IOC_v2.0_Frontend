'use client';

import { App, ConfigProvider } from 'antd';
import React, { createContext, useContext, useLayoutEffect } from 'react';

const ToastContext = createContext(null);

const COLOR_BG = 'linear-gradient(135deg,#6253e1, #04befe)';

export let notificationApi = null;
export let messageApi = null;
export let modalApi = null;

function AntdAppHookHelper() {
  const { notification: nApi, message: mApi, modal: modApi } = App.useApp();

  useLayoutEffect(() => {
    notificationApi = nApi;
    messageApi = mApi;
    modalApi = modApi;
  }, [nApi, mApi, modApi]);

  return null;
}

export function ToastProvider({ children }) {
  const toast = {
    success: (title, description, options = {}) => {
      const isObject =
        typeof description === 'object' &&
        description !== null &&
        !React.isValidElement(description);
      const opt = isObject ? description : options;
      const desc = isObject ? undefined : description;

      return notificationApi?.success({
        title: title,
        description: desc,
        showProgress: true,
        duration: 5,
        ...opt,
      });
    },
    error: (title, description, options = {}) => {
      const isObject =
        typeof description === 'object' &&
        description !== null &&
        !React.isValidElement(description);
      const opt = isObject ? description : options;
      const desc = isObject ? undefined : description;

      return notificationApi?.error({
        title: title,
        description: desc,
        showProgress: true,
        ...opt,
      });
    },
    info: (title, description, options = {}) => {
      const isObject =
        typeof description === 'object' &&
        description !== null &&
        !React.isValidElement(description);
      const opt = isObject ? description : options;
      const desc = isObject ? undefined : description;

      return notificationApi?.info({
        title: title,
        description: desc,
        showProgress: true,
        ...opt,
      });
    },
    warning: (title, description, options = {}) => {
      const isObject =
        typeof description === 'object' &&
        description !== null &&
        !React.isValidElement(description);
      const opt = isObject ? description : options;
      const desc = isObject ? undefined : description;

      return notificationApi?.warning({
        title: title,
        description: desc,
        showProgress: true,
        ...opt,
      });
    },
    dismiss: (key) => {
      if (key) {
        notificationApi?.destroy(key);
      } else {
        notificationApi?.destroy();
      }
    },
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#b91c1c',
          colorLink: '#b91c1c',
          fontFamily: 'var(--font-sans)',
        },
        components: {
          Notification: {
            progressBg: COLOR_BG,
          },
        },
      }}
    >
      <App component="div">
        <AntdAppHookHelper />
        <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
      </App>
    </ConfigProvider>
  );
}

export const useToast = () => useContext(ToastContext);
