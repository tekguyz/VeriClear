
import React, { useState } from 'react';
import { X, ChevronDown, Phone, ListChecks, LayoutDashboard } from 'lucide-react';

interface AccordionItemProps {
  icon: React.ElementType;
  title: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ icon: Icon, title, isOpen, onClick, children }) => {
  return (
    <div className="border-b border-border-color last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-4 px-5 rounded-t-lg hover:bg-gray-800/50"
      >
        <div className="flex items-center">
          <Icon className={`mr-4 ${isOpen ? 'text-accent-primary' : 'text-gray-400'}`} size={24} />
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        <ChevronDown
          className={`transform transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180 text-accent-primary' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="pb-6 px-5 text-gray-400">{children}</div>
        </div>
      </div>
    </div>
  );
};


interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [openAccordion, setOpenAccordion] = useState<string>('live-copilot');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-panel-background border border-border-color rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-8 text-center border-b border-border-color">
          <h1 className="text-3xl font-bold text-text-primary">Welcome to VeriClear!</h1>
          <p className="text-gray-400 mt-2">Here's a quick look at the powerful features at your disposal.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <AccordionItem
            title="Live AI Co-Pilot"
            icon={Phone}
            isOpen={openAccordion === 'live-copilot'}
            onClick={() => toggleAccordion('live-copilot')}
          >
            <div className="space-y-4">
              <p>The Live Call Analysis feature is powered by a new, low-latency model designed for real-time voice interactions. Think of it as an incredibly smart "co-pilot" sitting next to your human agents.</p>
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
                <p>All automated actions and transcriptions appear in the timeline, providing a rich, second-by-second audit trail of not just what was said, but what actions the AI took to assist.</p>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            title="Effortless Batch Audits"
            icon={ListChecks}
            isOpen={openAccordion === 'batch-audits'}
            onClick={() => toggleAccordion('batch-audits')}
          >
            <p>Process hundreds of pre-recorded calls or transcripts asynchronously. Our system performs in-depth analysis, extracts structured data, and generates comprehensive audit reports, saving your team countless hours of manual review.</p>
          </AccordionItem>
          <AccordionItem
            title="Actionable Insights"
            icon={LayoutDashboard}
            isOpen={openAccordion === 'insights'}
            onClick={() => toggleAccordion('insights')}
          >
            <p>The Analytics Dashboard visualizes key metrics from all your audits. Track compliance trends over time, monitor agent performance, and identify areas for improvement with easy-to-understand charts and data points.</p>
          </AccordionItem>
        </div>

        <div className="p-6 border-t border-border-color text-center">
            <button
                onClick={onClose}
                className="w-full sm:w-auto px-12 py-3 bg-accent-primary text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
                Get Started
            </button>
        </div>
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <X size={24} />
         </button>
      </div>
    </div>
  );
};

export default OnboardingModal;