
import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

interface InfoPopoverProps {
  content: React.ReactNode;
}

const InfoPopover: React.FC<InfoPopoverProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(popoverRef, () => setIsOpen(false));

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div ref={popoverRef} className="relative">
      <button
        onClick={() => setIsOpen(p => !p)}
        className="text-icon-primary hover:text-text-primary"
        aria-label="More information"
      >
        <Info size={16} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-panel-background border border-border-color rounded-xl shadow-2xl p-4 text-sm animate-fade-in z-20">
          <div className="text-text-secondary leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPopover;
