

import React from 'react';
import { PlayCircle, Zap, Phone, ListChecks, LayoutDashboard, ArrowDown } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import PricingTable from '../../components/pricing/PricingTable';

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
  <div className="card-glow bg-panel-background border border-border-color rounded-2xl p-8 transform transition-transform duration-300 hover:-translate-y-2">
    <div className="flex items-center justify-center w-16 h-16 bg-primary-background border-2 border-border-color rounded-full mb-6">
      <Icon className="text-accent-primary" size={32} />
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);


const EntryView: React.FC = () => {
  const setAppMode = useAppStore((state) => state.setAppMode);

  return (
    <div className="bg-primary-background text-text-primary font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen text-center p-8 animate-fade-in">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to <span className="text-accent-primary">VeriClear</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            An advanced compliance and audit dashboard featuring live call analysis, batch processing, and detailed audit trails.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => setAppMode('demo')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gray-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
            >
              <PlayCircle size={28} />
              Launch Interactive Demo
            </button>
            <button
              onClick={() => setAppMode('app')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-accent-primary text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              <Zap size={28} />
              Start Full Application
            </button>
          </div>
        </div>
        <div className="absolute bottom-10">
          <ArrowDown className="text-gray-600 animate-bounce-slow" size={24} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Powerful Features, Seamless Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Phone} 
              title="Live Call Analysis"
              description="Monitor calls in real-time with an AI co-pilot that transcribes, flags issues, and provides instant agent assistance." 
            />
            <FeatureCard 
              icon={ListChecks} 
              title="Batch Processing"
              description="Upload hundreds of recordings or transcripts for asynchronous, in-depth analysis and generate structured audit reports." 
            />
            <FeatureCard 
              icon={LayoutDashboard} 
              title="Analytics Dashboard"
              description="Visualize key metrics, track compliance trends, and gain actionable insights into your team's performance." 
            />
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