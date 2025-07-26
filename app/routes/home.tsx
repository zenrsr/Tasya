import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tasya AI - Smart Resume Analysis" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return (
    <main className="bg-gradient min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="main-section pt-24">
        <div className="page-heading py-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-dark-800/50 border border-accent-blue/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
              <span className="text-sm font-medium text-silver-300">AI-Powered Resume Analysis</span>
            </div>
            
            <h1 className="mb-6">Track Your Applications & Resume Ratings</h1>
            
            {!loadingResumes && resumes?.length === 0 ? (
              <div className="space-y-4">
                <h2>No resumes found. Upload your first resume to get feedback.</h2>
                <p className="text-silver-400 text-lg max-w-2xl mx-auto leading-relaxed">
                  Get instant AI-powered feedback on your resume's ATS compatibility, content quality, 
                  structure, and professional presentation. Start optimizing your resume today.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2>Review your submissions and check AI-powered feedback.</h2>
                <p className="text-silver-400 text-lg max-w-2xl mx-auto leading-relaxed">
                  Monitor your resume performance across different job applications and track improvements over time.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-accent-blue/20 rounded-full blur-xl animate-pulse"></div>
              <img src="/images/resume-scan-2.gif" className="relative w-[120px] opacity-80" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-silver-200 mb-2">Loading your resumes...</h3>
              <p className="text-silver-400">Fetching your analysis history</p>
            </div>
          </div>
        )}

        {/* Resume Cards Grid */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="w-full max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-silver-100 mb-2">Your Resume Portfolio</h3>
                <p className="text-silver-400">
                  {resumes.length} resume{resumes.length !== 1 ? 's' : ''} analyzed • 
                  Average score: {Math.round(resumes.reduce((acc, r) => acc + r.feedback.overallScore, 0) / resumes.length)}%
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
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ResumeCard resume={resume} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center max-w-md">
              {/* Illustration */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 rounded-full blur-2xl"></div>
                <div className="relative bg-dark-800/50 p-8 rounded-2xl border border-dark-700/50 backdrop-blur-sm">
                  <svg className="w-16 h-16 mx-auto text-accent-blue mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-silver-100 mb-2">Ready to analyze your first resume?</h3>
                  <p className="text-silver-400 text-sm mb-6">
                    Upload your resume and get instant AI-powered feedback on ATS compatibility, 
                    content quality, and professional presentation.
                  </p>
                </div>
              </div>
              
              <Link to="/upload" className="primary-button text-xl font-semibold group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Your Resume
                </div>
              </Link>
              
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-silver-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                  <span>ATS Optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-blue"></div>
                  <span>AI Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
