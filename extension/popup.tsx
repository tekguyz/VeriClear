/*
  NOTE: Browser Extension Development Paused

  The code for the browser extension pop-up has been temporarily commented out
  to stabilize the development workflow for the main web application and prevent
  recurring build errors.

  The file structure and this commented-out code are being kept as a blueprint
  for when development on this feature resumes. Do not uncomment or modify this
  file until the feature is officially scheduled for active development.
*/
/*
// Fix: Added a triple-slash directive to include type definitions for the Chrome extension APIs. This resolves errors related to the 'chrome' object being undefined.
/// <reference types="chrome" />

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Radio, Mic, Bot, CheckCircle, Loader2, ListChecks, Info } from 'lucide-react';

type CaptureState = 'idle' | 'capturing' | 'analyzing' | 'complete' | 'error';

const Logomark: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    aria-label="VeriClear Logomark"
  >
    <title>VeriClear Logomark</title>
    <circle cx="16" cy="16" r="15" stroke="#4285F4" strokeWidth="2"></circle>
    <path d="M 13 10 L 9 13 L 13 16" stroke="#EA4335" strokeWidth="2.5"></path>
    <path d="M 19 10 L 23 13 L 19 16" stroke="#FBBC05" strokeWidth="2.5"></path>
    <path d="M 10 21 Q 16 26 22 21" stroke="#34A853" strokeWidth="2.5"></path>
  </svg>
);

const Popup: React.FC = () => {
    const [state, setState] = useState<CaptureState>('idle');
    const [tabTitle, setTabTitle] = useState('this tab');

    useEffect(() => {
        // Get current state from background script when popup opens
        chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
            if (response) {
                setState(response.state || 'idle');
                setTabTitle(response.tabTitle || 'this tab');
            }
        });

        // Listen for state changes from background script
        const messageListener = (message: any) => {
            if (message.type === 'STATE_UPDATE') {
                setState(message.state);
                if(message.tabTitle) setTabTitle(message.tabTitle);
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);
        return () => chrome.runtime.onMessage.removeListener(messageListener);
    }, []);

    const handleStart = () => {
        chrome.runtime.sendMessage({ type: 'START_CAPTURE' });
    };

    const handleStop = () => {
        chrome.runtime.sendMessage({ type: 'STOP_CAPTURE' });
    };
    
    const handleViewReview = () => {
        // In a real app, this would be a dynamic URL.
        window.open('http://localhost:8888/#/reviews', '_blank');
    };

    const renderContent = () => {
        switch (state) {
            case 'capturing':
                return (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <Radio size={48} className="text-red-500 mb-4 animate-pulse" />
                        <h2 className="text-xl font-bold">Recording...</h2>
                        <p className="text-text-secondary mt-1">Analyzing audio from:</p>
                        <p className="text-text-primary font-medium truncate w-full px-4" title={tabTitle}>{tabTitle}</p>
                        <button onClick={handleStop} className="mt-8 bg-red-500 text-white px-6 py-2 rounded-lg font-semibold">
                            Stop Analysis
                        </button>
                    </div>
                );
            case 'analyzing':
                 return (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <Loader2 size={48} className="text-accent-primary mb-4 animate-spin" />
                        <h2 className="text-xl font-bold">Analyzing Audio</h2>
                        <p className="text-text-secondary mt-1">Please wait while we process the recording...</p>
                    </div>
                );
            case 'complete':
                 return (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <CheckCircle size={48} className="text-green-500 mb-4" />
                        <h2 className="text-xl font-bold">Analysis Complete!</h2>
                        <p className="text-text-secondary mt-1">Your review is ready.</p>
                        <button onClick={handleViewReview} className="mt-8 bg-accent-primary text-text-inverted px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
                           <ListChecks size={16} /> View in VeriClear
                        </button>
                    </div>
                );
            case 'error':
                return (
                     <div className="text-center flex flex-col items-center justify-center h-full">
                        <CheckCircle size={48} className="text-red-500 mb-4" />
                        <h2 className="text-xl font-bold">Error</h2>
                        <p className="text-text-secondary mt-1">Could not capture tab audio. Please try again.</p>
                        <button onClick={() => setState('idle')} className="mt-8 bg-interactive-background-hover text-text-primary px-6 py-2 rounded-lg font-semibold">
                           Go Back
                        </button>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <Bot size={48} className="text-accent-primary mb-4" />
                        <h2 className="text-xl font-bold">Start Co-Pilot</h2>
                        <p className="text-text-secondary mt-1">Analyze the audio from your current browser tab.</p>
                        <button onClick={handleStart} className="mt-8 bg-accent-primary text-text-inverted px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                            <Mic size={18} /> Analyze this Tab
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center gap-3 p-4 border-b border-border-color">
                <Logomark className="w-8 h-8" />
                <h1 className="text-lg font-bold text-text-primary">VeriClear</h1>
            </header>
            <main className="flex-1 p-4">
                {renderContent()}
            </main>
            {state === 'idle' && (
                <footer className="p-4 border-t border-border-color text-center">
                    <div className="relative group flex items-center justify-center text-xs text-text-secondary">
                        <Info size={14} className="mr-2" />
                        <span>How does this work?</span>
                         <div className="absolute bottom-full mb-2 w-[90%] px-3 py-2 bg-primary-background border border-border-color text-text-secondary text-xs font-normal rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                           Analyzes audio from the current browser tab only. Does not work with desktop apps like Zoom or Teams.
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
*/