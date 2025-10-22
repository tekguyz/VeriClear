import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Headset, ListChecks, BarChart, Smartphone, Puzzle, Zap } from 'lucide-react';
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
          className="w-full flex justify-between items-center text-left py-4 px-1 rounded-t-lg hover:bg-interactive-background-hover/50"
        >
          <div className="flex items-center">
            <Icon className={`mr-4 ${isOpen ? 'text-accent-primary' : 'text-gray-400'}`} size={24} />
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
          <div className="pb-6 pt-2 px-1 text-gray-400">{children}</div>
        </div>
      </div>
    </div>
  );
};


const DecorativeSidePanel: React.FC = () => (
    <div className="hidden md:flex flex-col items-center justify-center bg-primary-background p-8 rounded-l-2xl border-r border-border-color overflow-hidden">
        <div className="relative w-full max-w-xs h-auto aspect-square flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-transparent rounded-full animate-pulse"></div>
            <Logomark className="w-24 h-24 text-accent-primary z-10" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mt-8">Welcome to VeriClear</h2>
        <p className="text-text-secondary mt-2 text-center">Your AI-powered coaching platform.</p>
        <div className="mt-12 w-full p-4 bg-panel-background border border-border-color rounded-xl shadow-lg">
            <p className="text-xs text-text-secondary font-semibold mb-2">APP PREVIEW</p>
            <div className="flex gap-2">
                <div className="w-1/4 bg-subtle-background rounded h-24"></div>
                <div className="w-2/4 bg-subtle-background rounded h-24"></div>
                <div className="w-1/4 bg-subtle-background rounded h-24"></div>
            </div>
        </div>
    </div>
);


interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  // Fix: Changed React import to provide correct types for hooks and removed incorrect "Fix" comment.
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

    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
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
    <div className="fixed inset-0 bg-black/70 md:backdrop-blur-sm z-[100] flex items-center justify-center md:p-4">
        {/* Mobile: Fullscreen slide-up */}
        <div 
            ref={mobileModalRef} 
            className="md:hidden w-full h-full bg-panel-background flex flex-col animate-slide-in-up"
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title-mobile"
        >
             <div className="p-8 text-center border-b border-border-color">
                <h1 id="onboarding-title-mobile" className="text-3xl font-bold text-text-primary">Welcome to VeriClear!</h1>
                <p className="text-gray-400 mt-2">Here's a quick look at the powerful features at your disposal.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                <AccordionContent openAccordion={openAccordion} toggleAccordion={toggleAccordion} />
            </div>
             <div className="p-4 border-t border-border-color bg-panel-background">
                <button
                    onClick={onClose}
                    className="w-full px-12 py-3 bg-accent-primary text-white font-semibold rounded-lg shadow-lg hover:bg-accent-primary-hover transition-colors"
                >
                    Get Started
                </button>
            </div>
        </div>

        {/* Desktop: Two-column centered modal */}
        <div 
            ref={modalRef} 
            className="hidden md:flex w-full max-w-4xl bg-panel-background border border-border-color rounded-2xl shadow-2xl max-h-[90vh] animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
        >
            <DecorativeSidePanel />
            <div className="flex-1 flex flex-col">
                 <div className="p-8 text-center border-b border-border-color">
                    <h1 id="onboarding-title" className="text-3xl font-bold text-text-primary">Feature Overview</h1>
                    <p className="text-gray-400 mt-2">A quick look at the powerful tools at your disposal.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                     <AccordionContent openAccordion={openAccordion} toggleAccordion={toggleAccordion} />
                </div>
                <div className="p-6 border-t border-border-color text-center">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-12 py-3 bg-accent-primary text-white font-semibold rounded-lg shadow-lg hover:bg-accent-primary-hover transition-colors"
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
    <>
        <AccordionItem
            title="AI Co-Pilot"
            id="live-copilot"
            icon={Headset}
            isOpen={openAccordion === 'live-copilot'}
            onClick={() => toggleAccordion('live-copilot')}
            >
            <div className="space-y-4">
                <p>The Co-Pilot feature is powered by a new, low-latency model designed for real-time voice interactions. Think of it as an incredibly smart "co-pilot" sitting next to your human agents.</p>
                <div>
                <h4 className="font-semibold text-text-primary mb-1">Real-time Transcription</h4>
                <p>Creates a live, written record of the entire conversation, separating who said what (customer vs. agent).</p>
                </div>
                <div>
                <h4 className="font-semibold text-text-primary mb-1">Automated Actions</h4>
                <p>Based on what it hears, the AI can automatically trigger actions without the agent lifting a finger. For example:</p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-sm pl-4">
                    <li><strong>Knowledge Lookup:</strong> A customer asks about the return policy, and the AI instantly pulls up the correct document on the agent's screen.</li>
                    <li><strong>Compliance Check:</strong> An agent reads a required legal disclosure, and the AI verifies it was read correctly, flagging any mistakes in real-time.</li>
                    <li><strong>Escalation Alert:</strong> A customer becomes angry, and the AI silently notifies a supervisor that the agent may need assistance.</li>
                </ul>
                </div>
                <div>
                <h4 className="font-semibold text-text-primary mb-1">Instant Feedback & Audit Trail</h4>
                <p>All automated actions and transcriptions appear in the timeline, providing a rich, second-by-second review of not just what was said, but what actions the AI took to assist.</p>
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
            <p>Process hundreds of pre-recorded calls or transcripts asynchronously. Our system performs in-depth analysis, extracts structured data, and generates comprehensive review reports, saving your team countless hours of manual work.</p>
        </AccordionItem>
        <AccordionItem
            title="Actionable Insights"
            id="insights"
            icon={BarChart}
            isOpen={openAccordion === 'insights'}
            onClick={() => toggleAccordion('insights')}
        >
            <p>The Analytics page visualizes key metrics from all your reviews. Track compliance trends over time, monitor agent performance, and identify areas for improvement with easy-to-understand charts and data points.</p>
        </AccordionItem>
        <AccordionItem
            title="Upcoming Features"
            id="coming-soon"
            icon={Zap}
            isOpen={openAccordion === 'coming-soon'}
            onClick={() => toggleAccordion('coming-soon')}
        >
            <div className="space-y-6">
                <div>
                    <div className="flex items-center mb-2">
                        <Smartphone size={20} className="text-icon-primary mr-3 flex-shrink-0" />
                        <h4 className="font-semibold text-text-primary">Native Mobile App</h4>
                    </div>
                    <p className="pl-8 text-text-secondary text-sm">
                        Enable true background analysis on the go. Our native app will let you start a Co-Pilot session and freely switch to other apps like Phone or Zoom, knowing VeriClear is still listening.
                    </p>
                </div>
                <div>
                    <div className="flex items-center mb-2">
                        <Puzzle size={20} className="text-icon-primary mr-3 flex-shrink-0" />
                        <h4 className="font-semibold text-text-primary">Browser Extension</h4>
                    </div>
                    <p className="pl-8 text-text-secondary text-sm">
                        Bring Co-Pilot directly into your web calls. Analyze meetings on platforms like Google Meet or Microsoft Teams with a seamless, integrated experience right inside your browser tab.
                    </p>
                </div>
            </div>
        </AccordionItem>
    </>
);


export default OnboardingModal;
