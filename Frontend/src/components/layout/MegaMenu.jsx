import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/* Hoist animation config so they're never recreated */
const MOTION_INITIAL  = { opacity: 0, y: 6 };
const MOTION_ANIMATE  = { opacity: 1, y: 0 };
const MOTION_EXIT     = { opacity: 0, y: 6 };
const MOTION_TRANSITION = { duration: 0.18, ease: [0.4, 0, 0.2, 1] };

/* Derive column class outside the component for stability */
function getGridCols(count) {
  if (count >= 4) return 'grid-cols-4';
  if (count === 3) return 'grid-cols-3';
  return 'grid-cols-2';
}

function MegaMenu({ category, isOpen }) {
  if (!category?.subcategories?.length) return null;

  const gridCols = getGridCols(category.subcategories.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={MOTION_INITIAL}
          animate={MOTION_ANIMATE}
          exit={MOTION_EXIT}
          transition={MOTION_TRANSITION}
          className="absolute left-0 top-full z-40 min-w-[520px]"
          /* Stop mouseleave from propagating to the parent nav item
             when the cursor moves from the label into the panel */
          onMouseEnter={(e) => e.stopPropagation()}
        >
          {/* Brand-coloured bridge strip */}
          <div className="h-[2.5px] bg-[var(--color-primary)] rounded-b-full" aria-hidden="true" />

          <div className="bg-white border border-t-0 border-gray-100/80 rounded-b-2xl shadow-[0_16px_48px_rgba(0,0,0,0.10)]">
            {/* Sub-category columns */}
            <nav aria-label={`${category.name} subcategories`}>
              <div className={`grid ${gridCols} gap-0 divide-x divide-gray-50`}>
                {category.subcategories.map((sub) => (
                  <div key={sub.name} className="px-6 py-7">
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-4 select-none"
                      aria-hidden="true"
                    >
                      {sub.name}
                    </p>

                    <ul className="space-y-1" aria-label={sub.name}>
                      {sub.items.map((item) => (
                        <li key={item}>
                          <Link
                            to={`/shop?category=${category.id}&sub=${encodeURIComponent(item)}`}
                            className="group/item flex items-center gap-1.5 py-1.5
                              text-[13.5px] font-medium text-gray-600
                              hover:text-[var(--color-primary)] transition-colors duration-150"
                          >
                            <ArrowRight
                              size={12}
                              strokeWidth={2.5}
                              aria-hidden="true"
                              className="shrink-0 opacity-0 -translate-x-1
                                group-hover/item:opacity-100 group-hover/item:translate-x-0
                                transition-all duration-150 text-[var(--color-primary)]"
                            />
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>

            {/* View-all footer */}
            <div className="border-t border-gray-50 px-6 py-3 flex items-center justify-between">
              <span className="text-[12px] text-gray-400">
                Browse all in{' '}
                <span className="font-semibold text-gray-600">{category.name}</span>
              </span>
              <Link
                to={`/shop?category=${category.id}`}
                className="flex items-center gap-1 text-[12px] font-semibold
                  text-[var(--color-primary)] hover:underline transition-colors duration-150"
              >
                View all
                <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* memo — only re-render when category data or isOpen flag changes */
export default memo(MegaMenu);
