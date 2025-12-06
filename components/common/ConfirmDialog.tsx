

import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const ConfirmDialog: React.FC = () => {
  const { visible, title, message, onConfirm, onCancel } = useAppStore((state) => state.confirmDialog);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Fix: Cast the result of querySelectorAll to NodeListOf<HTMLElement> to resolve potential generic type argument errors.
    const focusableElements = modalElement.querySelectorAll('button') as NodeListOf<HTMLElement>;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
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
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, onCancel]);
  
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-panel-background border border-border-color rounded-2xl shadow-2xl p-8"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-600/20 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-400" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 id="confirm-dialog-title" className="text-lg leading-6 font-bold text-text-primary">
                {title}
                </h3>
                <div className="mt-2">
                <p id="confirm-dialog-description" className="text-sm text-text-secondary">
                    {message}
                </p>
                </div>
            </div>
        </div>

        <div className="mt-8 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-border-color shadow-sm px-4 py-2 bg-interactive-background-hover text-base font-medium text-text-primary hover:bg-border-color focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
