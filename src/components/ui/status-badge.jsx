'use client';

import PropTypes from 'prop-types';
import React from 'react';

import { cn } from '@/lib/cn';

/**
 * A unified StatusBadge component for consistent status indicators across the app.
 * Redesigned to match the "User Management" style (Glow Dot + Bold Text).
 */
const StatusBadge = ({
  variant = 'neutral',
  label,
  children,
  icon,
  showDot = true, // Default to true to match User Management
  pulseDot = false,
  className = '',
  dotColor,
  variantType = 'minimal', // 'minimal' for dot+text, 'boxed' for original badge look
}) => {
  // Color configuration mapping
  const config = {
    primary: {
      dot: 'bg-primary-600',
      ring: 'ring-primary/10',
      shadow: 'shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]', // CSS variable for shadow
      text: 'text-primary-600',
      bg: 'bg-primary-surface',
      border: 'border-primary-100',
    },
    success: {
      dot: 'bg-emerald-500',
      ring: 'ring-emerald-500/10',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    warning: {
      dot: 'bg-amber-500',
      ring: 'ring-amber-500/10',
      shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      text: 'text-amber-600',
      bg: 'bg-warning-surface',
      border: 'border-warning-border',
    },
    error: {
      dot: 'bg-rose-500',
      ring: 'ring-rose-500/10',
      shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]',
      text: 'text-rose-600',
      bg: 'bg-primary-surface',
      border: 'border-primary-100',
    },
    danger: {
      dot: 'bg-rose-500',
      ring: 'ring-rose-500/10',
      shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]',
      text: 'text-rose-600',
      bg: 'bg-primary-surface',
      border: 'border-primary-100',
    },
    info: {
      dot: 'bg-blue-500',
      ring: 'ring-blue-500/10',
      shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    neutral: {
      dot: 'bg-gray-400',
      ring: 'ring-gray-300/10',
      shadow: 'shadow-none',
      text: 'text-muted/60',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
    },
    blue: {
      dot: 'bg-blue-500',
      ring: 'ring-blue-500/10',
      shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    emerald: {
      dot: 'bg-emerald-500',
      ring: 'ring-emerald-500/10',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    amber: {
      dot: 'bg-amber-500',
      ring: 'ring-amber-500/10',
      shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      text: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    rose: {
      dot: 'bg-rose-500',
      ring: 'ring-rose-500/10',
      shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]',
      text: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
  };

  const current = config[variant] || config.neutral;

  if (variantType === 'boxed') {
    return (
      <div
        className={cn(
          'inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-lg border px-2.5 py-1',
          'text-[11px] font-black uppercase tracking-tight shadow-sm',
          current.bg,
          current.border,
          current.text,
          className
        )}
      >
        {showDot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full shrink-0',
              current.dot,
              pulseDot && 'animate-pulse'
            )}
          />
        )}
        {icon && <span className="flex shrink-0 items-center justify-center">{icon}</span>}
        <span>{label || children}</span>
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-2 transition-all duration-300', className)}>
      {showDot && (
        <div
          className={cn(
            'size-1.5 flex-shrink-0 rounded-full ring-4 transition-all duration-500',
            current.dot,
            current.ring,
            current.shadow,
            pulseDot && 'animate-pulse'
          )}
        />
      )}
      {icon && <span className="flex shrink-0 items-center justify-center">{icon}</span>}
      <span
        className={cn(
          'text-xs font-black uppercase tracking-widest transition-colors',
          current.text
        )}
      >
        {label || children}
      </span>
    </div>
  );
};

StatusBadge.propTypes = {
  variant: PropTypes.oneOf([
    'primary',
    'success',
    'warning',
    'error',
    'danger',
    'info',
    'neutral',
    'blue',
    'emerald',
    'amber',
    'rose',
  ]),
  label: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.node,
  showDot: PropTypes.bool,
  pulseDot: PropTypes.bool,
  className: PropTypes.string,
  dotColor: PropTypes.string,
  variantType: PropTypes.oneOf(['minimal', 'boxed']),
};

export default StatusBadge;
