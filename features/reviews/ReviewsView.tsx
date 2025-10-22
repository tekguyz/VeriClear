import React from 'react';
import FileManager from '../../components/fileManager/FileManager';

const ReviewsView: React.FC = () => {
    return (
        <div className="animate-fade-in h-full flex flex-col">
            <p className="text-gray-400 mb-8 text-center max-w-3xl mx-auto">
                Browse, search, and filter all completed reviews from both live calls and file uploads. This is your central repository for every analysis.
            </p>
            <div className="flex-1">
                <FileManager />
            </div>
        </div>
    );
};

export default ReviewsView;