

import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, Zap, Headset, ListChecks, BarChart, CheckSquare, Smartphone, Puzzle, ChevronDown, Mail, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import PricingTable from '../../components/pricing/PricingTable';

const features = [
  {
    icon: Headset,
    title: "AI Co-Pilot",
    description: "Get live help during calls. Our AI listens in, suggests answers, and spots problems before they happen, so your team always says the right thing.",
    isComingSoon: false,
  },
  {
    icon: ListChecks,
    title: "Batch File Analysis",
    description: "Review past calls effortlessly. Upload your recordings, and our AI will analyze them, score performance, and deliver easy-to-read reports.",
    isComingSoon: false,
  },
  {
    icon: BarChart,
    title: "Analytics Dashboard",
    description: "See your team's performance at a glance. Our simple dashboard shows you pass rates, customer sentiment, and where you can improve.",
    isComingSoon: false,
  },
  {
    icon: CheckSquare,
    title: "Review Tools",
    description: "Simplify your quality checks. Use our interactive checklist and timeline to review calls, add notes, and track issues with ease.",
    isComingSoon: false,
  },
  {
    icon: Smartphone,
    title: "Native App",
    description: "Enable true background analysis on your mobile device. Start a Co-Pilot session and switch to your Phone or Zoom call, knowing VeriClear is still working for you.",
    isComingSoon: true,
  },
  {
    icon: Puzzle,
    title: "Extension",
    description: "Analyze calls and meetings that happen directly inside a browser tab, like Google Meet or Microsoft Teams, with a seamless and integrated co-pilot experience.",
    isComingSoon: true,
  },
];

const FeatureAccordionItem: React.FC<{
  feature: typeof features[0];
  isOpen: boolean;
  onClick: () => void;
}> = ({ feature, isOpen, onClick }) => {
  const { icon: Icon, title, description, isComingSoon } = feature;
  return (
    <div className="border-b border-border-color last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-5 px-6 hover:bg-interactive-background-hover transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <Icon className="mr-5 text-icon-primary flex-shrink-0" size={24} />
          <span className="text-lg font-semibold text-text-primary">{title}</span>
          {isComingSoon && <span className="ml-3 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">Coming Soon</span>}
        </div>
        <ChevronDown
          className={`transform transition-transform duration-300 text-icon-primary ${isOpen ? 'rotate-180 text-accent-primary' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
                <div className="pb-5 px-6 pl-16 text-text-secondary leading-relaxed">{description}</div>
          </div>
      </div>
    </div>
  );
};

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const EntryView: React.FC = () => {
  const setAppMode = useAppStore((state) => state.setAppMode);
  const [openAccordion, setOpenAccordion] = useState<string | null>(features[0].title);
  const [email, setEmail] = useState('');
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [formMessage, setFormMessage] = useState('');
  const componentIsMounted = useRef(true);

  useEffect(() => {
    componentIsMounted.current = true;
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormStatus('submitting');
      setFormMessage('');

      const formData = new URLSearchParams();
      formData.append('form-name', 'lead-capture');
      formData.append('email', email);

      fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
      })
      .then(() => {
          if (componentIsMounted.current) {
            setFormStatus('success');
            setFormMessage("Thanks for subscribing! We'll be in touch.");
          }
      })
      .catch((error) => {
          if (componentIsMounted.current) {
            setFormStatus('error');
            setFormMessage('Oops! Something went wrong. Please try again.');
          }
      });
  };
  
  const renderButtonContent = () => {
      switch (formStatus) {
          case 'submitting':
              return <Loader2 className="animate-spin" />;
          case 'success':
              return 'Subscribed!';
          case 'error':
              return 'Try Again';
          case 'idle':
          default:
              return 'Get Notified';
      }
  };


  return (
    <div className="bg-primary-background text-text-primary font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center p-8 animate-fade-in">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Unlock <span className="text-accent-primary">Perfect Calls</span> with AI Coaching
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            VeriClear listens to your customer calls, spots issues, and gives you the insights to improve performance and keep customers happy. Perfect for small teams and businesses.
          </p>
          
          {/* Lead Capture Form */}
          <form onSubmit={handleFormSubmit} className="w-full max-w-lg mx-auto mb-6">
            <input type="hidden" name="form-name" value="lead-capture" />
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-placeholder" size={20} />
                <input 
                  type="email"
                  name="email"
                  placeholder="Enter your email for updates"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className="w-full text-lg pl-12 pr-4 py-3 bg-panel-background border border-border-color rounded-full focus:ring-2 focus:ring-accent-primary focus:outline-none placeholder:text-text-placeholder disabled:opacity-70"
                />
              </div>
              <button 
                type="submit"
                disabled={formStatus === 'submitting' || formStatus === 'success'}
                className="flex-shrink-0 h-14 sm:w-40 w-full flex items-center justify-center bg-accent-primary text-white font-semibold rounded-full hover:bg-accent-primary-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {renderButtonContent()}
              </button>
            </div>
             {formMessage && (
                <p className={`mt-4 text-sm ${formStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {formMessage}
                </p>
            )}
          </form>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setAppMode('demo')}
              className="flex items-center justify-center gap-2 px-6 py-3 text-text-secondary font-semibold rounded-lg hover:text-text-primary transition-colors"
            >
              <PlayCircle size={20} />
              Launch Interactive Demo
            </button>
          </div>
        </div>
      </section>

      {/* Value Bridge Section */}
      <section className="py-20 px-8 bg-primary-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-panel-background border border-border-color rounded-2xl p-8">
              <h3 className="text-5xl font-bold text-accent-primary mb-2">90%</h3>
              <p className="font-semibold text-text-primary">Faster Reviews</p>
              <p className="text-sm text-text-secondary mt-1">AI does the heavy lifting, turning hours of work into minutes.</p>
            </div>
            <div className="bg-panel-background border border-border-color rounded-2xl p-8">
              <h3 className="text-5xl font-bold text-accent-primary mb-2">35%</h3>
              <p className="font-semibold text-text-primary">Reduction in Errors</p>
              <p className="text-sm text-text-secondary mt-1">Catch compliance misses and mistakes before they become problems.</p>
            </div>
            <div className="bg-panel-background border border-border-color rounded-2xl p-8">
              <h3 className="text-5xl font-bold text-accent-primary mb-2">100%</h3>
              <p className="font-semibold text-text-primary">Coverage</p>
              <p className="text-sm text-text-secondary mt-1">Analyze every call, not just a small sample, for complete quality assurance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Accordion Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">One Platform, Every Feature</h2>
           <p className="text-center text-gray-400 mb-12">From real-time assistance to in-depth analytics, here's everything VeriClear can do.</p>
          <div className="bg-panel-background border border-border-color rounded-2xl shadow-2xl overflow-hidden">
            {features.map(feature => (
              <FeatureAccordionItem
                key={feature.title}
                feature={feature}
                isOpen={openAccordion === feature.title}
                onClick={() => setOpenAccordion(openAccordion === feature.title ? null : feature.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-8 bg-primary-background">
          <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
              <p className="text-center text-gray-400 mb-12">Start for free, scale as you grow.</p>
              <PricingTable source="landing" />
          </div>
      </section>
    </div>
  );
};

export default EntryView;