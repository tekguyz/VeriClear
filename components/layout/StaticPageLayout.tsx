
import React from 'react';
// Fix: Use namespace import for react-router-dom to resolve export issues.
import * as ReactRouterDOM from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const StaticPageLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  const { Link } = ReactRouterDOM;
  return (
    <div className="min-h-screen flex flex-col bg-primary-background text-text-primary font-sans">
      <header className="py-4 px-8 border-b border-border-color">
        <Link to="/" className="text-xl font-bold text-text-primary">VeriClear</Link>
      </header>
      <main className="flex-1 w-full max-w-3xl mx-auto py-12 px-6">
        <Link to="/settings" className="flex items-center gap-2 text-gray-400 hover:text-accent-primary transition-colors mb-8">
            <ArrowLeft size={16} />
            Back to Settings
        </Link>
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="prose prose-invert max-w-none 
          text-gray-300 
          prose-p:leading-relaxed 
          prose-a:text-accent-primary hover:prose-a:underline
          prose-headings:text-text-primary prose-headings:font-bold
          prose-h3:mb-2 prose-h3:text-xl
          prose-ul:list-disc prose-ul:pl-5
          prose-li:mb-10 prose-li:pl-2
          prose-li:marker:text-accent-primary prose-li:marker:text-xl
        ">
            {children}
        </div>
      </main>
      <footer className="w-full text-center py-6 text-xs text-gray-500">
         © {new Date().getFullYear()} VeriClear. All Rights Reserved.
      </footer>
    </div>
  );
};

export default StaticPageLayout;