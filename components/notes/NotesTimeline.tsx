import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAppStore } from '../../store/appStore';
import { FunctionSquare, AlertTriangle, XCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import type { TimelineEvent, TimelineEventType } from '../../types';

const MAX_NOTE_LENGTH = 5000;
const LOCAL_STORAGE_KEY = 'vericlear-notes';
const NOTE_HEIGHT_KEY = 'vericlear-notes-height';
const DEMO_NOTE = `Review of Support_Call_Oct23.wav:

The agent, Alex, successfully resolved the customer's primary billing issue by proactively offering a loyalty discount. Customer sentiment was positive at the end of the call.

However, the AI flagged two key misses that require follow-up coaching:
1.  **Missed Disclosure:** The required privacy disclosure was not provided (see timeline event at 02:15). This is a critical compliance failure.
2.  **Missed Upsell:** A clear opportunity to upsell the 'Pro-Care' warranty was missed (see AI suggestion at 01:00).

Action Item: Schedule a coaching session with Alex to review these two points.
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
            return { icon: FunctionSquare, color: 'text-text-accent' };
        case 'compliance_flag':
            return { icon: AlertTriangle, color: 'text-yellow-500' };
        case 'error':
            return { icon: XCircle, color: 'text-red-500' };
        case 'system_message':
        default:
            return { icon: MessageSquare, color: 'text-icon-primary' };
    }
};

const DemoNoteDisplay: React.FC<{ height: number }> = ({ height }) => (
    <div style={{ height: `${height}px` }} className="w-full p-3 bg-input-background rounded-2xl text-sm text-text-primary overflow-y-auto thin-scrollbar">
        {DEMO_NOTE.split('\n').map((line, i) => {
            // Split line by the bold markdown syntax
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={i} className="mb-2 last:mb-0">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-text-primary font-semibold">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        })}
    </div>
);

const NotesTimeline: React.FC = () => {
    const [note, setNote] = useState('');
    const [noteHeight, setNoteHeight] = useState(250); // Taller default height
    const timelineEvents = useAppStore(state => state.timelineEvents);
    const appMode = useAppStore(state => state.appMode);
    const isDemoMode = appMode === 'demo';
    const debouncedNote = useDebounce(note, 3000);
    const notesRef = useRef<HTMLDivElement>(null);

    // Load note and height from localStorage on initial render
    useEffect(() => {
        if (isDemoMode) {
            setNote(DEMO_NOTE);
            return;
        }
        try {
            const storedNote = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedNote) setNote(storedNote);
            
            const storedHeight = localStorage.getItem(NOTE_HEIGHT_KEY);
            if (storedHeight) setNoteHeight(Math.max(100, Math.min(600, parseInt(storedHeight, 10))));

        } catch (error) {
            console.error("Failed to load notes from localStorage", error);
        }
    }, [isDemoMode]);

    // Auto-save debounced note and height to localStorage
    useEffect(() => {
        if (isDemoMode) return;
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, debouncedNote);
            localStorage.setItem(NOTE_HEIGHT_KEY, noteHeight.toString());
        } catch (error) {
            console.error("Failed to save notes to localStorage", error);
        }
    }, [debouncedNote, noteHeight, isDemoMode]);

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value.slice(0, MAX_NOTE_LENGTH));
    };

    const handleResizeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        document.body.style.cursor = 'row-resize';
        const startY = e.clientY;
        const startHeight = notesRef.current?.clientHeight || noteHeight;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newHeight = startHeight + (moveEvent.clientY - startY);
            setNoteHeight(Math.max(100, Math.min(600, newHeight)));
        };
        const handleMouseUp = () => {
            document.body.style.cursor = '';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [noteHeight]);
    
    // Memoize sorted events to prevent re-sorting on every render
    const sortedTimelineEvents = useMemo(() => {
        return [...timelineEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [timelineEvents]);


    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Notes Section */}
            <div className="relative mb-6 flex-shrink-0">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Notes</h3>
                 <div ref={notesRef} className="relative">
                    {isDemoMode ? (
                        <DemoNoteDisplay height={noteHeight} />
                    ) : (
                        <textarea
                            value={note}
                            onChange={handleNoteChange}
                            style={{ height: `${noteHeight}px` }}
                            className="w-full p-3 bg-input-background rounded-2xl text-sm text-text-primary placeholder:text-text-placeholder focus:ring-1 focus:ring-accent-primary focus:outline-none resize-none disabled:opacity-70 thin-scrollbar"
                            placeholder="Add notes here... auto-saves after 3 seconds."
                        />
                    )}
                    <div className="absolute bottom-3 right-3 text-xs text-text-secondary bg-input-background/50 backdrop-blur-sm px-1 rounded">
                        {note.length} / {MAX_NOTE_LENGTH}
                    </div>
                </div>
                <div 
                    onMouseDown={handleResizeMouseDown}
                    className="w-full h-2 cursor-row-resize flex items-center justify-center group"
                >
                    <div className="w-10 h-1 bg-border-color rounded-full group-hover:bg-accent-primary transition-colors"></div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="flex-1 min-h-0 flex flex-col">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex-shrink-0">Timeline</h3>
                <div className="flex-1 overflow-y-auto pr-2 thin-scrollbar">
                    {sortedTimelineEvents.length > 0 ? (
                        sortedTimelineEvents.map(event => {
                             const { icon: Icon, color } = getEventAppearance(event.type);
                            return (
                                <div key={event.id} className="flex items-start mb-4 last:mb-0">
                                    <div className="mr-3 pt-1">
                                       <Icon className={color} size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <p className={`font-semibold text-sm ${color}`}>{event.title}</p>
                                            <p className="text-xs text-text-secondary">{format(event.timestamp, 'HH:mm:ss')}</p>
                                        </div>
                                        <p className="text-xs text-text-secondary">{event.details}</p>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                         <p className="text-sm text-text-secondary text-center py-4">No events recorded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesTimeline;