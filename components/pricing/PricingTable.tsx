
import React from 'react';
import { Check } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'For individuals and small teams getting started.',
        cta: 'Get Started',
        features: [
            '60 Live Call Minutes / Mo',
            '10 File Uploads / Mo',
            '15MB Max File Size',
            'Basic Analytics',
            'Community Support',
        ],
        popular: false,
    },
    {
        name: 'Pro',
        price: '$25',
        description: 'For growing teams that need more power and support.',
        cta: 'Upgrade to Pro',
        features: [
            '5,000 Live Call Minutes / Mo',
            'Unlimited File Uploads',
            '100MB Max File Size',
            'Advanced Analytics Dashboard',
            'Team Collaboration',
            'Priority Email Support',
        ],
        popular: true,
    },
];

interface PricingTableProps {
  source: 'landing' | 'modal';
}

const PricingTable: React.FC<PricingTableProps> = ({ source }) => {
    const openPaymentModal = useAppStore(state => state.openPaymentModal);
    const setAppMode = useAppStore(state => state.setAppMode);

    const handleCTAClick = (planName: string) => {
        if (planName === 'Pro') {
            openPaymentModal();
        } else {
            setAppMode('app');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map(plan => (
                <div key={plan.name} className={`relative flex flex-col bg-panel-background border rounded-2xl p-8 ${plan.popular ? 'border-accent-primary' : 'border-border-color'}`}>
                    {plan.popular && (
                        <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                            <span className="bg-accent-primary text-white text-xs font-semibold px-4 py-1 rounded-full uppercase">Most Popular</span>
                        </div>
                    )}
                    <h3 className="text-2xl font-semibold">{plan.name}</h3>
                    <p className="text-gray-400 mt-2 mb-6 h-10">{plan.description}</p>
                    <div className="flex items-baseline mb-6">
                        <span className="text-5xl font-bold">{plan.price}</span>
                        {plan.name === 'Pro' && <span className="text-gray-400 ml-2">/ user / month</span>}
                        {plan.name === 'Free' && <span className="text-gray-400 ml-2">/ month</span>}
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {plan.features.map(feature => (
                            <li key={feature} className="flex items-center">
                                <Check className="text-green-500 mr-3 flex-shrink-0" size={20} />
                                <span className="text-gray-300">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => handleCTAClick(plan.name)}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.popular ? 'bg-accent-primary text-white hover:bg-blue-600' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                        {plan.cta}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default PricingTable;