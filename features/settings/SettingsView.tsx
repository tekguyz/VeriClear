
import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { NavLink } from 'react-router-dom';
import { 
  ChevronRight, User, Settings as Cog, Palette, Database, Shield, Info, LogOut, 
  ArrowLeft, Sun, Moon, Trash2, Link as LinkIcon, Users, Check, ToggleLeft, ToggleRight, 
  Download, UploadCloud, KeyRound, Mail 
} from 'lucide-react';

const SECTIONS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'general', icon: Cog, label: 'General' },
  { id: 'apps', icon: Users, label: 'Apps & Connectors' },
  { id: 'data', icon: Database, label: 'Data Controls' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'about', icon: Info, label: 'About' },
];

const ACCENT_COLORS = [
  { name: 'Blue', color: '#4285F4', hover: '#3367D6' },
  { name: 'Green', color: '#34A853', hover: '#1E8E3E' },
  { name: 'Pink', color: '#E52565', hover: '#C2185B' },
  { name: 'Orange', color: '#F29900', hover: '#E97500' },
];

const SectionHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="relative flex items-center justify-center mb-6">
    <button onClick={onBack} className="absolute left-0 p-2 text-text-secondary hover:text-text-primary"><ArrowLeft size={24} /></button>
    <h1 className="text-xl font-bold">{title}</h1>
  </div>
);

const Row = ({ label, children, description }: { label: string; children: React.ReactNode; description?: string }) => (
  <div className="flex items-center justify-between py-4 border-b border-border-color last:border-0">
    <div className="flex-1 mr-4">
      <p className="font-medium text-text-primary">{label}</p>
      {description && <p className="text-sm text-text-secondary">{description}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const General = () => {
  const { theme, setTheme, accentColor, setAccentColor, hapticFeedbackEnabled, toggleHapticFeedback } = useAppStore();
  return (
    <div className="space-y-2">
      <Row label="Theme">
        <div className="flex gap-1 p-1 bg-primary-background rounded-lg">
          <button onClick={() => setTheme('light')} className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 ${theme === 'light' ? 'bg-panel-background shadow text-text-primary' : 'text-text-secondary'}`}><Sun size={14} /> Light</button>
          <button onClick={() => setTheme('dark')} className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 ${theme === 'dark' ? 'bg-panel-background shadow text-text-primary' : 'text-text-secondary'}`}><Moon size={14} /> Dark</button>
        </div>
      </Row>
      <Row label="Accent Color">
        <div className="flex gap-2">
          {ACCENT_COLORS.map(c => (
            <button key={c.name} onClick={() => setAccentColor(c.color, c.hover)} className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: c.color }}>
              {accentColor === c.color && <Check size={16} className="text-white" />}
            </button>
          ))}
        </div>
      </Row>
      <Row label="Haptic Feedback" description="Physical feedback on interactions">
        <button onClick={toggleHapticFeedback}>{hapticFeedbackEnabled ? <ToggleRight size={32} className="text-accent-primary" /> : <ToggleLeft size={32} className="text-text-secondary" />}</button>
      </Row>
    </div>
  );
};

const Profile = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center py-4">
      <div className="w-24 h-24 rounded-full bg-accent-primary flex items-center justify-center text-3xl font-bold text-white mb-4">DU</div>
      <p className="font-bold text-lg">Demo User</p>
      <p className="text-sm text-text-secondary">Free Tier</p>
    </div>
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 block">Display Name</label>
        <input type="text" readOnly value="Demo User" className="w-full bg-input-background border border-border-color rounded-lg px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 block">Email Address</label>
        <input type="email" readOnly value="demo@vericlear.ai" className="w-full bg-input-background border border-border-color rounded-lg px-4 py-2.5 text-sm" />
      </div>
    </div>
  </div>
);

const About = () => (
  <div className="space-y-4">
    {['Help Center', 'Terms of Use', 'Privacy Policy'].map(label => (
      <button key={label} className="w-full flex items-center justify-between p-4 hover:bg-interactive-background-hover rounded-lg transition-colors">
        <span className="text-text-primary">{label}</span>
        <ChevronRight size={18} className="text-text-secondary" />
      </button>
    ))}
    <div className="pt-6 border-t border-border-color text-sm text-text-secondary space-y-2">
      <div className="flex justify-between"><span>Version</span><span className="font-mono">1.0.2</span></div>
      <div className="flex justify-between"><span>Developer</span><span className="font-bold text-accent-primary">TEKGUYZ</span></div>
    </div>
  </div>
);

const SettingsView = () => {
  const [active, setActive] = useState<string | null>(null);
  const { setAppMode } = useAppStore();

  if (active) {
    const renderContent = () => {
      if (active === 'profile') return <Profile />;
      if (active === 'general') return <General />;
      if (active === 'about') return <About />;
      return <div className="py-20 text-center text-text-secondary">Coming Soon</div>;
    };
    return (
      <div className="max-w-xl mx-auto animate-fade-in">
        <SectionHeader title={SECTIONS.find(s => s.id === active)?.label || ''} onBack={() => setActive(null)} />
        <div className="bg-panel-background border border-border-color rounded-2xl p-6 shadow-sm">{renderContent()}</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in space-y-4">
      <div className="bg-panel-background border border-border-color rounded-2xl overflow-hidden shadow-sm">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} className="w-full flex items-center justify-between p-4 hover:bg-interactive-background-hover border-b border-border-color last:border-0 transition-colors">
            <div className="flex items-center gap-4">
              <s.icon className="text-icon-primary" size={20} />
              <span className="font-medium text-text-primary">{s.label}</span>
            </div>
            <ChevronRight size={18} className="text-text-secondary" />
          </button>
        ))}
      </div>
      <button onClick={() => setAppMode(null)} className="w-full flex items-center gap-4 p-4 text-red-500 bg-panel-background border border-border-color rounded-2xl hover:bg-red-500/5 transition-colors">
        <LogOut size={20} /> <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
};

export default SettingsView;
