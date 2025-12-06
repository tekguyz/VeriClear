



import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, BarChart, Headset, Upload, ListChecks, History, BookOpen, Smartphone, Puzzle, Star, Bug, Lightbulb, MessageSquare, Loader2, Send, Mail, CreditCard, Shield, Wrench } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

type Topic = 'getting-started' | 'analytics' | 'co-pilot' | 'upload' | 'reviews' | 'billing-plans' | 'security' | 'troubleshooting' | 'browser-extension' | 'native-app' | 'submit-feedback';
type FeedbackType = 'bug' | 'feature' | 'general' | null;
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const navItems = [
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'co-pilot', label: 'Co-Pilot', icon: Headset },
    { id: 'upload', label: 'File Upload', icon: Upload },
    { id: 'reviews', label: 'Reviews', icon: ListChecks },
    { id: 'billing-plans', label: 'Billing & Plans', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Wrench },
    { id: 'browser-extension', label: 'Browser Extension', icon: Puzzle },
    { id: 'native-app', label: 'Native App', icon: Smartphone },
    { id: 'submit-feedback', label: 'Submit Feedback', icon: MessageSquare },
];


const FAQItem: React.FC<{ q: string; a: React.ReactNode, id: string }> = ({ q, a, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentId = `faq-content-${id}`;
    return (
        <div className="border-b border-border-color last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
                aria-expanded={isOpen}
                aria-controls={contentId}
            >
                <h3 className="text-md font-medium text-text-primary">{q}</h3>
                <ChevronDown
                    className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                />
            </button>
            <div id={contentId} className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                     <div className="pb-4 pr-6 text-gray-400">{a}</div>
                </div>
            </div>
        </div>
    );
};

// --- Content Components ---

const GettingStartedContent: React.FC = () => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-semibold mb-3">Welcome to VeriClear</h2>
            <p className="text-gray-400">This guide provides everything you need to know about using VeriClear's powerful features. Use the menu on the left to navigate between topics.</p>
        </div>
        <div>
            <h2 className="text-2xl font-semibold mb-3">Frequently Asked Questions</h2>
            <div className="bg-panel-background border border-border-color rounded-2xl px-6">
                <FAQItem
                    id="demo-mode"
                    q="What is Interactive Demo Mode?"
                    a="Demo Mode is a read-only environment designed to showcase the application's features without any risk. In this mode, all actions like starting calls or uploading files are disabled. It's pre-loaded with sample data to give you a feel for how the application works."
                />
                <FAQItem
                    id="data-storage"
                    q="Where are my notes and checklist data stored?"
                    a="The contents of the 'Notes' editor and the state of the 'Audit Checklist' are saved directly in your browser's local storage. This means the data persists on your machine between sessions but is not stored on a central server."
                />
                 <FAQItem
                    id="clear-data"
                    q="How do I clear my local data and start fresh?"
                    a="Navigate to the 'Settings' page. There you will find a 'Clear Local Cache' button which will reset your notes and checklist data stored in the browser."
                />
            </div>
        </div>
    </div>
);

const AnalyticsContent: React.FC = () => (
    <div>
        <h2 className="text-2xl font-semibold mb-3">Analytics Dashboard</h2>
        <p className="text-gray-400">The Analytics Dashboard provides a high-level overview of your team's performance. It tracks key metrics derived from all completed reviews.</p>
        <div className="mt-6 bg-panel-background border border-border-color rounded-2xl px-6">
            <FAQItem
                id="metrics-source"
                q="Where does the dashboard data come from?"
                a="All metrics on the dashboard are aggregated from the data generated during the 'Co-Pilot' and 'File Upload' analysis processes. Only reviews with a 'completed' status contribute to these metrics."
            />
            <FAQItem
                id="data-freshness"
                q="How often is the data updated?"
                a="The dashboard metrics are polled for updates every 30 seconds to ensure you have near real-time insights into your operations."
            />
        </div>
    </div>
);

