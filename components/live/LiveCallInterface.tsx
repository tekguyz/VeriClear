
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, PhoneOff, Bot, User, AlertCircle, Phone, Video, X, Info, CaseSensitive, Maximize, Minimize, ScreenShare } from 'lucide-react';
import { GoogleGenAI, FunctionDeclaration, Type, Modality, LiveServerMessage } from '@google/genai';
import type { TranscriptSegment, TranscriptSpeaker } from '../../types';
import { useAppStore } from '../../store/appStore';
import AudioVisualizer from './AudioVisualizer';

type CallState = 'idle' | 'connecting' | 'active' | 'error';
const MAX_CALL_DURATION_SECONDS = 900; // 15 minutes

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const functionDeclarations: FunctionDeclaration[] = [
    { name: 'knowledge_base_lookup', description: "Search internal resources for information.", parameters: { type: Type.OBJECT, properties: { query: { type: Type.STRING, description: "The search query." } }, required: ["query"] } },
    { name: 'compliance_check', description: "Verify if a statement adheres to compliance requirements.", parameters: { type: Type.OBJECT, properties: { statement: { type: Type.STRING, description: "The statement to check." } }, required: ["statement"] } },
    { name: 'escalation_alert', description: "Trigger an alert for supervisor assistance.", parameters: { type: Type.OBJECT, properties: { reason: { type: Type.STRING, description: "The reason for escalation." }, urgency: { type: Type.STRING, enum: ['high', 'medium', 'low'], description: "The urgency level." } }, required: ["reason", "urgency"] } },
    { name: 'customer_data_retrieve', description: "Retrieve customer details from the CRM.", parameters: { type: Type.OBJECT, properties: { customerId: { type: Type.STRING, description: "The customer's ID." } }, required: ["customerId"] } }
];

interface CallLauncherModalProps {
    onClose: () => void;
    onRecordMic: () => void;
    onRecordMeeting: () => void;
}

const CallLauncherModal: React.FC<CallLauncherModalProps> = ({ onClose, onRecordMic, onRecordMeeting }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement) return;
        const focusableElements = modalElement.querySelectorAll('button, a') as NodeListOf<HTMLElement>;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        firstElement?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'Tab') {
                if (event.shiftKey) { if (document.activeElement === firstElement) { lastElement.focus(); event.preventDefault(); } } 
                else { if (document.activeElement === lastElement) { firstElement.focus(); event.preventDefault(); } }
            }
        };
        const handleClickOutside = (event: MouseEvent) => { if (modalRef.current && !modalRef.current.contains(event.target as Node)) onClose(); };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('keydown', handleKeyDown); document.removeEventListener('mousedown', handleClickOutside); };
    }, [onClose]);
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div ref={modalRef} className="relative w-full max-w-sm bg-panel-background border border-border-color rounded-2xl shadow-2xl p-6 text-center" role="dialog" aria-modal="true" aria-labelledby="launcher-title">
                <h2 id="launcher-title" className="text-xl font-bold mb-2">Start a Session</h2>
                <p className="text-sm text-text-secondary mb-6">Choose how you want to capture the audio for analysis.</p>
                <div className="space-y-3">
                     <button onClick={onRecordMeeting} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-interactive-background-hover text-text-primary text-md font-semibold rounded-lg hover:bg-border-color transition-colors border border-accent-primary/20"> 
                        <ScreenShare size={20} className="text-accent-primary"/> 
                        <div className="text-left">
                            <span className="block text-sm font-bold">Connect to Meeting</span>
                            <span className="block text-xs text-text-secondary">Captures Google Meet/Zoom tab audio + Mic</span>
                        </div>
                    </button>
                    <button onClick={onRecordMic} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-accent-primary text-text-inverted text-md font-semibold rounded-lg hover:bg-accent-primary-hover transition-colors"> 
                        <Mic size={20} /> 
                        <div className="text-left">
                            <span className="block text-sm font-bold">Microphone Only</span>
                            <span className="block text-xs text-white/80">Best for speakerphone or in-person</span>
                        </div>
                    </button>
                </div>
                <div className="mt-6 text-xs text-text-secondary bg-primary-background p-3 rounded-lg"> 
                    <strong>Tip for Meetings:</strong> When prompted, select the specific browser tab your meeting is in and ensure "Share tab audio" is checked.
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary" aria-label="Close"> <X size={24} /> </button>
            </div>
        </div>
    );
};

