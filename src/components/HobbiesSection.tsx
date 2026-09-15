import React from "react";
import {
  Cpu,
  Code2,
  BookMarked,
  Compass,
  Sparkles,
  HeartHandshake,
  Lightbulb,
} from "lucide-react";
import { hobbiesList } from "../data/portfolioData";

export const HobbiesSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Cpu":
        return <Cpu className="w-7 h-7" />;
      case "Code2":
        return <Code2 className="w-7 h-7" />;
      case "BookMarked":
        return <BookMarked className="w-7 h-7" />;
      case "Compass":
        return <Compass className="w-7 h-7" />;
      default:
        return <Lightbulb className="w-7 h-7" />;
    }
  };

  return (
    <section
      id="hobbies"
      className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-stone-100/40 dark:bg-[#05130e]/60"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-4 h-4" />
            <span>Passions & Interests</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Hobbies &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Curiosity
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            What fuels my creativity outside the university lecture halls and
            code repositories.
          </p>
        </div>

        {/* Hobbies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hobbiesList.map((hobby) => (
            <div
              key={hobby.id}
              className="group relative bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 shadow-xl backdrop-blur-md"
            >
              <div>
                {/* Icon Container with Animated Gradient */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${hobby.colorClass} text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                >
                  {getIcon(hobby.icon)}
                </div>

                <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-3">
                  {hobby.tag}
                </span>

                <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                  {hobby.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                  {hobby.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200/80 dark:border-emerald-500/20 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Continuous Lifelong Learning</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
