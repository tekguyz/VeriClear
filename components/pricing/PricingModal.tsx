
import React from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import PricingTable from './PricingTable';

const PricingModal: React.FC = () => {
    const togglePricingModal = useAppStore(state => state.togglePricingModal);
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="relative w-full max-w-4xl bg-panel-background border border-border-color rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
                <div className="p-8 text-center border-b border-border-color">
                    <h1 className="text-3xl font-bold text-text-primary">Upgrade Your Plan</h1>
                    <p className="text-gray-400 mt-2">Unlock advanced features and higher limits to supercharge your auditing workflow.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8">
                    <PricingTable source="modal" />
                </div>

                <button onClick={togglePricingModal} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

export default PricingModal;
