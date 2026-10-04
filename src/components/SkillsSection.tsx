import React from "react";
import { Cpu } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export const SkillsSection: React.FC = () => {
  const { circularSkills } = usePortfolio();

  return (
    <section
      id="skills"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative z-10"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4" />
            <span>Technical Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Skills &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
              Expertise
            </span>
          </h2>

          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            A focused overview of my technical skills, development tools,
            programming knowledge, and modern web technologies.
          </p>
        </div>

        {/* Skill Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {circularSkills.map((skill, idx) => {
            const radius = 42;
            const circumference = 2 * Math.PI * radius;
            const percentage = Number(skill.percentage) || 0;

            const strokeDashoffset =
              circumference - (percentage / 100) * circumference;

            return (
              <div
                key={`${skill.name}-${idx}`}
                className="
                  group
                  bg-white/95 dark:bg-[#0e102c]
                  border border-purple-500/20 dark:border-purple-500/30
                  rounded-3xl
                  p-5
                  flex flex-col items-center text-center
                  shadow-lg
                  backdrop-blur-md
                  transition-all duration-300 ease-out
                  hover:-translate-y-1
                  hover:border-purple-500/40
                  hover:shadow-xl
                  hover:shadow-purple-500/10
                "
              >
                {/* Skill Circle */}
                <div
                  className="
                    relative w-28 h-28
                    flex items-center justify-center
                    mb-3
                    transition-transform duration-300 ease-out
                    group-hover:scale-[1.03]
                  "
                >
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      className="text-stone-200 dark:text-[#161a45]"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />

                    {/* Progress Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={skill.color}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>

                  {/* Percentage */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="
                        text-2xl font-black
                        text-stone-900 dark:text-white
                        transition-colors duration-300
                        group-hover:text-purple-600
                        dark:group-hover:text-purple-400
                      "
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Skill Name */}
                <h4
                  className="
                    font-bold text-sm
                    text-stone-900 dark:text-white
                    group-hover:text-purple-600
                    dark:group-hover:text-purple-400
                    transition-colors duration-300
                  "
                >
                  {skill.name}
                </h4>

                {/* Skill Category */}
                <p
                  className="
                    text-[11px]
                    text-stone-500 dark:text-stone-400
                    mt-0.5
                    transition-colors duration-300
                    group-hover:text-stone-600
                    dark:group-hover:text-stone-300
                  "
                >
                  {skill.category}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};