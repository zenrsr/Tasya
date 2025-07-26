export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

// Global cache for PDF.js library
let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

// Memory management for canvas operations
const MAX_CANVAS_SIZE = 4096; // Prevent memory issues
const OPTIMAL_SCALE = 2; // Reduced from 4 for better performance

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    
    // @ts-expect-error - pdfjs-dist types not available for .mjs import
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    }).catch((error) => {
        console.error('Failed to load PDF.js:', error);
        isLoading = false;
        loadPromise = null;
        throw error;
    });

    return loadPromise;
}

// Optimized canvas creation with memory management
function createOptimizedCanvas(viewport: any): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    
    // Limit canvas size to prevent memory issues
    const scale = Math.min(OPTIMAL_SCALE, MAX_CANVAS_SIZE / Math.max(viewport.width, viewport.height));
    const scaledViewport = viewport.clone({ scale });
    
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    
    const context = canvas.getContext("2d", {
        alpha: false, // Better performance for opaque images
        willReadFrequently: false // Optimize for write operations
    });
    
    if (context) {
        // Optimize rendering settings
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        
        // Set white background for better contrast
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    return canvas;
}

// Optimized blob conversion with quality management
function canvasToBlob(canvas: HTMLCanvasElement, quality: number = 0.9): Promise<Blob | null> {
    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => resolve(blob),
            "image/jpeg", // Use JPEG for better compression
            quality
        );
    });
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    let canvas: HTMLCanvasElement | null = null;
    
    try {
        // Validate file type and size
        if (!file.type.includes('pdf')) {
            throw new Error('Invalid file type. Please upload a PDF file.');
        }
        
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            throw new Error('File too large. Please upload a PDF smaller than 50MB.');
        }

        const lib = await loadPdfJs();

        // Use Uint8Array for better performance
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Load PDF with optimized settings
        const loadingTask = lib.getDocument({
            data: uint8Array,
            verbosity: 0, // Disable console output
            maxImageSize: MAX_CANVAS_SIZE * MAX_CANVAS_SIZE,
            disableFontFace: false, // Keep fonts for better quality
            disableRange: true, // Load entire file for better performance
            disableStream: true
        });
        
        const pdf = await loadingTask.promise;
        
        // Always use first page
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        
        // Create optimized canvas
        canvas = createOptimizedCanvas(viewport);
        const context = canvas.getContext("2d");
        
        if (!context) {
            throw new Error('Failed to get canvas context');
        }
        
        // Render with optimized viewport
        const scaledViewport = viewport.clone({ 
            scale: Math.min(OPTIMAL_SCALE, MAX_CANVAS_SIZE / Math.max(viewport.width, viewport.height))
        });
        
        await page.render({ 
            canvasContext: context, 
            viewport: scaledViewport,
            intent: 'display' // Optimize for display rather than print
        }).promise;
        
        // Clean up PDF resources
        page.cleanup();
        await pdf.cleanup();
        
        // Convert to blob with optimized quality
        const blob = await canvasToBlob(canvas, 0.85); // Reduced quality for better performance
        
        if (!blob) {
            throw new Error('Failed to create image blob');
        }
        
        // Create optimized file name
        const originalName = file.name.replace(/\.pdf$/i, "");
        const imageFile = new File([blob], `${originalName}.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now()
        });

        const imageUrl = URL.createObjectURL(blob);
        
        return {
            imageUrl,
            file: imageFile,
        };
        
    } catch (err) {
        console.error('PDF conversion error:', err);
        return {
            imageUrl: "",
            file: null,
            error: err instanceof Error ? err.message : `Failed to convert PDF: ${err}`,
        };
    } finally {
        // Clean up canvas to prevent memory leaks
        if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            canvas.width = 0;
            canvas.height = 0;
        }
    }
}

// Utility function to preload PDF.js for better UX
export async function preloadPdfJs(): Promise<void> {
    try {
        await loadPdfJs();
    } catch (error) {
        console.warn('Failed to preload PDF.js:', error);
    }
}
