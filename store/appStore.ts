
import { create } from 'zustand';
import type { AppView, TimelineEvent, AppMode, BatchAuditRecord, AnalyticsMetrics } from '../types';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ConfirmDialogState {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface AppState {
  isLiveMode: boolean;
  isRecording: boolean;
  liveTranscription: string[];
  records: BatchAuditRecord[];
  selectedRecordId: string | null;
  currentAnalysis: object | null;
  analyticsMetrics: AnalyticsMetrics | null;
  currentView: AppView;
  isLeftPanelOpen: boolean;
  rightPanelVisible: boolean;
  rightPanelWidth: number;
  timelineEvents: TimelineEvent[];
  appMode: AppMode;
  isPricingModalVisible: boolean;
  isPaymentModalVisible: boolean;
  theme: 'light' | 'dark';
  accentColor: string;
  accentColorHover: string;
  hapticFeedbackEnabled: boolean;
  toast: ToastState | null;
  confirmDialog: ConfirmDialogState;

  toggleLeftPanelOpen: () => void;
  setIsLeftPanelOpen: (isOpen: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelVisible: (visible: boolean) => void;
  setRightPanelWidth: (width: number) => void;
  startLiveCall: () => void;
  stopLiveCall: () => void;
  addTranscriptionSegment: (segment: string) => void;
  setRecords: (records: BatchAuditRecord[]) => void;
  setSelectedRecordId: (id: string | null) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void;
  setAppMode: (mode: 'demo' | 'app' | null) => void;
  resetState: () => void;
  togglePricingModal: () => void;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setAccentColor: (color: string, hoverColor: string) => void;
  toggleHapticFeedback: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: () => void;
  showConfirmDialog: (title: string, message: string, onConfirm: () => void) => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  try {
    const item = window.localStorage.getItem('vericlear-theme');
    return item === 'light' ? 'light' : 'dark'; // Default to dark
  } catch {
    return 'dark';
  }
};

const getInitialLeftPanelState = () => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
const getInitialRightPanelWidth = () => 400;

const demoRecords: BatchAuditRecord[] = [
  {
    id: '1',
    filename: 'Support_Call_Oct23.wav',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    complianceFlag: 'flagged',
    source: 'upload',
    problemSummary: 'Agent missed required disclosure and an upsell opportunity.',
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
    problemSummary: 'Customer successfully updated their contact information.',
    callSentiment: 'positive',
    agentPerformanceScore: 10,
  }
];

const mockAnalyticsMetrics: AnalyticsMetrics = {
    totalCalls: { value: '2', label: 'Total Calls Reviewed', change: 10, changeType: 'increase' },
    complianceRate: { value: '50%', label: 'Pass Rate', change: 5, changeType: 'increase', progress: 50 },
    averageSentiment: { value: 'Neutral', label: 'Average Sentiment', change: 0, changeType: 'neutral' },
    agentPerformance: { value: '8/10', label: 'Agent Performance', change: 0.2, changeType: 'increase' },
    callVolume: [{ date: 'Mon', calls: 5 }],
    complianceTrends: [{ date: 'Jan', passed: 100, flagged: 10, failed: 5 }],
};

const initialState = {
  isLiveMode: false,
  isRecording: false,
  liveTranscription: [],
  records: [],
  selectedRecordId: null,
  currentAnalysis: null,
  analyticsMetrics: null,
  currentView: 'analytics' as AppView,
  isLeftPanelOpen: getInitialLeftPanelState(),
  rightPanelVisible: false,
  rightPanelWidth: getInitialRightPanelWidth(),
  timelineEvents: [],
  appMode: null as AppMode,
  isPricingModalVisible: false,
  isPaymentModalVisible: false,
  theme: getInitialTheme(),
  accentColor: '#4285F4',
  accentColorHover: '#3367D6',
  hapticFeedbackEnabled: false,
  toast: null,
  confirmDialog: {
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setTheme: (theme) => {
    localStorage.setItem('vericlear-theme', theme);
    set({ theme });
  },
  
  setAccentColor: (color, hoverColor) => {
    localStorage.setItem('vericlear-accent-color', color);
    localStorage.setItem('vericlear-accent-color-hover', hoverColor);
    set({ accentColor: color, accentColorHover: hoverColor });
  },
  
  toggleHapticFeedback: () => set((state) => ({ hapticFeedbackEnabled: !state.hapticFeedbackEnabled })),

  toggleLeftPanelOpen: () => set((state) => ({ isLeftPanelOpen: !state.isLeftPanelOpen })),
  setIsLeftPanelOpen: (isOpen) => set({ isLeftPanelOpen: isOpen }),

  toggleRightPanel: () => set((state) => ({ rightPanelVisible: !state.rightPanelVisible })),
  setRightPanelVisible: (visible) => set({ rightPanelVisible: visible }),
  setRightPanelWidth: (width) => set({ rightPanelWidth: Math.max(300, Math.min(800, width)) }),
  
  setAppMode: (mode) => {
    if (mode === 'demo') {
      set({ appMode: mode, records: demoRecords, analyticsMetrics: mockAnalyticsMetrics });
    } else {
      set({ appMode: mode, records: [], analyticsMetrics: null });
    }
  },

  startLiveCall: () => set({ isLiveMode: true, isRecording: true, rightPanelVisible: true }),
  stopLiveCall: () => set({ isLiveMode: false, isRecording: false }),
  addTranscriptionSegment: (segment) => set((state) => ({ liveTranscription: [...state.liveTranscription, segment] })),
  setRecords: (records) => set({ records }),
  setSelectedRecordId: (id) => set({ selectedRecordId: id, rightPanelVisible: id !== null }),
  addTimelineEvent: (event) => set((state) => ({
    timelineEvents: [...state.timelineEvents, { ...event, id: crypto.randomUUID(), timestamp: new Date() }]
  })),
  resetState: () => set(initialState),
  togglePricingModal: () => set((state) => ({ isPricingModalVisible: !state.isPricingModalVisible })),
  openPaymentModal: () => set({ isPaymentModalVisible: true, isPricingModalVisible: false }),
  closePaymentModal: () => set({ isPaymentModalVisible: false }),
  showToast: (message, type = 'success') => set({ toast: { id: Date.now(), message, type } }),
  hideToast: () => set({ toast: null }),
  showConfirmDialog: (title, message, onConfirm) => {
    set({ confirmDialog: { visible: true, title, message, onConfirm: () => { onConfirm(); set({ confirmDialog: initialState.confirmDialog }); }, onCancel: () => set({ confirmDialog: initialState.confirmDialog }) } });
  },
}));
