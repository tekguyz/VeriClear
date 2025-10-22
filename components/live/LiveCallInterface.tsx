
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, PhoneOff, Bot, User, AlertCircle } from 'lucide-react';
import { GoogleGenAI, FunctionDeclaration, Type, Modality, LiveServerMessage } from '@google/genai';
import type { TranscriptSegment, TranscriptSpeaker } from '../../types';
import { useAppStore } from '../../store/appStore';
import AudioVisualizer from './AudioVisualizer';

type CallState = 'idle' | 'connecting' | 'active' | 'error';
const MAX_CALL_DURATION_SECONDS = 900; // 15 minutes

// Fix: Per Gemini API guidelines, do not use external libraries for encoding.
// Implement the encode function manually.
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// --- Function Declarations for Agent Assistance ---
const functionDeclarations: FunctionDeclaration[] = [
    {
        name: 'knowledge_base_lookup',
        description: "Search internal resources for information.",
        parameters: { type: Type.OBJECT, properties: { query: { type: Type.STRING, description: "The search query." } }, required: ["query"] }
    },
    {
        name: 'compliance_check',
        description: "Verify if a statement adheres to compliance requirements.",
        parameters: { type: Type.OBJECT, properties: { statement: { type: Type.STRING, description: "The statement to check." } }, required: ["statement"] }
    },
    {
        name: 'escalation_alert',
        description: "Trigger an alert for supervisor assistance.",
        parameters: {
            type: Type.OBJECT, properties: {
                reason: { type: Type.STRING, description: "The reason for escalation." },
                urgency: { type: Type.STRING, enum: ['high', 'medium', 'low'], description: "The urgency level." }
            }, required: ["reason", "urgency"]
        }
    },
    {
        name: 'customer_data_retrieve',
        description: "Retrieve customer details from the CRM.",
        parameters: { type: Type.OBJECT, properties: { customerId: { type: Type.STRING, description: "The customer's ID." } }, required: ["customerId"] }
    }
];

