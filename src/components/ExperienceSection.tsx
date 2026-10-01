import React from "react";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Network,
  BookOpen,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export const ExperienceSection: React.FC = () => {
  const { experienceList } = usePortfolio();
  return (
    <section
      id="experience"
      className="py-24 px-4 sm:px-6 lg:px-8 relative z-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professional Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Work{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Experience
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            Hands-on professional background in enterprise networking, system
            troubleshooting, and instructional teaching.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Green Connecting Line */}
          <div className="hidden sm:block absolute left-8 top-6 bottom-6 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />

          <div className="space-y-12">
            {experienceList.map((exp, idx) => {
              const IconComponent =
                exp.iconName === "Network" ? Network : BookOpen;
              return (
                <div key={exp.id} className="relative sm:pl-20 group">
                  {/* Timeline Node on the line */}
                  <div className="hidden sm:flex absolute left-4.5 top-5 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#071912] border-3 border-emerald-500 items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-125 group-hover:border-teal-400 transition-all duration-300 z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:bg-teal-400 animate-ping opacity-75" />
                  </div>

                  {/* Card Content with True Emerald Night Styling */}
                  <div className="bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 shadow-xl backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 shrink-0 group-hover:rotate-6 transition-transform">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                            {exp.role}
                          </h3>
                          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {exp.company}
                          </div>
                        </div>
                      </div>

                      {/* Duration & Badge */}
                      <div className="flex sm:flex-col items-start sm:items-end gap-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/25 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{exp.duration}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-[#092218] border border-transparent dark:border-emerald-500/20">
                          <Clock className="w-3 h-3 text-emerald-500" />
                          <span>{exp.type}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    {/* Key Responsibilities */}
                    <div className="space-y-2 mb-5">
                      {exp.keyResponsibilities.map((resp, rIdx) => (
                        <div
                          key={rIdx}
                          className="flex items-start gap-2 text-xs sm:text-sm text-stone-700 dark:text-stone-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>

                    {/* Technologies Pills */}
                    <div className="border-t border-stone-200/80 dark:border-emerald-500/20 pt-4 flex flex-wrap gap-2">
                      {exp.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
