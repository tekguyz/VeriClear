
import type { BatchAuditRecord } from '../../types';
import { withApiProtection } from '../utils/api';

const mockRecords: BatchAuditRecord[] = [
  {
    id: '1',
    filename: 'Q3_Sales_Call_Ref7821.mp3',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    complianceFlag: 'passed',
    problemSummary: 'The agent successfully addressed all customer concerns regarding the new billing cycle changes.',
    callSentiment: 'positive',
    agentPerformanceScore: 9,
  },
  {
    id: '2',
    filename: 'Support_Ticket_9815_Escalation.wav',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    complianceFlag: 'flagged',
    problemSummary: 'Agent missed the required secondary disclosure statement, but customer sentiment remained neutral.',
    callSentiment: 'neutral',
    agentPerformanceScore: 6,
  },
  {
    id: '3',
    filename: 'Onboarding_Session_NewClient.m4a',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    complianceFlag: 'flagged',
  },
    {
    id: '4',
    filename: 'Annual_Review_CorpAccount.pdf',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'failed',
    complianceFlag: 'failed',
    problemSummary: 'Critical processing error during analysis of the provided transcript document.',
  },
   {
    id: '5',
    filename: 'Customer_Complaint_Verification.txt',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    complianceFlag: 'failed',
    problemSummary: 'The agent provided incorrect policy information leading to a compliance failure and customer escalation.',
    callSentiment: 'escalated',
    agentPerformanceScore: 2,
  }
];

export default withApiProtection(async () => {
  // In a real application, you would fetch this from a database.
  // The withApiProtection wrapper will handle errors and headers.
  return new Response(JSON.stringify({ records: mockRecords }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
