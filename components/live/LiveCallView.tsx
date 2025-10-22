import React from 'react';
import LiveCallInterface from './LiveCallInterface';

const LiveCallView: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">Live Call Analysis</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    This is an AI co-pilot for your human agents. Start a session to monitor a live call. The system will provide real-time transcription, automatically look up information, flag compliance issues, and suggest next steps to help your agent resolve issues faster and more accurately.
                </p>
            </div>
            <LiveCallInterface />
        </div>
    );
};

export default LiveCallView;