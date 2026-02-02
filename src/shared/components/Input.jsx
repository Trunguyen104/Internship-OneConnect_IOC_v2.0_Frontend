'use client';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className='mb-4'>
      <label className='block mb-2 text-sm font-medium text-gray-900'>
        {label} <span className='text-red-500'>*</span>
      </label>

      <div className='relative'>
        <input
          {...props}
          className={`
            w-full px-4 py-2 rounded-2xl
            bg-white text-gray-900 placeholder-gray-400
            border cursor-text
            ${error ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2
            ${error ? 'focus:ring-red-400' : 'focus:ring-blue-400'}
            ${className}
          `}
        />

        {error && (
          <span
            className='absolute right-3 top-1/2 -translate-y-1/2
            text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md'
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
