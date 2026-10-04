import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface SearchResult {
  id: string;
  type: "Project" | "Skill" | "Experience" | "Education" | "Achievement" | "About";
  title: string;
  subtitle: string;
  targetId: string;
  snippet?: string;
}

export const PortfolioSearch: React.FC = () => {
  const {
    personalInfo,
    projectsList,
    educationList,
    experienceList,
    circularSkills,
    skillCategories,
    credentialsList,
  } = usePortfolio();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsMobileExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus mobile input when expanded
  useEffect(() => {
    if (isMobileExpanded && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  }, [isMobileExpanded]);

  // Compute Search Results
  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: SearchResult[] = [];

    // 1. Projects
    projectsList.forEach((p) => {
      const matchInTitle = p.title.toLowerCase().includes(q);
      const matchInDesc = p.description.toLowerCase().includes(q);
      const matchInLongDesc = p.longDescription?.toLowerCase().includes(q);
      const matchInTags = p.tags.some((t) => t.toLowerCase().includes(q));
      const matchInCat = p.category.toLowerCase().includes(q);

      if (matchInTitle || matchInDesc || matchInLongDesc || matchInTags || matchInCat) {
        matches.push({
          id: `proj-${p.id}`,
          type: "Project",
          title: p.title,
          subtitle: p.tags.slice(0, 3).join(", ") || p.category,
          targetId: "projects",
          snippet: p.description,
        });
      }
    });

    // 2. Skills
    const seenSkills = new Set<string>();
    circularSkills.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) {
        seenSkills.add(s.name.toLowerCase());
        matches.push({
          id: `skill-${s.name}`,
          type: "Skill",
          title: s.name,
          subtitle: `${s.percentage}% • ${s.category}`,
          targetId: "skills",
        });
      }
    });

    skillCategories.forEach((cat) => {
      cat.skills.forEach((s) => {
        if (!seenSkills.has(s.name.toLowerCase())) {
          if (
            s.name.toLowerCase().includes(q) ||
            cat.category.toLowerCase().includes(q) ||
            s.description?.toLowerCase().includes(q)
          ) {
            seenSkills.add(s.name.toLowerCase());
            matches.push({
              id: `skill-cat-${s.name}`,
              type: "Skill",
              title: s.name,
              subtitle: cat.category,
              targetId: "skills",
            });
          }
        }
      });
    });

    // 3. Work Experience
    experienceList.forEach((exp) => {
      const matchRole = exp.role.toLowerCase().includes(q);
      const matchCompany = exp.company.toLowerCase().includes(q);
      const matchDesc = exp.description.toLowerCase().includes(q);
      const matchTech = exp.technologies.some((t) => t.toLowerCase().includes(q));
      const matchResp = exp.keyResponsibilities.some((r) => r.toLowerCase().includes(q));

      if (matchRole || matchCompany || matchDesc || matchTech || matchResp) {
        matches.push({
          id: `exp-${exp.id}`,
          type: "Experience",
          title: exp.role,
          subtitle: `${exp.company} (${exp.duration})`,
          targetId: "experience",
          snippet: exp.description,
        });
      }
    });

    // 4. Education
    educationList.forEach((edu) => {
      const matchDegree = edu.degree.toLowerCase().includes(q);
      const matchInst = edu.institute.toLowerCase().includes(q);
      const matchHigh = edu.highlights.some((h) => h.toLowerCase().includes(q));
      const matchGrade = edu.grade?.toLowerCase().includes(q);

      if (matchDegree || matchInst || matchHigh || matchGrade) {
        matches.push({
          id: `edu-${edu.id}`,
          type: "Education",
          title: edu.degree,
          subtitle: `${edu.institute} • ${edu.year}`,
          targetId: "education",
        });
      }
    });

    // 5. Achievements / Credentials
    credentialsList.forEach((cred) => {
      const matchTitle = cred.title.toLowerCase().includes(q);
      const matchIssuer = cred.issuer.toLowerCase().includes(q);
      const matchSkills = cred.skillsLearned.some((s) => s.toLowerCase().includes(q));
      const matchCat = cred.category.toLowerCase().includes(q);

      if (matchTitle || matchIssuer || matchSkills || matchCat) {
        matches.push({
          id: `cred-${cred.id}`,
          type: "Achievement",
          title: cred.title,
          subtitle: `${cred.issuer} • ${cred.date}`,
          targetId: "credentials",
        });
      }
    });

    // 6. About
    if (
      personalInfo.bio?.toLowerCase().includes(q) ||
      personalInfo.name?.toLowerCase().includes(q) ||
      personalInfo.quote?.toLowerCase().includes(q) ||
      personalInfo.titles?.some((t) => t.toLowerCase().includes(q)) ||
      "about me background bio".includes(q)
    ) {
      matches.push({
        id: "about-me-match",
        type: "About",
        title: personalInfo.name,
        subtitle: personalInfo.titles?.[0] || "Full Stack Developer",
        targetId: "about",
        snippet: personalInfo.bio,
      });
    }

    return matches.slice(0, 8); // Top 8 most relevant matches
  }, [
    query,
    projectsList,
    circularSkills,
    skillCategories,
    experienceList,
    educationList,
    credentialsList,
    personalInfo,
  ]);

  const handleSelectResult = (targetId: string) => {
    setIsOpen(false);
    setIsMobileExpanded(false);
    setQuery("");

    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -80; // Offset for sticky navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const getBadgeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "Project":
        return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25";
      case "Skill":
        return "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/25";
      case "Experience":
        return "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25";
      case "Education":
        return "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/25";
      case "Achievement":
        return "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/25";
      case "About":
        return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25";
      default:
        return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25";
    }
  };

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "Project":
        return <FolderGit2 className="w-3.5 h-3.5" />;
      case "Skill":
        return <Cpu className="w-3.5 h-3.5" />;
      case "Experience":
        return <Briefcase className="w-3.5 h-3.5" />;
      case "Education":
        return <GraduationCap className="w-3.5 h-3.5" />;
      case "Achievement":
        return <Award className="w-3.5 h-3.5" />;
      case "About":
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* ========================================================
          1. Desktop & Tablet Compact Search Bar (slightly wider than View CV)
      ======================================================== */}
      <div className="hidden sm:flex items-center relative">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-stone-400 dark:text-purple-400/80 absolute left-2.5 pointer-events-none transition-colors" />

          <input
            ref={desktopInputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) setIsOpen(true);
            }}
            placeholder="Search..."
            className="w-32 sm:w-36 md:w-40 lg:w-44 pl-8 pr-7 py-2 rounded-xl text-xs bg-stone-100 dark:bg-[#0e102c] text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 border border-stone-200/80 dark:border-purple-500/30 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
                desktopInputRef.current?.focus();
              }}
              className="absolute right-2 p-0.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          2. Mobile Clean Search Icon Button (Non-intrusive)
      ======================================================== */}
      <div className="sm:hidden flex items-center">
        <button
          onClick={() => {
            setIsMobileExpanded(!isMobileExpanded);
            if (!isMobileExpanded) {
              setIsOpen(true);
            }
          }}
          aria-label="Search portfolio"
          className="p-2 rounded-xl text-stone-700 dark:text-stone-200 bg-stone-100 hover:bg-stone-200 dark:bg-[#0e102c] dark:hover:bg-[#14173d] transition-colors border border-stone-200/80 dark:border-purple-500/30 cursor-pointer shadow-xs"
        >
          {isMobileExpanded ? (
            <X className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          ) : (
            <Search className="w-4 h-4 text-stone-600 dark:text-purple-400" />
          )}
        </button>
      </div>

      {/* ========================================================
          3. Mobile Smoothly Expandable Search Row
      ======================================================== */}
      {isMobileExpanded && (
        <div className="sm:hidden fixed left-0 right-0 top-[60px] bg-white/95 dark:bg-[#08091a]/98 backdrop-blur-xl border-b border-purple-500/20 px-4 py-2.5 shadow-xl animate-in slide-in-from-top-2 duration-200 z-50">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-purple-500 absolute left-3 pointer-events-none" />

            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              placeholder="Search projects, skills, experience..."
              className="w-full pl-9 pr-9 py-2 rounded-xl text-xs bg-stone-100 dark:bg-[#111335] text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 border border-stone-200 dark:border-purple-500/30 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />

            {query ? (
              <button
                onClick={() => {
                  setQuery("");
                  mobileInputRef.current?.focus();
                }}
                className="absolute right-2.5 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsMobileExpanded(false)}
                className="absolute right-2.5 text-[11px] font-semibold text-stone-400 hover:text-purple-500"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          4. Search Results Floating Dropdown (Responsive)
      ======================================================== */}
      {isOpen && query.trim().length > 0 && (
        <div
          className={`
            fixed sm:absolute
            top-[115px] sm:top-full
            left-3 right-3 sm:left-auto sm:right-0
            sm:w-80 md:w-96
            mt-2
            max-h-[65vh] sm:max-h-96
            overflow-y-auto
            rounded-2xl
            bg-white/98 dark:bg-[#0c0e29]/98
            backdrop-blur-2xl
            border border-purple-500/25 dark:border-purple-500/35
            shadow-2xl shadow-purple-950/20
            p-2
            z-50
            animate-in fade-in slide-in-from-top-2 duration-150
          `}
        >
          {results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center justify-between border-b border-stone-200/70 dark:border-purple-500/15 mb-1 pb-1.5">
                <span>Matching Results</span>
                <span className="text-stone-400 dark:text-stone-500 font-normal">
                  {results.length} found
                </span>
              </div>

              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectResult(item.targetId)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-purple-500/10 dark:hover:bg-purple-500/15 transition-all duration-150 flex items-start gap-2.5 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-[#14173d] flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    {getTypeIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${getBadgeColor(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {item.subtitle}
                    </p>

                    {item.snippet && (
                      <p className="text-[10px] text-stone-400 dark:text-stone-500 line-clamp-1 mt-0.5">
                        {item.snippet}
                      </p>
                    )}
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-stone-300 dark:text-purple-400/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all self-center shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Search className="w-6 h-6 mx-auto text-purple-500/40 mb-2" />
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                No matching results found
              </p>
              <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
                Try searching for skills, projects, degrees, or roles.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
