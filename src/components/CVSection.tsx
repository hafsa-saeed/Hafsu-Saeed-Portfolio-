import React from "react";
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Printer,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface CVSectionProps {
  onOpenCVModal: () => void;
}

export const CVSection: React.FC<CVSectionProps> = ({ onOpenCVModal }) => {
  const { personalInfo } = usePortfolio();
  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="cv"
      className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-stone-100/50 dark:bg-[#05130e]/80"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            <span>Curriculum Vitae</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Curriculum{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Vitae (CV)
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            Review my complete career credentials, academic milestones, and
            technical qualifications.
          </p>
        </div>

        {/* Embedded Interactive CV Preview Card */}
        <div className="bg-white/95 dark:bg-[#071912] rounded-3xl p-6 sm:p-10 border border-emerald-500/25 dark:border-emerald-500/35 overflow-hidden shadow-2xl relative backdrop-blur-md">
          {/* Top Bar with Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-200/80 dark:border-emerald-500/20">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  Hafsa_Saeed_Resume.pdf
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Official BS CS Curriculum Vitae • Verified 2026 Edition
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenCVModal}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>View Full CV</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-[#092218] hover:bg-stone-200 dark:hover:bg-[#103427] text-stone-800 dark:text-stone-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-stone-200 dark:border-emerald-500/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Download / Print</span>
              </button>
            </div>
          </div>

          {/* Embedded Resume Preview Canvas */}
          <div className="mt-8 bg-stone-50 dark:bg-[#092218] text-stone-900 dark:text-stone-100 rounded-2xl p-6 sm:p-10 shadow-lg border border-stone-200 dark:border-emerald-500/25 max-w-3xl mx-auto font-['Inter',sans-serif]">
            {/* CV Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between border-b-2 border-emerald-600 pb-6 gap-6">
              <div>
                <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                  HAFSA SAEED
                </h1>
                <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider mt-1">
                  BS Computer Science Student & Full Stack Web Developer
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 max-w-md leading-relaxed">
                  {personalInfo.bio}
                </p>
              </div>

              {/* Quick Info Box */}
              <div className="text-xs text-stone-600 dark:text-stone-300 space-y-1 bg-white dark:bg-[#071912] p-4 rounded-xl border border-stone-200 dark:border-emerald-500/30 shrink-0 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800 dark:text-stone-100">
                    Age:
                  </span>
                  <span>20 Years Old (Female)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800 dark:text-stone-100">
                    Location:
                  </span>
                  <span>{personalInfo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800 dark:text-stone-100">
                    Email:
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {personalInfo.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800 dark:text-stone-100">
                    Phone:
                  </span>
                  <span>{personalInfo.phone2}</span>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="mt-6 space-y-6 text-xs sm:text-sm">
              {/* Education */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education</span>
                </h4>
                <div className="space-y-3">
                  <div className="border-l-2 border-emerald-500 pl-3">
                    <div className="font-bold text-stone-900 dark:text-white">
                      BS Computer Science (6th Sem Continue)
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 text-xs">
                      Superior Group of Colleges, Mianwali (2023 - 2027)
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Core coursework: OOP, DSA, Database Systems, Computer
                      Networks, AI Systems
                    </div>
                  </div>
                  <div className="border-l-2 border-stone-300 dark:border-emerald-500/30 pl-3">
                    <div className="font-bold text-stone-900 dark:text-white">
                      FSC Pre-Medical (Grade A, 848/1100)
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 text-xs">
                      Superior Group of Colleges (2021 - 2023)
                    </div>
                  </div>
                  <div className="border-l-2 border-stone-300 dark:border-emerald-500/30 pl-3">
                    <div className="font-bold text-stone-900 dark:text-white">
                      Matriculation Science (Grade A+, 1074/1100)
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 text-xs">
                      Govt. Girls Higher Secondary School Kundian (2019 - 2021)
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Work Experience</span>
                </h4>
                <div className="space-y-3">
                  <div className="border-l-2 border-emerald-500 pl-3">
                    <div className="font-bold text-stone-900 dark:text-white">
                      Networking Specialist — STS (Success Training System)
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 text-xs">
                      June 2023 – Dec 2023
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                      Configured LAN infrastructure, IP addressing schemes,
                      subnetting, hardware diagnostics, and switch setup.
                    </div>
                  </div>
                  <div className="border-l-2 border-stone-300 dark:border-emerald-500/30 pl-3">
                    <div className="font-bold text-stone-900 dark:text-white">
                      Computer & General Instructor — Dream House School System
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 text-xs">
                      July 2024 – Dec 2024
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                      Taught computer science curricula, basic programming
                      constructs, typing speed, and office applications,
                      English, Methamatics, General Science
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Technical Capabilities */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Technical Proficiencies</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <strong>Frontend:</strong> React, HTML5, CSS3, Tailwind, JS,
                    Bootstrap, Next.js, TypeScript,
                  </div>
                  <div>
                    <strong>Backend:</strong> Node.js, Express, REST APIs,
                    Python
                  </div>
                  <div>
                    <strong>Databases:</strong> MongoDB, MySQL
                  </div>
                  <div>
                    <strong>Additional:</strong> Git , Github
                  </div>
                  <div>
                    <strong>AI Tools:</strong> Lovable, Claude, Cursor, ChatGPT,
                    Menus, Google AI studio, Gemini
                  </div>
                  <div>
                    <strong>Programming skills:</strong> C, C++, Java, Python,
                    JavaScript, Numby, Pandas,Data Structure and algorithm,
                  </div>
                  <div>
                    <strong>Courses:</strong> Wordpress, Data Analytics &
                    Business Development, Office Automization
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
