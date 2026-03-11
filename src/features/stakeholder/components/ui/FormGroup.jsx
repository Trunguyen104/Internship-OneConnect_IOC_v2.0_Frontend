'use client';

export default function FormGroup({ label, required, error, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className='block text-sm font-medium text-slate-700'>
          {label} {required && <span className='text-primary'>*</span>}
        </label>
      )}
      {children}
      {error && <p className='text-primary mt-1 text-xs'>{error}</p>}
    </div>
  );
}
