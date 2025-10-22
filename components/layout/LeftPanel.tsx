
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { LayoutDashboard, Phone, ListChecks, Settings, X, HelpCircle, Sparkles, User, LogOut, Plus, Info, Check, ChevronRight, PanelLeftOpen } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Logomark } from './Logomark';

// --- Reusable Hook for Outside Clicks ---
const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};


// --- New User Popup Menu ---
const UserPopupMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(menuRef, onClose);
    const { Link } = ReactRouterDOM;

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div ref={menuRef} className="absolute bottom-full mb-2 left-2 w-64 bg-[#2a2a2e] border border-border-color rounded-xl shadow-2xl p-2 text-sm animate-fade-in z-50">
            <ul className="space-y-1 text-gray-300">
                <li><button onClick={() => { useAppStore.getState().togglePricingModal(); onClose(); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700/80"><Sparkles size={20} /> Upgrade plan</button></li>
                <li><Link to="/settings" onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700/80"><User size={20} /> Personalization</Link></li>
                <li><Link to="/settings" onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700/80"><Settings size={20} /> Settings</Link></li>
                <hr className="border-border-color my-1" />
                <li><Link to="/help" onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700/80"><HelpCircle size={20} /> Help <ChevronRight size={16} className="ml-auto text-gray-500" /></Link></li>
                <li><button onClick={() => { useAppStore.getState().setAppMode(null); onClose(); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700/80"><LogOut size={20} /> Log out</button></li>
            </ul>
        </div>
    );
};


// --- Main Sidebar Component ---
const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/live-call', icon: Phone, label: 'Live Call' },
  { to: '/batch-analysis', icon: ListChecks, label: 'Batch Analysis' },
];

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
    <div className="relative group flex items-center">
        {children}
        <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#2a2a2e] text-white text-xs font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-20">
            {text}
        </div>
    </div>
);

const NavItem: React.FC<{ item: { to: string; icon: React.ElementType; label: string; }; isCollapsed: boolean; onClick: () => void; }> = ({ item, isCollapsed, onClick }) => {
    const { NavLink } = ReactRouterDOM;
    
    const linkContent = (
        <NavLink
            to={item.to}
            onClick={onClick}
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-neutral-700/50 hover:text-white ${
                isCollapsed ? 'justify-center' : ''
              }`
            }
        >
            <item.icon size={20} className="flex-shrink-0" />
            <span className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{item.label}</span>
        </NavLink>
    );

    return (
        <li>
            {isCollapsed ? <Tooltip text={item.label}>{linkContent}</Tooltip> : linkContent}
        </li>
    );
};


const LeftPanel: React.FC<{ isDrawer?: boolean }> = ({ isDrawer = false }) => {
  const isCollapsed = useAppStore((state) => state.leftPanelCollapsed);
  const toggleLeftPanel = useAppStore((state) => state.toggleLeftPanel);
  const toggleLeftPanelDrawer = useAppStore((state) => state.toggleLeftPanelDrawer);
  
  const [isUserPopupMenuOpen, setUserPopupMenuOpen] = useState(false);

  const handleLinkClick = () => {
    if (isDrawer) toggleLeftPanelDrawer();
  };

  const effectiveIsCollapsed = isDrawer ? false : isCollapsed;

  return (
    <>
      <nav className={`relative flex flex-col h-full bg-panel-background border-r border-border-color transition-all duration-300 ease-in-out p-3 ${effectiveIsCollapsed ? 'w-[72px]' : 'w-[260px]'}`}>
        
        {/* Logo and Toggle */}
         <div className={`flex items-center mb-6 h-10 ${effectiveIsCollapsed ? 'justify-center' : 'justify-start'}`}>
            {!isDrawer && (
                <button 
                    onClick={toggleLeftPanel} 
                    title={effectiveIsCollapsed ? "Expand" : "Collapse"} 
                    className="group flex items-center gap-3 w-full transition-colors duration-200 rounded-lg p-1 hover:bg-neutral-700/50"
                >
                    <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
                        <Logomark className={`w-8 h-8 transition-opacity duration-200 ${effectiveIsCollapsed ? 'group-hover:opacity-0' : ''}`} />
                        {effectiveIsCollapsed && (
                            <PanelLeftOpen size={28} className="absolute text-gray-300 transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
                        )}
                    </div>
                    
                    <span className={`text-xl font-bold text-text-primary overflow-hidden whitespace-nowrap transition-all duration-200 ${effectiveIsCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                        VeriClear
                    </span>
                </button>
            )}
             {isDrawer && (
                 <button onClick={toggleLeftPanelDrawer} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            )}
        </div>

        {/* New Chat Button */}
        <div className="px-1 mb-4">
             <button className={`flex items-center w-full p-3 rounded-lg text-left font-semibold transition-colors text-gray-400 hover:bg-neutral-700/50 hover:text-white ${effectiveIsCollapsed ? 'justify-center' : ''}`}>
                 <Plus size={20} className="flex-shrink-0" />
                 <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-200 ${effectiveIsCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>New Audit</span>
             </button>
        </div>


        {/* Main Navigation */}
        <ul className="flex-1 space-y-1 px-1">
            {navItems.map(item => <NavItem key={item.to} item={item} isCollapsed={effectiveIsCollapsed} onClick={handleLinkClick} />)}
        </ul>


        {/* User Area */}
        <div className="relative">
             <hr className="border-border-color my-2 mx-1"/>
            
            {/* Upgrade Icon when Collapsed */}
            {effectiveIsCollapsed && (
                 <div className="mb-2">
                    <Tooltip text="Upgrade Plan">
                        <button
                            onClick={() => useAppStore.getState().togglePricingModal()}
                            className="w-full flex justify-center p-2 text-gray-400 hover:text-white rounded-lg transition-colors hover:bg-neutral-700/50"
                            aria-label="Upgrade Plan"
                        >
                            <Sparkles size={20} />
                        </button>
                    </Tooltip>
                 </div>
            )}

            <button onClick={() => setUserPopupMenuOpen(p => !p)} className={`w-full flex items-center p-2 rounded-lg text-left transition-colors hover:bg-neutral-700/50 ${effectiveIsCollapsed ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-blue-500/50 flex items-center justify-center text-blue-300 font-bold">AU</div>
                <div className={`ml-3 flex-1 overflow-hidden transition-all duration-200 ${effectiveIsCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    <p className="font-bold text-sm text-white truncate">Demo User</p>
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">Free</p>
                        <button onClick={(e) => { e.stopPropagation(); useAppStore.getState().togglePricingModal(); }} className="px-2 py-0.5 text-xs font-semibold bg-gray-600 rounded-full hover:bg-gray-500">Upgrade</button>
                    </div>
                </div>
            </button>
            {isUserPopupMenuOpen && !effectiveIsCollapsed && <UserPopupMenu onClose={() => setUserPopupMenuOpen(false)} />}
        </div>
      </nav>
    </>
  );
};

export default LeftPanel;
