import type { Route } from "./+types/home";
import { memo, useCallback, useEffect, useState, useMemo } from "react";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import BlurText from "~/components/slick-components/BlurText";
import DarkVeil from "~/components/slick-components/DarkVeil";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Tasya AI - Smart Resume Analysis" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

// Memoized loading component
const LoadingState = memo(() => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-accent-blue/20 rounded-full blur-xl animate-pulse"></div>
      <img
        src="/images/resume-scan-2.gif"
        className="relative w-[120px] opacity-80"
        alt="Loading animation"
        loading="lazy"
      />
    </div>
    <div className="text-center">
      <h3 className="text-xl font-semibold text-silver-200 mb-2">Loading your resumes...</h3>
      <p className="text-silver-400">Fetching your analysis history</p>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

// Memoized empty state component
const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="text-center max-w-lg">
      {/* Illustration */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/15 to-accent-purple/15 rounded-3xl blur-3xl"></div>
        <div className="relative bg-dark-800/40 p-12 rounded-3xl border border-dark-700/30 backdrop-blur-xl">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-accent-blue/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-dark-700/50 p-6 rounded-2xl border border-dark-600/50">
              <svg className="w-16 h-16 mx-auto text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          <BlurText
            text="Ready to analyze your first resume?"
            delay={80}
            animateBy="words"
            direction="top"
            className="text-2xl font-bold text-silver-100 mb-4"
          />

          <BlurText
            text="Upload your resume and get instant AI-powered feedback on ATS compatibility, content quality, and professional presentation."
            delay={50}
            animateBy="words"
            direction="top"
            className="text-silver-400 leading-relaxed"
          />
        </div>
      </div>

      <div className="space-y-6">
        <Link to="/upload" className="primary-button text-xl font-semibold group relative overflow-hidden inline-flex">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Your Resume
          </div>
        </Link>

        <div className="flex items-center justify-center gap-8 text-sm text-silver-500">
          <div className="flex items-center gap-2 group hover:text-silver-400 transition-colors duration-300">
            <div className="w-2 h-2 rounded-full bg-accent-green group-hover:scale-110 transition-transform duration-300"></div>
            <span>ATS Optimization</span>
          </div>
          <div className="flex items-center gap-2 group hover:text-silver-400 transition-colors duration-300">
            <div className="w-2 h-2 rounded-full bg-accent-blue group-hover:scale-110 transition-transform duration-300"></div>
            <span>AI Analysis</span>
          </div>
          <div className="flex items-center gap-2 group hover:text-silver-400 transition-colors duration-300">
            <div className="w-2 h-2 rounded-full bg-accent-purple group-hover:scale-110 transition-transform duration-300"></div>
            <span>Instant Results</span>
          </div>
        </div>
      </div>
    </div>
  </div>
));

