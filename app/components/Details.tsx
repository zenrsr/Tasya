import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105",
      score > 69
        ? "bg-badge-green/80 border border-badge-green-text/20 hover:border-badge-green-text/40"
        : score > 39
          ? "bg-badge-yellow/80 border border-badge-yellow-text/20 hover:border-badge-yellow-text/40"
          : "bg-badge-red/80 border border-badge-red-text/20 hover:border-badge-red-text/40"
    )}>
      <div className={cn(
        "w-2 h-2 rounded-full animate-pulse",
        score > 69
          ? "bg-badge-green-text"
          : score > 39
            ? "bg-badge-yellow-text"
            : "bg-badge-red-text"
      )}></div>
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className={`w-4 h-4 ${score > 69 ? 'success-icon' : 'warning-icon'}`}
      />
      <p className={cn(
        "text-sm font-semibold tracking-wide",
        score > 69
          ? "text-badge-green-text"
          : score > 39
            ? "text-badge-yellow-text"
            : "text-badge-red-text"
      )}>
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex items-center justify-between py-2 w-full">
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-semibold text-silver-100 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <ScoreBadge score={categoryScore} />
      </div>
      <div className="flex items-center gap-2 text-sm text-silver-400">
        <span>{categoryScore > 70 ? 'Excellent' : categoryScore > 50 ? 'Good' : 'Needs Work'}</span>
      </div>
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="space-y-6">
      {/* Quick overview grid */}
      <div className="bg-dark-800/50 border border-dark-600/50 rounded-xl p-5 backdrop-blur-sm">
        <h5 className="text-sm font-semibold text-silver-300 mb-4 uppercase tracking-wider">Quick Overview</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips.map((tip, index) => (
            <div className="flex items-center gap-3 group" key={index}>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                tip.type === "good"
                  ? "bg-badge-green/20 border border-badge-green-text/30 group-hover:bg-badge-green/30"
                  : "bg-badge-yellow/20 border border-badge-yellow-text/30 group-hover:bg-badge-yellow/30"
              )}>
                <img
                  src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                  alt="status"
                  className={`w-3 h-3 ${tip.type === "good" ? 'success-icon' : 'warning-icon'}`}
                />
              </div>
              <p className="text-silver-300 group-hover:text-silver-200 transition-colors duration-300 text-sm font-medium">
                {tip.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed explanations */}
      <div className="space-y-4">
        <h5 className="text-sm font-semibold text-silver-300 uppercase tracking-wider mb-4">Detailed Analysis</h5>
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              "group p-5 rounded-xl border transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm",
              tip.type === "good"
                ? "bg-badge-green/10 border-badge-green-text/20 hover:border-badge-green-text/40 hover:bg-badge-green/20"
                : "bg-badge-yellow/10 border-badge-yellow-text/20 hover:border-badge-yellow-text/40 hover:bg-badge-yellow/20"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  tip.type === "good"
                    ? "bg-badge-green/20 border border-badge-green-text/30 group-hover:bg-badge-green/30"
                    : "bg-badge-yellow/20 border border-badge-yellow-text/30 group-hover:bg-badge-yellow/30"
                )}>
                  <img
                    src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                    alt="status"
                    className={`w-4 h-4 ${tip.type === "good" ? 'success-icon' : 'warning-icon'}`}
                  />
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <h6 className="text-lg font-semibold text-silver-100 group-hover:text-white transition-colors duration-300">
                  {tip.tip}
                </h6>
                <p className="text-silver-300 leading-relaxed group-hover:text-silver-200 transition-colors duration-300">
                  {tip.explanation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="gradient-border glass-shadow animate-fade-in">
      <div className="p-6 border-b border-dark-700/50">
        <h2 className="text-2xl font-bold text-gradient-purple-flow mb-2">
          Detailed Feedback
        </h2>
        <p className="text-silver-400">
          In-depth analysis of each category with actionable recommendations
        </p>
      </div>

      <div className="p-6">
        <Accordion defaultOpen="tone-style" allowMultiple={false}>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                title="Tone & Style"
                categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                title="Content Quality"
                categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                title="Structure & Format"
                categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                title="Skills Presentation"
                categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Details;
