import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, RefreshCw, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow, subDays } from 'date-fns';
import type { BatchAuditRecord, AnalysisStatus, ComplianceStatus } from '../../types';
import { analysisStatuses, complianceStatuses } from '../../types';

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

const FileManager: React.FC = () => {
    const [records, setRecords] = useState<BatchAuditRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<AnalysisStatus | 'all'>('all');
    const [complianceFilter, setComplianceFilter] = useState<ComplianceStatus | 'all'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | '24h' | '7d' | '30d'>('all');

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

    const filteredRecords = useMemo(() => {
        const now = new Date();
        return records.filter(record => {
            const searchMatch = record.filename.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const statusMatch = statusFilter === 'all' || record.status === statusFilter;
            const complianceMatch = complianceFilter === 'all' || record.complianceFlag === complianceFilter;

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

            return searchMatch && statusMatch && complianceMatch && dateMatch;
        });
    }, [records, debouncedSearchTerm, statusFilter, complianceFilter, dateFilter]);

    return (
        <div className="bg-panel-background border border-border-color rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">File Manager</h3>
                 <button onClick={fetchRecords} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by filename..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800/50 border border-border-color rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none"
                    />
                </div>
                <div className="flex gap-3">
                    <select value={dateFilter} onChange={e => setDateFilter(e.target.value as any)} className="flex-1 bg-gray-800/50 border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none">
                        <option value="all">All Dates</option>
                        <option value="24h">Last 24 hours</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="flex-1 bg-gray-800/50 border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none">
                        <option value="all">All Statuses</option>
                        {analysisStatuses.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                     <select value={complianceFilter} onChange={e => setComplianceFilter(e.target.value as any)} className="flex-1 bg-gray-800/50 border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none">
                        <option value="all">All Compliance</option>
                        {complianceStatuses.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {loading && <p className="text-center text-gray-400">Loading records...</p>}
                {error && <p className="text-center text-red-400">{error}</p>}
                {!loading && !error && (
                    <ul className="space-y-3">
                        {filteredRecords.length > 0 ? filteredRecords.map(record => (
                            <li key={record.id} className="bg-gray-800/50 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-medium text-sm truncate" title={record.filename}>{record.filename}</p>
                                    <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeClass(record.status)}`}>{record.status}</span>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getComplianceBadgeClass(record.complianceFlag)}`}>{record.complianceFlag}</span>
                                    <button className="text-gray-400 hover:text-white"><MoreHorizontal size={18} /></button>
                                </div>
                            </li>
                        )) : <p className="text-center text-gray-400">No records found.</p>}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FileManager;