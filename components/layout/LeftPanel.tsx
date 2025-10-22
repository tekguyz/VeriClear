

import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { BarChart, Headset, ListChecks, Settings, X, HelpCircle, User, LogOut, Plus, Sparkle, Upload, ChevronsLeft } from 'lucide-react';
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
const UserPopupMenu: React.FC<{
  onClose: () => void;
  onActionClick: () => void;
}> = ({ onClose, onActionClick }) => {
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

    const handleAction = () => {
        onClose();
        onActionClick();
    };
    
    return (
        <div ref={menuRef} className="absolute bottom-full mb-2 left-2 w-64 bg-panel-background border border-border-color rounded-xl shadow-2xl p-2 text-sm animate-fade-in z-50">
            <ul className="space-y-1 text-text-primary">
                <li><button onClick={() => { useAppStore.getState().togglePricingModal(); handleAction(); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-interactive-background-hover"><Sparkle size={20} /> Upgrade plan</button></li>
                <li><Link to="/settings" onClick={handleAction} className="flex items-center gap-3 p-2 rounded-lg hover:bg-interactive-background-hover"><Settings size={20} /> Settings</Link></li>
                <hr className="border-border-color my-1" />
                <li><Link to="/help" onClick={handleAction} className="flex items-center gap-3 p-2 rounded-lg hover:bg-interactive-background-hover"><HelpCircle size={20} /> Help</Link></li>
                <li><button onClick={() => { useAppStore.getState().setAppMode(null); handleAction(); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-interactive-background-hover"><LogOut size={20} /> Log out</button></li>
            </ul>
        </div>
    );
};

// --- New Audit Popup Menu ---
const NewAuditMenu: React.FC<{
  onClose: () => void;
  onLinkClick: () => void;
}> = ({ onClose, onLinkClick }) => {
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

    const handleNavigationClick = () => {
        onClose(); // Close the popup menu itself
        onLinkClick(); // Trigger any parent actions, like closing a drawer
    };
    
    return (
        <div ref={menuRef} className="absolute top-full mt-2 left-1 w-72 bg-panel-background border border-border-color rounded-xl shadow-2xl p-2 text-sm animate-fade-in z-50">
            <p className="px-3 py-2 text-xs text-text-secondary font-semibold">Start a new review</p>
            <ul className="space-y-1 text-text-primary">
                <li>
                    <Link to="/co-pilot" onClick={handleNavigationClick} className="flex items-start gap-3 p-3 rounded-lg hover:bg-interactive-background-hover">
                        <Headset size={20} className="mt-1 flex-shrink-0 text-icon-primary" />
                        <div>
                            <p className="font-semibold">Co-Pilot</p>
                            <p className="text-xs text-text-secondary">Get real-time assistance from an AI co-pilot.</p>
                        </div>
                    </Link>
                </li>
                 <li>
                    <Link to="/upload" onClick={handleNavigationClick} className="flex items-start gap-3 p-3 rounded-lg hover:bg-interactive-background-hover">
                        <Upload size={20} className="mt-1 flex-shrink-0 text-icon-primary" />
                        <div>
                            <p className="font-semibold">Upload Files</p>
                            <p className="text-xs text-text-secondary">Upload recordings for asynchronous review.</p>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};


// --- Main Sidebar Component ---
const navItems = [
  { to: '/analytics', icon: BarChart, label: 'Analytics' },
  { to: '/co-pilot', icon: Headset, label: 'Co-Pilot' },
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/reviews', icon: ListChecks, label: 'Reviews' },
];

const NavItem: React.FC<{ item: { to: string; icon: React.ElementType; label: string; }; onClick: () => void; }> = ({ item, onClick }) => {
    const { NavLink } = ReactRouterDOM;
    
    return (
        <li>
            <NavLink
                to={item.to}
                onClick={onClick}
                className={({ isActive }) =>
                `flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-interactive-background-hover text-text-primary' : 'text-text-secondary hover:bg-interactive-background-hover hover:text-text-primary'
                }`
                }
            >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>
            </NavLink>
        </li>
    );
};


const LeftPanel: React.FC = () => {
  const toggleLeftPanelOpen = useAppStore((state) => state.toggleLeftPanelOpen);
  const setIsLeftPanelOpen = useAppStore((state) => state.setIsLeftPanelOpen);
  
  const [isUserPopupMenuOpen, setUserPopupMenuOpen] = useState(false);
  const [isNewAuditMenuOpen, setNewAuditMenuOpen] = useState(false);

  const handleLinkClick = () => {
    // On mobile, close the panel after navigation
    if (window.innerWidth < 1024) {
        setIsLeftPanelOpen(false);
    }
  };

  return (
    <nav className="relative flex flex-col h-full bg-panel-background border-r border-border-color p-3 w-[260px]">
        {/* Logo and App Name */}
        <div className="flex items-center justify-between mb-6 h-10">
            <div className="flex items-center gap-3">
                <Logomark className="w-8 h-8 flex-shrink-0" />
                <span className="text-xl font-bold text-text-primary">VeriClear</span>
            </div>
        </div>

        {/* New Audit Button */}
        <div className="relative px-1 mb-4">
            <button
                onClick={() => setNewAuditMenuOpen(p => !p)}
                aria-haspopup="true"
                aria-expanded={isNewAuditMenuOpen}
                className="flex items-center w-full p-3 rounded-lg text-left font-semibold transition-colors bg-accent-primary text-text-inverted hover:bg-accent-primary-hover"
            >
                <Plus size={20} className="flex-shrink-0" />
                <span className="ml-3 whitespace-nowrap">New Review</span>
            </button>
            {isNewAuditMenuOpen && <NewAuditMenu onClose={() => setNewAuditMenuOpen(false)} onLinkClick={handleLinkClick} />}
        </div>


        {/* Main Navigation */}
        <ul className="flex-1 space-y-1 px-1">
            {navItems.map(item => <NavItem key={item.to} item={item} onClick={handleLinkClick} />)}
        </ul>

        {/* Collapse Button moved to the bottom */}
        <div className="px-1">
            <button
                onClick={toggleLeftPanelOpen}
                aria-label="Collapse sidebar"
                className="flex items-center w-full p-3 rounded-lg transition-colors text-text-secondary hover:bg-interactive-background-hover hover:text-text-primary"
            >
                <ChevronsLeft size={20} className="flex-shrink-0" />
                <span className="ml-3 font-medium whitespace-nowrap">Collapse</span>
            </button>
        </div>

        {/* User Area */}
        <div className="relative">
            <hr className="border-border-color my-2 mx-1"/>
            
            <ul className="space-y-1 px-1">
              <li>
                <button 
                    onClick={() => setUserPopupMenuOpen(p => !p)}
                    aria-haspopup="true"
                    aria-expanded={isUserPopupMenuOpen}
                    className="w-full flex items-center p-3 rounded-lg text-left transition-colors hover:bg-interactive-background-hover">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-blue-500/50 flex items-center justify-center text-blue-300 font-bold">AU</div>
                    <div className="ml-3 overflow-hidden">
                        <p className="font-bold text-sm text-text-primary truncate">Demo User</p>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-text-secondary">Free</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); useAppStore.getState().togglePricingModal(); handleLinkClick(); }} 
                                className="px-2 py-0.5 text-xs font-semibold bg-gray-600 text-gray-200 rounded-full hover:bg-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                Upgrade
                            </button>
                        </div>
                    </div>
                </button>
              </li>
            </ul>

            {isUserPopupMenuOpen && <UserPopupMenu onClose={() => setUserPopupMenuOpen(false)} onActionClick={handleLinkClick} />}
        </div>
    </nav>
  );
};

export default LeftPanel;
