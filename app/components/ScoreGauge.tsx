import { useEffect, useRef, useState, useMemo, useCallback } from "react";

interface ScoreGaugeProps {
    score?: number;
}

const ScoreGauge = ({ score = 75 }: ScoreGaugeProps) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const gaugeRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();

    // Memoize expensive color calculations
    const colors = useMemo(() => {
        if (score > 70) return { 
            primary: "#00d9a5", 
            secondary: "#0070f3",
            shadow: "rgba(0, 217, 165, 0.3)"
        };
        if (score > 50) return { 
            primary: "#ffa502", 
            secondary: "#ff6348",
            shadow: "rgba(255, 165, 2, 0.3)"
        };
        return { 
            primary: "#ff4757", 
            secondary: "#ff3742",
            shadow: "rgba(255, 71, 87, 0.3)"
        };
    }, [score]);

    // Memoize performance level
    const performanceLevel = useMemo(() => {
        return score > 70 ? 'Excellent' : score > 50 ? 'Good' : 'Fair';
    }, [score]);

    // Memoize SVG calculations
    const { circumference, strokeDashoffset } = useMemo(() => {
        const circumference = 2 * Math.PI * 90;
        const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
        return { circumference, strokeDashoffset };
    }, [animatedScore]);

    // Optimized animation using RAF
    const animateScore = useCallback(() => {
        const startTime = performance.now();
        const duration = 1500; // 1.5s animation
        
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentScore = Math.round(easeOutCubic * score);
            
            setAnimatedScore(currentScore);
            
            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };
        
        animationRef.current = requestAnimationFrame(animate);
    }, [score]);

    // Optimized intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                    // Delay animation start for better UX
                    setTimeout(animateScore, 300);
                }
            },
            { threshold: 0.3, rootMargin: '50px' }
        );

        const currentRef = gaugeRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animateScore, isVisible]);

    return (
        <div ref={gaugeRef} className="flex flex-col items-center">
            <div className="relative w-52 h-52">
                {/* Optimized glow effect - only when visible */}
                {isVisible && (
                    <div 
                        className="absolute inset-0 rounded-full opacity-20 blur-xl animate-pulse"
                        style={{ 
                            background: `radial-gradient(circle, ${colors.shadow} 0%, transparent 70%)`,
                            willChange: 'opacity'
                        }}
                    />
                )}
                
                {/* Main gauge container */}
                <div className="relative w-full h-full">
                    <svg 
                        className="w-full h-full transform -rotate-90" 
                        viewBox="0 0 200 200"
                        style={{ willChange: 'transform' }}
                    >
                        <defs>
                            <linearGradient id="backgroundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#2a2a2a" />
                                <stop offset="100%" stopColor="#1a1a1a" />
                            </linearGradient>
                            
                            <linearGradient id={`scoreGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={colors.primary} />
                                <stop offset="100%" stopColor={colors.secondary} />
                            </linearGradient>
                        </defs>

                        {/* Background circle */}
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="url(#backgroundGrad)"
                            strokeWidth="8"
                            className="opacity-30"
                        />
                        
                        {/* Progress circle */}
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke={`url(#scoreGradient-${score})`}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-300 ease-out"
                            style={{ willChange: 'stroke-dashoffset' }}
                        />

                        {/* Minimal decorative circles */}
                        <circle cx="100" cy="100" r="75" fill="none" stroke="#3a3a3a" strokeWidth="1" opacity="0.3"/>
                    </svg>

                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-silver-100 leading-none mb-1">
                                {animatedScore}
                            </div>
                            <div className="text-lg text-silver-400 font-medium">
                                /100
                            </div>
                            <div className="mt-2 px-3 py-1 bg-dark-800/60 backdrop-blur-sm rounded-full border border-dark-600/50">
                                <span className="text-xs font-medium text-silver-400 uppercase tracking-wider">
                                    {performanceLevel}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress indicator text */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-2 text-xs text-silver-500">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                        <span>Overall Score</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;

