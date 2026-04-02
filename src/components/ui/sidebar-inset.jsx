'use client';

import React from 'react';

/**
 * SidebarInset
 * A layout bounds wrapper mimicking Shadcn's SidebarInset.
 * Provides the main content area with a consistent grayish inset look.
 */
export function SidebarInset({ children, className = '' }) {
  return (
    <main
      className={`relative flex min-h-screen flex-1 flex-col overflow-hidden bg-slate-50 transition-all duration-300 ease-in-out md:ml-0 md:rounded-tl-2xl md:border-t md:border-l md:border-gray-200 md:shadow-sm ${className}`}
    >
      {children}
    </main>
  );
}
