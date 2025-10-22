
import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, Calendar, Lock, Users, Loader2, Check, User, Mail } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

type PaymentStatus = 'idle' | 'loading' | 'success';

const PaymentModal: React.FC = () => {
    const { closePaymentModal, showConfetti } = useAppStore(state => ({ closePaymentModal: state.closePaymentModal, showConfetti: state.showConfetti }));
    const [seats, setSeats] = useState(1);
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const modalRef = useRef<HTMLDivElement>(null);

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
            showConfetti();
            setTimeout(() => {
                closePaymentModal();
            }, 1500); // Close after success message
        }, 2000); // Simulate network request
    };

    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const handleClose = () => {
            if (status === 'idle') {
                closePaymentModal();
            }
        };
        
        const focusableElements = modalElement.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        firstElement?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
                return;
            }
            if (event.key === 'Tab' && status === 'idle') {
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
                handleClose();
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
    }, [closePaymentModal, status]);

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

    const inputClasses = "w-full bg-input-background border border-border-color rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none placeholder:text-text-placeholder";
    const inputWithIconClasses = `${inputClasses} pl-10`;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-panel-background border border-border-color rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-title"
            >
                <div className="p-6 border-b border-border-color">
                    <h2 id="payment-title" className="text-xl font-semibold text-text-primary">Complete Your Purchase</h2>
                    <p className="text-sm text-text-secondary">You are upgrading to the Pro Plan.</p>
                </div>

                <form id="payment-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <fieldset disabled={status !== 'idle'}>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-md font-semibold mb-3 text-text-primary">Card Information</h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" size={18} />
                                        <input type="text" placeholder="Card Number" aria-label="Card Number" className={inputWithIconClasses} required />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="relative w-1/2">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" size={18} />
                                            <input type="text" placeholder="MM / YY" aria-label="Expiration Date (MM / YY)" className={inputWithIconClasses} required />
                                        </div>
                                        <div className="relative w-1/2">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" size={18} />
                                            <input type="text" placeholder="CVC" aria-label="Card Verification Code (CVC)" className={inputWithIconClasses} required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <div>
                                <h3 className="text-md font-semibold mb-3 text-text-primary">Billing Information</h3>
                                <div className="space-y-4">
                                     <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" size={18} />
                                        <input type="text" placeholder="Name on Card" aria-label="Name on Card" className={inputWithIconClasses} required />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" size={18} />
                                        <input type="email" placeholder="Email Address" aria-label="Email Address" className={inputWithIconClasses} required />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-md font-semibold mb-3 text-text-primary">Order Summary</h3>
                                <div className="flex justify-between items-center bg-subtle-background p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <Users className="text-text-placeholder mr-3" size={20} />
                                        <label htmlFor="seats" className="text-sm text-text-primary">Seats</label>
                                    </div>
                                    <input
                                        id="seats"
                                        type="number"
                                        value={seats}
                                        onChange={handleSeatsChange}
                                        className="w-20 bg-input-background border border-border-color rounded-lg px-2 py-1 text-center font-semibold"
                                        min="1"
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-color">
                                    <span className="font-semibold text-text-primary">Total Due Today</span>
                                    <span className="text-xl font-bold text-text-primary">${totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
                <div className="p-6 border-t border-border-color">
                     <button
                        type="submit"
                        form="payment-form"
                        disabled={status !== 'idle'}
                        className={`w-full h-12 flex items-center justify-center font-semibold rounded-lg transition-colors text-text-inverted
                            ${status === 'idle' && 'bg-accent-primary hover:bg-accent-primary-hover'}
                            ${status === 'loading' && 'bg-gray-600 cursor-wait'}
                            ${status === 'success' && 'bg-green-500'}
                        `}
                    >
                        {renderButtonContent()}
                    </button>
                </div>
                 <button onClick={() => status === 'idle' && closePaymentModal()} aria-label="Close payment modal" className="absolute top-4 right-4 text-gray-500 hover:text-white disabled:opacity-50" disabled={status !== 'idle'}>
                    <X size={24} />
                 </button>
            </div>
        </div>
    );
};

export default PaymentModal;