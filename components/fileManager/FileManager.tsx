


import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, RefreshCw, MoreHorizontal, X, Headset, FileUp } from 'lucide-react';
import { formatDistanceToNow, subDays } from 'date-fns';
import type { BatchAuditRecord, AnalysisStatus, ComplianceStatus } from '../../types';
import { analysisStatuses, complianceStatuses } from '../../types';
import InfoPopover from '../common/InfoPopover';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const getStatusBadgeClass = (status: AnalysisStatus) => {
    switch (status) {
        case 'completed': return 'bg-green-500/20 text-green-400';
        case 'pending': return 'bg-yellow-500/20 text-yellow-400';
        case 'failed': return 'bg-red-500/20 text-red-400';
        default: return 'bg-gray-500/20 text-gray-400';
    }
};

const getComplianceBadgeClass = (flag: ComplianceStatus) => {
    switch (flag) {
        case 'passed': return 'bg-blue-500/20 text-blue-400';
        case 'flagged': return 'bg-orange-500/20 text-orange-400';
        case 'failed': return 'bg-purple-500/20 text-purple-400';
        default: return 'bg-gray-500/20 text-gray-400';
    }
};

const FilterPanel: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    dateFilter: string;
    setDateFilter: (val: any) => void;
    statusFilter: string;
    setStatusFilter: (val: any) => void;
    complianceFilter: string;
    setComplianceFilter: (val: any) => void;
    sourceFilter: string;
    setSourceFilter: (val: any) => void;
}> = ({ isOpen, onClose, dateFilter, setDateFilter, statusFilter, setStatusFilter, complianceFilter, setComplianceFilter, sourceFilter, setSourceFilter }) => {
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div
                className={`fixed bottom-0 left-0 right-0 bg-panel-background border-t border-border-color rounded-t-2xl p-6 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-semibold">Filter Records</h4>
                    <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary">
                        <X size={24} />
                    </button>
                </div>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-text-secondary mb-1 block">Source</label>
                        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="w-full bg-input-background border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none">
                            <option value="all">All Sources</option>
                            <option value="co-pilot">Co-Pilot Session</option>
                            <option value="upload">Upload</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-text-secondary mb-1 block">Date Range</label>
                        <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full bg-input-background border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none">
                            <option value="all">All Dates</option>
                            <option value="24h">Last 24 hours</option>
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-text-secondary mb-1 block">Analysis Status</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-input-background border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none">
                            <option value="all">All Statuses</option>
                            {analysisStatuses.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-text-secondary mb-1 block">Result</label>
                        <select value={complianceFilter} onChange={e => setComplianceFilter(e.target.value)} className="w-full bg-input-background border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none">
                            <option value="all">All Results</option>
                            {complianceStatuses.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
};

const FileManager: React.FC = () => {
    const [records, setRecords] = useState<BatchAuditRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<AnalysisStatus | 'all'>('all');
    const [complianceFilter, setComplianceFilter] = useState<ComplianceStatus | 'all'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | '24h' | '7d' | '30d'>('all');
    const [sourceFilter, setSourceFilter] = useState<'all' | 'co-pilot' | 'upload'>('all');
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fetchRecords = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/.netlify/functions/getAuditRecords');
            if (!response.ok) throw new Error('Failed to fetch records.');
            const data = await response.json();
            setRecords(data.records);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);
    
    const areFiltersActive = dateFilter !== 'all' || statusFilter !== 'all' || complianceFilter !== 'all' || sourceFilter !== 'all';

    const filteredRecords = useMemo(() => {
        const now = new Date();
        return records.filter(record => {
            const searchMatch = record.filename.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const statusMatch = statusFilter === 'all' || record.status === statusFilter;
            const complianceMatch = complianceFilter === 'all' || record.complianceFlag === complianceFilter;
            const sourceMatch = sourceFilter === 'all' || record.source === sourceFilter;

            const recordDate = new Date(record.createdAt);
            const dateMatch = (() => {
                switch (dateFilter) {
                    case '24h': return recordDate > subDays(now, 1);
                    case '7d': return recordDate > subDays(now, 7);
                    case '30d': return recordDate > subDays(now, 30);
                    case 'all':
                    default:
                      return true;
                }
            })();

            return searchMatch && statusMatch && complianceMatch && dateMatch && sourceMatch;
        });
    }, [records, debouncedSearchTerm, statusFilter, complianceFilter, dateFilter, sourceFilter]);

    return (
        <div className="bg-panel-background border border-border-color rounded-2xl p-4 md:p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">All Reviews</h3>
                 <button onClick={fetchRecords} className="p-2 text-text-secondary hover:text-text-primary hover:bg-interactive-background-hover rounded-full transition-colors">
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" size={18} />
                    <input
                        type="text"
                        placeholder="Search by filename..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-input-background border border-border-color rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none placeholder:text-text-placeholder"
                    />
                </div>
                <button onClick={() => setIsFilterPanelOpen(true)} className="relative flex-shrink-0 flex items-center justify-center md:justify-start gap-2 px-4 py-2 bg-input-background border border-border-color rounded-lg text-sm text-text-primary hover:border-gray-500 transition-colors">
                    <SlidersHorizontal size={16} />
                    <span className="hidden md:inline">Filters</span>
                    {areFiltersActive && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-primary rounded-full border-2 border-panel-background"></div>}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                 {loading && <p className="text-center text-text-secondary py-8">Loading records...</p>}
                {error && <p className="text-center text-red-400 py-8">{error}</p>}
                {!loading && !error && (
                    <>
                        {/* --- Mobile Card View --- */}
                        <div className="space-y-3 md:hidden">
                           {filteredRecords.length > 0 ? filteredRecords.map(record => (
                                <div key={record.id} className="bg-subtle-background rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex-shrink-0">
                                                {record.source === 'co-pilot'
                                                    ? <Headset size={24} className="text-icon-primary" title="Co-Pilot Session" />
                                                    : <FileUp size={24} className="text-icon-primary" title="File Upload" />
                                                }
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-medium text-sm truncate" title={record.filename}>{record.filename}</p>
                                                <p className="text-xs text-text-secondary">{formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}</p>
                                            </div>
                                        </div>
                                         <button className="flex-shrink-0 p-1 -mr-1 text-text-secondary hover:text-text-primary"><MoreHorizontal size={20} /></button>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                         <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadgeClass(record.status)}`}>{record.status}</span>
                                         <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getComplianceBadgeClass(record.complianceFlag)}`}>{record.complianceFlag}</span>
                                    </div>
                                </div>
                           )) : <p className="text-center text-text-secondary py-8">No records found.</p>}
                        </div>

                        {/* --- Desktop Table View --- */}
                        <table className="hidden md:table w-full text-sm">
                            <thead className="text-xs text-text-secondary font-semibold">
                                <tr className="border-b border-border-color">
                                    <th className="text-left font-semibold p-3">File</th>
                                    <th className="w-24 text-center font-semibold p-3">Source</th>
                                    <th className="w-40 text-left font-semibold p-3">Created</th>
                                    <th className="w-28 text-center font-semibold p-3">Status</th>
                                    <th className="w-28 text-center font-semibold p-3 flex items-center justify-center gap-1">
                                        <span>Result</span>
                                        <InfoPopover content={
                                        <div className="space-y-2">
                                            <p><span className="font-bold text-blue-400">Passed:</span> The call met all quality standards.</p>
                                            <p><span className="font-bold text-orange-400">Flagged:</span> A potential issue was detected for review.</p>
                                            <p><span className="font-bold text-purple-400">Failed:</span> A clear issue or error was found.</p>
                                        </div>
                                        } />
                                    </th>
                                    <th className="w-10 text-center font-semibold p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.length > 0 ? filteredRecords.map(record => (
                                     <tr key={record.id} className="hover:bg-interactive-background-hover">
                                        <td className="p-3">
                                            <p className="font-medium truncate" title={record.filename}>{record.filename}</p>
                                        </td>
                                        <td className="p-3 text-center">
                                            {record.source === 'co-pilot'
                                                ? <Headset size={18} className="text-icon-primary inline-block" title="Co-Pilot Session" />
                                                : <FileUp size={18} className="text-icon-primary inline-block" title="File Upload" />
                                            }
                                        </td>
                                        <td className="p-3 text-text-secondary">{formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}</td>
                                        <td className="p-3 text-center">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeClass(record.status)}`}>{record.status}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getComplianceBadgeClass(record.complianceFlag)}`}>{record.complianceFlag}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button className="text-text-secondary hover:text-text-primary"><MoreHorizontal size={18} /></button>
                                        </td>
                                     </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="text-center text-text-secondary py-8">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
            <FilterPanel 
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                complianceFilter={complianceFilter}
                setComplianceFilter={setComplianceFilter}
                sourceFilter={sourceFilter}
                setSourceFilter={setSourceFilter}
            />
        </div>
    );
};

export default FileManager;