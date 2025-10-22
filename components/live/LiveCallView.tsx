import React from 'react';
import LiveCallInterface from './LiveCallInterface';

const LiveCallView: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            <p className="text-gray-400 max-w-3xl mx-auto text-center mb-8">
                This is an AI co-pilot for your human agents. Start a session to monitor a live call. The system will provide real-time transcription, automatically look up information, flag compliance issues, and suggest next steps to help your agent resolve issues faster and more accurately.
            </p>
            <LiveCallInterface />
        </div>
    );
};

export default LiveCallView;
