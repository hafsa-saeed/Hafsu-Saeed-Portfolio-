import React from "react";
import {
  GraduationCap,
  Calendar,
  Award,
  CheckCircle2,
  School,
  Sparkles,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export const EducationSection: React.FC = () => {
  const { educationList } = usePortfolio();

  // Public order: BS → FSc → Matric
  const educationOrder: Record<string, number> = {
    matric: 2,
    fsc: 1,
    "bs-cs": 0,
  };

  const orderedEducation = [...educationList].sort(
    (a, b) =>
      (educationOrder[a.id] ?? 99) - (educationOrder[b.id] ?? 99)
  );

  return (
    <section
      id="education"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative z-10 bg-stone-100/50 dark:bg-[#0a0c24]/70"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Background</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Education &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
              Qualifications
            </span>
          </h2>

          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            Formal education emphasizing algorithmic rigor, scientific method,
            and software engineering principles.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="hidden sm:block absolute left-7 top-5 bottom-5 w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]" />

          <div className="space-y-6 sm:space-y-7">
            {orderedEducation.map((edu) => {
              const isDegree = edu.id === "bs-cs";

              return (
                <div
                  key={edu.id}
                  className="relative sm:pl-16 group"
                >
                  {/* Timeline Node */}
                  <div className="hidden sm:flex absolute left-7 top-5 -translate-x-1/2 w-7 h-7 rounded-full bg-white dark:bg-[#0e102c] border-4 border-purple-500 items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-125 group-hover:border-indigo-400 transition-all duration-300 z-20">
                    <div className="w-2 h-2 rounded-full bg-purple-500 group-hover:bg-indigo-400 animate-ping opacity-75" />
                  </div>

                  {/* Education Card */}
                  <div className="relative bg-white/95 dark:bg-[#0e102c] border border-purple-500/20 dark:border-purple-500/30 rounded-2xl p-5 sm:p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 shadow-md backdrop-blur-md">
                    {/* Active Degree Badge */}
                    {isDegree && (
                      <div className="absolute -top-3 right-5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-[10px] font-bold shadow-md uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>In Active Progress</span>
                      </div>
                    )}

                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3">
                      {/* Icon + Degree */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0 group-hover:rotate-6 transition-transform duration-300">
                          <GraduationCap className="w-5 h-5" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white leading-snug">
                            {edu.degree}
                          </h3>

                          <div className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-start gap-1.5 mt-1">
                            <School className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{edu.institute}</span>
                          </div>
                        </div>
                      </div>

                      {/* Year */}
                      <div className="sm:shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-500/25 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                          <Calendar className="w-3 h-3" />
                          <span>{edu.year}</span>
                        </span>
                      </div>
                    </div>

                    {/* Grade */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{edu.grade}</span>
                      </span>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1.5">
                      {edu.highlights.map((item, hIdx) => {
                        // Remove only the first highlight from BS
                        if (isDegree && hIdx === 0) {
                          return null;
                        }

                        return (
                          <div
                            key={hIdx}
                            className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-200 leading-relaxed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Compact Status */}
                    <div className="mt-3 flex items-center gap-2 text-[11px] font-medium">
                      <span className="text-stone-500 dark:text-stone-400">
                        Status:
                      </span>

                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {isDegree ? "In Progress" : edu.status}
                      </span>
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