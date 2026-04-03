// Rebuild trigger
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import BackToTop from './components/BackToTop';
import AppErrorBoundary from './components/AppErrorBoundary';
import { useLocation } from 'react-router-dom';

const LayoutWrapper = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const hideNavbar = isDashboardRoute || isAdminRoute;
  const hideFooter = isDashboardRoute;

  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
        // If no hash, scroll to top on every route change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const isAuthPage = location.pathname === '/register' || location.pathname === '/login';

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans relative">
      {!hideNavbar && <Navbar />}
      
      <main className="flex-grow">
        <AppErrorBoundary resetKey={location.pathname}>
          <AppRoutes />
        </AppErrorBoundary>
      </main>
      
      {!hideFooter && !isAuthPage && (
        <>
            <Footer />
            <BackToTop />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppErrorBoundary resetKey={window.location.pathname}>
        <AuthProvider>
          <SimulationProvider>
            <LayoutWrapper />
          </SimulationProvider>
        </AuthProvider>
      </AppErrorBoundary>
    </Router>
  );
}

export default App;
