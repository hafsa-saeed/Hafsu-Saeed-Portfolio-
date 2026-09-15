import React from "react";
import {
  GraduationCap,
  Calendar,
  Award,
  CheckCircle2,
  School,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { educationList } from "../data/portfolioData";

export const EducationSection: React.FC = () => {
  return (
    <section
      id="education"
      className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-stone-100/50 dark:bg-[#05130e]/70"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Education &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Qualifications
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            Formal education emphasizing algorithmic rigor, scientific method,
            and software engineering principles.
          </p>
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {educationList.map((edu) => {
            const isDegree = edu.id === "edu-bs";
            return (
              <div
                key={edu.id}
                className={`group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 bg-white/95 dark:bg-[#071912] shadow-xl backdrop-blur-md ${
                  isDegree
                    ? "border-2 border-emerald-500/50 shadow-emerald-500/10"
                    : "border border-emerald-500/20 dark:border-emerald-500/30 hover:border-emerald-500/50"
                }`}
              >
                {isDegree && (
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[11px] font-bold shadow-md uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>In Active Progress</span>
                  </div>
                )}

                <div>
                  {/* Top Icon and Year */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{edu.year}</span>
                    </span>
                  </div>

                  {/* Degree Title & Institute */}
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {edu.degree}
                  </h3>
                  <div className="text-sm font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1.5 mt-1">
                    <School className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{edu.institute}</span>
                  </div>

                  {/* Grade Pill */}
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{edu.grade}</span>
                  </div>

                  {/* Highlights */}
                  <div className="mt-5 space-y-2 border-t border-stone-200/80 dark:border-emerald-500/20 pt-4">
                    {edu.highlights.map((item, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Footer */}
                <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-emerald-500/20 flex items-center justify-between text-xs font-medium text-stone-500 dark:text-stone-400">
                  <span>Status:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {edu.status}
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
