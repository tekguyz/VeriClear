import React, { useState } from 'react';
import { X, ChevronsRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import AuditChecklist from '../checklist/AuditChecklist';
import NotesTimeline from '../notes/NotesTimeline';

type Tab = 'audit' | 'notes';

const RightPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('audit');

  return (
    <aside className="relative w-full h-full bg-panel-background border-l border-border-color flex flex-col p-6">
      <div role="tablist" aria-label="Audit panel tabs" className="flex border-b border-border-color mb-4">
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

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'audit' && (
            <div id="tabpanel-audit" role="tabpanel" aria-labelledby="tab-audit">
                <AuditChecklist />
            </div>
        )}
        {activeTab === 'notes' && (
            <div id="tabpanel-notes" role="tabpanel" aria-labelledby="tab-notes">
                <NotesTimeline />
            </div>
        )}
      </div>
    </aside>
  );
};

export default RightPanel;