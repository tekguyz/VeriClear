import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const StaticPageLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col bg-primary-background text-text-primary font-sans">
      <header className="py-4 px-8 border-b border-border-color">
        <Link to="/" className="text-xl font-bold text-text-primary">VeriClear</Link>
      </header>
      <main className="flex-1 w-full max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="prose prose-invert max-w-none 
          text-gray-300 
          prose-p:leading-relaxed 
          prose-a:text-accent-primary hover:prose-a:underline
          prose-headings:text-text-primary prose-headings:font-bold
          prose-h3:mb-2 prose-h3:text-xl
          prose-ol:list-decimal prose-ol:pl-5
          prose-li:pb-4 prose-li:pl-4
          prose-li:marker:text-gray-400 prose-li:marker:font-semibold prose-li:marker:text-lg
        ">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StaticPageLayout;