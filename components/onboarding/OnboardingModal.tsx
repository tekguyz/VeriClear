
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Headset, ListChecks, BarChart, Smartphone, Puzzle, Zap, CheckCircle, Mic, Activity, FileText } from 'lucide-react';
import { Logomark } from '../layout/Logomark';

interface AccordionItemProps {
  icon: React.ElementType;
  title: string;
  id: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ icon: Icon, title, id, isOpen, onClick, children }) => {
  const contentId = `accordion-content-${id}`;
  const headerId = `accordion-header-${id}`;

  return (
    <div className="border-b border-border-color last:border-b-0">
      <h3 id={headerId} className="text-lg font-semibold text-text-primary">
        <button
          onClick={onClick}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="w-full flex justify-between items-center text-left py-4 px-2 rounded-lg hover:bg-interactive-background-hover/50 transition-colors"
        >
          <div className="flex items-center">
            <Icon className={`mr-4 ${isOpen ? 'text-accent-primary' : 'text-gray-400'} transition-colors`} size={24} />
            <span>{title}</span>
          </div>
          <ChevronDown
            className={`transform transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180 text-accent-primary' : ''}`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pt-2 px-2 text-gray-400 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};


const DecorativeSidePanel: React.FC = () => (
    <div className="hidden md:flex flex-col items-center justify-center bg-subtle-background p-10 rounded-l-2xl border-r border-border-color overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-primary/10 via-transparent to-transparent"></div>
        
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
             <div className="absolute inset-0 bg-accent-primary/20 rounded-full animate-pulse"></div>
             <div className="absolute inset-4 bg-panel-background rounded-full shadow-lg flex items-center justify-center">
                <Logomark className="w-16 h-16 text-text-primary" />
             </div>
        </div>
        
        <h2 className="text-3xl font-bold text-text-primary text-center">Welcome to <br/> VeriClear</h2>
        <p className="text-text-secondary mt-3 text-center max-w-xs">Your AI-powered coaching & compliance platform.</p>
        
        <div className="mt-12 w-full max-w-xs bg-panel-background border border-border-color rounded-2xl shadow-xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="bg-accent-primary/10 px-4 py-2 border-b border-border-color flex justify-between items-center">
                <p className="text-[10px] text-accent-primary font-bold uppercase tracking-wider">Live Analysis</p>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
            </div>
            <div className="p-4 space-y-3">
                {/* Visual Fake Data */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                            <Activity size={16} />
                        </div>
                        <div>
                            <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                            <div className="h-1.5 w-10 bg-gray-100 dark:bg-gray-800 rounded"></div>
                        </div>
                    </div>
                    <div className="text-right">
                         <span className="text-lg font-bold text-text-primary">9.2</span>
                         <span className="text-[10px] text-text-secondary block">Score</span>
                    </div>
                </div>
                
                <div className="h-px bg-border-color w-full"></div>

                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                         <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                         <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex items-start gap-2">
                         <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                         <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex items-start gap-2 opacity-50">
                         <div className="w-3.5 h-3.5 border border-gray-300 rounded-sm mt-0.5 flex-shrink-0"></div>
                         <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [openAccordion, setOpenAccordion] = useState<string>('live-copilot');
  const modalRef = useRef<HTMLDivElement>(null);
  const mobileModalRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const activeModalRef = isMobile ? mobileModalRef : modalRef;
    
    const modalElement = activeModalRef.current;
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      
      if (event.key === 'Tab') {
        if (event.shiftKey) { // Shift+Tab
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            event.preventDefault();
          }
        }
      }
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    if (!isMobile) { // Only add click outside on desktop
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 md:backdrop-blur-sm z-[100] flex items-center justify-center p-0 md:p-6">
        {/* Mobile: Fullscreen slide-up */}
        <div 
            ref={mobileModalRef} 
            className="md:hidden w-full h-full bg-panel-background flex flex-col animate-slide-in-up"
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title-mobile"
        >
             <div className="p-6 text-center border-b border-border-color bg-subtle-background">
                <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Logomark className="w-6 h-6 text-accent-primary" />
                </div>
                <h1 id="onboarding-title-mobile" className="text-2xl font-bold text-text-primary">Welcome to VeriClear</h1>
                <p className="text-text-secondary mt-1 text-sm">Here's a quick look at your new tools.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <AccordionContent openAccordion={openAccordion} toggleAccordion={toggleAccordion} />
            </div>
             <div className="p-4 border-t border-border-color bg-panel-background pb-8 safe-area-bottom">
                <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-accent-primary text-white font-bold rounded-xl shadow-lg hover:bg-accent-primary-hover transition-colors active:scale-95 transform duration-100"
                >
                    Get Started
                </button>
            </div>
        </div>

        {/* Desktop: Two-column centered modal - INCREASED SIZE */}
        <div 
            ref={modalRef} 
            className="hidden md:flex w-full max-w-6xl bg-panel-background border border-border-color rounded-2xl shadow-2xl max-h-[85vh] h-[700px] animate-fade-in overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
        >
            <div className="w-5/12 h-full">
                 <DecorativeSidePanel />
            </div>
            <div className="w-7/12 flex flex-col h-full">
                 <div className="p-8 border-b border-border-color">
                    <h1 id="onboarding-title" className="text-2xl font-bold text-text-primary">Feature Overview</h1>
                    <p className="text-gray-400 mt-1">Explore the capabilities at your disposal.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-8 thin-scrollbar">
                     <AccordionContent openAccordion={openAccordion} toggleAccordion={toggleAccordion} />
                </div>
                <div className="p-6 border-t border-border-color flex justify-end bg-subtle-background/30">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-accent-primary text-white font-semibold rounded-lg shadow-md hover:bg-accent-primary-hover hover:shadow-lg transition-all"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};


const AccordionContent: React.FC<{ openAccordion: string; toggleAccordion: (id: string) => void }> = ({ openAccordion, toggleAccordion }) => (
    <div className="space-y-1">
        <AccordionItem
            title="AI Co-Pilot"
            id="live-copilot"
            icon={Headset}
            isOpen={openAccordion === 'live-copilot'}
            onClick={() => toggleAccordion('live-copilot')}
            >
            <div className="space-y-4 text-sm">
                <p>The Co-Pilot is your always-on assistant for live calls. It listens, transcribes, and assists in real-time.</p>
                <div className="grid grid-cols-1 gap-4 mt-2">
                    <div className="flex gap-3">
                        <div className="mt-1 bg-blue-500/10 p-1.5 rounded text-blue-500"><Mic size={16} /></div>
                        <div>
                            <h4 className="font-semibold text-text-primary">Real-time Transcription</h4>
                            <p>Creates a live record of the conversation, separating speakers automatically.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="mt-1 bg-purple-500/10 p-1.5 rounded text-purple-500"><Zap size={16} /></div>
                        <div>
                            <h4 className="font-semibold text-text-primary">Automated Actions</h4>
                            <p>Triggers knowledge lookups, compliance checks, and supervisor alerts instantly based on context.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AccordionItem>
        <AccordionItem
            title="Effortless Offline Reviews"
            id="batch-audits"
            icon={ListChecks}
            isOpen={openAccordion === 'batch-audits'}
            onClick={() => toggleAccordion('batch-audits')}
        >
             <div className="space-y-4 text-sm">
                <p>Upload previously recorded calls (MP3, WAV) or transcripts for asynchronous analysis.</p>
                 <div className="flex items-center gap-3 bg-subtle-background p-3 rounded-lg border border-border-color">
                    <FileText size={20} className="text-icon-primary" />
                    <div>
                        <p className="font-medium text-text-primary">Bulk Processing</p>
                        <p className="text-xs text-text-secondary">Queue up multiple files and let AI handle the grading.</p>
                    </div>
                 </div>
             </div>
        </AccordionItem>
        <AccordionItem
            title="Actionable Insights"
            id="insights"
            icon={BarChart}
            isOpen={openAccordion === 'insights'}
            onClick={() => toggleAccordion('insights')}
        >
            <p className="text-sm">Visualize compliance trends, track agent improvement, and identify training opportunities with our comprehensive analytics dashboard.</p>
        </AccordionItem>
        <AccordionItem
            title="Coming Soon: Everywhere"
            id="coming-soon"
            icon={Puzzle}
            isOpen={openAccordion === 'coming-soon'}
            onClick={() => toggleAccordion('coming-soon')}
        >
            <div className="space-y-4 text-sm">
                <div className="flex items-center p-2 rounded hover:bg-interactive-background-hover transition-colors">
                    <Smartphone size={20} className="text-icon-primary mr-3" />
                    <div>
                        <h4 className="font-semibold text-text-primary">Native Mobile App</h4>
                        <p className="text-xs text-text-secondary">Background analysis on iOS & Android.</p>
                    </div>
                </div>
                <div className="flex items-center p-2 rounded hover:bg-interactive-background-hover transition-colors">
                     <Puzzle size={20} className="text-icon-primary mr-3" />
                    <div>
                        <h4 className="font-semibold text-text-primary">Browser Extension</h4>
                        <p className="text-xs text-text-secondary">Integrated directly into Google Meet & Teams.</p>
                    </div>
                </div>
            </div>
        </AccordionItem>
    </div>
);


export default OnboardingModal;
