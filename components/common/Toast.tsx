
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const Toast: React.FC<{
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}> = ({ message, type, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, 300); // Wait for exit animation
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 300);
  };

  const Icon = type === 'success' ? CheckCircle : XCircle;
  const iconColor = type === 'success' ? 'text-green-400' : 'text-red-400';

  return (
    <div
      className={`
        w-full max-w-sm bg-panel-background border border-border-color rounded-xl shadow-2xl flex items-start p-4
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
      `}
      role="alert"
    >
      <div className="flex-shrink-0">
        <Icon size={20} className={iconColor} />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-text-primary">{message}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full text-icon-primary hover:bg-interactive-background-hover focus:outline-none focus:ring-2 focus:ring-accent-primary"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const toast = useAppStore((state) => state.toast);
  const hideToast = useAppStore((state) => state.hideToast);

  if (!toast) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
    </div>
  );
};

export default ToastContainer;
