
import React from 'react';
// Fix: Use namespace import for react-router-dom to resolve export issues.
import * as ReactRouterDOM from 'react-router-dom';

const Footer: React.FC = () => {
  const { Link } = ReactRouterDOM;
  return (
    <footer className="w-full text-center py-6 text-xs text-gray-500">
      <div className="flex justify-center gap-4 mb-2">
        <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
        <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
        <Link to="/ai-ethics" className="hover:text-gray-300 transition-colors">AI Ethics</Link>
        <Link to="/cookie-policy" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
      </div>
      <div>© {new Date().getFullYear()} VeriClear. All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;
