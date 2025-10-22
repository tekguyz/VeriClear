import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import * as ReactRouterDOM from 'react-router-dom';
import {
  ChevronRight, User, Settings as Cog, Palette, Database, Shield, Info, LogOut,
  ArrowLeft, Sun, Moon, Trash2, Link as LinkIcon, Users, Mic, FileCog, HelpCircle,
  Upload, Check, ToggleLeft, ToggleRight, Download, UploadCloud, KeyRound, Lock,
} from 'lucide-react';

type SectionId = 'profile' | 'general' | 'apps' | 'data' | 'security' | 'about';

// --- Reusable Haptic Feedback Hook ---
const useHapticFeedback = () => {
    const isEnabled = useAppStore(state => state.hapticFeedbackEnabled);
    return (intensity = 50) => {
        if (isEnabled && 'vibrate' in navigator) {
            navigator.vibrate(intensity);
        }
    };
};

// --- Accent Color Data ---
const accentColors = [
    { name: 'Blue', color: '#4285F4', hover: '#3367D6' },
    { name: 'Green', color: '#34A853', hover: '#1E8E3E' },
    { name: 'Yellow', color: '#FBBC05', hover: '#F9AB00' },
    { name: 'Pink', color: '#E52565', hover: '#C2185B' },
    { name: 'Orange', color: '#F29900', hover: '#E97500' },
];

// --- Sub-Sections ---

