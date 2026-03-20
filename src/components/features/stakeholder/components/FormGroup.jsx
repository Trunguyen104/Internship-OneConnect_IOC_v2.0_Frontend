'use client';

import React from 'react';

export default function FormGroup({ label, required, error, children, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-text block text-sm font-semibold">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-danger mt-1 text-xs">{error}</p>}
    </div>
  );
}
