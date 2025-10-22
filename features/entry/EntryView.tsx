
import React from 'react';
import { PlayCircle, Zap } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import Footer from '../../components/layout/Footer';

const EntryView: React.FC = () => {
  const setAppMode = useAppStore((state) => state.setAppMode);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary-background text-text-primary font-sans">
      <div className="flex-1 flex items-center justify-center text-center p-8 max-w-2xl mx-auto animate-fade-in">
        <div>
          <h1 className="text-5xl font-bold mb-4">
            Welcome to <span className="text-accent-primary">VeriClear</span>
          </h1>
          <p className="text-lg text-gray-400 mb-12">
            An advanced compliance and audit dashboard featuring live call analysis, batch processing, and detailed audit trails.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => setAppMode('demo')}
              className="w-full sm:w-64 flex items-center justify-center gap-3 px-6 py-4 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
            >
              <PlayCircle size={24} />
              Launch Interactive Demo
            </button>
            <button
              onClick={() => setAppMode('app')}
              className="w-full sm:w-64 flex items-center justify-center gap-3 px-6 py-4 bg-accent-primary text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-600 transition-transform transform hover:scale-105"
            >
              <Zap size={24} />
              Start Full Application
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-12">
            The interactive demo is a read-only environment pre-populated with mock data to showcase features.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EntryView;
