import React, { useState, useCallback } from 'react';
import FileUploader from './FileUploader';
import FileManager from '../fileManager/FileManager';
import ProcessStatusStepper from './ProcessStatusStepper';

type StepperStatus = 'idle' | 'in-progress' | 'success' | 'error';

const BatchAnalysisView: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [stepperStatus, setStepperStatus] = useState<StepperStatus>('idle');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAnalysisComplete = useCallback(() => {
        setCurrentStep(4);
        setStepperStatus('success');
        setRefreshKey(k => k + 1);
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
        <div className="animate-fade-in">
            <p className="text-gray-400 mb-8">Upload audio recordings or call transcripts for asynchronous processing and review audit records.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                   <FileUploader 
                     onAnalysisComplete={handleAnalysisComplete} 
                     onProgressUpdate={handleProgressUpdate}
                     onAnalysisError={handleAnalysisError}
                   />
                   <ProcessStatusStepper currentStep={currentStep} status={stepperStatus} />
                </div>
                <div className="lg:col-span-3">
                    <FileManager key={refreshKey} />
                </div>
            </div>
        </div>
    );
};

export default BatchAnalysisView;
