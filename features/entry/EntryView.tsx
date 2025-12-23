
import React, { useState } from 'react';
import { PlayCircle, Zap, Headset, ListChecks, BarChart, CheckSquare, Smartphone, Puzzle, ChevronDown, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
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

const MetricCard: React.FC<{ icon: React.ElementType, value: string, label: string, subtext: string, delay: string }> = ({ icon: Icon, value, label, subtext, delay }) => (
    <div className={`bg-panel-background border border-border-color rounded-2xl p-6 shadow-xl flex flex-col items-start hover:border-accent-primary transition-all duration-500 hover:-translate-y-1 animate-fade-in ${delay}`}>
        <div className="p-3 bg-accent-primary/10 rounded-lg mb-4">
            <Icon className="text-accent-primary" size={24} />
        </div>
        <h3 className="text-4xl font-bold text-text-primary mb-1">{value}</h3>
        <p className="font-semibold text-text-primary text-lg">{label}</p>
        <p className="text-sm text-text-secondary mt-2">{subtext}</p>
    </div>
);

const EntryView: React.FC = () => {
  const setAppMode = useAppStore((state) => state.setAppMode);
  const [openAccordion, setOpenAccordion] = useState<string | null>(features[0].title);

  const scrollToFeatures = () => {
      const element = document.getElementById('features-section');
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    <div className="bg-primary-background text-text-primary font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-center min-h-[90vh] p-8 lg:px-16 lg:py-20 animate-fade-in overflow-hidden">
        
        {/* Left Column: Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10 mb-12 lg:mb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-semibold mb-6 animate-slide-in-up">
             <Zap size={14} fill="currentColor" />
             <span>AI-Powered Quality Assurance</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Compliance <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Made Crystal Clear</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-text-secondary mb-10 max-w-xl">
            VeriClear listens to your customer calls, spots compliance risks in real-time, and gives you actionable insights to improve performance instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setAppMode('demo')}
              className="w-full sm:w-auto group relative flex items-center justify-center gap-3 px-8 py-4 bg-accent-primary text-white font-bold text-lg rounded-xl shadow-lg hover:bg-accent-primary-hover hover:shadow-accent-primary/25 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <PlayCircle size={24} className="group-hover:scale-110 transition-transform" />
              <span>Launch Interactive Demo</span>
              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </div>
            </button>
            
            <button
                onClick={scrollToFeatures}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-panel-background border border-border-color text-text-primary font-semibold text-lg rounded-xl hover:bg-interactive-background-hover transition-all"
            >
                See Features
                <ArrowRight size={20} />
            </button>
          </div>
          
          <p className="mt-6 text-sm text-text-secondary">No credit card required. No installation needed.</p>
        </div>

        {/* Right Column: Visuals / Metrics */}
        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end items-center">
            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl -z-10 opacity-60"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg w-full">
                <div className="space-y-6 lg:translate-y-12">
                     <MetricCard 
                        icon={Clock} 
                        value="90%" 
                        label="Faster Reviews" 
                        subtext="AI turns hours of manual auditing into minutes."
                        delay="delay-100"
                    />
                     <MetricCard 
                        icon={ShieldCheck} 
                        value="35%" 
                        label="Fewer Errors" 
                        subtext="Catch compliance misses before they become fines."
                        delay="delay-300"
                    />
                </div>
                <div className="space-y-6 sm:translate-y-0">
                     <MetricCard 
                        icon={CheckCircle2} 
                        value="100%" 
                        label="Full Coverage" 
                        subtext="Analyze every single call, not just a random sample."
                        delay="delay-200"
                    />
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col justify-center items-center text-center text-white relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent-primary/10 group-hover:bg-accent-primary/20 transition-colors"></div>
                        <Zap size={32} className="text-yellow-400 mb-3 relative z-10" />
                        <h3 className="font-bold text-xl mb-1 relative z-10">Real-Time</h3>
                        <p className="text-sm text-gray-400 relative z-10">Coaching & Alerts</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features Accordion Section */}
      <section id="features-section" className="py-24 px-8 bg-subtle-background/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-bold mb-4">One Platform, Every Feature</h2>
             <p className="text-xl text-text-secondary max-w-2xl mx-auto">From real-time assistance to in-depth analytics, here's everything VeriClear can do for your team.</p>
          </div>
         
          <div className="bg-panel-background border border-border-color rounded-3xl shadow-2xl overflow-hidden">
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
      <section className="py-24 px-8 bg-primary-background">
          <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
              <p className="text-center text-text-secondary mb-12 text-lg">Start for free, scale as you grow.</p>
              <PricingTable source="landing" />
          </div>
      </section>
    </div>
  );
};

export default EntryView;
