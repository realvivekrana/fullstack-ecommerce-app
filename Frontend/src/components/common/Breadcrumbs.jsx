import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

function Breadcrumbs({ items = [] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-[12.5px] text-gray-400 py-4 sm:py-5"
    >
      <Link
        to="/"
        className="flex items-center justify-center w-6 h-6 rounded-md
          hover:text-[var(--color-primary)] hover:bg-gray-100
          transition-all duration-150"
        aria-label="Home"
      >
        <Home size={13} aria-hidden="true" />
      </Link>

      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={13} className="text-gray-300 shrink-0" aria-hidden="true" />
          {item.to ? (
            <Link
              to={item.to}
              className="hover:text-[var(--color-primary)] transition-colors duration-150"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