const CoPilotContent: React.FC = () => (
    <div>
        <h2 className="text-2xl font-semibold mb-3">Co-Pilot (Live Analysis)</h2>
        <p className="text-gray-400">The Co-Pilot is your real-time AI assistant. It listens to live audio, provides transcriptions, and triggers automated actions to help agents during calls.</p>
         <div className="mt-6 bg-panel-background border border-border-color rounded-2xl px-6">
            <FAQItem
                id="how-copilot-works"
                q="How does it work?"
                a="First, start your call on a separate application (e.g., your phone, Zoom) on speaker. Then, start the session in VeriClear. The app uses your device's microphone to listen to the conversation. For best results, the app must remain open and in the foreground."
            />
            <FAQItem
                id="copilot-functions"
                q="What are 'Function Calls' in the timeline?"
                a="Function calls are automated actions taken by the AI based on the conversation. For example, if a customer mentions a product, the AI can trigger a 'knowledge_base_lookup' function to automatically pull up information for the agent."
            />
        </div>
    </div>
);

const UploadContent: React.FC = () => (
    <div>
        <h2 className="text-2xl font-semibold mb-3">File Upload (Batch Analysis)</h2>
        <p className="text-gray-400">Analyze pre-recorded calls or transcripts by uploading them to VeriClear. The system will process them asynchronously and add the results to your 'Reviews' page.</p>
         <div className="mt-6 bg-panel-background border border-border-color rounded-2xl px-6">
            <FAQItem
                id="upload-formats"
                q="What file formats are supported?"
                a="We currently support audio files (MP3, WAV, M4A) and text transcripts (TXT, PDF). The maximum file size is 15MB."
            />
             <FAQItem
                id="upload-process"
                q="What happens after I upload a file?"
                a="The file is securely uploaded to our server. A serverless function then sends the content to the Gemini API for analysis. The AI extracts key information, scores the interaction, and saves the structured result. The status of this process is shown in the stepper on the upload page."
            />
        </div>
    </div>
);

const ReviewsContent: React.FC = () => (
    <div>
        <h2 className="text-2xl font-semibold mb-3">Reviews</h2>
        <p className="text-gray-400">The Reviews page is the central hub for all completed analyses. Here you can search, filter, and access the detailed reports for every call that has been processed.</p>
         <div className="mt-6 bg-panel-background border border-border-color rounded-2xl px-6">
            <FAQItem
                id="review-sources"
                q="What's the difference between 'Co-Pilot' and 'Upload' sources?"
                a="'Co-Pilot' source indicates the review was generated from a live analysis session. 'Upload' source means it was generated from a file you uploaded for batch processing."
            />
             <FAQItem
                id="review-results"
                q="What do the 'Passed', 'Flagged', and 'Failed' results mean?"
                a={
                    <div className="space-y-2">
                        <p><span className="font-bold text-blue-400">Passed:</span> The call met all quality and compliance standards.</p>
                        <p><span className="font-bold text-orange-400">Flagged:</span> A potential issue was detected that may require manual review.</p>
                        <p><span className="font-bold text-purple-400">Failed:</span> A clear compliance issue or critical error was found.</p>
                    </div>
                }
            />
        </div>
    </div>
);

