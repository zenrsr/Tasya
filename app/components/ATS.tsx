import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine gradient and colors based on score
  const getScoreStyles = (score: number) => {
    if (score > 69) {
      return {
        gradient: 'from-badge-green/20 to-dark-900',
        iconSrc: '/icons/ats-good.svg',
        iconClass: 'success-icon',
        subtitle: 'Excellent ATS Compatibility!',
        borderColor: 'border-accent-green/30'
      };
    } else if (score > 49) {
      return {
        gradient: 'from-badge-yellow/20 to-dark-900',
        iconSrc: '/icons/ats-warning.svg',
        iconClass: 'warning-icon',
        subtitle: 'Good Foundation, Room for Improvement',
        borderColor: 'border-accent-yellow/30'
      };
    } else {
      return {
        gradient: 'from-badge-red/20 to-dark-900',
        iconSrc: '/icons/ats-bad.svg',
        iconClass: 'warning-icon',
        subtitle: 'Needs Significant Improvement',
        borderColor: 'border-accent-red/30'
      };
    }
  };

  const styles = getScoreStyles(score);

  return (
    <div className="gradient-border glass-shadow animate-fade-in">
      {/* Header Section */}
      <div className={`bg-gradient-to-br ${styles.gradient} p-6 border-b border-dark-700/50`}>
        <div className="flex items-center gap-6 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 rounded-xl blur-lg"></div>
            <div className="relative bg-dark-800/80 p-4 rounded-xl border border-dark-600/50">
              <img 
                src={styles.iconSrc} 
                alt="ATS Score Icon" 
                className={`w-8 h-8 ${styles.iconClass}`} 
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-silver-100">ATS Compatibility</h2>
              <div className={`px-3 py-1 rounded-full border ${styles.borderColor} bg-dark-800/50 backdrop-blur-sm`}>
                <span className="text-lg font-bold text-silver-100">{score}/100</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-silver-200 mb-2">{styles.subtitle}</h3>
            <p className="text-silver-400 leading-relaxed">
              This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
            </p>
          </div>
        </div>

        {/* Score visualization */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-1000 ease-out"
              style={{ width: `${score}%` }}
            ></div>
          </div>
          <div className="text-sm text-silver-400 font-medium">
            {score > 69 ? 'Excellent' : score > 49 ? 'Good' : 'Poor'} ATS Performance
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-silver-200 mb-2">Detailed Analysis</h4>
          <p className="text-silver-400 text-sm">AI-powered insights to improve your resume's ATS compatibility</p>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className={`group p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                suggestion.type === "good" 
                  ? "bg-badge-green/10 border-badge-green-text/20 hover:border-badge-green-text/40 hover:bg-badge-green/20" 
                  : "bg-badge-yellow/10 border-badge-yellow-text/20 hover:border-badge-yellow-text/40 hover:bg-badge-yellow/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    suggestion.type === "good" 
                      ? "bg-badge-green/20 border border-badge-green-text/30" 
                      : "bg-badge-yellow/20 border border-badge-yellow-text/30"
                  }`}>
                    <img
                      src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                      alt={suggestion.type === "good" ? "Check" : "Warning"}
                      className={`w-3 h-3 ${suggestion.type === "good" ? 'success-icon' : 'warning-icon'}`}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`font-medium leading-relaxed ${
                    suggestion.type === "good" 
                      ? "text-badge-green-text" 
                      : "text-badge-yellow-text"
                  }`}>
                    {suggestion.tip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-8 p-4 bg-gradient-to-r from-dark-900/50 to-dark-800/50 rounded-xl border border-dark-700/30">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-accent-blue animate-pulse"></div>
            <p className="text-sm text-silver-300 font-medium italic">
              Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ATS
