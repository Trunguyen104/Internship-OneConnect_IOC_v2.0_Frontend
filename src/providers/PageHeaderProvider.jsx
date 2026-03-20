'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const PageHeaderContext = createContext(null);

export const usePageHeader = (config) => {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeader must be used within a PageHeaderProvider');
  }

  const { setHeaderConfig } = context;

  // Deconstruct config for stable effect dependencies
  const title = config?.title;
  const subtitle = config?.subtitle;
  const extra = config?.extra;

  useEffect(() => {
    if (title || subtitle || extra) {
      setHeaderConfig({ title, subtitle, extra });
    }
  }, [title, subtitle, extra, setHeaderConfig]);

  return context;
};

export const PageHeaderProvider = ({ children }) => {
  const [headerConfig, setHeaderConfig] = useState({
    title: '',
    subtitle: '',
    extra: null,
  });

  const updateHeader = useCallback((newConfig) => {
    setHeaderConfig((prev) => {
      // Comparison to prevent unnecessary re-renders
      if (
        prev.title === newConfig.title &&
        prev.subtitle === newConfig.subtitle &&
        prev.extra === newConfig.extra
      ) {
        return prev;
      }
      return { ...prev, ...newConfig };
    });
  }, []);

  const value = React.useMemo(
    () => ({
      headerConfig,
      setHeaderConfig: updateHeader,
    }),
    [headerConfig, updateHeader]
  );

  return <PageHeaderContext.Provider value={value}>{children}</PageHeaderContext.Provider>;
};