const FeedbackContent: React.FC = () => {
    const { showToast } = useAppStore();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
    const [comments, setComments] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const componentIsMounted = useRef(true);

    useEffect(() => {
      componentIsMounted.current = true;
      return () => {
        componentIsMounted.current = false;
      };
    }, []);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!feedbackType || rating === 0) {
        showToast('Please select a rating and feedback type.', 'error');
        return;
      }
      setStatus('submitting');
      
      const formData = new URLSearchParams();
      formData.append('form-name', 'feedback-form');
      formData.append('rating', rating.toString());
      formData.append('feedback-type', feedbackType);
      formData.append('comments', comments);
      formData.append('email', email);


      fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
      })
      .then(() => {
          if (componentIsMounted.current) {
              setStatus('success');
              showToast('Thank you for your feedback!', 'success');
              // Reset form
              setRating(0);
              setFeedbackType(null);
              setComments('');
              setEmail('');
              setTimeout(() => {
                  if (componentIsMounted.current) {
                      setStatus('idle');
                  }
              }, 3000);
          }
      })
      .catch(() => {
          if (componentIsMounted.current) {
              setStatus('error');
              showToast('Oops! Something went wrong. Please try again.', 'error');
               setTimeout(() => {
                  if (componentIsMounted.current) {
                      setStatus('idle');
                  }
              }, 3000);
          }
      });
  };

    const feedbackTypes = [
        { id: 'bug', label: 'Bug Report', icon: Bug },
        { id: 'feature', label: 'Feature Request', icon: Lightbulb },
        { id: 'general', label: 'General Feedback', icon: MessageSquare },
    ];
    
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-3">Submit Feedback</h2>
            <p className="text-gray-400 mb-6">We'd love to hear from you! Your feedback helps us improve VeriClear.</p>
            
            <div className="bg-panel-background border border-border-color rounded-2xl p-6">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                     <div>
                        <label className="text-md font-medium text-text-primary mb-3 block">How would you rate your experience?</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform transform hover:scale-125"
                                >
                                    <Star 
                                        size={32} 
                                        className={`${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-600'} transition-colors`} 
                                        fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                     <div>
                        <label className="text-md font-medium text-text-primary mb-3 block">What kind of feedback do you have?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {feedbackTypes.map(({id, label, icon: Icon}) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setFeedbackType(id as FeedbackType)}
                                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors ${feedbackType === id ? 'border-accent-primary bg-accent-primary/10' : 'border-border-color hover:border-gray-600'}`}
                                >
                                    <Icon size={24} className={feedbackType === id ? 'text-accent-primary' : 'text-icon-primary'} />
                                    <span className="mt-2 text-sm font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                     <div>
                        <label htmlFor="comments" className="text-md font-medium text-text-primary mb-2 block">Comments</label>
                        <textarea 
                            id="comments" 
                            name="comments"
                            rows={5} 
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Tell us more..."
                            className="w-full bg-input-background border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none placeholder:text-text-placeholder"
                        />
                    </div>
                    
                     <div>
                        <label htmlFor="email" className="text-md font-medium text-text-primary mb-2 block">Email (Optional)</label>
                         <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" size={18} />
                            <input 
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="So we can follow up with you"
                                className="w-full bg-input-background border border-border-color rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-accent-primary focus:outline-none placeholder:text-text-placeholder"
                            />
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <button 
                            type="submit"
                            disabled={status === 'submitting'}
                            className="inline-flex items-center justify-center gap-2 bg-accent-primary text-text-inverted px-6 py-2.5 rounded-lg font-semibold hover:bg-accent-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {status === 'submitting' && <Loader2 className="animate-spin" size={20} />}
                            <Send size={16} />
                            <span>{status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}</span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-400">This help section is currently under development. Please check back later for more information.</p>
    </div>
);


const HelpView: React.FC = () => {
    const [activeTopic, setActiveTopic] = useState<Topic>('getting-started');
    const setIsLeftPanelOpen = useAppStore(state => state.setIsLeftPanelOpen);
    
    const handleNavClick = (topicId: Topic) => {
        setActiveTopic(topicId);
        // On mobile, close the panel after navigation
        if (window.innerWidth < 1024) {
            setIsLeftPanelOpen(false);
        }
    };

    const renderContent = () => {
        switch (activeTopic) {
            case 'getting-started': return <GettingStartedContent />;
            case 'analytics': return <AnalyticsContent />;
            case 'co-pilot': return <CoPilotContent />;
            case 'upload': return <UploadContent />;
            case 'reviews': return <ReviewsContent />;
            case 'submit-feedback': return <FeedbackContent />;
            case 'billing-plans': return <PlaceholderContent title="Billing & Plans" />;
            case 'security': return <PlaceholderContent title="Security" />;
            case 'troubleshooting': return <PlaceholderContent title="Troubleshooting" />;
            case 'browser-extension': return <PlaceholderContent title="Browser Extension" />;
            case 'native-app': return <PlaceholderContent title="Native App" />;
            default: return <GettingStartedContent />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
            <aside className="w-full md:w-64 flex-shrink-0">
                <h2 className="text-lg font-semibold mb-4 hidden md:block">Topics</h2>
                <ul className="space-y-1">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => handleNavClick(item.id as Topic)}
                                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                                    activeTopic === item.id 
                                    ? 'bg-interactive-background-hover text-text-primary' 
                                    : 'text-text-secondary hover:bg-interactive-background-hover hover:text-text-primary'
                                }`}
                            >
                                <item.icon size={20} className="mr-3" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="flex-1 min-w-0">
                {renderContent()}
            </main>
        </div>
    );
};

export default HelpView;