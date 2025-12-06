

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, X, Loader2, CheckCircle, AlertTriangle, ListChecks, RotateCcw } from 'lucide-react';
import type { UploadedFile } from '../../types';
import { useAppStore } from '../../store/appStore';

const ACCEPTED_FORMATS = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/x-m4a': ['.m4a'],
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf'],
};
const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface FileUploaderProps {
    onProgressUpdate: (step: number) => void;
    onAnalysisComplete: () => void;
    onAnalysisError: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onProgressUpdate, onAnalysisComplete, onAnalysisError }) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const appMode = useAppStore(state => state.appMode);
    const isDemoMode = appMode === 'demo';
    const navigate = useNavigate();
    const componentIsMounted = useRef(true);

    useEffect(() => {
        componentIsMounted.current = true;
        return () => {
            componentIsMounted.current = false;
        };
    }, []);

    const processFiles = (fileList: FileList) => {
        if (isDemoMode) return;
        const newFiles: UploadedFile[] = Array.from(fileList)
            .filter(file => ACCEPTED_FORMATS[file.type] && file.size <= MAX_SIZE_BYTES)
            .map(file => ({ file, progress: 0, status: 'pending' }));
        setFiles(prev => [...prev, ...newFiles]);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            processFiles(event.target.files);
        }
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (event.dataTransfer.files) {
            processFiles(event.dataTransfer.files);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDemoMode]);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        if (isDemoMode) return;
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const removeFile = (fileName: string) => {
        if (isDemoMode) return;
        setFiles(prev => prev.filter(f => f.file.name !== fileName));
    };

    const startAnalysis = async () => {
        if (isDemoMode || files.some(f => f.status === 'uploading' || f.status === 'analyzing')) return;

        if (!componentIsMounted.current) return;
        onProgressUpdate(0); // Reset stepper

        for (let i = 0; i < files.length; i++) {
            const currentFile = files[i];
            
            // Step 1: Uploading
            if (!componentIsMounted.current) return;
            setFiles(prev => prev.map(f => f.file.name === currentFile.file.name ? { ...f, status: 'uploading' } : f));
            
            if (!componentIsMounted.current) return;
            onProgressUpdate(1);

            // Mock upload to Netlify Blobs
            await new Promise(resolve => {
                const interval = setInterval(() => {
                    if (!componentIsMounted.current) {
                        clearInterval(interval);
                        return;
                    }
                    setFiles(prev => prev.map(f => {
                        if (f.file.name === currentFile.file.name) {
                            const newProgress = f.progress + 20;
                            if (newProgress >= 100) {
                                clearInterval(interval);
                                resolve(true);
                                return { ...f, progress: 100 };
                            }
                            return { ...f, progress: newProgress };
                        }
                        return f;
                    }));
                }, 200);
            });
            
            if (!componentIsMounted.current) return;

            // Step 2: Analyzing
            setFiles(prev => prev.map(f => f.file.name === currentFile.file.name ? { ...f, status: 'analyzing' } : f));
            
            if (!componentIsMounted.current) return;
            onProgressUpdate(2);

            try {
                // Trigger analysis Netlify function
                const response = await fetch('/.netlify/functions/analyzeBatch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename: currentFile.file.name }),
                });

                if (!componentIsMounted.current) return;

                if (!response.ok) {
                    throw new Error('Analysis failed');
                }
                
                const result = await response.json();
                console.log('Analysis result:', result);

                // Steps 3 & 4 are backend, we just mark as completed
                onProgressUpdate(3); // Function Calling
                if (!componentIsMounted.current) return;
                onProgressUpdate(4); // Storing

                if (!componentIsMounted.current) return;
                setFiles(prev => prev.map(f => f.file.name === currentFile.file.name ? { ...f, status: 'completed' } : f));

            } catch (error) {
                if (!componentIsMounted.current) return;
                console.error(error);
                setFiles(prev => prev.map(f => f.file.name === currentFile.file.name ? { ...f, status: 'failed', error: 'Analysis failed' } : f));
                onAnalysisError();
                return; // Stop processing on first error
            }
        }
        
        if (!componentIsMounted.current) return;
        onAnalysisComplete();

        if (!componentIsMounted.current) return;
        setIsComplete(true);
    };

    const handleReset = () => {
        setFiles([]);
        setIsComplete(false);
        onProgressUpdate(0);
    };

    const renderFileStatusIcon = (status: UploadedFile['status']) => {
        switch (status) {
            case 'analyzing':
            case 'uploading':
                return <Loader2 className="animate-spin text-text-accent" size={20} />;
            case 'completed':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'failed':
                return <AlertTriangle className="text-red-500" size={20} />;
            default:
                return <FileText className="text-icon-primary" size={20} />;
        }
    };
    
    if (isComplete) {
        return (
            <div className="bg-panel-background border border-border-color rounded-2xl p-8 text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="text-green-500" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-text-primary">Analysis Complete</h3>
                <p className="text-sm text-text-secondary mt-1 mb-6">Your files have been processed successfully.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate('/reviews')}
                        className="w-full flex items-center justify-center gap-2 bg-accent-primary text-text-inverted py-2.5 rounded-lg font-semibold hover:bg-accent-primary-hover"
                    >
                        <ListChecks size={16} />
                        View Reviews
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full flex items-center justify-center gap-2 bg-interactive-background-hover text-text-primary py-2.5 rounded-lg font-semibold hover:bg-border-color"
                    >
                        <RotateCcw size={16} />
                        Start New Upload
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-panel-background border border-border-color rounded-2xl p-6">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                className={`relative w-full p-8 border-2 border-dashed ${isDragging ? 'border-accent-primary' : 'border-border-color'} rounded-2xl text-center transition-colors ${isDemoMode ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept={Object.keys(ACCEPTED_FORMATS).join(',')}
                    disabled={isDemoMode}
                />
                <label htmlFor="file-upload" className={isDemoMode ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    <div className="flex justify-center mb-4">
                        <UploadCloud className="text-icon-primary" size={48} />
                    </div>
                    <p className="font-semibold text-text-primary">Click to upload or drag and drop</p>
                    <p className="text-sm text-text-secondary">MP3, WAV, M4A, TXT, PDF (Max 15MB)</p>
                </label>
                 {isDemoMode && <div className="absolute inset-0 bg-panel-background/70 rounded-2xl flex items-center justify-center"><span className="px-4 py-2 bg-black/70 text-white rounded-md font-semibold">Disabled in Demo Mode</span></div>}
            </div>

            {files.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">File Queue</h3>
                    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {files.map(f => (
                            <li key={f.file.name} className="flex items-center justify-between bg-subtle-background p-3 rounded-lg">
                                <div className="flex items-center overflow-hidden">
                                    <div className="mr-3 flex-shrink-0">{renderFileStatusIcon(f.status)}</div>
                                    <div className="flex-grow overflow-hidden">
                                        <p className="text-sm font-medium truncate" title={f.file.name}>{f.file.name}</p>
                                         {(f.status === 'uploading') && (
                                            <div className="w-full bg-border-color rounded-full h-1.5 mt-1">
                                                <div className="bg-accent-primary h-1.5 rounded-full" style={{ width: `${f.progress}%` }}></div>
                                            </div>
                                        )}
                                        {f.status === 'failed' && <p className="text-xs text-red-400">{f.error}</p>}
                                    </div>
                                </div>
                                <button onClick={() => removeFile(f.file.name)} className="text-text-secondary hover:text-red-500 ml-2 flex-shrink-0">
                                    <X size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                     <button 
                        onClick={startAnalysis} 
                        disabled={isDemoMode || files.length === 0 || files.some(f => f.status === 'uploading' || f.status === 'analyzing')}
                        className="mt-6 w-full bg-accent-primary text-text-inverted py-2.5 rounded-lg font-semibold hover:bg-accent-primary-hover flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Start Analysis
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
