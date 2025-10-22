
import { create } from 'zustand';
import type { AuditRecord, ComplianceMetrics, AppView, TimelineEvent, AppMode } from '../types';

interface AppState {
  isLiveMode: boolean;
  isRecording: boolean;
  liveTranscription: string[];
  uploadedFiles: File[];
  currentAnalysis: object | null;
  auditRecords: AuditRecord[];
  complianceMetrics: ComplianceMetrics | null;
  currentView: AppView;
  leftPanelCollapsed: boolean;
  rightPanelVisible: boolean;
  leftPanelDrawerVisible: boolean; // For mobile drawer
  timelineEvents: TimelineEvent[];
  appMode: AppMode;
  isPricingModalVisible: boolean;
  isPaymentModalVisible: boolean;

  // Actions
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setRightPanelVisible: (visible: boolean) => void;
  toggleLeftPanelDrawer: () => void;
  startLiveCall: () => void;
  stopLiveCall: () => void;
  addTranscriptionSegment: (segment: string) => void;
  uploadFile: (file: File) => void;
  fetchAuditRecords: () => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void;
  setAppMode: (mode: 'demo' | 'app' | null) => void;
  resetState: () => void;
  togglePricingModal: () => void;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
}

const getInitialSidebarState = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
        const item = window.localStorage.getItem('vericlear-sidebar-collapsed');
        return item ? JSON.parse(item) : false;
    } catch (error) {
        console.warn('Error reading sidebar state from localStorage', error);
        return false;
    }
};


const mockAuditRecords: AuditRecord[] = [
    { id: '1', timestamp: new Date(), event: 'Disclosure Acknowledged', details: 'Agent confirmed customer understood terms.', status: 'compliant' },
    { id: '2', timestamp: new Date(Date.now() - 2 * 60000), event: 'Sentiment Drop', details: 'Customer sentiment dropped below -0.5.', status: 'warning' },
    { id: '3', timestamp: new Date(Date.now() - 5 * 60000), event: 'Missing Disclosure', details: 'Required privacy disclosure was not read.', status: 'non-compliant' },
    { id: '4', timestamp: new Date(Date.now() - 10 * 60000), event: 'Call Initiated', details: 'Live call started with customer ID 12345.', status: 'compliant' },
];

const mockComplianceMetrics: ComplianceMetrics = {
    overallScore: 85,
    scriptAdherence: 92,
    disclosureAccuracy: 78,
    sentimentAnalysis: 88,
};

const mockTimelineEvents: TimelineEvent[] = [
    {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 1 * 60000),
        type: 'error',
        title: 'Connection Lost',
        details: 'Failed to connect to the live analysis service.',
    },
    {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 3 * 60000),
        type: 'compliance_flag',
        title: 'Disclosure Warning',
        details: 'Agent nearly missed the secondary disclosure statement.',
    },
    {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 5 * 60000),
        type: 'function_call',
        title: 'Function: knowledge_base_lookup',
        details: 'Args: {"query":"return policy"}',
    },
    {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 10 * 60000),
        type: 'system_message',
        title: 'Session Initialized',
        details: 'Mock session data for demonstration.',
    },
];

const initialState = {
  isLiveMode: false,
  isRecording: false,
  liveTranscription: [],
  uploadedFiles: [],
  currentAnalysis: null,
  auditRecords: [],
  complianceMetrics: null,
  currentView: 'dashboard' as AppView,
  leftPanelCollapsed: getInitialSidebarState(),
  rightPanelVisible: false,
  leftPanelDrawerVisible: false,
  timelineEvents: [],
  appMode: null as AppMode,
  isPricingModalVisible: false,
  isPaymentModalVisible: false,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  toggleLeftPanel: () => set((state) => {
    const newCollapsedState = !state.leftPanelCollapsed;
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem('vericlear-sidebar-collapsed', JSON.stringify(newCollapsedState));
        } catch (error) {
            console.warn('Error writing sidebar state to localStorage', error);
        }
    }
    return { leftPanelCollapsed: newCollapsedState };
  }),

  toggleRightPanel: () => set((state) => ({ rightPanelVisible: !state.rightPanelVisible })),
  setRightPanelVisible: (visible: boolean) => set({ rightPanelVisible: visible }),
  toggleLeftPanelDrawer: () => set((state) => ({ leftPanelDrawerVisible: !state.leftPanelDrawerVisible })),
  
  setAppMode: (mode) => {
    if (mode === 'demo') {
      set({ appMode: mode, timelineEvents: mockTimelineEvents, auditRecords: mockAuditRecords, complianceMetrics: mockComplianceMetrics });
    } else {
      set({ appMode: mode, timelineEvents: [], auditRecords: [], complianceMetrics: null });
    }
  },

  startLiveCall: () => set((state) => {
    const startEvent: Omit<TimelineEvent, 'id' | 'timestamp'> = {
        type: 'system_message',
        title: 'Live Call Started',
        details: 'Session initialized and connected to AI.'
    };
    return {
        isLiveMode: true,
        isRecording: true,
        liveTranscription: ['[Call Started]...'],
        timelineEvents: [{ ...startEvent, id: crypto.randomUUID(), timestamp: new Date() }]
    }
  }),
  stopLiveCall: () => set({ isLiveMode: false, isRecording: false }),
  addTranscriptionSegment: (segment) => set((state) => ({ liveTranscription: [...state.liveTranscription, segment] })),
  
  uploadFile: (file) => set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
  
  fetchAuditRecords: () => set({ auditRecords: mockAuditRecords, complianceMetrics: mockComplianceMetrics }),
  
  addTimelineEvent: (event) => set((state) => ({
    timelineEvents: [...state.timelineEvents, { ...event, id: crypto.randomUUID(), timestamp: new Date() }]
  })),

  resetState: () => set(initialState),
  
  togglePricingModal: () => set((state) => ({ isPricingModalVisible: !state.isPricingModalVisible })),
  openPaymentModal: () => set({ isPaymentModalVisible: true, isPricingModalVisible: false }),
  closePaymentModal: () => set({ isPaymentModalVisible: false }),
}));
