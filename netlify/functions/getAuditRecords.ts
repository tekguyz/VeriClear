import type { BatchAuditRecord } from '../../types';
import { withApiProtection } from '../utils/api';

const mockRecords: BatchAuditRecord[] = [
  {
    id: '1',
    filename: 'Support_Call_Oct23.wav',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    complianceFlag: 'flagged',
    source: 'upload',
    problemSummary: 'Agent missed required disclosure and an upsell opportunity, but resolved the primary issue.',
    callSentiment: 'neutral',
    agentPerformanceScore: 6,
  },
  {
    id: '2',
    filename: 'Co-Pilot_Oct22.mp3',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    complianceFlag: 'passed',
    source: 'co-pilot',
    problemSummary: 'Customer successfully updated their contact information with agent guidance.',
    callSentiment: 'positive',
    agentPerformanceScore: 10,
  },
  {
    id: '3',
    filename: 'Q3_Sales_Ref7821.mp3',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    complianceFlag: 'passed',
    source: 'upload',
    problemSummary: 'The agent successfully addressed all customer concerns regarding billing changes.',
    callSentiment: 'positive',
    agentPerformanceScore: 9,
  },
  {
    id: '4',
    filename: 'Onboarding_NewClient.m4a',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    complianceFlag: 'flagged',
    source: 'upload',
  },
  {
    id: '5',
    filename: 'Complaint_Verification.txt',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    complianceFlag: 'failed',
    source: 'upload',
    problemSummary: 'Agent provided incorrect policy information leading to a compliance failure.',
    callSentiment: 'escalated',
    agentPerformanceScore: 2,
  }
];

export default withApiProtection(async () => {
  // In a real application, you would fetch this from a database.
  return new Response(JSON.stringify({ records: mockRecords }), {
    headers: { 'Content-Type': 'application/json' },
  });
});