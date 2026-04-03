// Rebuild trigger
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import BackToTop from './components/BackToTop';
import { useLocation } from 'react-router-dom';

const LayoutWrapper = () => {
  const location = useLocation();
  // Hide Navbar/Footer on Dashboard routes
  const isDashboard = location.pathname.startsWith('/dashboard');

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
      {!isDashboard && <Navbar />}
      
      <main className="flex-grow">
        <AppRoutes />
      </main>
      
      {!isDashboard && !isAuthPage && (
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
    <AuthProvider>
        <SimulationProvider>
          <Router>
            <LayoutWrapper />
          </Router>
        </SimulationProvider>
    </AuthProvider>
  );
}

export default App;
