import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import AuditChecklist from '../checklist/AuditChecklist';
import NotesTimeline from '../notes/NotesTimeline';

type Tab = 'audit' | 'notes';

const RightPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('notes');
  const { toggleRightPanel, setRightPanelWidth } = useAppStore(state => ({
      toggleRightPanel: state.toggleRightPanel,
      setRightPanelWidth: state.setRightPanelWidth
  }));

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    document.body.style.cursor = 'col-resize';

    const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = window.innerWidth - moveEvent.clientX;
        setRightPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [setRightPanelWidth]);


  return (
    <aside className="relative w-full h-full bg-panel-background border-l border-border-color flex flex-col">
      <div 
        onMouseDown={handleMouseDown}
        className="absolute top-0 left-0 -translate-x-1/2 h-full w-2 cursor-col-resize z-10 group"
      >
        <div className="w-0.5 h-full bg-transparent group-hover:bg-accent-primary transition-colors duration-200 mx-auto"></div>
      </div>
      <div className="p-6 flex flex-col h-full">
        {/* --- Mobile Header with Close Button --- */}
        <div className="flex items-center justify-between mb-4 xl:hidden flex-shrink-0">
            <h2 className="text-lg font-semibold">Audit Panel</h2>
            <button onClick={toggleRightPanel} className="p-1 text-text-secondary hover:text-text-primary" aria-label="Close audit panel">
                <X size={24} />
            </button>
        </div>

        <div role="tablist" aria-label="Audit panel tabs" className="flex-shrink-0 flex border-b border-border-color mb-4">
          <button
            id="tab-audit"
            role="tab"
            aria-selected={activeTab === 'audit'}
            aria-controls="tabpanel-audit"
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === 'audit' ? 'text-text-accent border-b-2 border-accent-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Audit Checklist
          </button>
          <button
            id="tab-notes"
            role="tab"
            aria-selected={activeTab === 'notes'}
            aria-controls="tabpanel-notes"
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === 'notes' ? 'text-text-accent border-b-2 border-accent-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Notes & Timeline
          </button>
        </div>

        <div className="flex-1 min-h-0">
          {activeTab === 'audit' && (
              <div id="tabpanel-audit" role="tabpanel" aria-labelledby="tab-audit" className="h-full overflow-y-auto">
                  <AuditChecklist />
              </div>
          )}
          {activeTab === 'notes' && (
              <div id="tabpanel-notes" role="tabpanel" aria-labelledby="tab-notes" className="h-full">
                  <NotesTimeline />
              </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;