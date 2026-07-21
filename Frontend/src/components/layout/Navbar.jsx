import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import SearchBar from '@/components/common/SearchBar';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import HamburgerIcon from './HamburgerIcon';
import UserMenu from './UserMenu';
import { categories } from '@/data/categories';
import { ROUTES } from '@/constants';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const location = useLocation();
  const activeCategoryParam = new URLSearchParams(location.search).get('category');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveCategory(null);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header
      className={clsx(
        'sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm border-b transition-shadow duration-300',
        scrolled ? 'border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.06)]' : 'border-gray-100'
      )}
    >
      <div className="hidden lg:block w-full bg-[var(--color-secondary)] text-white">
        <div className="max-w-7xl mx-auto w-full px-6 h-9 flex items-center justify-between text-[11px] tracking-wide">
          <span className="text-gray-300">Free shipping on orders above ₹999</span>
          <nav aria-label="Secondary" className="flex items-center gap-5">
            <Link to={ROUTES.ABOUT} className="text-gray-300 hover:text-white transition-colors duration-200">
              About
            </Link>
            <Link to={ROUTES.CONTACT} className="text-gray-300 hover:text-white transition-colors duration-200">
              Contact
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 h-16 lg:h-[72px] flex items-center justify-between gap-3 lg:gap-8">
        <div className="flex items-center gap-2 lg:gap-8 min-w-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden shrink-0 w-9 h-9 flex items-center justify-center text-gray-700 hover:text-[var(--color-primary)] transition-colors duration-200 rounded-md focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <HamburgerIcon isOpen={mobileOpen} />
          </button>

          <Link
            to={ROUTES.HOME}
            className="shrink-0 text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] rounded-sm"
          >
            Shop<span className="text-[var(--color-primary)]">Verse</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 shrink-0">
            {categories.map((cat) => {
              const isActive = activeCategoryParam === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    to={`/shop?category=${cat.id}`}
                    onFocus={() => setActiveCategory(cat.id)}
                    aria-current={isActive ? 'page' : undefined}
                    aria-expanded={activeCategory === cat.id}
                    className={clsx(
                      'relative flex items-center h-10 px-3 text-sm font-medium rounded-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]',
                      isActive ? 'text-[var(--color-primary)]' : 'text-gray-700 hover:text-[var(--color-primary)]'
                    )}
                  >
                    {cat.name}
                    <span
                      className={clsx(
                        'absolute left-3 right-3 bottom-1 h-[2px] rounded-full bg-[var(--color-primary)] origin-left transition-transform duration-200',
                        activeCategory === cat.id || isActive ? 'scale-x-100' : 'scale-x-0'
                      )}
                    />
                  </Link>
                  <MegaMenu category={cat} isOpen={activeCategory === cat.id} />
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 lg:gap-4 flex-1 lg:flex-none justify-end min-w-0">
          <SearchBar className="hidden md:block w-full max-w-md min-w-0" />

          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <UserMenu />

            <IconLink
              to={ROUTES.WISHLIST}
              label="Wishlist"
              icon={Heart}
              count={wishlistItems.length}
              filled={wishlistItems.length > 0}
            />

            <IconLink to={ROUTES.CART} label="Cart" icon={ShoppingCart} count={cartCount} />
          </div>
        </div>
      </div>

      <div className="md:hidden w-full px-4 pb-3">
        <SearchBar />
      </div>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function IconLink({ to, label, icon: Icon, count = 0, filled = false }) {
  return (
    <NavLink
      to={to}
      aria-label={`${label}${count > 0 ? `, ${count} items` : ''}`}
      className={({ isActive }) =>
        clsx(
          'relative flex items-center justify-center w-10 h-10 shrink-0 rounded-full transition-all duration-200 hover:bg-gray-50 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]',
          isActive ? 'text-[var(--color-primary)]' : 'text-gray-700'
        )
      }
    >
      <Icon size={20} className={filled ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : ''} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="absolute top-0 right-0 min-w-[17px] h-[17px] px-1 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center shadow-sm leading-none"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
}

export default Navbar;