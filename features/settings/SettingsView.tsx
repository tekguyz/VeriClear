
import React, { useState } from 'react';
import { Trash2, Sun, Moon, Link } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
// Fix: Use namespace import for react-router-dom to resolve export issues.
import * as ReactRouterDOM from 'react-router-dom';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-panel-background border border-border-color rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">{title}</h2>
        {children}
    </div>
);

const SettingsView: React.FC = () => {
    const resetState = useAppStore((state) => state.resetState);
    const [isDarkMode, setIsDarkMode] = useState(true); // Placeholder state
    const { NavLink } = ReactRouterDOM;

    const handleClearCache = () => {
        if (window.confirm("Are you sure you want to clear all local data? This will reset your notes and checklist.")) {
            localStorage.removeItem('vericlear-notes');
            localStorage.removeItem('vericlear-checklist');
            // We call resetState to also clear the in-memory store for a clean slate,
            // then reload to go back to the entry screen.
            resetState();
            window.location.reload();
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <h1 className="text-4xl font-bold text-text-primary">Settings</h1>

            <SettingsCard title="Appearance">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-300">Theme</p>
                        <div className="flex items-center gap-2 p-1 bg-primary-background rounded-lg">
                            <button
                                onClick={() => setIsDarkMode(false)}
                                className={`px-3 py-1 rounded-md text-sm ${!isDarkMode ? 'bg-accent-primary text-white' : 'text-gray-400'}`}
                            >
                                <Sun size={16} className="inline mr-1" /> Light
                            </button>
                            <button
                                onClick={() => setIsDarkMode(true)}
                                className={`px-3 py-1 rounded-md text-sm ${isDarkMode ? 'bg-accent-primary text-white' : 'text-gray-400'}`}
                            >
                                <Moon size={16} className="inline mr-1" /> Dark
                            </button>
                        </div>
                    </div>
                     <p className="text-xs text-gray-500 text-right -mt-2">Note: Theme switching is a visual placeholder.</p>
                </div>
            </SettingsCard>

            <SettingsCard title="Data Management">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-300">Clear Local Cache</p>
                        <p className="text-sm text-gray-500">Resets the audit checklist and notes saved in your browser.</p>
                    </div>
                    <button
                        onClick={handleClearCache}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 font-semibold rounded-lg hover:bg-red-600/40 transition-colors"
                    >
                        <Trash2 size={16} />
                        Clear Data
                    </button>
                </div>
            </SettingsCard>

            <SettingsCard title="Legal">
                <div className="space-y-3 text-gray-400">
                    <div className="flex justify-between items-center">
                        <span>Terms of Service</span>
                        <NavLink to="/terms" className="flex items-center gap-1 text-accent-primary hover:underline">
                            View Document <Link size={14} />
                        </NavLink>
                    </div>
                     <div className="flex justify-between items-center">
                        <span>Privacy Policy</span>
                        <NavLink to="/privacy" className="flex items-center gap-1 text-accent-primary hover:underline">
                            View Document <Link size={14} />
                        </NavLink>
                    </div>
                     <div className="flex justify-between items-center">
                        <span>AI Ethics</span>
                        <NavLink to="/ai-ethics" className="flex items-center gap-1 text-accent-primary hover:underline">
                            View Document <Link size={14} />
                        </NavLink>
                    </div>
                     <div className="flex justify-between items-center">
                        <span>Cookie Policy</span>
                        <NavLink to="/cookie-policy" className="flex items-center gap-1 text-accent-primary hover:underline">
                            View Document <Link size={14} />
                        </NavLink>
                    </div>
                </div>
            </SettingsCard>

             <SettingsCard title="About">
                 <div className="space-y-3 text-gray-400">
                    <div className="flex justify-between">
                        <span>Application Version</span>
                        <span className="font-mono">1.0.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Help & Documentation</span>
                        <NavLink to="/help" className="flex items-center gap-1 text-accent-primary hover:underline">
                            Go to Help Center <Link size={14} />
                        </NavLink>
                    </div>
                 </div>
            </SettingsCard>
        </div>
    );
};

export default SettingsView;