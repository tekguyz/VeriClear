import React from 'react';
import { UploadCloud, Cpu, FunctionSquare, Database, Check, X } from 'lucide-react';

interface Step {
  name: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { name: 'Uploading', icon: UploadCloud },
  { name: 'Analyzing', icon: Cpu },
  { name: 'Function Calling', icon: FunctionSquare },
  { name: 'Storing', icon: Database },
];

type StepperStatus = 'idle' | 'in-progress' | 'success' | 'error';

interface ProcessStatusStepperProps {
  currentStep: number;
  status: StepperStatus;
}

const ProcessStatusStepper: React.FC<ProcessStatusStepperProps> = ({ currentStep, status }) => {
  return (
    <div className="bg-panel-background border border-border-color rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-text-primary">Processing Status</h3>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepIndex = index + 1;
          const isCompleted = status === 'success' || stepIndex < currentStep;
          const isCurrent = stepIndex === currentStep && status === 'in-progress';
          const isError = stepIndex === currentStep && status === 'error';

          let iconColor = 'text-gray-500';
          if (isCompleted) iconColor = 'text-green-500';
          if (isCurrent) iconColor = 'text-accent-primary';
          if (isError) iconColor = 'text-red-500';

          let statusIcon = <step.icon className={`${iconColor} transition-colors`} size={24} />;
          if (isCompleted) statusIcon = <Check className="text-white" size={16} />;
          if (isError) statusIcon = <X className="text-white" size={16} />;

          let circleClass = 'bg-gray-700';
          if (isCompleted) circleClass = 'bg-green-500';
          if (isCurrent) circleClass = 'bg-accent-primary animate-pulse';
          if (isError) circleClass = 'bg-red-500';
          
          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${circleClass} transition-colors`}>
                  {isCompleted || isError ? statusIcon : <step.icon className={`${isCurrent ? 'text-white' : 'text-gray-400'}`} size={20} />}
                </div>
                <p className={`mt-2 text-xs text-center ${isCurrent || isCompleted ? 'text-text-primary' : 'text-gray-400'}`}>{step.name}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-auto border-t-2 transition-colors duration-500 ${isCompleted || isCurrent || isError ? 'border-accent-primary' : 'border-gray-700'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessStatusStepper;
