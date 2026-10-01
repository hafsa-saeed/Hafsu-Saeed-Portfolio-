import React from "react";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Languages,
  Calendar,
  CheckCircle2,
  Download,
  Quote,
  Sparkles,
  Target,
  Heart,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface AboutSectionProps {
  onOpenCVModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenCVModal,
}) => {
  const { personalInfo } = usePortfolio();
  const personalDetails = [
    { label: "Full Name", value: personalInfo.name, icon: User },
    { label: "Age", value: personalInfo.age, icon: Calendar },
    { label: "Gender", value: personalInfo.gender, icon: User },
    { label: "Nationality", value: personalInfo.nationality, icon: Target },
    { label: "Religion", value: personalInfo.religion, icon: Heart },
    {
      label: "Marital Status",
      value: personalInfo.maritalStatus,
      icon: CheckCircle2,
    },
    { label: "Location", value: personalInfo.location, icon: MapPin },
    { label: "Email", value: personalInfo.email, icon: Mail },
    { label: "Phone 1", value: personalInfo.phone1, icon: Phone },
    { label: "Phone 2", value: personalInfo.phone2, icon: Phone },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover My Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Me
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            Passionate about transforming computing concepts into elegant
            digital applications.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Visual Portrait & Quotation Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              {/* Outer decorative glowing layer */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur-lg opacity-25" />

              {/* Main Visual Card */}
              <div className="relative bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-4 sm:p-6 overflow-hidden shadow-xl backdrop-blur-md">
                <div className="relative rounded-2xl overflow-hidden aspect-4/5 bg-emerald-950/20 mb-5">
                  <img
                    src="/about-Profile-img.jpg"
                    alt="Hafsa Saeed - Computer Science Student"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                    <div className="text-white">
                      <div className="font-bold text-lg">
                        {personalInfo.name}
                      </div>
                      <div className="text-xs text-emerald-300 font-medium">
                        BS CS Student • Superior Group of Colleges
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quote Card */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-stone-800 dark:text-stone-200">
                  <div className="flex items-start gap-3">
                    <Quote className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs sm:text-sm italic font-medium leading-relaxed">
                        "{personalInfo.quote}"
                      </p>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                        — {personalInfo.quoteAuthor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Quick Facts & Goals */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-3">
                  Hello! I'm{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Hafsa Saeed
                  </span>
                </h3>
                <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed mb-3">
                  {personalInfo.bio}
                </p>
                <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                  My core technical focus centers on crafting robust web
                  solutions using React, Node.js, and modern databases, paired
                  with algorithmic problem-solving. Beyond traditional
                  programming, I actively integrate AI-driven
                  workflows—leveraging tools like Gemini, Claude, and AI coding
                  assistants—to accelerate development and engineer smarter
                  digital products.
                </p>
              </div>

              {/* Quick Facts Grid */}
              <div className="border-t border-stone-200/80 dark:border-emerald-500/20 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Personal Details & Demographics</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {personalDetails.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 dark:bg-[#092218] border border-stone-200/60 dark:border-emerald-500/25 shadow-xs"
                    >
                      <detail.icon className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-stone-500 dark:text-stone-400 font-medium">
                        {detail.label}:
                      </span>
                      <span className="font-semibold text-stone-800 dark:text-stone-100 truncate">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages Spoken */}
              <div className="border-t border-stone-200/80 dark:border-emerald-500/20 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  <span>Languages Spoken</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {personalInfo.languages.map((lang, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/25 text-xs text-stone-800 dark:text-stone-200 font-medium flex items-center gap-1.5"
                    >
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {lang.name}:
                      </span>
                      <span>{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goals & Next Aims */}
              <div className="border-t border-stone-200/80 dark:border-emerald-500/20 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>My Goals & Next Aims (AI Era)</span>
                </h4>
                <ul className="space-y-2">
                  {personalInfo.goals.map((goal, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={onOpenCVModal}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Preview Full Resume</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
