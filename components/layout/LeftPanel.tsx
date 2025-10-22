import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Phone, ListChecks, Settings, ChevronsLeft, ChevronsRight, X, HelpCircle } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/live-call', icon: Phone, label: 'Live Call' },
  { to: '/batch-analysis', icon: ListChecks, label: 'Batch Analysis' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/help', icon: HelpCircle, label: 'Help & Documentation' },
];

interface LeftPanelProps {
  isDrawer?: boolean;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ isDrawer = false }) => {
  const { leftPanelCollapsed, toggleLeftPanel, toggleLeftPanelDrawer } = useAppStore();

  const handleLinkClick = () => {
    if (isDrawer) {
      toggleLeftPanelDrawer();
    }
  }

  // In drawer mode, the panel is never "collapsed" visually
  const isCollapsed = isDrawer ? false : leftPanelCollapsed;

  return (
    <nav
      className={`relative flex flex-col h-full bg-panel-background border-r border-border-color p-4 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      <div className={`flex items-center mb-10 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <span className="text-xl font-bold text-text-primary">VeriClear</span>}
        {isDrawer && (
             <button onClick={toggleLeftPanelDrawer} className="text-gray-400 hover:text-white">
                <X size={24} />
            </button>
        )}
      </div>

      <ul className="flex-1 space-y-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-accent-primary text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon size={24} />
              {!isCollapsed && <span className="ml-4 font-medium">{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
      
      {!isDrawer && (
        <div className="mt-auto">
           <button
              onClick={toggleLeftPanel}
              className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-700 hover:text-white ${isCollapsed ? 'justify-center' : ''}`}
          >
              {isCollapsed ? <ChevronsRight size={24} /> : <ChevronsLeft size={24} />}
              {!isCollapsed && <span className="ml-4 font-medium">Collapse</span>}
          </button>
        </div>
      )}

    </nav>
  );
};

export default LeftPanel;