import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ label, error, hint, className, id, ...props }, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'w-full h-11 px-4 rounded-xl border text-[14px] text-gray-900',
          'placeholder:text-gray-400 bg-gray-50',
          'transition-all duration-200',
          'focus:outline-none focus:bg-white',
          error
            ? 'border-red-300 ring-2 ring-red-100 focus:border-red-400'
            : 'border-gray-200 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/12',
          className
        )}
        {...props}
      />

      {hint && !error && (
        <p className="text-[11.5px] text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-[11.5px] text-red-500 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error.message ?? error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
