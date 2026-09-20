import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  ArrowDown,
  Linkedin,
  Github,
  Twitter,
  Mail,
  Sparkles,
  PhoneCall,
  Award,
  BookOpen,
  Code2,
} from "lucide-react";
import { personalInfo } from "../data/portfolioData";

interface HeroSectionProps {
  onOpenCVModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCVModal }) => {
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
          setTitleIndex((prev) => (prev + 1) % personalInfo.titles.length);
          setTypingSpeed(250);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex, typingSpeed]);

  const handleDownloadCV = () => {
    // Triggers download or open CV modal
    onOpenCVModal();
  };

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

        {/* Small greeting badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Assalamu Alaikum & Welcome to My Digital Space</span>
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
          <button
            onClick={onOpenCVModal}
            className="flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>View CV</span>
          </button>

          <button
            onClick={handleDownloadCV}
            className="flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl font-semibold text-sm sm:text-base text-emerald-800 dark:text-emerald-200 bg-white/80 dark:bg-[#0b241b]/90 hover:bg-emerald-50 dark:hover:bg-[#103427] border-2 border-emerald-500/40 hover:border-emerald-500 shadow-md shadow-emerald-500/10 hover:scale-105 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download CV</span>
          </button>
        </div>

        {/* Social Media Icons with Bouncing Micro-interactions */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-12">
          {[
            {
              label: "LinkedIn",
              icon: Linkedin,
              href: personalInfo.socials.linkedin,
            },
            {
              label: "GitHub",
              icon: Github,
              href: personalInfo.socials.github,
            },
            {
              label: "Twitter",
              icon: Twitter,
              href: personalInfo.socials.twitter,
            },
            { label: "Email", icon: Mail, href: personalInfo.socials.email },
            {
              label: "WhatsApp",
              icon: PhoneCall,
              href: personalInfo.socials.whatsapp,
            },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-115 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/30 transition-all duration-200"
            >
              <item.icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl">
          {personalInfo.stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/90 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 text-center hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg backdrop-blur-md"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {stat.value}
                <span className="text-xs sm:text-sm font-semibold text-emerald-700/70 dark:text-emerald-300/70 ml-0.5">
                  {stat.suffix}
                </span>
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                {stat.label}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll-down Indicator */}
        <a
          href="#about"
          aria-label="Scroll down to About section"
          className="mt-12 flex flex-col items-center gap-1.5 text-stone-500 dark:text-stone-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
        >
          <span className="text-xs tracking-wider uppercase font-semibold">
            Explore Profile
          </span>
          <div className="w-7 h-11 rounded-full border-2 border-emerald-500/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
};
