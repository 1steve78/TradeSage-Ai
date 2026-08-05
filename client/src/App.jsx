import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import useAuthStore from './store/authStore';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import PageSkeleton from './components/PageSkeleton';
import { SkeletonDashboard, SkeletonPortfolio, SkeletonOrders, SkeletonScanner, SkeletonAI } from './components/common/Skeletons';
import OfflineBanner from './components/common/OfflineBanner';

// Lazy loaded routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Orders = lazy(() => import('./pages/Orders'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const AIInsightsPage = lazy(() => import('./pages/AIInsightsPage'));
const StockDetailsPage = lazy(() => import('./pages/StockDetailsPage'));
const MarketExplorer = lazy(() => import('./components/Stock/MarketExplorer'));
const Scanner = lazy(() => import('./pages/Scanner'));

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Toaster position="bottom-right" theme="dark" richColors />
      <OfflineBanner />
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
            <Route path="/dashboard" element={<Suspense fallback={<SkeletonDashboard />}><Dashboard /></Suspense>} />
            <Route path="/explorer" element={<Suspense fallback={<PageSkeleton />}><MarketExplorer /></Suspense>} />
            <Route path="/stock/:symbol" element={<Suspense fallback={<PageSkeleton />}><StockDetailsPage /></Suspense>} />
            <Route path="/ai-insights" element={<Suspense fallback={<SkeletonAI />}><AIInsightsPage /></Suspense>} />
            <Route path="/portfolio" element={<Suspense fallback={<SkeletonPortfolio />}><Portfolio /></Suspense>} />
            <Route path="/analytics" element={<Suspense fallback={<PageSkeleton />}><AnalyticsPage /></Suspense>} />
            <Route path="/orders" element={<Suspense fallback={<SkeletonOrders />}><Orders /></Suspense>} />
            <Route path="/watchlist" element={<Suspense fallback={<PageSkeleton />}><Watchlist /></Suspense>} />
            <Route path="/scanner" element={<Suspense fallback={<SkeletonScanner />}><Scanner /></Suspense>} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<Suspense fallback={<PageSkeleton />}><NotFound /></Suspense>} />
      </Routes>
    </>
  );
}

export default App;