
import React from 'react';
// Fix: Use namespace import for react-router-dom to resolve export issues.
import * as ReactRouterDOM from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundView: React.FC = () => {
  const { Link } = ReactRouterDOM;
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary-background text-text-primary text-center">
      <AlertTriangle size={64} className="text-yellow-400 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-gray-400 mb-8">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-accent-primary text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-600 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundView;
