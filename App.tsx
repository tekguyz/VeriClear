

import React, { Suspense } from 'react';
// Fix: Use namespace import for react-router-dom to resolve export issues.
import * as ReactRouterDOM from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useAppStore } from './store/appStore';
import EntryView from './features/entry/EntryView';
import PricingModal from './components/pricing/PricingModal';
import PaymentModal from './components/pricing/PaymentModal';

// --- Code Splitting for all views ---
const DashboardView = React.lazy(() => import('./features/dashboard/DashboardView'));
const LiveCallView = React.lazy(() => import('./components/live/LiveCallView'));
const BatchAnalysisView = React.lazy(() => import('./components/batch/BatchAnalysisView'));
const SettingsView = React.lazy(() => import('./features/settings/SettingsView'));
const HelpView = React.lazy(() => import('./features/help/HelpView'));
const TermsView = React.lazy(() => import('./features/legal/TermsView'));
const PrivacyView = React.lazy(() => import('./features/legal/PrivacyView'));
const AIEthicsView = React.lazy(() => import('./features/legal/AIEthicsView'));
const CookiePolicyView = React.lazy(() => import('./features/legal/CookiePolicyView'));
const NotFoundView = React.lazy(() => import('./features/notfound/NotFoundView'));


const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-screen bg-primary-background">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
  </div>
);

const App: React.FC = () => {
  const appMode = useAppStore((state) => state.appMode);
  const isPricingModalVisible = useAppStore((state) => state.isPricingModalVisible);
  const isPaymentModalVisible = useAppStore((state) => state.isPaymentModalVisible);
  const { HashRouter, Routes, Route, Navigate } = ReactRouterDOM;

  return (
    <HashRouter>
      {isPricingModalVisible && <PricingModal />}
      {isPaymentModalVisible && <PaymentModal />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Static pages are always available, regardless of app mode */}
          <Route path="/terms" element={<TermsView />} />
          <Route path="/privacy" element={<PrivacyView />} />
          <Route path="/ai-ethics" element={<AIEthicsView />} />
          <Route path="/cookie-policy" element={<CookiePolicyView />} />

          {appMode === null ? (
            // --- Pre-Selection Routes ---
            // If no mode is selected, only the entry view is accessible at the root.
            // Any other path redirects to the entry view.
            <>
              <Route path="/" element={<EntryView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            // --- Main Application Routes ---
            // If a mode is selected, the main application routes are available.
            <>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardView />} />
                <Route path="live-call" element={<LiveCallView />} />
                <Route path="batch-analysis" element={<BatchAnalysisView />} />
                <Route path="settings" element={<SettingsView />} />
                <Route path="help" element={<HelpView />} />
              </Route>
              {/* Catch-all 404 for the main application */}
              <Route path="*" element={<NotFoundView />} />
            </>
          )}
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;