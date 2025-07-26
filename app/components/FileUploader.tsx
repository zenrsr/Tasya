import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    const file = acceptedFiles[0] || null;

    return (
        <div className="w-full">
            <div {...getRootProps()} className="group">
                <input {...getInputProps()} />

                <div className={`relative transition-all duration-300 cursor-pointer ${
                    isDragActive 
                        ? 'uplader-drag-area border-accent-blue bg-dark-800 scale-[1.02]' 
                        : 'uplader-drag-area group-hover:border-accent-blue/50 group-hover:bg-dark-800'
                }`}>
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-accent-purple/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                        {file ? (
                            <div className="flex items-center justify-between p-4 bg-dark-800/80 border border-dark-600/50 rounded-xl backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-accent-green/20 rounded-lg blur-lg"></div>
                                        <div className="relative bg-dark-700 p-3 rounded-lg border border-dark-600">
                                            <img src="/images/pdf.png" alt="pdf" className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-silver-100 truncate max-w-xs">
                                            {file.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
                                            <p className="text-sm text-silver-400">
                                                {formatSize(file.size)} • Ready to analyze
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="p-3 hover:bg-dark-600 rounded-lg transition-colors duration-200 group/btn" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFileSelect?.(null);
                                    }}
                                >
                                    <img src="/icons/cross.svg" alt="remove" className="w-5 h-5 dark-icon group-hover/btn:brightness-150" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="relative mx-auto w-20 h-20 flex items-center justify-center mb-6">
                                    {/* Animated ring */}
                                    <div className="absolute inset-0 rounded-full border-2 border-accent-blue/20 animate-pulse"></div>
                                    <div className="absolute inset-2 rounded-full border border-accent-purple/30"></div>
                                    
                                    {/* Upload icon */}
                                    <div className="relative z-10 p-4 bg-dark-800 rounded-full border border-dark-600 group-hover:border-accent-blue/50 transition-colors duration-300">
                                        <svg className="w-8 h-8 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <p className="text-xl font-semibold text-silver-200">
                                        {isDragActive ? (
                                            <span className="text-accent-blue">Drop your PDF here</span>
                                        ) : (
                                            <>
                                                <span className="text-accent-blue cursor-pointer hover:text-accent-blue-hover transition-colors duration-200">
                                                    Click to upload
                                                </span> or drag and drop
                                            </>
                                        )}
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-px bg-gradient-to-r from-transparent via-dark-600 to-transparent flex-1"></div>
                                        <p className="text-sm text-silver-400 px-3">PDF only • max {formatSize(maxFileSize)}</p>
                                        <div className="h-px bg-gradient-to-r from-transparent via-dark-600 to-transparent flex-1"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FileUploader
