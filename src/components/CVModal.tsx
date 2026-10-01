import React from "react";
import {
  X,
  Printer,
  Download,
  FileText,
  GraduationCap,
  Briefcase,
  Sparkles,
  Award,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  const { personalInfo, educationList, experienceList } = usePortfolio();
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const cvContent = `
=====================================================
            HAFSA SAEED - CURRICULUM VITAE
  BS Computer Science Student & Full Stack Web Developer
=====================================================

CONTACT INFORMATION:
- Email: ${personalInfo.email}
- Phone: ${personalInfo.phone1} / ${personalInfo.phone2}
- Location: ${personalInfo.location}
- Demographics: Age: 20 | Gender: Female | Nationality: Pakistani

PROFESSIONAL SUMMARY:
${personalInfo.bio}

EDUCATION OVERVIEW:
1. BS Computer Science (6th Semester Continue)
   Superior Group of Colleges, Mianwali (2023 - 2027)
   Expected Completion: End of 2027

2. FSC Pre-Medical
   Superior Group of Colleges, Mianwali (2023)
   Score: 848 / 1100 (Grade A Distinction)

3. Matriculation (Science)
   Govt. Girls Higher Secondary School Kundian (2021)
   Score: 1074 / 1100 (Grade A+ Distinction)

TECHNICAL SKILLS & TOOLS:
- Frontend: HTML5, CSS3, JavaScript (ES6+), React.js, Tailwind CSS, Bootstrap 5
- Backend & DB: Node.js, Express.js, MongoDB, MySQL
- Languages & Data: Python, Pandas, C, C++, Data Structures & Algorithms
- AI & Modern Tools: Modern AI Dev Workflows (Lovable, Claude, Cursor, Gemini, ChatGPT), DigiSkills WordPress, MS Office Automation

WORK EXPERIENCE:
- STS (Success Training System) - Networking Specialist (June 2023 - Dec 2023)
  Hands-on networking configuration, troubleshooting, routing protocols, and hardware diagnostics.
- Dream House School System - Computer & General Instructor (July 2024 - Dec 2024)
  Delivered computer fundamentals and digital literacy curricula.

COURSES & DIGISKILLS CERTIFICATIONS:
- WordPress CMS Development (From DigiSkills Training Program)
- Data Analytics & Business Development Course (From DigiSkills Training Program)
- Office Automation Course (MS Word, Excel, PowerPoint)

PERSONAL MOTTO:
"${personalInfo.quote}" — ${personalInfo.quoteAuthor}
=====================================================
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([cvContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Hafsa_Saeed_CV.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#071912] rounded-3xl shadow-2xl border border-emerald-500/30 flex flex-col">
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#071912]/95 backdrop-blur-md border-b border-stone-200 dark:border-emerald-500/20">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
              Official Curriculum Vitae • Hafsa Saeed
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#092218] dark:hover:bg-[#103427] text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200/80 dark:border-emerald-500/20"
            >
              <Printer className="w-4 h-4 text-emerald-500" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-500/30"
            >
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#092218] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-6 sm:p-12 font-['Inter',sans-serif] text-stone-900 dark:text-stone-100 print:text-black">
          {/* Header */}
          <div className="border-b-2 border-emerald-600 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
                HAFSA SAEED
              </h1>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm tracking-wide uppercase mt-1">
                BS Computer Science Student & Full Stack Web Developer
              </p>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-3 max-w-xl leading-relaxed">
                {personalInfo.bio}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#092218] border border-stone-200 dark:border-emerald-500/25 text-xs space-y-1.5 shrink-0 w-full sm:w-auto shadow-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>{personalInfo.phone1}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  Age: {personalInfo.age} • {personalInfo.gender}
                </span>
              </div>
            </div>
          </div>

          {/* Body Sections */}
          <div className="space-y-8">
            {/* Education */}
            <section>
              <h2 className="text-base font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2 border-b border-stone-200 dark:border-emerald-500/20 pb-2">
                <GraduationCap className="w-5 h-5 text-emerald-500" />
                <span>Academic Record & Degrees</span>
              </h2>
              <div className="space-y-4">
                {educationList.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-[#092218] transition-colors"
                  >
                    <div>
                      <div className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                        {edu.degree}
                      </div>
                      <div className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        {edu.institute}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-stone-600 dark:text-stone-300">
                        {edu.highlights.map((h, i) => (
                          <span key={i} className="inline-block">
                            • {h}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300">
                        {edu.year}
                      </span>
                      <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-semibold">
                        {edu.grade}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Work Experience */}
            <section>
              <h2 className="text-base font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2 border-b border-stone-200 dark:border-emerald-500/20 pb-2">
                <Briefcase className="w-5 h-5 text-emerald-500" />
                <span>Professional Experience</span>
              </h2>
              <div className="space-y-4">
                {experienceList.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-[#092218] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                        {exp.role}
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {exp.duration}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 mb-2">
                      {exp.company}
                    </div>
                    <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300 mb-2">
                      {exp.keyResponsibilities.map((resp, idx) => (
                        <li key={idx}>• {resp}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-stone-100 dark:bg-[#092218] border border-stone-200 dark:border-emerald-500/20 text-stone-700 dark:text-stone-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications & Training */}
            <section>
              <h2 className="text-base font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2 border-b border-stone-200 dark:border-emerald-500/20 pb-2">
                <Award className="w-5 h-5 text-emerald-500" />
                <span>Certifications & Short Courses</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#092218] border border-stone-200 dark:border-emerald-500/20">
                  <div className="font-bold text-stone-900 dark:text-white">
                    WordPress CMS Development
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    DigiSkills Training Program
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Themes, plugins, WooCommerce, database migrations
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#092218] border border-stone-200 dark:border-emerald-500/20">
                  <div className="font-bold text-stone-900 dark:text-white">
                    Data Analytics & Business Dev
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    DigiSkills Training Program
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Exploratory data analysis, market research, client
                    communication
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#092218] border border-stone-200 dark:border-emerald-500/20">
                  <div className="font-bold text-stone-900 dark:text-white">
                    Office Automation Course
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    Advanced Computer Literacy
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    MS Excel formulas, Word reporting, professional
                    presentations
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#092218] border border-stone-200 dark:border-emerald-500/20">
                  <div className="font-bold text-stone-900 dark:text-white">
                    AI-Assisted Engineering
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    Self-Directed Research
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Claude, Cursor, Gemini, Lovable rapid prototyping workflows
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
