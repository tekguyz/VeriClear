
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Info, ArrowLeft, ChevronsLeft, ChevronsRight, Menu, X } from 'lucide-react';
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
  const rightPanelVisible = useAppStore((state) => state.rightPanelVisible);
  const toggleRightPanel = useAppStore((state) => state.toggleRightPanel);
  const setRightPanelVisible = useAppStore((state) => state.setRightPanelVisible);
  const rightPanelWidth = useAppStore((state) => state.rightPanelWidth);
  const appMode = useAppStore((state) => state.appMode);
  const [showOnboarding, setShowOnboarding] = useState(false);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-primary-background text-text-primary font-sans">
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      
      {/* --- Right Panel Slide-out Handle (Desktop) --- */}
      <button
        onClick={toggleRightPanel}
        className="hidden xl:flex items-center justify-center fixed top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ease-in-out w-6 h-20 bg-panel-background hover:bg-interactive-background-hover border-y border-l border-border-color rounded-l-md shadow-md"
        style={{ right: rightPanelVisible ? `${rightPanelWidth}px` : '0' }}
        aria-label="Toggle audit panel"
      >
          {rightPanelVisible ? <ChevronsRight size={20} className="text-icon-primary" /> : <ChevronsLeft size={20} className="text-icon-primary" />}
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
          
          {/* New Unified Header */}
          <header className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-border-color bg-panel-background/80 backdrop-blur-sm z-10">
              <div className="flex items-center">
                  {/* Back button for mobile subpages */}
                  <button onClick={() => navigate(-1)} className={`p-2 text-text-secondary hover:text-text-primary ${isHeaderSubPage ? 'lg:hidden' : 'hidden'}`} aria-label="Go back">
                      <ArrowLeft size={24} />
                  </button>
                  {/* Hamburger for all other cases */}
                  <button onClick={toggleLeftPanelOpen} className={`p-2 text-text-secondary hover:text-text-primary ${isHeaderSubPage ? 'hidden lg:block' : 'block'}`} aria-label="Toggle navigation menu">
                      <Menu size={24} />
                  </button>
              </div>
              
              <h1 className="text-xl font-bold whitespace-nowrap absolute left-1/2 -translate-x-1/2">{pageTitle}</h1>

              <div className="flex items-center">
                  {/* Right panel toggle for small/medium screens */}
                  <button onClick={toggleRightPanel} className="p-2 text-text-secondary hover:text-text-primary xl:hidden" aria-label="Toggle audit panel">
                      <ChevronsLeft size={24} />
                  </button>
              </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <Outlet />
          </div>
        </main>
        
        <aside style={{ width: rightPanelVisible ? `${rightPanelWidth}px` : '0' }} className={`transition-all duration-300 ease-in-out hidden xl:block flex-shrink-0`}>
           {rightPanelVisible && <RightPanel />}
        </aside>
      </div>
    </div>
  );
};

export default Layout;
