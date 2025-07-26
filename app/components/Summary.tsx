import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";
import BlurText from "~/components/slick-components/BlurText";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-accent-green'
            : score > 49
        ? 'text-accent-yellow' : 'text-accent-red';

    return (
        <div className="group">
            <div className="flex items-center justify-between p-6 bg-dark-900/50 border border-dark-700/50 rounded-xl hover:border-silver-400/30 hover:bg-dark-800/50 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-silver-100 group-hover:text-white transition-colors duration-300">{title}</h3>
                        <ScoreBadge score={score} />
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">
                        <span className={`${textColor} group-hover:brightness-110 transition-all duration-300`}>{score}</span>
                        <span className="text-silver-400 text-lg">/100</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="gradient-border glass-shadow animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 p-8 border-b border-dark-700/50">
                <div className="flex-shrink-0">
                    <div className="relative">
                        <ScoreGauge score={feedback.overallScore} />
                    </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                    <BlurText
                        text="Your Resume Score"
                        delay={100}
                        animateBy="words"
                        direction="top"
                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-silver-100 via-accent-blue to-silver-100 mb-3"
                    />
                    <BlurText
                        text="This comprehensive score is calculated based on multiple factors including content quality, structure optimization, tone analysis, and skills presentation."
                        delay={50}
                        animateBy="words"
                        direction="top"
                        className="text-silver-400 text-lg leading-relaxed max-w-2xl"
                    />
                    <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                        <div className="w-8 h-[2px] bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"></div>
                        <span className="text-sm text-silver-500 font-medium">Powered by AI Analysis</span>
                    </div>
                </div>
            </div>

            {/* Score Categories */}
            <div className="p-8">
                <div className="mb-6">
                    <BlurText
                        text="Score Breakdown"
                        delay={80}
                        animateBy="words"
                        direction="top"
                        className="text-xl font-semibold text-silver-200 mb-2"
                    />
                    <p className="text-silver-400 text-sm">Each category contributes to your overall resume effectiveness</p>
                </div>
                
                <div className="space-y-4">
                    <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
                    <Category title="Content" score={feedback.content.score} />
                    <Category title="Structure" score={feedback.structure.score} />
                    <Category title="Skills" score={feedback.skills.score} />
                </div>

                {/* Performance Indicator */}
                <div className="mt-8 p-4 bg-gradient-to-r from-dark-900/50 to-dark-800/50 rounded-xl border border-dark-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse"></div>
                        <span className="text-sm text-silver-300 font-medium">
                            {feedback.overallScore > 70 ? 'Excellent performance! Your resume is well-optimized.' :
                             feedback.overallScore > 50 ? 'Good foundation with room for improvement.' :
                             'Consider focusing on the highlighted areas for better results.'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Summary
