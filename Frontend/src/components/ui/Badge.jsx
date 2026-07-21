import clsx from 'clsx';

const VARIANTS = {
  primary: 'bg-[var(--color-primary)] text-white shadow-[0_1px_6px_rgba(255,107,53,0.30)]',
  dark:    'bg-[var(--color-secondary)] text-white',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
  outline: 'border border-gray-200 text-gray-600 bg-white',
};

function Badge({ children, variant = 'primary', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full',
        'text-[10.5px] font-bold px-2.5 py-[3px] tracking-wide',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
