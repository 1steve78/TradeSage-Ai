import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useAuthStore from './store/authStore';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Orders from './pages/Orders';
import Watchlist from './pages/Watchlist';
import NotFound from './pages/NotFound';

import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Landing Page Route */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Authentication Route */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Layout and Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;