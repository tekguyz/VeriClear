import React from 'react';
import LiveCallInterface from './LiveCallInterface';

const LiveCallView: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            <p className="text-gray-400 max-w-3xl mx-auto text-center mb-8">
                This is your AI Co-Pilot. Start a session to get real-time assistance during a call. The system will provide live transcription, automatically look up information, flag compliance issues, and suggest next steps to help your agent resolve issues faster and more accurately.
            </p>
            <LiveCallInterface />
        </div>
    );
};

export default LiveCallView;