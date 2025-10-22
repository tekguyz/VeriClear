

import React, { useState, useEffect } from 'react';
// Fix: Use namespace import for react-router-dom to resolve export issues.
import * as ReactRouterDOM from 'react-router-dom';
import { PanelRightOpen, Info, ArrowLeft, ChevronsLeft } from 'lucide-react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { useAppStore } from '../../store/appStore';
import OnboardingModal from '../onboarding/OnboardingModal';
import { Logomark } from './Logomark';

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { Outlet, useLocation } = ReactRouterDOM;
  const location = useLocation();

  const isDemoMode = appMode === 'demo';

  const getPageTitle = (pathname: string) => {
    const segment = pathname.split('/').pop() || 'dashboard';
    switch (segment) {
        case 'dashboard': return 'Dashboard';
        case 'live-call': return 'Live Call Analysis';
        case 'batch-analysis': return 'Batch Analysis';
        case 'settings': return 'Settings';
        case 'help': return 'Help & Documentation';
        default: return 'VeriClear';
    }
  };

  const pageTitle = getPageTitle(location.pathname);

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
            <div className="md:hidden grid grid-cols-3 items-center mb-4">
              <button onClick={toggleLeftPanelDrawer} className="p-1 justify-self-start">
                <Logomark className="w-8 h-8" />
              </button>
              <h1 className="text-xl font-bold text-center col-start-2">{pageTitle}</h1>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block text-center mb-6">
                <h1 className="text-2xl font-bold">{pageTitle}</h1>
            </div>
            
            <Outlet />
        </div>
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

      {/* FAB for screens < 1280px to open right drawer */}
      <button
        onClick={toggleRightPanel}
        className="fixed bottom-4 right-4 z-30 p-3 bg-panel-background border border-border-color text-gray-400 hover:text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-background focus:ring-accent-primary xl:hidden"
        aria-label="Toggle audit panel"
      >
        <ChevronsLeft size={20} />
      </button>

      {/* Mobile Right Panel Drawer */}
      <div className={`fixed top-0 right-0 h-full w-96 max-w-[calc(100vw-2rem)] bg-panel-background z-50 transition-transform duration-300 ease-in-out xl:hidden ${rightPanelVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <RightPanel />
      </div>

       {/* Overlay for Mobile Right Panel */}
      {rightPanelVisible && <div onClick={toggleRightPanel} className="fixed inset-0 bg-black/50 z-40 xl:hidden"></div>}
    </div>
  );
};

export default Layout;