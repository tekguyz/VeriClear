
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Info, ArrowLeft, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { useAppStore } from '../../store/appStore';
import OnboardingModal from '../onboarding/OnboardingModal';

const DemoBanner: React.FC = () => {
    const setAppMode = useAppStore(state => state.setAppMode);
    return (
        <div className="bg-notice-background text-notice-text px-4 py-2 text-sm flex items-center justify-between">
            <div className="flex items-center">
                <Info size={16} className="mr-2" />
                You are in Interactive Demo Mode. All actions are disabled.
            </div>
            <button onClick={() => setAppMode(null)} className="flex items-center font-semibold hover:text-text-primary transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Exit Demo
            </button>
        </div>
    )
}

const Layout: React.FC = () => {
  const isLeftPanelOpen = useAppStore((state) => state.isLeftPanelOpen);
  const toggleLeftPanelOpen = useAppStore((state) => state.toggleLeftPanelOpen);
  const setIsLeftPanelOpen = useAppStore((state) => state.setIsLeftPanelOpen);
  const rightPanelVisible = useAppStore((state) => state.rightPanelVisible);
  const toggleRightPanel = useAppStore((state) => state.toggleRightPanel);
  const setRightPanelVisible = useAppStore((state) => state.setRightPanelVisible);
  const appMode = useAppStore((state) => state.appMode);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { Outlet, useLocation, useNavigate } = ReactRouterDOM;
  const location = useLocation();
  const navigate = useNavigate();

  const isDemoMode = appMode === 'demo';

  const getPageTitle = (pathname: string) => {
    const segment = pathname.split('/').pop() || 'analytics';
    switch (segment) {
        case 'analytics': return 'Analytics';
        case 'co-pilot': return 'Co-Pilot';
        case 'upload': return 'Upload';
        case 'reviews': return 'Reviews';
        case 'settings': return 'Settings';
        case 'help': return 'Help Center';
        case 'changelog': return 'What\'s New';
        default: return 'VeriClear';
    }
  };

  const pageTitle = getPageTitle(location.pathname);
  
  // Determines if the mobile header should show a back button
  const isHeaderSubPage = ['Settings', 'Help Center', 'What\'s New'].includes(pageTitle);

  // Determines if the mobile FABs should be hidden
  const fullScreenPages = ['/settings', '/help', '/changelog'];
  const isFullScreenPage = fullScreenPages.some(p => location.pathname.startsWith(p));


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
    // On smaller desktop screens, ensure the right panel is closed by default.
    if (window.innerWidth < 1280) {
      setRightPanelVisible(false);
    }
    // The left panel's initial state is now correctly handled by the store,
    // which checks localStorage first and then defaults based on screen size.
    // This effect no longer needs to force the left panel closed on mobile.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-primary-background text-text-primary font-sans">
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      
      {/* --- Floating Action Buttons --- */}
      {/* Show left-side buttons only if the panel is closed */}
      {!isLeftPanelOpen && (
        <>
          {/* Mobile Left FAB: Hidden on full-screen pages */}
          <button
            onClick={toggleLeftPanelOpen}
            className={`fixed bottom-20 left-4 z-30 h-12 w-12 items-center justify-center rounded-full border border-border-color bg-panel-background text-accent-primary shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-primary-background lg:hidden animate-fade-in ${isFullScreenPage ? 'hidden' : 'flex'}`}
            aria-label="Open navigation panel"
          >
            <ChevronsRight size={24} />
          </button>
           {/* Desktop Left FAB */}
          <button
            onClick={toggleLeftPanelOpen}
            aria-label="Open navigation panel"
            className="fixed top-1/2 -translate-y-1/2 left-0 z-30 hidden items-center justify-center rounded-r-full border-y border-r border-border-color bg-panel-background p-2 text-accent-primary lg:flex animate-fade-in"
          >
            <ChevronsRight size={20} />
          </button>
        </>
      )}
      
      {/* --- Persistent Right Panel Button --- */}
      {/* Desktop Right FAB */}
      <button
        onClick={toggleRightPanel}
        aria-label={rightPanelVisible ? "Collapse audit panel" : "Expand audit panel"}
        className="fixed top-1/2 -translate-y-1/2 right-0 z-30 hidden items-center justify-center rounded-l-full border-y border-l border-border-color bg-panel-background p-2 text-icon-primary xl:flex animate-fade-in"
      >
        {rightPanelVisible ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
      </button>

      {/* Mobile Right FAB: Hidden on full-screen pages */}
      <button
        onClick={toggleRightPanel}
        className={`fixed bottom-4 right-4 z-30 h-12 w-12 items-center justify-center rounded-full border border-border-color bg-panel-background text-icon-primary shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-primary-background xl:hidden ${isFullScreenPage ? 'hidden' : 'flex'}`}
        aria-label="Toggle audit panel"
      >
        {rightPanelVisible ? <X size={24} /> : <ChevronsLeft size={24} />}
      </button>


      {/* --- Panels & Overlays --- */}
      <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${isLeftPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <LeftPanel />
      </div>
      {isLeftPanelOpen && <div onClick={toggleLeftPanelOpen} className="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>}
      
      <div className={`fixed top-0 right-0 h-full w-full bg-panel-background z-50 transition-transform duration-300 ease-in-out xl:hidden ${rightPanelVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <RightPanel />
      </div>
      {rightPanelVisible && <div onClick={toggleRightPanel} className="fixed inset-0 bg-black/50 z-40 xl:hidden"></div>}

      {/* --- Main Content --- */}
      <div className={`flex h-screen w-full transition-all duration-300 ease-in-out ${isLeftPanelOpen ? 'lg:pl-[260px]' : 'lg:pl-0'}`}>
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {isDemoMode && <DemoBanner />}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
              {/* Mobile Header */}
              <div className="lg:hidden relative flex items-center justify-center mb-4 h-10">
                {isHeaderSubPage ? (
                  <button onClick={() => navigate(-1)} className="p-2 absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary" aria-label="Go back">
                    <ArrowLeft size={24} />
                  </button>
                ) : (
                  <div className="absolute left-0 h-10 w-10"></div>
                )}
                <h1 className="text-xl font-bold whitespace-nowrap">{pageTitle}</h1>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-center text-center mb-6 gap-3">
                  <h1 className="text-2xl font-bold">{pageTitle}</h1>
              </div>
              
              <Outlet />
          </div>
        </main>
        
        <div className={`transition-all duration-300 ease-in-out ${rightPanelVisible ? 'w-96' : 'w-0'} hidden xl:block`}>
           {rightPanelVisible && <RightPanel />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
