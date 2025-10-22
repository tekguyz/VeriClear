
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppStore } from '../../store/appStore';
import { FunctionSquare, AlertTriangle, XCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import type { TimelineEvent, TimelineEventType } from '../../types';

const MAX_NOTE_LENGTH = 5000;
const LOCAL_STORAGE_KEY = 'vericlear-notes';
const DEMO_NOTE = `This is a note from a previous session. The agent, Alex, did a great job de-escalating the billing issue by proactively offering a loyalty discount. Follow up with marketing to see if this discount can be more widely advertised to at-risk customers.

Key points:
- Customer was unaware their promotional period had ended.
- Agent successfully applied a 15% loyalty discount.
- Customer sentiment shifted from negative to positive.
`;


// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const getEventAppearance = (type: TimelineEventType) => {
    switch (type) {
        case 'function_call':
            return { icon: FunctionSquare, color: 'text-accent-primary' };
        case 'compliance_flag':
            return { icon: AlertTriangle, color: 'text-yellow-500' };
        case 'error':
            return { icon: XCircle, color: 'text-red-500' };
        case 'system_message':
        default:
            return { icon: MessageSquare, color: 'text-gray-400' };
    }
};

const NotesTimeline: React.FC = () => {
    const [note, setNote] = useState('');
    const timelineEvents = useAppStore(state => state.timelineEvents);
    const appMode = useAppStore(state => state.appMode);
    const isDemoMode = appMode === 'demo';
    const debouncedNote = useDebounce(note, 3000); // 3-second debounce

    // Load note from localStorage on initial render or set demo note
    useEffect(() => {
        if (isDemoMode) {
            setNote(DEMO_NOTE);
            return;
        }
        try {
            const storedNote = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedNote) {
                setNote(storedNote);
            } else {
                setNote('');
            }
        } catch (error) {
            console.error("Failed to load notes from localStorage", error);
        }
    }, [isDemoMode]);

    // Auto-save debounced note to localStorage
    useEffect(() => {
        if (isDemoMode) return;
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, debouncedNote);
        } catch (error) {
            console.error("Failed to save notes to localStorage", error);
        }
    }, [debouncedNote, isDemoMode]);

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value.slice(0, MAX_NOTE_LENGTH));
    };
    
    // Memoize sorted events to prevent re-sorting on every render
    const sortedTimelineEvents = useMemo(() => {
        return [...timelineEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [timelineEvents]);


    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Notes Section */}
            <div className="relative mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Notes</h3>
                <textarea
                    value={note}
                    onChange={handleNoteChange}
                    readOnly={isDemoMode}
                    className="w-full h-40 p-3 bg-gray-800/50 rounded-2xl text-sm text-gray-300 placeholder-gray-500 focus:ring-1 focus:ring-accent-primary focus:outline-none resize-none disabled:opacity-70"
                    placeholder={isDemoMode ? "Notes are read-only in demo mode." : "Add notes here... auto-saves after 3 seconds."}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {note.length} / {MAX_NOTE_LENGTH}
                </div>
            </div>

            {/* Timeline Section */}
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Timeline</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {sortedTimelineEvents.length > 0 ? (
                        sortedTimelineEvents.map(event => {
                             const { icon: Icon, color } = getEventAppearance(event.type);
                            return (
                                <div key={event.id} className="flex items-start">
                                    <div className="mr-3 pt-1">
                                       <Icon className={color} size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <p className={`font-semibold text-sm ${color}`}>{event.title}</p>
                                            <p className="text-xs text-gray-500">{format(event.timestamp, 'HH:mm:ss')}</p>
                                        </div>
                                        <p className="text-xs text-gray-400">{event.details}</p>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                         <p className="text-sm text-gray-500 text-center py-4">No events recorded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesTimeline;