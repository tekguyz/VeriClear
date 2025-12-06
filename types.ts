


import { z } from 'zod';

export type AppView = 'analytics' | 'co-pilot' | 'batch' | 'settings';
export type AppMode = 'demo' | 'app' | null;


// Types for Batch Analysis
export const callSentimentSchema = z.enum(['positive', 'neutral', 'negative', 'escalated']);
export type CallSentiment = z.infer<typeof callSentimentSchema>;

export const auditRecordSchema = z.object({
  problem_summary: z.string().min(10, { message: "Summary must be at least 10 characters." }).max(200, { message: "Summary must be at most 200 characters." }),
  solution_steps: z.array(z.string()),
  compliance_flag: z.boolean(),
  call_sentiment: callSentimentSchema,
  agent_performance_score: z.number().min(1).max(10),
});

export type GeminiAuditRecord = z.infer<typeof auditRecordSchema>;

export type AnalysisStatus = 'pending' | 'completed' | 'failed';
export const analysisStatuses: AnalysisStatus[] = ['pending', 'completed', 'failed'];

export type ComplianceStatus = 'passed' | 'failed' | 'flagged';
export const complianceStatuses: ComplianceStatus[] = ['passed', 'failed', 'flagged'];


export interface BatchAuditRecord {
  id: string;
  filename: string;
  createdAt: string; // ISO string
  status: AnalysisStatus;
  complianceFlag: ComplianceStatus;
  source: 'upload' | 'co-pilot';
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

// Types for Analytics
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

export interface AnalyticsMetrics {
  totalCalls: MetricCardData;
  complianceRate: MetricCardData;
  averageSentiment: MetricCardData;
  agentPerformance: MetricCardData;
  callVolume: ChartDataPoint[];
  complianceTrends: ChartDataPoint[];
}