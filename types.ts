
import { z } from 'zod';

export interface AuditRecord {
  id: string;
  timestamp: Date;
  event: string;
  details: string;
  status: 'compliant' | 'warning' | 'non-compliant';
}

export interface ComplianceMetrics {
  overallScore: number;
  scriptAdherence: number;
  disclosureAccuracy: number;
  sentimentAnalysis: number;
}

export type AppView = 'dashboard' | 'live' | 'batch' | 'settings';
export type AppMode = 'demo' | 'app' | null;


// Types for Batch Analysis
export const callSentimentSchema = z.enum(['positive', 'neutral', 'negative', 'escalated']);
export type CallSentiment = z.infer<typeof callSentimentSchema>;

export const auditRecordSchema = z.object({
  problem_summary: z.string().min(50, { message: "Summary must be at least 50 characters." }).max(200, { message: "Summary must be at most 200 characters." }),
  solution_steps: z.array(z.string()),
  compliance_flag: z.boolean(),
  call_sentiment: callSentimentSchema,
  agent_performance_score: z.number().min(1).max(10),
});

export type GeminiAuditRecord = z.infer<typeof auditRecordSchema>;

export type AnalysisStatus = 'pending' | 'completed' | 'failed';
export const analysisStatuses: AnalysisStatus[] = ['pending', 'completed', 'failed'];

export type ComplianceStatus = 'passed' | 'failed' | 'flagged';
// Fix: Corrected the type from the variable name `complianceStatuses` to the type name `ComplianceStatus`.
export const complianceStatuses: ComplianceStatus[] = ['passed', 'failed', 'flagged'];


export interface BatchAuditRecord {
  id: string;
  filename: string;
  createdAt: string; // ISO string
  status: AnalysisStatus;
  complianceFlag: ComplianceStatus;
  problemSummary?: string;
  solutionSteps?: string[];
  callSentiment?: CallSentiment;
  agentPerformanceScore?: number;
}

export interface UploadedFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'analyzing' | 'completed' | 'failed';
  error?: string;
}

// Types for Live Call Analysis
export type TranscriptSpeaker = 'customer' | 'agent' | 'system';

export interface TranscriptSegment {
  id: string;
  speaker: TranscriptSpeaker;
  text: string;
  isFinal: boolean;
}

// Types for Timeline Events
export type TimelineEventType = 'function_call' | 'compliance_flag' | 'error' | 'system_message';

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: TimelineEventType;
  title: string;
  details: string;
}

// Types for Analytics Dashboard
export interface MetricCardData {
  value: string;
  label: string;
  change: number; // Percentage change
  changeType: 'increase' | 'decrease' | 'neutral';
  progress?: number; // Optional progress for rings (0-100)
}

export interface ChartDataPoint {
  date: string;
  [key: string]: number | string;
}

export interface DashboardMetrics {
  totalCalls: MetricCardData;
  complianceRate: MetricCardData;
  averageSentiment: MetricCardData;
  agentPerformance: MetricCardData;
  callVolume: ChartDataPoint[];
  complianceTrends: ChartDataPoint[];
}
