
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Tab = 'guide' | 'changes';

const FAQItem: React.FC<{ q: string; a: React.ReactNode }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border-color last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
            >
                <h3 className="text-md font-medium text-text-primary">{q}</h3>
                <ChevronDown
                    className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && <div className="pb-4 pr-6 text-gray-400 animate-fade-in">{a}</div>}
        </div>
    );
};

const FeatureGuideTab: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-panel-background border border-border-color rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-3">Core Features</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-300">
                <li><strong>Dashboard:</strong> Your mission control center. Get a high-level overview of key metrics like how many calls have been analyzed, the overall compliance rate, and average agent performance scores.</li>
                <li><strong>Live Call Analysis:</strong> The AI co-pilot for your auditors. Start a session to get real-time call transcriptions and see the AI provide instant support and flag potential compliance issues as they happen.</li>
                <li><strong>Batch Analysis:</strong> For asynchronous work. Drag and drop a batch of pre-recorded calls or transcripts, and the system will process them in the background, providing a full audit report for each one.</li>
                <li><strong>Productivity Tools:</strong> The right-hand panel contains an interactive checklist and a notes section with a timeline. Use these to document your findings and track key events during an audit.</li>
            </ul>
        </div>
        <div>
            <h2 className="text-2xl font-semibold mb-3">Frequently Asked Questions</h2>
            <div className="bg-panel-background border border-border-color rounded-2xl p-6">
                <FAQItem
                    q="What is Interactive Demo Mode?"
                    a="Demo Mode is a read-only environment designed to showcase the application's features without any risk. In this mode, all actions like starting calls or uploading files are disabled. It's pre-loaded with sample data to give you a feel for how the application works."
                />
                <FAQItem
                    q="Where are my notes and checklist data stored?"
                    a="The contents of the 'Notes' editor and the state of the 'Audit Checklist' are saved directly in your browser's local storage. This means the data persists on your machine between sessions but is not stored on a central server."
                />
                 <FAQItem
                    q="How do I clear my local data and start fresh?"
                    a="Navigate to the 'Settings' page. There you will find a 'Clear Local Cache' button which will reset your notes and checklist data stored in the browser."
                />
            </div>
        </div>
    </div>
);

const ChangesTab: React.FC = () => (
     <div className="bg-panel-background border border-border-color rounded-2xl p-6 animate-fade-in">
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Version 1.0.0 <span className="text-sm font-normal text-gray-400 ml-2">(Current)</span></h2>
                <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                    <li><span className="font-semibold text-green-400">New:</span> Added a user-friendly Help Center with a Feature Guide and Changelog.</li>
                    <li><span className="font-semibold text-green-400">New:</span> Implemented a functional Settings page with a 'Clear Local Cache' option.</li>
                    <li><span className="font-semibold text-blue-400">Improved:</span> The application now starts with a choice between a read-only Demo Mode and the full application.</li>
                     <li><span className="font-semibold text-blue-400">Improved:</span> Implemented code-splitting for major features to improve initial load times.</li>
                </ul>
            </div>
             <div>
                <h2 className="text-xl font-semibold">Version 0.9.0</h2>
                <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                    <li><span className="font-semibold text-green-400">New:</span> Launched the Analytics Dashboard with real-time metric cards.</li>
                    <li><span className="font-semibold text-green-400">New:</span> Added an interactive Audit Checklist and Notes/Timeline panel.</li>
                    <li><span className="font-semibold text-blue-400">Improved:</span> Hardened all backend functions with security headers and centralized error logging.</li>
                </ul>
            </div>
        </div>
     </div>
);


const HelpView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('guide');

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <p className="text-lg text-gray-400 mb-8">
                Your guide to understanding and using VeriClear's features.
            </p>

            <div className="flex border-b border-border-color mb-6">
                <button
                    onClick={() => setActiveTab('guide')}
                    className={`px-4 py-2 text-md font-medium transition-colors ${
                        activeTab === 'guide' ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Feature Guide
                </button>
                <button
                    onClick={() => setActiveTab('changes')}
                    className={`px-4 py-2 text-md font-medium transition-colors ${
                        activeTab === 'changes' ? 'text-accent-primary border-b-2 border-accent-primary' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Changes
                </button>
            </div>
            
            <div>
                {activeTab === 'guide' && <FeatureGuideTab />}
                {activeTab === 'changes' && <ChangesTab />}
            </div>
        </div>
    );
};

export default HelpView;