const ProfileSettings = () => {
    const [name, setName] = useState('Demo User');
    const [email, setEmail] = useState('demo@vericlear.ai');
    const [avatarColor, setAvatarColor] = useState(accentColors[0].color);
    const [avatarImage, setAvatarImage] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 group">
                    {avatarImage ? (
                        <img src={avatarImage} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: avatarColor }}>
                            {name.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                     <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Upload size={24} />
                    </label>
                    <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                 <div className="flex gap-2">
                    {accentColors.map(({ name, color }) => (
                        <button
                            key={name}
                            onClick={() => setAvatarColor(color)}
                            className="w-8 h-8 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary focus:ring-offset-panel-background flex items-center justify-center"
                            style={{ backgroundColor: color }}
                            aria-label={`Select ${name} avatar background`}
                        >
                            {avatarColor === color && <Check size={16} className="text-white" />}
                        </button>
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
    const { theme, setTheme, accentColor, setAccentColor, hapticFeedbackEnabled, toggleHapticFeedback } = useAppStore();
    const triggerHaptic = useHapticFeedback();
    
    const handleSetAccentColor = (color: { name: string, color: string, hover: string }) => {
        setAccentColor(color.color, color.hover);
        document.documentElement.style.setProperty('--color-accent-background', color.color);
        document.documentElement.style.setProperty('--color-accent-background-hover', color.hover);
        document.documentElement.style.setProperty('--color-text-accent', color.color);
        triggerHaptic();
    };
    
    const handleToggleHaptic = () => {
        toggleHapticFeedback();
        // Vibrate immediately to give feedback on the change itself
        if (!hapticFeedbackEnabled && 'vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="font-medium text-text-primary">Theme</p>
                <div className="flex items-center gap-2 p-1 bg-primary-background rounded-lg">
                    <button onClick={() => setTheme('light')} className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 transition-colors ${theme !== 'dark' ? 'bg-accent-primary text-text-inverted' : 'text-text-secondary hover:bg-interactive-background-hover'}`}>
                        <Sun size={16} /> Light
                    </button>
                    <button onClick={() => setTheme('dark')} className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 transition-colors ${theme === 'dark' ? 'bg-accent-primary text-text-inverted' : 'text-text-secondary hover:bg-interactive-background-hover'}`}>
                        <Moon size={16} /> Dark
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <p className="font-medium text-text-primary">Accent Color</p>
                <div className="flex gap-2">
                    {accentColors.map(color => (
                        <button
                            key={color.name}
                            onClick={() => handleSetAccentColor(color)}
                            className="w-8 h-8 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary focus:ring-offset-panel-background flex items-center justify-center"
                            style={{ backgroundColor: color.color }}
                            aria-label={`Set accent color to ${color.name}`}
                        >
                            {accentColor === color.color && <Check size={16} className="text-white" />}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between">
                 <div>
                    <p className="font-medium text-text-primary">Haptic Feedback</p>
                    <p className="text-sm text-text-secondary">Provides physical feedback on supported devices.</p>
                </div>
                <button onClick={handleToggleHaptic}>
                    {hapticFeedbackEnabled ? <ToggleRight size={32} className="text-accent-primary" /> : <ToggleLeft size={32} className="text-text-secondary" />}
                </button>
            </div>
            <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                 <div>
                    <p className="font-medium text-text-primary">Language</p>
                    <p className="text-sm text-text-secondary">Localization features are coming soon.</p>
                </div>
                <select disabled className="bg-input-background border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none">
                    <option>English (US)</option>
                </select>
            </div>
        </div>
    );
};

const DataControlsSettings = () => {
    const { showConfirmDialog } = useAppStore();
     const handleDeleteAccount = () => {
        showConfirmDialog(
            "Delete Account?",
            "Are you sure you want to permanently delete your account and all associated data? This action cannot be undone.",
            () => {
                // In a real app, this would trigger an API call.
                useAppStore.getState().showToast('Account deletion initiated.', 'success');
            }
        );
    };
    return (
        <div className="space-y-6">
            <p className="text-sm text-text-secondary text-center bg-subtle-background p-4 rounded-lg">We're working on features to give you more control over your data, including import and export options.</p>
            <div className="flex items-center justify-between opacity-50">
                <div>
                    <p className="font-medium text-text-primary">Export Data</p>
                    <p className="text-sm text-text-secondary">Download all your reviews and notes in a portable format.</p>
                </div>
                <button disabled className="flex items-center gap-2 px-4 py-2 bg-interactive-background-hover text-text-secondary font-semibold rounded-lg cursor-not-allowed">
                    <Download size={16} />
                    Export
                </button>
            </div>
             <div className="flex items-center justify-between opacity-50">
                <div>
                    <p className="font-medium text-text-primary">Import Data</p>
                    <p className="text-sm text-text-secondary">Import data from another platform.</p>
                </div>
                <button disabled className="flex items-center gap-2 px-4 py-2 bg-interactive-background-hover text-text-secondary font-semibold rounded-lg cursor-not-allowed">
                    <UploadCloud size={16} />
                    Import
                </button>
            </div>
            <hr className="border-border-color" />
             <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-red-400">Delete Account</p>
                    <p className="text-sm text-text-secondary">Permanently delete your account and all data.</p>
                </div>
                <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 font-semibold rounded-lg hover:bg-red-600/40 transition-colors"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </div>
    );
};

const SecuritySettings = () => (
    <div className="space-y-6">
        <p className="text-sm text-text-secondary text-center bg-subtle-background p-4 rounded-lg">We're building robust security features to keep your account safe, including password management and two-factor authentication.</p>
        <div className="opacity-50 space-y-4">
             <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Change Password</label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" size={18} />
                    <input type="password" value="fakepassword" disabled className="w-full bg-input-background border border-border-color rounded-lg px-10 py-2 text-sm cursor-not-allowed" />
                </div>
            </div>
             <div className="flex items-center justify-between">
                 <div>
                    <p className="font-medium text-text-primary">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-text-secondary">Add an extra layer of security to your account.</p>
                </div>
                <button disabled className="cursor-not-allowed">
                    <ToggleLeft size={32} className="text-text-secondary" />
                </button>
            </div>
        </div>
    </div>
);


const AboutSettings = () => {
    const { NavLink } = ReactRouterDOM;
    const aboutLinks = [
        { to: '/help', label: 'Help Center', icon: HelpCircle },
        { to: '/terms', label: 'Terms of Use', icon: FileCog },
        { to: '/privacy', label: 'Privacy Policy', icon: Shield },
    ];
    return (
        <div className="space-y-4">
            {aboutLinks.map(link => (
                <NavLink key={link.to} to={link.to} className="w-full flex items-center justify-between p-3 -m-3 rounded-lg hover:bg-interactive-background-hover transition-colors">
                    <div className="flex items-center">
                        <link.icon className="w-5 h-5 mr-4 text-icon-primary" />
                        <p className="font-medium text-text-primary text-left">{link.label}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary" />
                </NavLink>
            ))}
             <hr className="!my-6 border-border-color"/>
             <div className="text-sm text-text-secondary">
                 <div className="flex justify-between items-center">
                    <span>Developed by</span>
                    <a href="https://tekguyz.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-text-accent hover:underline">TEKGUYZ</a>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span>Application Version</span>
                    <NavLink to="/changelog" className="font-mono text-text-primary hover:underline flex items-center gap-1">
                        1.0.2 <LinkIcon size={14} />
                    </NavLink>
                </div>
             </div>
        </div>
    );
};

const PlaceholderSection: React.FC<{ title: string }> = ({ title }) => (
    <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">This section is currently under development. Check back soon for updates!</p>
    </div>
);

const sections: Record<SectionId, { title: string; component: React.ComponentType }> = {
    profile: { title: 'Profile', component: ProfileSettings },
    general: { title: 'General', component: GeneralSettings },
    apps: { title: 'Apps & Connectors', component: () => <PlaceholderSection title="Apps & Connectors" /> },
    data: { title: 'Data Controls', component: DataControlsSettings },
    security: { title: 'Security', component: SecuritySettings },
    about: { title: 'About', component: AboutSettings },
};

const SettingsView: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SectionId | null>(null);
    const { setAppMode } = useAppStore();

    const menuItems = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'general', icon: Cog, label: 'General' },
        { id: 'apps', icon: Users, label: 'Apps & Connectors' },
        { id: 'data', icon: Database, label: 'Data Controls' },
        { id: 'security', icon: Shield, label: 'Security' },
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
                                    <p className="text-md font-medium text-text-primary text-left">{item.label}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-text-secondary" />
                            </button>
                        </li>
                    ))}
                </ul>
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