interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = '';
  let badgeText = '';
  let iconColor = '';

  if (score > 70) {
    badgeColor = 'bg-badge-green/80 text-badge-green-text border border-badge-green-text/20 hover:border-badge-green-text/40 hover:bg-badge-green';
    badgeText = 'Strong';
    iconColor = 'bg-accent-green';
  } else if (score > 49) {
    badgeColor = 'bg-badge-yellow/80 text-badge-yellow-text border border-badge-yellow-text/20 hover:border-badge-yellow-text/40 hover:bg-badge-yellow';
    badgeText = 'Good Start';
    iconColor = 'bg-accent-yellow';
  } else {
    badgeColor = 'bg-badge-red/80 text-badge-red-text border border-badge-red-text/20 hover:border-badge-red-text/40 hover:bg-badge-red';
    badgeText = 'Needs Work';
    iconColor = 'bg-accent-red';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 ${badgeColor}`}>
      <div className={`w-2 h-2 rounded-full ${iconColor} animate-pulse`}></div>
      <p className="text-sm font-semibold tracking-wide">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;
