import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { User, ChevronDown, UserCircle, Package, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <NavLink
        to={ROUTES.LOGIN}
        className={({ isActive }) =>
          clsx(
            'hidden lg:flex items-center gap-2 h-10 pl-2 pr-3 rounded-full text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]',
            isActive ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/8' : 'text-gray-700 hover:bg-gray-50'
          )
        }
        aria-label="Login to your account"
      >
        <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <User size={15} />
        </span>
        Login
      </NavLink>
    );
  }

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate(ROUTES.HOME);
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative hidden lg:block" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 h-10 pl-1.5 pr-2.5 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
      >
        <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-semibold shrink-0">
          {initials}
        </span>
        <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
        <ChevronDown size={14} className={clsx('transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40"
          >
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>

            <Link
              to={ROUTES.PROFILE}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <UserCircle size={16} className="text-gray-400" /> My Profile
            </Link>
            <Link
              to={ROUTES.ORDERS}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Package size={16} className="text-gray-400" /> My Orders
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut size={16} /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserMenu;