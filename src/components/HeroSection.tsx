import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  ArrowDown,
  Sparkles,
  Award,
  BookOpen,
  Code2,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface HeroSectionProps {
  onOpenCVModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const { personalInfo } = usePortfolio();
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(110);

  // Typing effect
  useEffect(() => {
    const fullText = personalInfo.titles[titleIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));

        if (currentText.length + 1 === fullText.length) {
          // Pause at end
          setTypingSpeed(1800);
          setIsDeleting(true);
        } else {
          setTypingSpeed(90);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(45);

        if (currentText.length === 0) {
          setIsDeleting(false);
          setTitleIndex(
            (prev) => (prev + 1) % personalInfo.titles.length
          );
          setTypingSpeed(250);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex, typingSpeed]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Soft radial backdrop glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-teal-300/15 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center z-10">

        {/* Floating Profile Picture with Glowing Rings */}
        <div className="relative mb-6 sm:mb-8 group">

          {/* Animated glow aura */}
          <div className="absolute -inset-2.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

          {/* Floating Outer Circle */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-emerald-600 via-emerald-400 to-teal-300 shadow-xl shadow-emerald-500/25 animate-float">

            <div className="w-full h-full rounded-full overflow-hidden bg-emerald-950 border-4 border-white dark:border-[#0a1e16] relative flex items-center justify-center">

              {/* High-quality portrait representation */}
              <img
                src="/my-photo.jpg"
                alt="Hafsa Saeed"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />

              {/* Subtle glass reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-white/10 pointer-events-none" />
            </div>

            {/* Active Status Badge */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-1 border-2 border-white dark:border-[#0a1e16] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Available</span>
            </div>

          </div>
        </div>

        {/* Main Name & Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-stone-900 dark:text-white mb-4">
          Hi, I'm{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500">
            {personalInfo.name}
          </span>
        </h1>

        {/* Animated Typing Title */}
        <div className="h-10 sm:h-12 flex items-center justify-center mb-5">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-stone-700 dark:text-stone-200 flex items-center">
            <span>{currentText}</span>

            <span className="w-0.5 h-6 sm:h-8 bg-emerald-500 ml-1.5 animate-ping inline-block" />
          </h2>
        </div>

        {/* Short Tagline */}
        <p className="max-w-2xl text-stone-600 dark:text-stone-300 text-sm sm:text-base lg:text-lg mb-8 leading-relaxed font-normal">
          Currently pursuing my BS in Computer Science (6th Semester) at
          Superior Group of Colleges. Passionate about engineering responsive
          web applications, working with modern AI dev tools, and solving
          algorithmic challenges.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 w-full max-w-md">

          <a
            href="/Hafsa_Saeed_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>View CV</span>
          </a>

          <a
            href="/Hafsa_Saeed_CV.pdf"
            download="Hafsa_Saeed_CV.pdf"
            className="flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl font-semibold text-sm sm:text-base text-emerald-800 dark:text-emerald-200 bg-white/80 dark:bg-[#0b241b]/90 hover:bg-emerald-50 dark:hover:bg-[#103427] border-2 border-emerald-500/40 hover:border-emerald-500 shadow-md shadow-emerald-500/10 hover:scale-105 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download CV</span>
          </a>

        </div>

      </div>
    </section>
  );
};
