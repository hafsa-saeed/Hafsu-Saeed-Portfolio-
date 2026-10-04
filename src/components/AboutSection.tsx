import React from "react";
import { Sparkles } from "lucide-react";

interface AboutSectionProps {
  onOpenCVModal?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section
      id="about"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative z-10"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Heading - Matching Portfolio Objects/Sections */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover My Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
              Me
            </span>
          </h2>
        </div>

        {/* Two Short Professional Paragraphs */}
        <div className="max-w-2xl mx-auto space-y-4 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed mb-8">
          <p>
            I am a Full Stack Developer dedicated to engineering clean,
            responsive, and performance-driven web applications. My work
            focuses on bridging intuitive frontend interfaces with resilient
            backend architectures, translating complex ideas into seamless
            digital experiences that scale.
          </p>
          <p>
            Driven by curiosity and a commitment to continuous learning, I
            thrive on exploring modern web technologies, AI-powered developer
            tooling, and analytical problem-solving. Every project is an
            opportunity to write maintainable code, optimize user interactions,
            and build software that creates genuine impact.
          </p>
        </div>

        {/* Professional Focus - Integrated in one line enclosed with | */}
        <div className="pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
            Professional Focus
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-2 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
            <span className="text-purple-500/70 font-light select-none">|</span>
            <span className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Full Stack Development
            </span>
            <span className="text-purple-500/70 font-light select-none">|</span>
            <span className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              AI & Emerging Technologies
            </span>
            <span className="text-purple-500/70 font-light select-none">|</span>
            <span className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Modern Web Technologies
            </span>
            <span className="text-purple-500/70 font-light select-none">|</span>
            <span className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Problem Solving
            </span>
            <span className="text-purple-500/70 font-light select-none">|</span>
          </div>
        </div>
      </div>
    </section>
  );
};
