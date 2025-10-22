import { create } from 'zustand';
import type { AuditRecord, ComplianceMetrics, AppView, TimelineEvent, AppMode } from '../types';

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
  uploadedFiles: File[];
  currentAnalysis: object | null;
  auditRecords: AuditRecord[];
  complianceMetrics: ComplianceMetrics | null;
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
  isConfettiVisible: boolean;

  // Actions
  toggleLeftPanelOpen: () => void;
  setIsLeftPanelOpen: (isOpen: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelVisible: (visible: boolean) => void;
  setRightPanelWidth: (width: number) => void;
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
  setTheme: (theme: 'light' | 'dark') => void;
  setAccentColor: (color: string, hoverColor: string) => void;
  toggleHapticFeedback: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: () => void;
  showConfirmDialog: (title: string, message: string, onConfirm: () => void) => void;
  showConfetti: () => void;
}

const getInitialLeftPanelState = (): boolean => {
    if (typeof window === 'undefined') return true;
    try {
        const item = window.localStorage.getItem('vericlear-left-panel-open');
        if (item) {
            return JSON.parse(item);
        }
        // Default to open on desktop, closed on mobile
        return window.innerWidth >= 1024;
    } catch (error) {
        console.warn('Error reading left panel state from localStorage', error);
        return window.innerWidth >= 1024;
    }
};

const getInitialRightPanelWidth = (): number => {
    if (typeof window === 'undefined') return 400;
    try {
        const item = window.localStorage.getItem('vericlear-right-panel-width');
        const width = item ? parseInt(item, 10) : 400;
        // Add constraints to prevent extreme values
        return Math.max(320, Math.min(800, width));
    } catch (error) {
        console.warn('Error reading right panel width from localStorage', error);
        return 400; // A wider default
    }
};


const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'dark';
    try {
        const item = window.localStorage.getItem('vericlear-theme');
        return item === 'light' ? 'light' : 'dark';
    } catch (error) {
        console.warn('Error reading theme from localStorage', error);
        return 'dark';
    }
};

const getInitialAccentColor = (): { color: string, hover: string } => {
    if (typeof window === 'undefined') return { color: '#4285F4', hover: '#3367D6' };
    try {
        const color = window.localStorage.getItem('vericlear-accent-color');
        const hover = window.localStorage.getItem('vericlear-accent-color-hover');
        if (color && hover) {
            return { color, hover };
        }
    } catch (error) {
        console.warn('Error reading accent color from localStorage', error);
    }
    return { color: '#4285F4', hover: '#3367D6' }; // Default Blue
};

const getInitialHapticState = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
        const item = window.localStorage.getItem('vericlear-haptics-enabled');
        return item ? JSON.parse(item) : false;
    } catch (error) {
        console.warn('Error reading haptic state from localStorage', error);
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
        timestamp: new Date(Date.now() - 1 * 60000), // 1 minute ago
        type: 'system_message',
        title: 'AI Suggestion: Upsell',
        details: 'Agent could offer the "Pro-Care" warranty for the customer\'s product.',
    },
    {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 2 * 60000 - 15000), // 2 min 15 sec ago
        type: 'compliance_flag',
        title: 'Missed Disclosure',
        details: 'The agent did not provide the required privacy disclosure statement before ending the call.',
    },
    {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 3 * 60000), // 3 minutes ago
        type: 'function_call',
        title: 'Function: knowledge_base_lookup',
        details: 'Args: {"query":"return policy for model X"}',
    },
    {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 4 * 60000), // 4 minutes ago
        type: 'system_message',
        title: 'Session Initialized',
        details: 'Analysis started for Support_Call_Oct23.wav.',
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
  currentView: 'analytics' as AppView,
  isLeftPanelOpen: getInitialLeftPanelState(),
  rightPanelVisible: false,
  rightPanelWidth: getInitialRightPanelWidth(),
  timelineEvents: [],
  appMode: null as AppMode,
  isPricingModalVisible: false,
  isPaymentModalVisible: false,
  theme: getInitialTheme(),
  accentColor: getInitialAccentColor().color,
  accentColorHover: getInitialAccentColor().hover,
  hapticFeedbackEnabled: getInitialHapticState(),
  toast: null,
  confirmDialog: {
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  },
  isConfettiVisible: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setTheme: (theme) => {
    try {
        window.localStorage.setItem('vericlear-theme', theme);
    } catch (error) {
        console.warn('Error writing theme to localStorage', error);
    }
    set({ theme });
  },
  
  setAccentColor: (color, hoverColor) => {
    try {
        window.localStorage.setItem('vericlear-accent-color', color);
        window.localStorage.setItem('vericlear-accent-color-hover', hoverColor);
    } catch (error) {
        console.warn('Error writing accent color to localStorage', error);
    }
    set({ accentColor: color, accentColorHover: hoverColor });
  },
  
  toggleHapticFeedback: () => set((state) => {
    const newHapticState = !state.hapticFeedbackEnabled;
    try {
        window.localStorage.setItem('vericlear-haptics-enabled', JSON.stringify(newHapticState));
    } catch (error) {
        console.warn('Error writing haptic state to localStorage', error);
    }
    return { hapticFeedbackEnabled: newHapticState };
  }),

  toggleLeftPanelOpen: () => set((state) => {
    const newOpenState = !state.isLeftPanelOpen;
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem('vericlear-left-panel-open', JSON.stringify(newOpenState));
        } catch (error) {
            console.warn('Error writing left panel state to localStorage', error);
        }
    }
    return { isLeftPanelOpen: newOpenState };
  }),
  setIsLeftPanelOpen: (isOpen) => set(() => {
     if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem('vericlear-left-panel-open', JSON.stringify(isOpen));
        } catch (error) {
            console.warn('Error writing left panel state to localStorage', error);
        }
    }
    return { isLeftPanelOpen: isOpen };
  }),

  toggleRightPanel: () => set((state) => ({ rightPanelVisible: !state.rightPanelVisible })),
  setRightPanelVisible: (visible: boolean) => set({ rightPanelVisible: visible }),
  setRightPanelWidth: (width) => {
    const constrainedWidth = Math.max(320, Math.min(800, width));
    try {
        window.localStorage.setItem('vericlear-right-panel-width', constrainedWidth.toString());
    } catch (error) {
        console.warn('Error writing right panel width to localStorage', error);
    }
    set({ rightPanelWidth: constrainedWidth });
  },
  
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
  
  showToast: (message, type = 'success') => set({ toast: { id: Date.now(), message, type } }),
  hideToast: () => set({ toast: null }),
  
  showConfirmDialog: (title, message, onConfirm) => {
    set({
      confirmDialog: {
        visible: true,
        title,
        message,
        onConfirm: () => {
          onConfirm();
          set({ confirmDialog: initialState.confirmDialog });
        },
        onCancel: () => {
          set({ confirmDialog: initialState.confirmDialog });
        },
      },
    });
  },

  showConfetti: () => {
    set({ isConfettiVisible: true });
    // Hide after the animation duration
    setTimeout(() => set({ isConfettiVisible: false }), 4000);
  },
}));