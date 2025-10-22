
import type { DashboardMetrics } from '../../types';
import { withApiProtection } from '../utils/api';

const handler = async (): Promise<Response> => {
    // In a real application, this data would be aggregated from the 'audit_records'
    // and 'agent_performance' tables in your PostgreSQL database.
    const metrics: DashboardMetrics = {
        totalCalls: {
            value: (1345).toLocaleString(),
            label: 'Total Calls Analyzed',
            change: 2.5,
            changeType: 'increase',
        },
        complianceRate: {
            value: '96.2%',
            label: 'Compliance Rate',
            change: -1.1,
            changeType: 'decrease',
            progress: 96.2,
        },
        averageSentiment: {
            value: 'Positive',
            label: 'Average Sentiment',
            change: 0.5,
            changeType: 'increase',
        },
        agentPerformance: {
            value: '8.7/10',
            label: 'Agent Performance',
            change: 0.0,
            changeType: 'neutral',
        },
        // Mock data for charts
        callVolume: [
            { date: 'Mon', calls: Math.floor(Math.random() * 50) + 100 },
            { date: 'Tue', calls: Math.floor(Math.random() * 50) + 120 },
            { date: 'Wed', calls: Math.floor(Math.random() * 50) + 130 },
            { date: 'Thu', calls: Math.floor(Math.random() * 50) + 150 },
            { date: 'Fri', calls: Math.floor(Math.random() * 50) + 140 },
            { date: 'Sat', calls: Math.floor(Math.random() * 50) + 80 },
            { date: 'Sun', calls: Math.floor(Math.random() * 50) + 70 },
        ],
        complianceTrends: [
            { date: 'Jan', passed: 1200, flagged: 150, failed: 30 },
            { date: 'Feb', passed: 1300, flagged: 120, failed: 25 },
            { date: 'Mar', passed: 1450, flagged: 100, failed: 20 },
            { date: 'Apr', passed: 1400, flagged: 110, failed: 28 },
        ],
    };

    return new Response(JSON.stringify(metrics), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};

export default withApiProtection(handler);
