'use client';

import { App, ConfigProvider } from 'antd';
import { createContext, useContext, useLayoutEffect } from 'react';

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
    success: (title, description) =>
      notificationApi?.success({
        title: title,
        description,
        showProgress: true,
        duration: 5,
      }),
    error: (title, description) =>
      notificationApi?.error({
        title: title,
        description,
        showProgress: true,
      }),
    info: (title, description) =>
      notificationApi?.info({
        title: title,
        description,
        showProgress: true,
      }),
    warning: (title, description) =>
      notificationApi?.warning({
        title: title,
        description,
        showProgress: true,
      }),
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