const LiveCallInterface: React.FC = () => {
    const [callState, setCallState] = useState<CallState>('idle');
    const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
    const [timer, setTimer] = useState(0);
    const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
    const addTimelineEvent = useAppStore(state => state.addTimelineEvent);
    const startStoreCall = useAppStore(state => state.startLiveCall);
    const appMode = useAppStore(state => state.appMode);
    const isDemoMode = appMode === 'demo';

    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcripts]);

    const addTranscript = useCallback((speaker: TranscriptSpeaker, text: string, isFinal = false) => {
        if (!text) return;
        setTranscripts(prev => {
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
        addTimelineEvent({
            type: 'function_call',
            title: `Function: ${fc.name}`,
            details,
        });
    }, [addTranscript, addTimelineEvent]);

    const stopCall = useCallback((reason?: 'user' | 'duration_limit' | 'api_close' | 'error') => {
        if (callState === 'idle') return;
        
        sessionPromiseRef.current?.then(session => session.close());
        processorRef.current?.disconnect();
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        audioContextRef.current?.close();

        sessionPromiseRef.current = null;
        processorRef.current = null;
        mediaStreamRef.current = null;
        audioContextRef.current = null;

        if (reason === 'duration_limit') {
            const message = `Call automatically ended after ${MAX_CALL_DURATION_SECONDS / 60} minutes to conserve resources.`;
            addTranscript('system', message, true);
            addTimelineEvent({
                type: 'system_message',
                title: 'Call Duration Limit Reached',
                details: message,
            });
        }

        setAnalyserNode(null);
        setCallState('idle');
    }, [callState, addTranscript, addTimelineEvent]);

    useEffect(() => {
        let interval: number;
        if (callState === 'active') {
            interval = setInterval(() => {
                setTimer(t => {
                    const newTime = t + 1;
                    if (newTime >= MAX_CALL_DURATION_SECONDS) {
                        clearInterval(interval);
                        stopCall('duration_limit');
                        return MAX_CALL_DURATION_SECONDS;
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callState, stopCall]);


    const startCall = async () => {
        if (isDemoMode) return;
        setCallState('connecting');
        setTranscripts([]);
        setTimer(0);
        startStoreCall();

        try {
            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Fix: Cast window to `any` to allow access to the prefixed `webkitAudioContext` for broader browser compatibility without TypeScript errors.
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            
            const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            const analyser = audioContextRef.current.createAnalyser();
            source.connect(analyser);
            setAnalyserNode(analyser);

            processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            source.connect(processorRef.current);
            processorRef.current.connect(audioContextRef.current.destination);

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
                    onopen: () => {
                        setCallState('active');
                        addTranscript('system', 'Live session started. AI assistant is online.', true);
                    },
                    onmessage: (msg: LiveServerMessage) => {
                        if (msg.serverContent?.inputTranscription) {
                            addTranscript('customer', msg.serverContent.inputTranscription.text, msg.serverContent.inputTranscription.isFinal);
                        }
                        if (msg.serverContent?.outputTranscription) {
                             addTranscript('agent', msg.serverContent.outputTranscription.text, msg.serverContent.outputTranscription.isFinal);
                        }
                        if(msg.toolCall?.functionCalls) {
                            msg.toolCall.functionCalls.forEach(handleFunctionCall);
                        }
                    },
                    onclose: () => stopCall('api_close'),
                    onerror: (e) => {
                        console.error(e);
                        setCallState('error');
                        const errorDetails = e instanceof ErrorEvent ? e.message : 'An unknown error occurred.';
                        addTranscript('system', `Connection error: ${errorDetails}`, true);
                        addTimelineEvent({
                           type: 'error',
                           title: 'Live Connection Failed',
                           details: errorDetails,
                        });
                        stopCall('error');
                    },
                }
            });

            processorRef.current.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                    int16[i] = inputData[i] * 32768;
                }
                const base64 = encode(new Uint8Array(int16.buffer));
                sessionPromiseRef.current?.then(session => session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };

        } catch (error) {
            console.error("Failed to start call:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to get microphone access.';
            setCallState('error');
            addTranscript('system', `Error: ${errorMessage}`, true);
            addTimelineEvent({
                type: 'error',
                title: 'Failed to Start Call',
                details: errorMessage,
            });
        }
    };
    
    
    const formatTime = (seconds: number) => new Date(seconds * 1000).toISOString().substr(14, 5);
    
    const getSpeakerIcon = (speaker: TranscriptSpeaker) => {
        switch (speaker) {
            case 'customer': return <User size={20} className="text-blue-400" />;
            case 'agent': return <Bot size={20} className="text-blue-400" />;
            default: return <AlertCircle size={20} className="text-gray-500" />;
        }
    };

    return (
        <div className="flex flex-col flex-1 bg-panel-background border border-border-color rounded-2xl p-6 h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${callState === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <span className="font-mono text-lg">{formatTime(timer)}</span>
                </div>
                <button
                    onClick={callState === 'active' ? () => stopCall('user') : startCall}
                    disabled={isDemoMode || callState === 'connecting'}
                    className={`relative flex items-center justify-center w-40 h-12 rounded-full font-semibold text-white transition-all duration-300 ${
                        callState === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-accent-primary hover:bg-blue-600'
                    } disabled:bg-gray-600 disabled:cursor-not-allowed`}
                    title={isDemoMode ? "Live call is disabled in Demo Mode" : ""}
                >
                    {callState === 'idle' && !isDemoMode && <div className="absolute inset-0 rounded-full bg-accent-primary animate-pulse"></div>}
                    <div className="relative z-10 flex items-center">
                        {callState === 'active' ? <PhoneOff size={24} className="mr-2" /> : <Mic size={24} className="mr-2" />}
                        <span>{callState === 'active' ? 'End Call' : 'Start Call'}</span>
                    </div>
                </button>
            </div>

            <div className="mb-4">
                <AudioVisualizer analyserNode={analyserNode} isActive={callState === 'active'} />
            </div>

            <div className="flex-1 bg-primary-background/50 rounded-lg p-4 overflow-y-auto space-y-4">
                {transcripts.map((t) => (
                    <div key={t.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mt-1">
                           {getSpeakerIcon(t.speaker)}
                        </div>
                        <div>
                            <p className="font-semibold capitalize text-sm">{t.speaker}</p>
                            <p className="text-gray-300">{t.text}</p>
                        </div>
                    </div>
                ))}
                 {callState === 'error' && (
                    <div className="text-center p-4">
                        <p className="text-red-400">An error occurred. Please check console and try again.</p>
                        <button 
                            onClick={() => window.location.hash = '/batch-analysis'}
                            className="mt-4 bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600"
                        >
                            Switch to Batch Analysis
                        </button>
                    </div>
                )}
                <div ref={transcriptEndRef} />
            </div>
        </div>
    );
};

export default LiveCallInterface;