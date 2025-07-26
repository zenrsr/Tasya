import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-gradient min-h-screen">
            <Navbar />

            <section className="main-section pt-24">
                <div className="page-heading py-20">
                    {isProcessing ? (
                        <div className="text-center space-y-8">
                            <div className="inline-flex items-center gap-2 bg-dark-800/50 border border-accent-blue/30 rounded-full px-4 py-2 backdrop-blur-sm">
                                <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></div>
                                <span className="text-sm font-medium text-silver-300">AI Analysis in Progress</span>
                            </div>
                            
                            <h1>Analyzing Your Resume</h1>
                            
                            <div className="relative max-w-md mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 rounded-2xl blur-xl animate-pulse"></div>
                                <div className="relative bg-dark-800/50 p-8 rounded-2xl border border-dark-700/50 backdrop-blur-sm">
                                    <img src="/images/resume-scan.gif" className="w-full max-w-[300px] mx-auto opacity-90" />
                                    <div className="mt-6 space-y-3">
                                        <h3 className="text-xl font-semibold text-silver-100">{statusText}</h3>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-1 w-32 bg-dark-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-accent-blue to-accent-purple animate-pulse"></div>
                                            </div>
                                        </div>
                                        <p className="text-silver-400 text-sm">
                                            This usually takes 30-60 seconds
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-8">
                            <div className="inline-flex items-center gap-2 bg-dark-800/50 border border-accent-purple/30 rounded-full px-4 py-2 backdrop-blur-sm">
                                <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse"></div>
                                <span className="text-sm font-medium text-silver-300">Smart Resume Analysis</span>
                            </div>
                            
                            <h1>Smart feedback for your dream job</h1>
                            <h2>Drop your resume for an ATS score and improvement tips</h2>
                            
                            <div className="max-w-4xl mx-auto">
                                <form id="upload-form" onSubmit={handleSubmit} className="gradient-border glass-shadow animate-fade-in">
                                    <div className="p-8 space-y-8">
                                        {/* Header */}
                                        <div className="text-center border-b border-dark-700/50 pb-6">
                                            <h3 className="text-2xl font-bold text-silver-100 mb-2">Resume Analysis Form</h3>
                                            <p className="text-silver-400">
                                                Provide job details for personalized feedback and ATS optimization
                                            </p>
                                        </div>

                                        {/* Job Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="form-div">
                                                <label htmlFor="company-name" className="flex items-center gap-2 mb-3">
                                                    <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    Company Name
                                                    <span className="text-silver-500 text-sm">(Optional)</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="company-name" 
                                                    placeholder="e.g., Google, Microsoft, Apple" 
                                                    id="company-name"
                                                    className="transition-all duration-300 hover:border-silver-400/50 focus:border-accent-blue focus:shadow-lg focus:shadow-accent-blue/20"
                                                />
                                            </div>
                                            
                                            <div className="form-div">
                                                <label htmlFor="job-title" className="flex items-center gap-2 mb-3">
                                                    <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5" />
                                                    </svg>
                                                    Job Title
                                                    <span className="text-silver-500 text-sm">(Optional)</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="job-title" 
                                                    placeholder="e.g., Software Engineer, Product Manager" 
                                                    id="job-title"
                                                    className="transition-all duration-300 hover:border-silver-400/50 focus:border-accent-blue focus:shadow-lg focus:shadow-accent-blue/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-div">
                                            <label htmlFor="job-description" className="flex items-center gap-2 mb-3">
                                                <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Job Description
                                                <span className="text-silver-500 text-sm">(Optional but recommended)</span>
                                            </label>
                                            <textarea 
                                                rows={6} 
                                                name="job-description" 
                                                placeholder="Paste the full job description here for more accurate ATS analysis and targeted feedback..."
                                                id="job-description"
                                                className="transition-all duration-300 hover:border-silver-400/50 focus:border-accent-blue focus:shadow-lg focus:shadow-accent-blue/20"
                                            />
                                        </div>

                                        <div className="form-div">
                                            <label htmlFor="uploader" className="flex items-center gap-2 mb-3">
                                                <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                Upload Resume
                                                <span className="text-accent-red text-sm">*Required</span>
                                            </label>
                                            <FileUploader onFileSelect={handleFileSelect} />
                                        </div>

                                        <div className="pt-6 border-t border-dark-700/50">
                                            <button 
                                                className={`w-full primary-button text-lg font-semibold py-4 group relative overflow-hidden transition-all duration-300 ${
                                                    !file ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                                                }`}
                                                type="submit"
                                                disabled={!file}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="relative flex items-center justify-center gap-3">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    Analyze Resume with AI
                                                </div>
                                            </button>
                                            
                                            {!file && (
                                                <p className="text-center text-silver-500 text-sm mt-3">
                                                    Please upload a PDF file to continue
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Features */}
                            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                <div className="text-center p-6 bg-dark-900/30 border border-dark-700/50 rounded-xl backdrop-blur-sm hover:border-accent-green/30 transition-all duration-300">
                                    <div className="w-12 h-12 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-silver-100 mb-2">ATS Optimization</h4>
                                    <p className="text-silver-400 text-sm">Ensure your resume passes applicant tracking systems</p>
                                </div>
                                
                                <div className="text-center p-6 bg-dark-900/30 border border-dark-700/50 rounded-xl backdrop-blur-sm hover:border-accent-blue/30 transition-all duration-300">
                                    <div className="w-12 h-12 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-silver-100 mb-2">AI-Powered Analysis</h4>
                                    <p className="text-silver-400 text-sm">Advanced algorithms analyze content and structure</p>
                                </div>
                                
                                <div className="text-center p-6 bg-dark-900/30 border border-dark-700/50 rounded-xl backdrop-blur-sm hover:border-accent-purple/30 transition-all duration-300">
                                    <div className="w-12 h-12 bg-accent-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-silver-100 mb-2">Instant Results</h4>
                                    <p className="text-silver-400 text-sm">Get detailed feedback in under 60 seconds</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
