'use client';

import { Tabs } from 'antd';
import React from 'react';

import { cn } from '@/lib/cn';

const PREMIUM_TABS_STYLES = `
  /* Custom styles for PremiumTabs to override Ant Design defaults */
  .premium-tabs-wrapper .ant-tabs-nav {
    margin-bottom: 20px !important;
  }
  
  .premium-tabs-wrapper .ant-tabs-nav::before {
    border-bottom: 1px solid var(--gray-100) !important;
  }

  .premium-tabs-wrapper .ant-tabs-tab {
    padding: 10px 0 !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.1em !important;
    font-size: 11px !important;
    color: var(--gray-400) !important;
    margin-right: 24px !important;
    transition: all 0.3s ease !important;
  }

  .premium-tabs-wrapper .ant-tabs-tab:hover {
    color: var(--blue-600) !important;
  }

  .premium-tabs-wrapper .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--blue-800) !important;
  }

  .premium-tabs-wrapper .ant-tabs-ink-bar {
    background: var(--blue-800) !important;
    height: 3px !important;
    border-radius: 4px !important;
  }
`;

/**
 * A Premium styled Tabs component based on Ant Design.
 * Usage: <PremiumTabs items={...} activeKey={...} onChange={...} />
 */
export function PremiumTabs({ className, ...props }) {
  return (
    <>
      <Tabs {...props} className={cn('premium-tabs-wrapper', className)} />
      <style jsx global>
        {PREMIUM_TABS_STYLES}
      </style>
    </>
  );
}
