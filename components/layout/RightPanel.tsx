

import React, { useState, useCallback, useMemo } from 'react';
import { X, FileText, CheckCircle, AlertTriangle, AlertCircle as AlertCircleIcon, Smile, Meh, Frown, ChevronsUp } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import AuditChecklist from '../checklist/AuditChecklist';
import NotesTimeline from '../notes/NotesTimeline';
import type { BatchAuditRecord, CallSentiment, ComplianceStatus } from '../../types';
import { format } from 'date-fns';

type Tab = 'audit' | 'notes';

const LiveCallView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('notes');
    return (
        <div className="p-6 flex flex-col h-full">
            <div role="tablist" aria-label="Audit panel tabs" className="flex-shrink-0 flex border-b border-border-color mb-4">
                <button
                    id="tab-audit"
                    role="tab"
                    aria-selected={activeTab === 'audit'}
                    aria-controls="tabpanel-audit"
                    onClick={() => setActiveTab('audit')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'audit' ? 'text-text-accent border-b-2 border-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    Audit Checklist
                </button>
                <button
                    id="tab-notes"
                    role="tab"
                    aria-selected={activeTab === 'notes'}
                    aria-controls="tabpanel-notes"
                    onClick={() => setActiveTab('notes')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'notes' ? 'text-text-accent border-b-2 border-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}
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
    );
};

const getComplianceInfo = (flag: ComplianceStatus) => {
    switch (flag) {
        case 'passed': return { Icon: CheckCircle, color: 'text-blue-400', label: 'Passed' };
        case 'flagged': return { Icon: AlertTriangle, color: 'text-orange-400', label: 'Flagged' };
        case 'failed': return { Icon: AlertCircleIcon, color: 'text-purple-400', label: 'Failed' };
        default: return { Icon: AlertTriangle, color: 'text-icon-primary', label: 'Unknown' };
    }
};

const getSentimentInfo = (sentiment?: CallSentiment) => {
    switch (sentiment) {
        case 'positive': return { Icon: Smile, color: 'text-green-400', label: 'Positive' };
        case 'neutral': return { Icon: Meh, color: 'text-gray-400', label: 'Neutral' };
        case 'negative': return { Icon: Frown, color: 'text-yellow-400', label: 'Negative' };
        case 'escalated': return { Icon: ChevronsUp, color: 'text-red-400', label: 'Escalated' };
        default: return { Icon: Meh, color: 'text-icon-primary', label: 'N/A' };
    }
};

const RecordDetailView: React.FC<{ record: BatchAuditRecord }> = ({ record }) => {
    const setSelectedRecordId = useAppStore(state => state.setSelectedRecordId);
    const Compliance = getComplianceInfo(record.complianceFlag);
    const Sentiment = getSentimentInfo(record.callSentiment);

    return (
        <div className="flex flex-col h-full">
             <div className="p-4 border-b border-border-color flex-shrink-0">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <FileText size={24} className="text-icon-primary flex-shrink-0" />
                        <div className="flex-1 overflow-hidden">
                            <h2 className="text-md font-semibold truncate" title={record.filename}>{record.filename}</h2>
                            <p className="text-xs text-text-secondary">Created {format(new Date(record.createdAt), 'PPp')}</p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedRecordId(null)} className="p-1 text-text-secondary hover:text-text-primary xl:hidden" aria-label="Close details">
                        <X size={24} />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div>
                        <p className="text-xs text-text-secondary font-semibold">SCORE</p>
                        <p className="text-lg font-bold">{record.agentPerformanceScore ?? 'N/A'}/10</p>
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary font-semibold">RESULT</p>
                        <div className={`flex items-center justify-center gap-1.5 text-lg font-bold ${Compliance.color}`}>
                            <Compliance.Icon size={16} />
                            <span>{Compliance.label}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary font-semibold">SENTIMENT</p>
                        <div className={`flex items-center justify-center gap-1.5 text-lg font-bold ${Sentiment.color}`}>
                            <Sentiment.Icon size={16} />
                            <span>{Sentiment.label}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 border-b border-border-color flex-shrink-0">
                <h3 className="text-sm font-semibold mb-2">Problem Summary</h3>
                <p className="text-sm text-text-secondary">{record.problemSummary || "No summary available."}</p>
            </div>
            <div className="flex-1 min-h-0">
                <NotesTimeline />
            </div>
        </div>
    );
};

const RightPanel: React.FC = () => {
    // FIX: Select state individually to prevent referential instability which causes infinite re-renders
    const isLiveMode = useAppStore(state => state.isLiveMode);
    const selectedRecordId = useAppStore(state => state.selectedRecordId);
    const records = useAppStore(state => state.records);
    const setRightPanelWidth = useAppStore(state => state.setRightPanelWidth);

    const selectedRecord = useMemo(() => records.find(r => r.id === selectedRecordId), [records, selectedRecordId]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        document.body.style.cursor = 'col-resize';

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = window.innerWidth - moveEvent.clientX;
            // Debouncing or throttling could be added here if performance is an issue, 
            // but for UI resizing, rAF or direct updates usually feel smoothest.
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
                aria-hidden="true"
            >
                <div className="w-0.5 h-full bg-transparent group-hover:bg-accent-primary transition-colors duration-200 mx-auto"></div>
            </div>

            {isLiveMode && <LiveCallView />}
            {!isLiveMode && selectedRecord && <RecordDetailView record={selectedRecord} />}
            {!isLiveMode && !selectedRecord && (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary p-8 text-center">
                    <FileText size={48} className="mb-4 opacity-20" />
                    <p>Select a recording to view details or start a Co-Pilot session.</p>
                </div>
            )}
        </aside>
    );
};

export default RightPanel;
