
import React, { useState, useEffect } from 'react';
// Fix: Use namespace import for react-router-dom to resolve export issues.
import * as ReactRouterDOM from 'react-router-dom';
import { PanelRightOpen, Menu, Info, ArrowLeft, ChevronsLeft } from 'lucide-react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import Footer from './Footer';
import { useAppStore } from '../../store/appStore';
import OnboardingModal from '../onboarding/OnboardingModal';
import PricingModal from '../pricing/PricingModal';

const DemoBanner: React.FC = () => {
    const setAppMode = useAppStore(state => state.setAppMode);
    return (
        <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 text-sm flex items-center justify-between">
            <div className="flex items-center">
                <Info size={16} className="mr-2" />
                You are in Interactive Demo Mode. All actions are disabled.
            </div>
            <button onClick={() => setAppMode(null)} className="flex items-center font-semibold hover:text-white transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Exit Demo
            </button>
        </div>
    )
}

const Layout: React.FC = () => {
  const rightPanelVisible = useAppStore((state) => state.rightPanelVisible);
  const toggleRightPanel = useAppStore((state) => state.toggleRightPanel);
  const setRightPanelVisible = useAppStore((state) => state.setRightPanelVisible);
  const leftPanelDrawerVisible = useAppStore((state) => state.leftPanelDrawerVisible);
  const toggleLeftPanelDrawer = useAppStore((state) => state.toggleLeftPanelDrawer);
  const appMode = useAppStore((state) => state.appMode);
  const isPricingModalVisible = useAppStore((state) => state.isPricingModalVisible);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { Outlet } = ReactRouterDOM;

  const isDemoMode = appMode === 'demo';

  useEffect(() => {
    const hasSeenOnboarding = sessionStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    sessionStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  useEffect(() => {
    if (window.innerWidth < 1280) {
      setRightPanelVisible(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen w-full bg-primary-background text-text-primary font-sans">
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      {isPricingModalVisible && <PricingModal />}
      
      {/* Static Left Panel for md screens and up */}
      <div className="hidden md:flex">
        <LeftPanel />
      </div>

      {/* Mobile Left Panel Drawer */}
      <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out md:hidden ${leftPanelDrawerVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <LeftPanel isDrawer={true} />
      </div>
      {leftPanelDrawerVisible && <div onClick={toggleLeftPanelDrawer} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {isDemoMode && <DemoBanner />}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center mb-4">
              <button onClick={toggleLeftPanelDrawer} className="p-2 text-gray-400 hover:text-white">
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold ml-4">VeriClear</h1>
            </div>
            <Outlet />
        </div>
        <Footer />
      </main>
      
      {/* Right Panel - Conditional rendering based on state */}
      <div className={`transition-all duration-300 ease-in-out ${rightPanelVisible ? 'w-96' : 'w-0'} hidden xl:block`}>
         {rightPanelVisible && <RightPanel />}
      </div>
      
       {/* Expand button for collapsed right panel on desktop */}
      {!rightPanelVisible && (
        <button
            onClick={toggleRightPanel}
            title="Expand audit panel"
            className="fixed top-1/2 -translate-y-1/2 right-0 z-20 p-2 bg-panel-background border-y border-l border-border-color rounded-l-full text-gray-400 hover:text-white hidden xl:flex items-center justify-center animate-fade-in"
        >
            <ChevronsLeft size={18} />
        </button>
      )}

      {/* FAB for screens < 1280px to open drawer */}
      <button
        onClick={toggleRightPanel}
        className="fixed bottom-6 right-6 z-30 p-4 bg-accent-primary text-white rounded-full shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-background focus:ring-accent-primary xl:hidden"
        aria-label="Toggle audit panel"
      >
        <PanelRightOpen size={24} />
      </button>

      {/* Mobile Right Panel Drawer */}
      <div className={`fixed top-0 right-0 h-full bg-panel-background z-40 transition-transform duration-300 ease-in-out xl:hidden ${rightPanelVisible ? 'translate-x-0' : 'translate-x-full'} w-full max-w-sm sm:max-w-md`}>
         <RightPanel />
      </div>
       {/* Overlay for Mobile Right Panel */}
      {rightPanelVisible && <div onClick={toggleRightPanel} className="fixed inset-0 bg-black/50 z-30 xl:hidden"></div>}
    </div>
  );
};

export default Layout;
