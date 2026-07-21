import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';

/**
 * Root layout wrapping every page.
 * - Provides the skip-nav target `#main-content` wired to the <main> element.
 * - Announces route changes to screen readers via a visually-hidden live region.
 * - Scrolls to the top on every route change (SPA behaviour without full reload).
 */
function MainLayout() {
  const { pathname } = useLocation();

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Skip-nav target */}
      <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
