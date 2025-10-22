
import React, { useState, useCallback } from 'react';
import FileUploader from './FileUploader';
import ProcessStatusStepper from './ProcessStatusStepper';

type StepperStatus = 'idle' | 'in-progress' | 'success' | 'error';

const BatchAnalysisView: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [stepperStatus, setStepperStatus] = useState<StepperStatus>('idle');

    const handleAnalysisComplete = useCallback(() => {
        setCurrentStep(4);
        setStepperStatus('success');
        // In a real app, you might navigate to the reviews page
        // or show a success notification.
        setTimeout(() => {
            setCurrentStep(0);
            setStepperStatus('idle');
        }, 5000);
    }, []);
    
    const handleAnalysisError = useCallback(() => {
        setStepperStatus('error');
    }, []);

    const handleProgressUpdate = useCallback((step: number) => {
        setCurrentStep(step);
        setStepperStatus('in-progress');
    }, []);

    return (
        <div className="animate-fade-in max-w-xl mx-auto">
            <p className="text-gray-400 mb-8 text-center">Let our AI analyze your call recordings. Upload audio or transcript files, and we'll generate a detailed review, flagging compliance issues and scoring agent performance.</p>
            
            <div className="flex flex-col gap-8">
               <FileUploader 
                 onAnalysisComplete={handleAnalysisComplete} 
                 onProgressUpdate={handleProgressUpdate}
                 onAnalysisError={handleAnalysisError}
               />
               <ProcessStatusStepper currentStep={currentStep} status={stepperStatus} />
            </div>
        </div>
    );
};

export default BatchAnalysisView;