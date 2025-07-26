import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const gaugeRef = useRef<HTMLDivElement>(null);

    // Dynamic color based on score
    const getScoreColor = (score: number) => {
        if (score > 70) return { 
            primary: "#00d9a5", 
            secondary: "#0070f3",
            gradient: "from-green-400 to-blue-500",
            shadow: "rgba(0, 217, 165, 0.3)"
        };
        if (score > 50) return { 
            primary: "#ffa502", 
            secondary: "#ff6348",
            gradient: "from-orange-400 to-red-400", 
            shadow: "rgba(255, 165, 2, 0.3)"
        };
        return { 
            primary: "#ff4757", 
            secondary: "#ff3742",
            gradient: "from-red-400 to-red-500",
            shadow: "rgba(255, 71, 87, 0.3)"
        };
    };

    const colors = getScoreColor(score);
    const circumference = 2 * Math.PI * 90; // radius of 90
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (gaugeRef.current) {
            observer.observe(gaugeRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                const interval = setInterval(() => {
                    setAnimatedScore(prev => {
                        if (prev >= score) {
                            clearInterval(interval);
                            return score;
                        }
                        return prev + 1;
                    });
                }, 20);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isVisible, score]);

    return (
        <div ref={gaugeRef} className="flex flex-col items-center">
            <div className="relative w-52 h-52">
                {/* Outer glow ring */}
                <div 
                    className="absolute inset-0 rounded-full opacity-20 blur-xl animate-pulse"
                    style={{ 
                        background: `radial-gradient(circle, ${colors.shadow} 0%, transparent 70%)` 
                    }}
                ></div>
                
                {/* Main gauge container */}
                <div className="relative w-full h-full">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                        <defs>
                            {/* Background gradient */}
                            <linearGradient id="backgroundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#2a2a2a" />
                                <stop offset="100%" stopColor="#1a1a1a" />
                            </linearGradient>
                            
                            {/* Score gradient */}
                            <linearGradient id={`scoreGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={colors.primary} />
                                <stop offset="100%" stopColor={colors.secondary} />
                            </linearGradient>
                            
                            {/* Glow filter */}
                            <filter id={`glow-${score}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
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
                        
                        {/* Progress circle with glow */}
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke={colors.primary}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            filter={`url(#glow-${score})`}
                            className="transition-all duration-1000 ease-out opacity-80"
                        />
                        
                        {/* Main progress circle */}
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
                            className="transition-all duration-1000 ease-out"
                        />

                        {/* Inner decorative circles */}
                        <circle cx="100" cy="100" r="75" fill="none" stroke="#3a3a3a" strokeWidth="1" opacity="0.3"/>
                        <circle cx="100" cy="100" r="60" fill="none" stroke="#4a4a4a" strokeWidth="1" opacity="0.2"/>
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
                                    {score > 70 ? 'Excellent' : score > 50 ? 'Good' : 'Fair'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative dots around the gauge */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue opacity-60 animate-pulse"></div>
                    </div>
                    <div className="absolute top-8 right-8">
                        <div className="w-1 h-1 rounded-full bg-accent-purple opacity-40"></div>
                    </div>
                    <div className="absolute bottom-8 left-8">
                        <div className="w-1 h-1 rounded-full bg-accent-green opacity-50"></div>
                    </div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-purple opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
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

