import React from 'react';
import LiveCallInterface from './LiveCallInterface';

const LiveCallView: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">Live Call Analysis</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Start the session to begin real-time transcription and AI-powered agent assistance.
                    Compliance events and function calls will appear in the transcript.
                </p>
            </div>
            <LiveCallInterface />
        </div>
    );
};

export default LiveCallView;