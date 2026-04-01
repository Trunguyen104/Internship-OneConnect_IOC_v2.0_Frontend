'use client';

import React from 'react';

/**
 * SidebarProvider
 * A lightweight wrapper mimicking the Shadcn layout pattern.
 * Connects architecturally with the global layout flow without heavy context dependencies.
 */
export function SidebarProvider({ children, className = '' }) {
  return <div className={`flex min-h-screen w-full bg-slate-50 ${className}`}>{children}</div>;
}
