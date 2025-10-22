
import React, { useState, useEffect, useRef } from 'react';
import { CheckSquare, Square, Edit3 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: '1', text: 'Verified customer identity', checked: true },
  { id: '2', text: 'Provided required disclosures', checked: true },
  { id: '3', text: 'Addressed primary concern', checked: false },
  { id: '4', text: 'Confirmed resolution with customer', checked: false },
  { id: '5', text: 'Maintained professional tone', checked: true },
];

// For this MVP, we use a static key. In a real app, this would be dynamic
// e.g., `vericlear-checklist-${callId}`
const LOCAL_STORAGE_KEY = 'vericlear-checklist';

const AuditChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_ITEMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const appMode = useAppStore(state => state.appMode);
  const isDemoMode = appMode === 'demo';

  // Load from localStorage on initial render
  useEffect(() => {
    if (isDemoMode) {
      setItems(DEFAULT_ITEMS);
      return;
    }
    try {
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      } else {
        setItems(DEFAULT_ITEMS.map(i => ({...i, checked: false})));
      }
    } catch (error) {
      console.error("Failed to load checklist from localStorage", error);
    }
  }, [isDemoMode]);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isDemoMode) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save checklist to localStorage", error);
    }
  }, [items, isDemoMode]);
  
  // Focus input when editing starts
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleToggleCheck = (id: string) => {
    if (isDemoMode) return;
    setItems(
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleTextChange = (id: string, newText: string) => {
     if (isDemoMode) return;
     setItems(
      items.map(item => (item.id === id ? { ...item, text: newText } : item))
    );
  };
  
  const handleEditBlur = () => {
    setEditingId(null);
  };
  
  const startEditing = (id: string) => {
    if (isDemoMode) return;
    setEditingId(id);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-text-primary">Live Audit Checklist</h3>
      <ul className="space-y-3">
        {items.map(item => (
          <li key={item.id} className="flex items-center group">
            <button onClick={() => handleToggleCheck(item.id)} className="mr-3 flex-shrink-0" disabled={isDemoMode}>
              {item.checked ? (
                <CheckSquare className="text-accent-primary" size={24} />
              ) : (
                <Square className="text-gray-500" size={24} />
              )}
            </button>
            <div className="flex-1">
              {editingId === item.id && !isDemoMode ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={item.text}
                  onChange={(e) => handleTextChange(item.id, e.target.value)}
                  onBlur={handleEditBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleEditBlur()}
                  className="w-full bg-transparent p-1 -m-1 rounded-md text-sm text-text-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
                />
              ) : (
                <span
                  className={`text-sm ${
                    item.checked ? 'text-gray-500 line-through' : 'text-text-primary'
                  }`}
                >
                  {item.text}
                </span>
              )}
            </div>
            <button 
                onClick={() => startEditing(item.id)} 
                className="ml-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-accent-primary disabled:opacity-0"
                aria-label="Edit item"
                disabled={isDemoMode}
            >
              <Edit3 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditChecklist;
