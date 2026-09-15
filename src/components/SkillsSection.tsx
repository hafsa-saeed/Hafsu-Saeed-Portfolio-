import React, { useState } from "react";
import {
  Code2,
  Database,
  Cpu,
  Sparkles,
  Bot,
  CheckCircle,
  Flame,
  Layout,
  Terminal,
  Brain,
} from "lucide-react";
import { skillCategories, circularSkills } from "../data/portfolioData";

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabIcons = [Layout, Database, Terminal, Bot, Brain];

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Skills &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Expertise
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            From algorithmic data structures to modern AI workflows and
            responsive frontend architectures.
          </p>
        </div>

        {/* Circular Progress Indicators for Core Competencies */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {circularSkills.map((skill, idx) => {
            const radius = 42;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset =
              circumference - (skill.percentage / 100) * circumference;

            return (
              <div
                key={idx}
                className="bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-5 flex flex-col items-center text-center hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 group shadow-lg backdrop-blur-md"
              >
                <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      className="text-stone-200 dark:text-[#0b2b20]"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {/* Animated Foreground Ring */}
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
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-stone-900 dark:text-white">
                      {skill.percentage}%
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  {skill.name}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {skill.category}
                </p>
              </div>
            );
          })}
        </div>

        {/* Categorized Skills Section with Tabs */}
        <div className="bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-stone-200/80 dark:border-emerald-500/20">
            {skillCategories.map((cat, idx) => {
              const TabIcon = tabIcons[idx % tabIcons.length];
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                      : "bg-stone-100 dark:bg-[#092218] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#0f3424] border border-transparent dark:border-emerald-500/20"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{cat.category}</span>
                </button>
              );
            })}
          </div>

          {/* Active Skills Grid with Animated Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories[activeTab].skills.map((skill, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-[#092218] border border-stone-200/70 dark:border-emerald-500/25 hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-sm text-stone-900 dark:text-white">
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {skill.level}%
                  </span>
                </div>

                {skill.description && (
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">
                    {skill.description}
                  </p>
                )}

                {/* Animated Progress Bar */}
                <div className="w-full h-2 rounded-full bg-stone-200/80 dark:bg-[#06150f] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 transition-all duration-700 ease-out shadow-xs shadow-emerald-500/50"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Modern AI Dev Tools Callout */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  Modern AI Workflow Integration
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Proficient in leveraging Claude, Cursor, Gemini, Lovable, and
                  ChatGPT for rapid prototyping and clean architecture.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {["Gemini", "Claude", "Cursor", "Lovable", "ChatGPT"].map(
                (tool, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white dark:bg-[#092218] border border-emerald-500/25 text-emerald-700 dark:text-emerald-300"
                  >
                    {tool}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
