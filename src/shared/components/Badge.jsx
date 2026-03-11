import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full';

  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-[var(--primary-50)] text-[var(--primary-700)]',
    success: 'bg-[var(--green-50)] text-[var(--green-600)]',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-[var(--blue-50)] text-[var(--blue-700)]',
    // Solid variants
    'success-solid': 'bg-[var(--green-500)] text-white',
    'primary-solid': 'bg-[var(--primary-600)] text-white',
    'warning-solid': 'bg-amber-500 text-white',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  const variantStyles = variants[variant] || variants.default;
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <span className={`${baseStyles} ${variantStyles} ${sizeStyles} uppercase tracking-wide ${className}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
