
import React, { useState, useEffect } from 'react';
import { X, CreditCard, Calendar, Lock, Users, Loader2, Check } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

type PaymentStatus = 'idle' | 'loading' | 'success';

const PaymentModal: React.FC = () => {
    const closePaymentModal = useAppStore(state => state.closePaymentModal);
    const [seats, setSeats] = useState(1);
    const [status, setStatus] = useState<PaymentStatus>('idle');

    const handleSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 100) value = 100; // Max seats
        setSeats(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (status !== 'idle') return;

        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                closePaymentModal();
            }, 1500); // Close after success message
        }, 2000); // Simulate network request
    };

    const totalPrice = (seats * 25).toFixed(2);

    const renderButtonContent = () => {
        if (status === 'loading') {
            return <Loader2 className="animate-spin" size={20} />;
        }
        if (status === 'success') {
            return <Check size={20} />;
        }
        return `Confirm Payment - $${totalPrice}`;
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="relative w-full max-w-lg bg-panel-background border border-border-color rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 text-center border-b border-border-color">
                    <h1 className="text-2xl font-bold text-text-primary">Upgrade to Pro</h1>
                    <p className="text-gray-400 mt-1">Complete your payment to unlock Pro features.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div>
                        <label htmlFor="seats" className="block text-sm font-medium text-gray-300 mb-2">Number of Seats</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="number"
                                id="seats"
                                value={seats}
                                onChange={handleSeatsChange}
                                className="w-full bg-gray-800/50 border border-border-color rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none"
                                min="1"
                                max="100"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="card-name" className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                        <input type="text" id="card-name" placeholder="John Doe" required className="w-full bg-gray-800/50 border border-border-color rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none" />
                    </div>
                    
                    <div>
                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-300 mb-2">Card Details</label>
                        <div className="relative">
                             <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                             <input type="text" id="card-number" placeholder="4242 4242 4242 4242" required className="w-full bg-gray-800/50 border border-border-color rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none" />
                        </div>
                        <div className="flex gap-4 mt-4">
                            <div className="relative w-1/2">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input type="text" placeholder="MM/YY" required className="w-full bg-gray-800/50 border border-border-color rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none" />
                            </div>
                             <div className="relative w-1/2">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input type="text" placeholder="CVC" required className="w-full bg-gray-800/50 border border-border-color rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none" />
                            </div>
                        </div>
                    </div>
                     <p className="text-xs text-gray-500 text-center">This is a placeholder form. No real payment will be processed.</p>
                </form>
                
                <div className="p-6 border-t border-border-color">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={status !== 'idle'}
                        className={`w-full h-12 flex items-center justify-center px-12 py-3 text-white font-semibold rounded-lg shadow-lg transition-colors transform ${
                            status === 'success' ? 'bg-green-600' : 'bg-accent-primary hover:bg-indigo-600'
                        } disabled:bg-gray-600 disabled:cursor-not-allowed`}
                    >
                        {renderButtonContent()}
                    </button>
                </div>

                <button onClick={closePaymentModal} disabled={status !== 'idle'} className="absolute top-4 right-4 text-gray-500 hover:text-white disabled:opacity-50">
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

export default PaymentModal;
