import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  /* Build page number list with ellipsis for long ranges */
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '…', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages);
    }
    return pages;
  };

  const navBtn =
    'flex items-center justify-center w-9 h-9 rounded-xl border text-gray-500 ' +
    'transition-all duration-150 ' +
    'hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 ' +
    'disabled:opacity-35 disabled:pointer-events-none ' +
    'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]';

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 mt-10 sm:mt-12"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={clsx(navBtn, 'border-gray-200')}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {getPages().map((page, i) =>
        page === '…' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={clsx(
              'flex items-center justify-center w-9 h-9 rounded-xl text-[13.5px] font-semibold',
              'transition-all duration-150',
              'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]',
              page === currentPage
                ? 'bg-[var(--color-primary)] text-white shadow-[0_2px_10px_rgba(255,107,53,0.32)]'
                : 'border border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={clsx(navBtn, 'border-gray-200')}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}

export default Pagination;
