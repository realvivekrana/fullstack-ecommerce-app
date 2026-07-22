import { NavLink, useNavigate } from 'react-router-dom';
import { UserCircle, Package, Heart, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

const NAV_ITEMS = [
  { to: ROUTES.PROFILE, icon: UserCircle, label: 'Profile & Addresses' },
  { to: ROUTES.ORDERS, icon: Package, label: 'My Orders' },
  { to: ROUTES.WISHLIST, icon: Heart, label: 'Wishlist' },
];

function DashboardSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-semibold shrink-0">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="bg-white rounded-2xl border border-gray-100 p-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200',
                isActive ? 'bg-[var(--color-primary)]/8 text-[var(--color-primary)]' : 'text-gray-600 hover:bg-gray-50'
              )
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut size={17} />
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;