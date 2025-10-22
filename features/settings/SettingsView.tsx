

import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import * as ReactRouterDOM from 'react-router-dom';
import {
  ChevronRight,
  User,
  Settings as Cog,
  Palette,
  Database,
  Shield,
  Info,
  LogOut,
  ArrowLeft,
  Sun,
  Moon,
  Trash2,
  Link as LinkIcon,
  Users,
  Mic,
  FileCog,
  History,
} from 'lucide-react';

type SectionId = 'general' | 'personalization' | 'data' | 'security' | 'about' | 'apps' | 'voice' | 'orders';

const avatarColors = [
  'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'
];

// --- Sub-Sections ---

const PersonalizationSettings = () => {
    const [name, setName] = useState('Demo User');
    const [email, setEmail] = useState('demo@vericlear.ai');
    const [selectedAvatar, setSelectedAvatar] = useState(avatarColors[0]);
    
    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 ${selectedAvatar}`}>
                    {name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex gap-2">
                    {avatarColors.map(color => (
                        <button
                            key={color}
                            onClick={() => setSelectedAvatar(color)}
                            className={`w-8 h-8 rounded-full ${color} transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary focus:ring-offset-panel-background ${selectedAvatar === color ? 'ring-2 ring-accent-primary ring-offset-2 ring-offset-panel-background' : ''}`}
                            aria-label={`Select ${color} avatar`}
                        />
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-text-secondary mb-1 block">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-input-background border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none" />
                </div>
                <div>
                    <label className="text-sm font-medium text-text-secondary mb-1 block">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-input-background border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none" />
                </div>
            </div>
        </div>
    );
};

const GeneralSettings = () => {
    const { theme, setTheme } = useAppStore();
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-text-primary">Theme</p>
                <div className="flex items-center gap-2 p-1 bg-primary-background rounded-lg">
                    <button
                        onClick={() => setTheme('light')}
                        className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 transition-colors ${theme !== 'dark' ? 'bg-accent-primary text-text-inverted' : 'text-text-secondary hover:bg-interactive-background-hover'}`}
                    >
                        <Sun size={16} /> Light
                    </button>
                    <button
                        onClick={() => setTheme('dark')}
                        className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 transition-colors ${theme === 'dark' ? 'bg-accent-primary text-text-inverted' : 'text-text-secondary hover:bg-interactive-background-hover'}`}
                    >
                        <Moon size={16} /> Dark
                    </button>
                </div>
            </div>
        </div>
    );
};

const DataControlsSettings = () => {
    const { resetState, showConfirmDialog } = useAppStore();
     const handleClearCache = () => {
        showConfirmDialog(
            "Clear Local Cache?",
            "Are you sure you want to clear all local data? This will reset your notes and checklist.",
            () => {
                localStorage.removeItem('vericlear-notes');
                localStorage.removeItem('vericlear-checklist');
                resetState();
                window.location.reload();
            }
        );
    };
    return (
         <div className="flex items-center justify-between">
            <div>
                <p className="text-text-primary">Clear Local Cache</p>
                <p className="text-sm text-text-secondary">Resets the audit checklist and notes saved in your browser.</p>
            </div>
            <button
                onClick={handleClearCache}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 font-semibold rounded-lg hover:bg-red-600/40 transition-colors"
            >
                <Trash2 size={16} />
                Clear Data
            </button>
        </div>
    );
};

const AboutSettings = () => {
    const { NavLink } = ReactRouterDOM;
    const legalLinks = [
        { to: '/terms', label: 'Terms of Service' },
        { to: '/privacy', label: 'Privacy Policy' },
        { to: '/ai-ethics', label: 'AI Ethics' },
        { to: '/cookie-policy', label: 'Cookie Policy' },
    ];
    return (
        <div className="space-y-4 text-text-secondary">
            <div className="flex justify-between items-center">
                <span>Developed by</span>
                <a href="https://tekguyz.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-text-accent hover:underline">TEKGUYZ</a>
            </div>
            <div className="flex justify-between items-center">
                <span>Application Version</span>
                <span className="font-mono text-text-primary">1.0.0</span>
            </div>
             <hr className="border-border-color"/>
             {legalLinks.map(link => (
                 <div key={link.to} className="flex justify-between items-center">
                    <span>{link.label}</span>
                    <NavLink to={link.to} className="flex items-center gap-1 text-text-accent hover:underline">
                        View <LinkIcon size={14} />
                    </NavLink>
                </div>
             ))}
        </div>
    );
};

const PlaceholderSection: React.FC<{ title: string }> = ({ title }) => (
    <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">This section is currently under development. Check back soon for updates!</p>
    </div>
);


const sections = {
    general: { title: 'General', component: GeneralSettings },
    personalization: { title: 'Personalization', component: PersonalizationSettings },
    data: { title: 'Data Controls', component: DataControlsSettings },
    security: { title: 'Security', component: () => <PlaceholderSection title="Security Settings" /> },
    about: { title: 'About', component: AboutSettings },
    apps: { title: 'Apps & Connectors', component: () => <PlaceholderSection title="Apps & Connectors" /> },
    voice: { title: 'Voice', component: () => <PlaceholderSection title="Voice Settings" /> },
    orders: { title: 'Orders', component: () => <PlaceholderSection title="Order History" /> },
};


// --- Main View ---

const SettingsView: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SectionId | null>(null);
    const { setAppMode } = useAppStore();
    const { Link } = ReactRouterDOM;

    const menuItems = [
        { id: 'personalization', icon: User, label: 'Personalization', subtitle: 'Demo User, demo@vericlear.ai' },
        { id: 'general', icon: Cog, label: 'General' },
        { id: 'apps', icon: Users, label: 'Apps & Connectors' },
        { id: 'data', icon: Database, label: 'Data Controls' },
        { id: 'voice', icon: Mic, label: 'Voice' },
        { id: 'security', icon: Shield, label: 'Security' },
        { id: 'orders', icon: FileCog, label: 'Orders' },
        { id: 'about', icon: Info, label: 'About' },
    ];

    const ActiveComponent = activeSection ? sections[activeSection].component : null;

    if (activeSection && ActiveComponent) {
        return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="relative flex items-center justify-center mb-6 h-10">
                    <button onClick={() => setActiveSection(null)} className="p-2 absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary" aria-label="Back to settings">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold whitespace-nowrap">{sections[activeSection].title}</h1>
                </div>
                <div className="bg-panel-background border border-border-color rounded-2xl p-6">
                    <ActiveComponent />
                </div>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-panel-background border border-border-color rounded-2xl">
                <ul className="divide-y divide-border-color">
                    {menuItems.map(item => (
                        <li key={item.id}>
                            <button onClick={() => setActiveSection(item.id as SectionId)} className="w-full flex items-center justify-between p-4 hover:bg-interactive-background-hover transition-colors">
                                <div className="flex items-center">
                                    <item.icon className="w-6 h-6 mr-4 text-icon-primary" />
                                    <div>
                                        <p className="text-md font-medium text-text-primary text-left">{item.label}</p>
                                        {item.subtitle && <p className="text-sm text-text-secondary text-left">{item.subtitle}</p>}
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-text-secondary" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 bg-panel-background border border-border-color rounded-2xl">
                <Link to="/changelog" className="w-full flex items-center justify-between p-4 hover:bg-interactive-background-hover transition-colors rounded-2xl">
                    <div className="flex items-center">
                        <History className="w-6 h-6 mr-4 text-icon-primary" />
                        <p className="text-md font-medium text-text-primary text-left">Changelog</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary" />
                </Link>
            </div>
            
            <div className="mt-6 bg-panel-background border border-border-color rounded-2xl">
                 <button onClick={() => setAppMode(null)} className="w-full flex items-center p-4 text-red-400 hover:bg-interactive-background-hover transition-colors rounded-2xl">
                    <LogOut className="w-6 h-6 mr-4" />
                    <span className="text-md font-medium">Sign out</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsView;