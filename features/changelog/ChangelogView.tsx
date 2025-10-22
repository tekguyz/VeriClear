import React, { useState } from 'react';
import { Sparkles, Zap, Bug, ChevronDown } from 'lucide-react';

const changelogData = [
    {
        version: '1.0.2',
        date: 'October 22, 2025',
        changes: [
            {
                type: 'Improvement',
                description: 'Co-Pilot transcription accuracy has been significantly improved for noisy environments.',
                icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10'
            },
            {
                type: 'New Feature',
                description: 'Added new "Source" filter to the Reviews page, allowing you to distinguish between Co-Pilot and Uploaded reviews.',
                icon: Sparkles, color: 'text-green-400', bg: 'bg-green-500/10'
            },
            {
                type: 'Fix',
                description: 'Resolved an issue where large file uploads would occasionally time out during analysis.',
                icon: Bug, color: 'text-orange-400', bg: 'bg-orange-500/10'
            }
        ]
    },
    {
        version: '1.0.1',
        date: 'October 21, 2025',
        changes: [
            {
                type: 'Improvement',
                description: 'Enhanced the responsive design of the onboarding modal for a full-screen experience on mobile devices.',
                icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10'
            },
            {
                type: 'Improvement',
                description: 'The "Reviews" page now uses a responsive layout, switching from a table on desktop to cards on mobile for better readability.',
                icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10'
            },
        ]
    },
    {
        version: '1.0.0',
        date: 'October 21, 2025',
        changes: [
            {
                type: 'New Feature',
                description: 'Initial release of VeriClear, including Analytics, Co-Pilot, File Upload, and Reviews modules.',
                icon: Sparkles, color: 'text-green-400', bg: 'bg-green-500/10'
            },
        ]
    }
];


const ChangeItem: React.FC<{ change: typeof changelogData[0]['changes'][0] }> = ({ change }) => {
    const { type, description, icon: Icon, color, bg } = change;
    return (
        <div className={`flex items-start gap-4 p-4 rounded-lg ${bg}`}>
            <div className="flex-shrink-0">
                <Icon size={20} className={color} />
            </div>
            <div>
                <p className={`text-sm font-semibold ${color}`}>{type}</p>
                <p className="text-text-secondary">{description}</p>
            </div>
        </div>
    );
};


const ChangelogView: React.FC = () => {
    const [expandedVersion, setExpandedVersion] = useState<string | null>(changelogData[0]?.version || null);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">What's New in VeriClear</h1>
                <p className="mt-4 text-md md:text-lg text-text-secondary">
                    Stay up-to-date with the latest features, improvements, and fixes.
                </p>
            </div>

            <div className="space-y-4">
                {changelogData.map(release => (
                    <div key={release.version} className="relative pl-8">
                        <div className="absolute left-0 top-1 h-full border-l-2 border-border-color"></div>
                        <div className="absolute left-[-9px] top-1 w-5 h-5 bg-accent-primary rounded-full border-4 border-panel-background"></div>
                        
                        <button
                            onClick={() => setExpandedVersion(expandedVersion === release.version ? null : release.version)}
                            className="w-full flex justify-between items-center text-left py-2"
                            aria-expanded={expandedVersion === release.version}
                            aria-controls={`changelog-section-${release.version}`}
                        >
                            <h2 className="text-xl md:text-2xl font-semibold text-text-primary">Version {release.version}</h2>
                             <div className="flex items-center gap-4">
                                <p className="text-sm text-text-secondary">{release.date}</p>
                                <ChevronDown className={`transform transition-transform duration-300 ${expandedVersion === release.version ? 'rotate-180' : ''}`} />
                            </div>
                        </button>
                        
                        <div 
                            id={`changelog-section-${release.version}`}
                            className={`grid transition-all duration-500 ease-in-out ${expandedVersion === release.version ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                            <div className="overflow-hidden">
                                <div className="space-y-4 pt-4 pb-8">
                                    {release.changes.map((change, index) => (
                                        <ChangeItem key={index} change={change} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChangelogView;