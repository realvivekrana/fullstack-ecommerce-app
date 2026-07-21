import clsx from 'clsx';

const VARIANTS = {
  primary:
    'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white ' +
    'shadow-[0_2px_12px_rgba(255,107,53,0.30)] ' +
    'hover:shadow-[0_4px_20px_rgba(255,107,53,0.42)] hover:brightness-110',
  outline:
    'border border-gray-200 text-gray-700 bg-white ' +
    'hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/4',
  ghost:
    'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  dark:
    'bg-[var(--color-secondary)] text-white ' +
    'hover:bg-[var(--color-accent)] shadow-sm hover:shadow-md',
};

const SIZES = {
  sm: 'h-8  px-3.5 text-[12.5px] rounded-lg',
  md: 'h-10 px-5   text-[13.5px] rounded-xl',
  lg: 'h-12 px-7   text-[14.5px] rounded-xl',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  as: Component = 'button',
  ...props
}) {
  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-200 ease-out',
        'active:scale-[0.97]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
