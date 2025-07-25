import { memo, useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { usePuterStore } from "~/lib/puter";

interface ResumeCardProps {
    resume: Resume;
}

const ResumeCard = memo(({ resume: { id, companyName, jobTitle, feedback, imagePath } }: ResumeCardProps) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    // Memoize performance level and color
    const { performanceLevel, performanceColor } = useMemo(() => {
        const score = feedback.overallScore;
        if (score > 70) return { performanceLevel: 'Excellent', performanceColor: 'bg-accent-green' };
        if (score > 50) return { performanceLevel: 'Good', performanceColor: 'bg-accent-yellow' };
        return { performanceLevel: 'Needs Improvement', performanceColor: 'bg-accent-red' };
    }, [feedback.overallScore]);

    // Optimized image loading with error handling
    const loadResume = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(false);
            
            const blob = await fs.read(imagePath);
            if (!blob) {
                setError(true);
                return;
            }
            
            const url = URL.createObjectURL(blob);
            setResumeUrl(url);
        } catch (err) {
            console.error('Failed to load resume image:', err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }, [fs, imagePath]);

    useEffect(() => {
        loadResume();
        
        // Cleanup function to revoke object URL
        return () => {
            if (resumeUrl) {
                URL.revokeObjectURL(resumeUrl);
            }
        };
    }, [loadResume]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (resumeUrl) {
                URL.revokeObjectURL(resumeUrl);
            }
        };
    }, [resumeUrl]);

    return (
        <Link to={`/resume/${id}`} className="group block animate-fade-in">
            <div className="resume-card group-hover:border-silver-400/50 group-hover:bg-dark-800/80 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-accent-blue/10">
                {/* Header with enhanced styling */}
                <div className="resume-card-header">
                    <div className="flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="h-px bg-gradient-to-r from-dark-600 to-transparent flex-1"></div>
                        </div>
                        
                        {companyName && (
                            <h2 className="text-xl font-bold text-silver-100 group-hover:text-white transition-colors duration-300 break-words">
                                {companyName}
                            </h2>
                        )}
                        {jobTitle && (
                            <h3 className="text-lg text-silver-400 group-hover:text-silver-300 transition-colors duration-300 break-words">
                                {jobTitle}
                            </h3>
                        )}
                        {!companyName && !jobTitle && (
                            <h2 className="text-xl font-bold text-silver-100 group-hover:text-white transition-colors duration-300">
                                Resume Analysis
                            </h2>
                        )}
                        
                        {/* Score indicator bar */}
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-1 bg-dark-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-500 group-hover:brightness-110"
                                    style={{ width: `${feedback.overallScore}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-medium text-silver-400 group-hover:text-silver-300 transition-colors duration-300">
                                {feedback.overallScore}%
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex-shrink-0 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <ScoreCircle score={feedback.overallScore} />
                        </div>
                    </div>
                </div>

                {/* Resume preview with enhanced styling */}
                <div className="relative overflow-hidden rounded-xl border border-dark-700/50 group-hover:border-dark-600 transition-colors duration-300">
                    {/* Loading state */}
                    {isLoading && (
                        <div className="w-full h-[350px] max-sm:h-[200px] bg-dark-800 flex items-center justify-center">
                            <div className="animate-pulse text-silver-400">Loading...</div>
                        </div>
                    )}
                    
                    {/* Error state */}
                    {error && !isLoading && (
                        <div className="w-full h-[350px] max-sm:h-[200px] bg-dark-800 flex items-center justify-center">
                            <div className="text-silver-500 text-sm">Failed to load preview</div>
                        </div>
                    )}
                    
                    {/* Image */}
                    {resumeUrl && !error && (
                        <>
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Preview image with lazy loading */}
                            <img
                                src={resumeUrl}
                                alt="resume preview"
                                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                            />
                            
                            {/* View indicator */}
                            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-dark-800/90 backdrop-blur-sm border border-silver-400/30 rounded-lg px-3 py-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span className="text-sm font-medium text-silver-200">View Details</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Performance indicators */}
                <div className="mt-4 flex items-center justify-between text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${performanceColor} animate-pulse`}></div>
                        <span className="text-silver-400">{performanceLevel}</span>
                    </div>
                    <span className="text-silver-500">Click to review</span>
                </div>
            </div>
        </Link>
    );
});

ResumeCard.displayName = 'ResumeCard';

export default ResumeCard;