EmptyState.displayName = 'EmptyState';

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize average score calculation
  const averageScore = useMemo(() => {
    if (resumes.length === 0) return 0;
    return Math.round(resumes.reduce((acc, r) => acc + r.feedback.overallScore, 0) / resumes.length);
  }, [resumes]);

  // Optimized resume loading with error handling
  const loadResumes = useCallback(async () => {
    try {
      setLoadingResumes(true);
      setError(null);

      const resumeData = (await kv.list('resume:*', true)) as KVItem[];

      if (!resumeData) {
        setResumes([]);
        return;
      }

      const parsedResumes = resumeData
        .filter(resume => resume?.value) // Filter out invalid entries
        .map((resume) => {
          try {
            return JSON.parse(resume.value) as Resume;
          } catch (parseError) {
            console.error('Failed to parse resume:', parseError);
            return null;
          }
        })
        .filter(Boolean) as Resume[]; // Remove null entries

      // Sort by creation date if available, newest first
      parsedResumes.sort((a, b) => {
        // Assuming id contains timestamp, adjust as needed
        return b.id.localeCompare(a.id);
      });

      setResumes(parsedResumes);
    } catch (err) {
      console.error('Failed to load resumes:', err);
      setError('Failed to load resumes. Please try again.');
      setResumes([]);
    } finally {
      setLoadingResumes(false);
    }
  }, [kv]);

  // Authentication check
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated, navigate]);

  // Load resumes on mount
  useEffect(() => {
    if (auth.isAuthenticated) {
      loadResumes();
    }
  }, [auth.isAuthenticated, loadResumes]);

  // Retry handler for error state
  const handleRetry = useCallback(() => {
    loadResumes();
  }, [loadResumes]);

  return (
    <main className="bg-gradient min-h-screen relative">
      <DarkVeil
        hueShift={0}
        noiseIntensity={0.02}
        scanlineIntensity={0}
        speed={0.3}
        warpAmount={0}
      />
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="main-section pt-32">
          <div className="page-heading py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-dark-800/30 border border-accent-blue/20 rounded-full px-6 py-3 mb-8 backdrop-blur-xl animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
                <span className="text-sm font-medium text-silver-300 tracking-wide">AI-Powered Resume Analysis</span>
              </div>

              <div className="space-y-6 mb-8">
                <h1 className="text-6xl max-md:text-4xl leading-tight tracking-[-2px] font-bold text-gradient-dark-contrast bg-clip-text text-transparent animate-fade-in">
                  Track Your Applications &
                </h1>
                <h1 className="text-6xl max-md:text-4xl leading-tight tracking-[-2px] font-bold text-gradient-dark-contrast bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  Resume Ratings
                </h1>
              </div>

              {!loadingResumes && resumes?.length === 0 ? (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <BlurText
                    text="No resumes found. Upload your first resume to get feedback."
                    delay={60}
                    animateBy="words"
                    direction="top"
                    className="text-2xl max-md:text-xl text-silver-200 font-medium"
                  />
                  <BlurText
                    text="Get instant AI-powered feedback on your resume's ATS compatibility, content quality, structure, and professional presentation. Start optimizing your resume today."
                    delay={40}
                    animateBy="words"
                    direction="top"
                    className="text-silver-400 text-lg leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <BlurText
                    text="Review your submissions and check AI-powered feedback."
                    delay={60}
                    animateBy="words"
                    direction="top"
                    className="text-2xl max-md:text-xl text-silver-200 font-medium"
                  />
                  <BlurText
                    text="Monitor your resume performance across different job applications and track improvements over time."
                    delay={40}
                    animateBy="words"
                    direction="top"
                    className="text-silver-400 text-lg leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center max-w-md bg-dark-800/50 p-8 rounded-2xl border border-dark-700/50 backdrop-blur-sm">
                <div className="text-accent-red mb-4 font-medium">{error}</div>
                <button
                  onClick={handleRetry}
                  className="primary-button"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loadingResumes && <LoadingState />}

          {/* Resume Cards Grid */}
          {!loadingResumes && !error && resumes.length > 0 && (
            <div className="w-full max-w-7xl px-6">
              <div className="mb-10 flex items-center justify-between bg-dark-800/30 p-6 rounded-2xl border border-dark-700/30 backdrop-blur-sm">
                <div>
                  <h3 className="text-2xl font-bold text-silver-100 mb-2">Your Resume Portfolio</h3>
                  <p className="text-silver-400">
                    {resumes.length} resume{resumes.length !== 1 ? 's' : ''} analyzed •
                    Average score: <span className="text-accent-blue font-medium">{averageScore}%</span>
                  </p>
                </div>

                <Link to="/upload" className="primary-button group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Analysis
                  </div>
                </Link>
              </div>

              <div className="resumes-section">
                {resumes.map((resume, index) => (
                  <div
                    key={resume.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${Math.min(index * 0.1, 0.5)}s` }} // Cap delay
                  >
                    <ResumeCard resume={resume} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loadingResumes && !error && resumes?.length === 0 && <EmptyState />}
        </section>
      </div>
    </main>
  );
}
