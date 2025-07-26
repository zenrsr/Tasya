import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState, lazy, Suspense} from "react";
import {usePuterStore} from "~/lib/puter";

// Lazy load heavy components for better performance
const Summary = lazy(() => import("~/components/Summary"));
const ATS = lazy(() => import("~/components/ATS"));
const Details = lazy(() => import("~/components/Details"));

// Loading fallback component
const ComponentLoader = () => (
    <div className="animate-pulse bg-dark-800/50 border border-dark-700/50 rounded-xl p-8">
        <div className="h-4 bg-dark-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-dark-700 rounded w-1/2"></div>
    </div>
);

export const meta = () => ([
    { title: 'Tasya AI | Resume Analysis' },
    { name: 'description', content: 'Detailed overview of your resume analysis' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [resumeData, setResumeData] = useState<Resume | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);
            setResumeData(data);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
        }

        loadResume();
    }, [id]);

    return (
        <main className="bg-gradient min-h-screen !pt-0">
            {/* Enhanced Navigation */}
            <nav className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="group flex items-center gap-3 hover:scale-105 transition-all duration-300">
                            <div className="p-2 bg-dark-800 rounded-lg border border-dark-600 group-hover:border-accent-blue/50 transition-colors duration-300">
                                <img src="/icons/back.svg" alt="back" className="w-4 h-4 dark-icon group-hover:brightness-150" />
                            </div>
                            <div>
                                <span className="text-silver-200 font-semibold group-hover:text-white transition-colors duration-300">Back to Dashboard</span>
                                <p className="text-silver-500 text-xs">View all resumes</p>
                            </div>
                        </Link>

                        {/* Resume Info */}
                        {resumeData && (
                            <div className="hidden md:flex items-center gap-4">
                                <div className="text-right">
                                    {resumeData.companyName && (
                                        <h3 className="font-semibold text-silver-100">{resumeData.companyName}</h3>
                                    )}
                                    {resumeData.jobTitle && (
                                        <p className="text-silver-400 text-sm">{resumeData.jobTitle}</p>
                                    )}
                                    {!resumeData.companyName && !resumeData.jobTitle && (
                                        <h3 className="font-semibold text-silver-100">Resume Analysis</h3>
                                    )}
                                </div>
                                <div className="w-px h-8 bg-dark-600"></div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        feedback?.overallScore && feedback.overallScore > 70 ? 'bg-accent-green' : 
                                        feedback?.overallScore && feedback.overallScore > 50 ? 'bg-accent-yellow' : 'bg-accent-red'
                                    } animate-pulse`}></div>
                                    <span className="text-silver-300 font-medium">
                                        Score: {feedback?.overallScore || 0}/100
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {resumeUrl && (
                                <a 
                                    href={resumeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg hover:border-accent-blue/50 hover:bg-dark-700 transition-all duration-300 text-silver-300 hover:text-white"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span className="text-sm font-medium">Open PDF</span>
                                </a>
                            )}
                            <Link 
                                to="/upload" 
                                className="primary-button group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    New Analysis
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                {/* Resume Preview Section */}
                <section className="feedback-section bg-gradient-to-br from-dark-950 to-dark-900 h-[100vh] sticky top-0 items-center justify-center max-lg:h-auto max-lg:relative">
                    <div className="p-6 h-full flex items-center justify-center">
                        {imageUrl && resumeUrl ? (
                            <div className="relative group animate-fade-in max-lg:w-full max-lg:max-w-md">
                                {/* Preview Container */}
                                <div className="gradient-border glass-shadow h-[90vh] max-lg:h-auto w-fit max-lg:w-full">
                                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
                                        <img
                                            src={imageUrl}
                                            className="w-full h-full object-contain rounded-xl hover:scale-[1.02] transition-transform duration-300"
                                            title="Click to open full PDF"
                                            alt="Resume preview"
                                            loading="lazy"
                                        />
                                    </a>
                                </div>
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center p-6">
                                    <div className="bg-dark-800/90 backdrop-blur-sm border border-silver-400/30 rounded-lg px-4 py-2 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        <span className="text-sm font-medium text-silver-200">Open PDF</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-accent-blue/20 rounded-full blur-xl animate-pulse"></div>
                                    <img src="/images/resume-scan-2.gif" className="relative w-[200px] opacity-80" alt="Loading" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-silver-200 mb-2">Loading resume...</h3>
                                    <p className="text-silver-400">Preparing your document</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Feedback Section */}
                <section className="feedback-section">
                    <div className="py-8">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold text-silver-100">Resume Analysis</h2>
                                    <p className="text-silver-400 mt-1">AI-powered insights for career success</p>
                                </div>
                            </div>
                            <div className="h-px bg-gradient-to-r from-accent-blue via-accent-purple to-transparent"></div>
                        </div>
                        
                        {feedback ? (
                            <div className="space-y-8 animate-fade-in">
                                <Suspense fallback={<ComponentLoader />}>
                                    <Summary feedback={feedback} />
                                </Suspense>
                                <Suspense fallback={<ComponentLoader />}>
                                    <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                </Suspense>
                                <Suspense fallback={<ComponentLoader />}>
                                    <Details feedback={feedback} />
                                </Suspense>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-accent-blue/20 rounded-full blur-xl animate-pulse"></div>
                                    <img src="/images/resume-scan-2.gif" className="relative w-[200px] opacity-80" alt="Loading" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-silver-200 mb-2">Generating insights...</h3>
                                    <p className="text-silver-400">Our AI is analyzing your resume</p>
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <div className="h-1 w-32 bg-dark-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-accent-blue to-accent-purple animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}
export default Resume
