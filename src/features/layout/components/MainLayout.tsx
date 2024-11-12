import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MobileHeader, DesktopHeader } from '../../navigation';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  const location = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Desktop Header */}
      <DesktopHeader navigationItems={[]} />

      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileHeader 
          isSearchOpen={false}
          setIsSearchOpen={() => {}}
          isMobileMenuOpen={false}
          setIsMobileMenuOpen={() => {}}
        />
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;