import React from "react";
import {
  Briefcase,
  Calendar,
  Network,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export const ExperienceSection: React.FC = () => {
  const { experienceList } = usePortfolio();

  return (
    <section
      id="experience"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative z-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professional Milestones</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Work{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
              Experience
            </span>
          </h2>

          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            A brief overview of my professional experience and practical
            learning.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {experienceList.slice(0, 2).map((exp) => {
            const IconComponent =
              exp.iconName === "Network" ? Network : BookOpen;

            return (
              <div
                key={exp.id}
                className="group relative bg-white/95 dark:bg-[#0e102c] border border-purple-500/20 dark:border-purple-500/30 rounded-2xl p-6 sm:p-7 shadow-lg backdrop-blur-md hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top Icon + Duration */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:rotate-6 transition-transform duration-300 shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-500/20 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                    <Calendar className="w-3 h-3" />
                    {exp.duration}
                  </span>
                </div>

                {/* Role */}
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {exp.role}
                </h3>

                {/* Company */}
                <div className="flex items-center gap-1.5 mt-1.5 text-sm font-semibold text-purple-600 dark:text-purple-400">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span>{exp.company}</span>
                </div>

                {/* Short Description */}
                <p className="mt-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
                  {exp.description}
                </p>

                {/* Type */}
                <div className="mt-5 pt-4 border-t border-stone-200/70 dark:border-purple-500/20">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                    {exp.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};