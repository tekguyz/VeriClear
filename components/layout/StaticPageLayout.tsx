
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const StaticPageLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col bg-primary-background text-text-primary font-sans">
      <header className="py-4 px-8 border-b border-border-color">
        <Link to="/" className="text-xl font-bold text-text-primary">VeriClear</Link>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="prose prose-invert max-w-none text-gray-300 prose-headings:text-gray-100 prose-headings:font-semibold prose-headings:border-b prose-headings:border-border-color prose-headings:pb-3 prose-h2:mt-12 prose-h2:mb-4 md:prose-h2:mb-6 prose-p:leading-relaxed prose-a:text-accent-primary hover:prose-a:underline">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StaticPageLayout;