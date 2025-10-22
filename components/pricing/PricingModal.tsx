
import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import PricingTable from './PricingTable';

const PricingModal: React.FC = () => {
    const togglePricingModal = useAppStore(state => state.togglePricingModal);
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const focusableElements = modalElement.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        firstElement?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                togglePricingModal();
                return;
            }
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement?.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement?.focus();
                        event.preventDefault();
                    }
                }
            }
        };

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                togglePricingModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [togglePricingModal]);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div 
              ref={modalRef} 
              className="relative w-full max-w-4xl bg-panel-background border border-border-color rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="pricing-title"
            >
                <div className="p-8 text-center border-b border-border-color">
                    <h1 id="pricing-title" className="text-3xl font-bold text-text-primary">Upgrade Your Plan</h1>
                    <p className="text-gray-400 mt-2">Unlock advanced features and higher limits to supercharge your auditing workflow.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8">
                    <PricingTable source="modal" />
                </div>

                <button onClick={togglePricingModal} className="absolute top-4 right-4 text-gray-500 hover:text-white" aria-label="Close pricing modal">
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

export default PricingModal;
