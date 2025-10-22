import type { AnalyticsMetrics } from '../../types';
import { withApiProtection } from '../utils/api';

const handler = async (): Promise<Response> => {
    // In a real application, this data would be aggregated from a database.
    // These metrics are now aligned with the new mock data in getAuditRecords.ts
    const metrics: AnalyticsMetrics = {
        totalCalls: {
            value: '5',
            label: 'Total Calls Reviewed',
            change: 12.5, // Mock change
            changeType: 'increase',
        },
        complianceRate: {
            value: '40%', // 2 passed out of 5 total records
            label: 'Pass Rate',
            change: -5.2, // Mock change
            changeType: 'decrease',
            progress: 40,
        },
        averageSentiment: {
            value: 'Neutral',
            label: 'Average Sentiment',
            change: -2.1,
            changeType: 'decrease',
        },
        agentPerformance: {
            value: '6.8/10',
            label: 'Agent Performance',
            change: 0.5,
            changeType: 'increase',
        },
        // Mock data for charts
        callVolume: [
            { date: 'Mon', calls: Math.floor(Math.random() * 2) + 1 },
            { date: 'Tue', calls: Math.floor(Math.random() * 2) + 2 },
            { date: 'Wed', calls: Math.floor(Math.random() * 2) + 1 },
            { date: 'Thu', calls: Math.floor(Math.random() * 2) + 3 },
            { date: 'Fri', calls: Math.floor(Math.random() * 2) + 2 },
            { date: 'Sat', calls: Math.floor(Math.random() * 2) + 0 },
            { date: 'Sun', calls: Math.floor(Math.random() * 2) + 1 },
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