const LiveCallInterface: React.FC = () => {
    const [callState, setCallState] = useState<CallState>('idle');
    const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
    const [timer, setTimer] = useState(0);
    const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
    const [isLauncherVisible, setLauncherVisible] = useState(false);
    const [isHelpTooltipVisible, setHelpTooltipVisible] = useState(false);
    const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>('base');
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    const componentIsMounted = useRef(true);
    const isMobileRef = useRef(false);
    
    const addTimelineEvent = useAppStore(state => state.addTimelineEvent);
    const startLiveCall = useAppStore(state => state.startLiveCall);
    const appMode = useAppStore(state => state.appMode);
    const isDemoMode = appMode === 'demo';

    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    const helpTooltipRef = useRef<HTMLDivElement>(null);
    const transcriptContainerRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(helpTooltipRef, () => setHelpTooltipVisible(false));

    useEffect(() => {
        isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }, []);
    
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcripts]);

    const addTranscript = useCallback((speaker: TranscriptSpeaker | 'finalize', text: string, isFinal = false) => {
        if (speaker !== 'finalize' && !text) return;
        setTranscripts(prev => {
            if (speaker === 'finalize') {
                 if (prev.length > 0) {
                    const last = prev[prev.length - 1];
                    if (!last.isFinal) {
                        const newTranscripts = [...prev];
                        newTranscripts[prev.length - 1] = { ...last, isFinal: true };
                        return newTranscripts;
                    }
                }
                return prev;
            }
            const last = prev[prev.length - 1];
            if (last && last.speaker === speaker && !last.isFinal) {
                const newTranscripts = [...prev];
                newTranscripts[prev.length - 1] = { ...last, text: last.text + text, isFinal };
                return newTranscripts;
            } else {
                return [...prev, { id: crypto.randomUUID(), speaker, text, isFinal }];
            }
        });
    }, []);
    
    const handleFunctionCall = useCallback((fc) => {
        const details = `Args: ${JSON.stringify(fc.args)}`;
        addTranscript('system', `Function Call: ${fc.name}(${JSON.stringify(fc.args)})`, true);
        addTimelineEvent({ type: 'function_call', title: `Function: ${fc.name}`, details, });
    }, [addTranscript, addTimelineEvent]);

    const stopCall = useCallback(() => {
        sessionPromiseRef.current?.then(session => session.close());
        processorRef.current?.disconnect();
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        audioContextRef.current?.close().catch(() => {});
        sessionPromiseRef.current = null;
        processorRef.current = null;
        mediaStreamRef.current = null;
        audioContextRef.current = null;
        if (componentIsMounted.current) {
            setAnalyserNode(null);
            setCallState('idle');
        }
    }, []);

    useEffect(() => {
        componentIsMounted.current = true;
        return () => {
            componentIsMounted.current = false;
            stopCall();
        };
    }, [stopCall]);

    useEffect(() => {
        let interval: number;
        if (callState === 'active') {
            interval = window.setInterval(() => {
                setTimer(t => {
                    const newTime = t + 1;
                    if (newTime >= MAX_CALL_DURATION_SECONDS) {
                        clearInterval(interval);
                        const message = `Call automatically ended after ${MAX_CALL_DURATION_SECONDS / 60} minutes to conserve resources.`;
                        addTranscript('system', message, true);
                        addTimelineEvent({ type: 'system_message', title: 'Call Duration Limit Reached', details: message });
                        stopCall();
                        return MAX_CALL_DURATION_SECONDS;
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callState, stopCall, addTranscript, addTimelineEvent]);

    const startCall = async (mode: 'mic' | 'meeting') => {
        setLauncherVisible(false);
        if (isDemoMode) return;
        setCallState('connecting');
        setTranscripts([]);
        setTimer(0);
        startLiveCall();
        try {
            let source: MediaStreamAudioSourceNode;
            let audioContext: AudioContext;

            if (mode === 'meeting') {
                // Meeting Mode: Capture System Audio (Meet) + Mic
                const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                // @ts-ignore - getDisplayMedia exists in modern browsers
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                
                // We only need the audio track from the display stream
                // Check if user actually shared audio
                const displayAudioTracks = displayStream.getAudioTracks();
                if (displayAudioTracks.length === 0) {
                     throw new Error("No tab audio shared. Please ensure 'Share tab audio' is checked.");
                }

                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                
                // Create sources
                const micSource = audioContext.createMediaStreamSource(micStream);
                const systemSource = audioContext.createMediaStreamSource(displayStream);
                const destination = audioContext.createMediaStreamDestination();
                
                // Mix them
                micSource.connect(destination);
                systemSource.connect(destination);
                
                source = audioContext.createMediaStreamSource(destination.stream);
                
                // Store tracks to stop later
                mediaStreamRef.current = new MediaStream([...micStream.getTracks(), ...displayStream.getTracks()]);
            } else {
                // Mic Only Mode
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaStreamRef.current = stream;
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                source = audioContext.createMediaStreamSource(stream);
            }
            
            audioContextRef.current = audioContext;
            
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
            setAnalyserNode(analyser);
            
            processorRef.current = audioContext.createScriptProcessor(4096, 1, 1);
            source.connect(processorRef.current);
            processorRef.current.connect(audioContext.destination);

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: { 
                    responseModalities: [Modality.AUDIO], 
                    inputAudioTranscription: {}, 
                    outputAudioTranscription: {}, 
                    tools: [{ functionDeclarations }], 
                    systemInstruction: "You are an AI assistant providing instant, actionable support to a call center AGENT. Your primary role is to listen to the customer, understand their needs, and provide the AGENT with real-time guidance, information, and function calls to resolve the issue efficiently and according to compliance standards. Your transcribed responses are for the agent's eyes only." 
                },
                callbacks: {
                    onopen: () => { if (componentIsMounted.current) { setCallState('active'); addTranscript('system', 'Live session started. AI assistant is online.', true); } },
                    onmessage: (msg: LiveServerMessage) => {
                        if (!componentIsMounted.current) return;
                        if (msg.serverContent?.inputTranscription) { addTranscript('customer', msg.serverContent.inputTranscription.text); }
                        if (msg.serverContent?.outputTranscription) { addTranscript('agent', msg.serverContent.outputTranscription.text); }
                        if (msg.serverContent?.turnComplete) { addTranscript('finalize', ''); }
                        if(msg.toolCall?.functionCalls) { msg.toolCall.functionCalls.forEach(handleFunctionCall); }
                    },
                    onclose: () => { if (componentIsMounted.current) stopCall(); },
                    onerror: (e) => {
                        if (!componentIsMounted.current) return;
                        console.error(e);
                        setCallState('error');
                        const errorDetails = e instanceof ErrorEvent ? e.message : 'An unknown error occurred.';
                        addTranscript('system', `Connection error: ${errorDetails}`, true);
                        addTimelineEvent({ type: 'error', title: 'Live Connection Failed', details: errorDetails });
                        stopCall();
                    },
                }
            });

            processorRef.current.onaudioprocess = (event) => {
                if (!componentIsMounted.current) return;
                const inputData = event.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) { int16[i] = inputData[i] * 32768; }
                const base64 = encode(new Uint8Array(int16.buffer));
                sessionPromiseRef.current?.then(session => session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
        } catch (error) {
            if (!componentIsMounted.current) return;
            console.error("Failed to start call:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to get microphone or tab access.';
            setCallState('error');
            addTranscript('system', `Error: ${errorMessage}`, true);
            addTimelineEvent({ type: 'error', title: 'Failed to Start Call', details: errorMessage });
        }
    };
    
    const handleStartCallClick = () => setLauncherVisible(true);
    const formatTime = (seconds: number) => new Date(seconds * 1000).toISOString().substr(14, 5);
    const getSpeakerIcon = (speaker: TranscriptSpeaker) => {
        switch (speaker) {
            case 'customer': return <User size={20} className="text-blue-400" />;
            case 'agent': return <Bot size={20} className="text-green-400" />;
            default: return <AlertCircle size={20} className="text-icon-primary" />;
        }
    };
    const cycleTextSize = () => { setTextSize(currentSize => { if (currentSize === 'sm') return 'base'; if (currentSize === 'base') return 'lg'; return 'sm'; }); };
    const toggleFullScreen = () => {
        const elem = transcriptContainerRef.current; if (!elem) return;
        if (!document.fullscreenElement) { elem.requestFullscreen().catch(err => { alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`); }); } 
        else { document.exitFullscreen(); }
    };

    useEffect(() => {
        const handleFullScreenChange = () => { setIsFullScreen(!!document.fullscreenElement); };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);
    
    const textSizeClass = { sm: 'text-sm', base: 'text-base', lg: 'text-lg' }[textSize];

    return (
        <>
            {isLauncherVisible && <CallLauncherModal onClose={() => setLauncherVisible(false)} onRecordMic={() => startCall('mic')} onRecordMeeting={() => startCall('meeting')} />}
            <div className="flex flex-col flex-1 bg-panel-background border border-border-color rounded-2xl h-full min-h-[500px] lg:p-6">
                <div className="flex flex-col lg:flex-row flex-1 lg:gap-8 h-full">
                    <div className="lg:w-1/3 flex flex-col p-6 lg:p-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${callState === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                                <span className="font-mono text-lg">{formatTime(timer)}</span>
                            </div>
                             <div ref={helpTooltipRef} className="relative">
                                <button onClick={() => setHelpTooltipVisible(p => !p)} className="text-icon-primary hover:text-text-primary" aria-label="How to use Co-Pilot"> <Info size={24} /> </button>
                                {isHelpTooltipVisible && (
                                    <div className="absolute bottom-full right-0 mb-2 w-72 bg-primary-background border border-border-color rounded-xl shadow-2xl p-4 text-sm animate-fade-in z-10">
                                        <h4 className="font-bold text-text-primary mb-2">How to use Co-Pilot</h4>
                                        <ul className="list-disc list-inside space-y-2 text-text-secondary">
                                            <li><strong>Meeting Mode:</strong> Connects to Google Meet or Zoom tab audio to hear your friend/customer.</li>
                                            <li><strong>Mic Only:</strong> Standard recording for speakerphone or in-person.</li>
                                            <li>Ensure the app remains open for uninterrupted analysis.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <button
                                onClick={callState === 'active' ? stopCall : handleStartCallClick}
                                disabled={isDemoMode || callState === 'connecting'}
                                className={`relative flex items-center justify-center w-48 h-16 rounded-full font-semibold text-text-inverted transition-all duration-300 ${ callState === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-accent-primary hover:bg-accent-primary-hover' } disabled:bg-gray-600 disabled:cursor-not-allowed`}
                                title={isDemoMode ? "Co-Pilot is disabled in Demo Mode" : ""}
                            >
                                {callState === 'idle' && !isDemoMode && <div className="absolute inset-0 rounded-full bg-accent-primary animate-pulse"></div>}
                                <div className="relative z-10 flex items-center text-lg">
                                    {callState === 'active' ? <PhoneOff size={24} className="mr-2" /> : <Mic size={24} className="mr-2" />}
                                    <span>{callState === 'active' ? 'End Call' : 'Start Call'}</span>
                                </div>
                            </button>
                        </div>
                        <div className="mt-4">
                            <AudioVisualizer analyserNode={analyserNode} isActive={callState === 'active'} />
                        </div>
                    </div>
                    <div className="relative flex-1 flex flex-col min-h-0 p-6 pt-0 lg:p-0">
                         <div ref={transcriptContainerRef} className="relative flex-1 bg-primary-background rounded-lg overflow-y-auto">
                            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-panel-background/50 backdrop-blur-sm p-1 rounded-md">
                                <button onClick={cycleTextSize} className="p-2 text-icon-primary hover:text-text-primary hover:bg-interactive-background-hover rounded-md transition-colors" aria-label="Cycle text size"> <CaseSensitive size={18} /> </button>
                                <button onClick={toggleFullScreen} className="p-2 text-icon-primary hover:text-text-primary hover:bg-interactive-background-hover rounded-md transition-colors" aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}> {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />} </button>
                            </div>
                            <div className="p-4 space-y-4">
                                {transcripts.map((t) => (
                                    <div key={t.id} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-panel-background flex items-center justify-center mt-1">
                                        {getSpeakerIcon(t.speaker)}
                                        </div>
                                        <div>
                                            <p className="font-semibold capitalize text-sm text-text-secondary">{t.speaker}</p>
                                            <p className={`text-text-primary transition-all duration-200 ${textSizeClass}`}>{t.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {callState === 'error' && (
                                    <div className="text-center p-4">
                                        <p className="text-red-400">An error occurred. Please check console and try again.</p>
                                        <button onClick={() => window.location.hash = '/upload'} className="mt-4 bg-interactive-background-hover text-text-primary py-2 px-4 rounded-lg font-semibold hover:bg-border-color"> Switch to Upload </button>
                                    </div>
                                )}
                                <div ref={transcriptEndRef} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LiveCallInterface;
