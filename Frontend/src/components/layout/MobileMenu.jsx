import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Heart, Package, ChevronRight, LogOut } from 'lucide-react';
import { categories } from '@/data/categories';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';

function MobileMenu({ isOpen, onClose }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate(ROUTES.HOME);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className="fixed top-0 left-0 h-full w-[85vw] max-w-80 bg-white z-50 shadow-2xl lg:hidden overflow-y-auto flex flex-col"
          >
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100 shrink-0">
              <span className="font-semibold text-base text-gray-900">Menu</span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-100 shrink-0">
              {[
                { to: ROUTES.PROFILE, icon: User, label: 'Profile' },
                { to: ROUTES.WISHLIST, icon: Heart, label: 'Wishlist' },
                { to: ROUTES.ORDERS, icon: Package, label: 'Orders' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={onClose}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors duration-200"
                >
                  <item.icon size={20} />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            <nav className="flex-1 px-2 py-2" aria-label="Categories">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-3.5 rounded-lg text-[15px] text-gray-800 font-medium hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors duration-200"
                >
                  {cat.name}
                  <ChevronRight size={16} className="text-gray-300" />
                </Link>
              ))}
            </nav>

            {/* Auth actions */}
            <div className="p-4 border-t border-gray-100 shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    aria-label="Logout"
                    className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={onClose}
                    className="flex items-center justify-center h-11 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={onClose}
                    className="flex items-center justify-center h-11 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;