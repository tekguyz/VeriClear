
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import AuditChecklist from '../checklist/AuditChecklist';
import NotesTimeline from '../notes/NotesTimeline';

type Tab = 'audit' | 'notes';

const RightPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('audit');
  const { toggleRightPanel } = useAppStore();

  return (
    <aside className="w-full h-full bg-panel-background border-l border-border-color flex flex-col p-6">
       <button onClick={toggleRightPanel} className="absolute top-4 right-4 text-gray-400 hover:text-white xl:hidden">
        <X size={24} />
      </button>

      <div className="flex border-b border-border-color mb-4">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'audit' ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-gray-400'
          }`}
        >
          Audit Checklist
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'notes' ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-gray-400'
          }`}
        >
          Notes & Timeline
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'audit' && <AuditChecklist />}
        {activeTab === 'notes' && <NotesTimeline />}
      </div>
    </aside>
  );
};

export default RightPanel;