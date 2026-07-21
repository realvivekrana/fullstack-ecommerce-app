import { useState, useRef, useCallback, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import clsx from 'clsx';

/**
 * SearchBar
 *
 * Props
 * ─────
 * className  — forwarded to the <form> wrapper (controls width / margins)
 * size       — "sm" (h-10, rounded-xl) | "md" (h-12, rounded-[14px], default)
 * onSubmit   — optional callback fired after navigation (e.g. to close a drawer)
 */
function SearchBar({ className = '', size = 'md', onSubmit }) {
  const [query,   setQuery  ] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate    = useNavigate();
  const inputRef    = useRef(null);
  const inputId     = useId();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    onSubmit?.();
  }, [query, navigate, onSubmit]);

  const handleChange = useCallback((e) => setQuery(e.target.value), []);
  const handleFocus  = useCallback(() => setFocused(true),  []);
  const handleBlur   = useCallback(() => setFocused(false), []);
  const focusInput   = useCallback(() => inputRef.current?.focus(), []);

  const isActive = focused || query.length > 0;

  const isSm = size === 'sm';

  return (
    <form
      role="search"
      aria-label="Search ShopVerse"
      onSubmit={handleSubmit}
      onClick={focusInput}
      className={clsx('relative w-full', className)}
    >
      <div
        className={clsx(
          'flex items-center w-full border overflow-hidden',
          'transition-all duration-200 ease-in-out',
          /* Height & radius by size */
          isSm ? 'h-10 rounded-xl' : 'h-12 rounded-[14px]',
          /* Focus / idle styles */
          focused
            ? 'bg-white border-[var(--color-primary)] shadow-[0_0_0_3px_rgba(255,107,53,0.12),0_2px_12px_rgba(0,0,0,0.06)]'
            : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
        )}
      >
        {/* Decorative icon */}
        <span
          aria-hidden="true"
          className={clsx(
            'flex items-center justify-center shrink-0 h-full transition-colors duration-200',
            isSm ? 'w-10' : 'w-12',
            focused ? 'text-[var(--color-primary)]' : 'text-gray-400'
          )}
        >
          <Search size={isSm ? 15 : 18} strokeWidth={2.2} />
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search for products, brands and more…"
          aria-label="Search products"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className={clsx(
            'flex-1 h-full bg-transparent',
            'font-normal text-gray-900 placeholder:text-gray-400',
            'pl-0 pr-2 focus:outline-none',
            isSm ? 'text-[13px]' : 'text-[14px]',
            '[&::-webkit-search-cancel-button]:hidden',
            '[&::-webkit-search-decoration]:hidden'
          )}
        />

        {/* Submit button */}
        <button
          type="submit"
          aria-label="Submit search"
          className={clsx(
            'flex items-center justify-center shrink-0 mx-1.5',
            'font-semibold tracking-wide transition-all duration-200',
            'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
            isSm
              ? 'h-7 w-7 rounded-[8px] text-[12px]'
              : 'h-8 px-3 sm:px-4 rounded-[10px] text-[13px]',
            isActive
              ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-[0_2px_8px_rgba(255,107,53,0.35)] hover:shadow-[0_4px_12px_rgba(255,107,53,0.45)] active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-default'
          )}
        >
          {/* On mobile (sm size) always show icon; on desktop show text */}
          {isSm ? (
            <Search size={13} strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <>
              <Search size={15} strokeWidth={2.5} className="sm:hidden" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
