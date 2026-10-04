import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Moon,
  Sun,
  Sparkles,
  FileText,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  onOpenCVModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  toggleTheme,
}) => {
  const { personalInfo } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About Me", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Achievements", href: "#credentials" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = navItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);

        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 dark:bg-[#071812]/90 backdrop-blur-md shadow-md border-b border-emerald-500/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          className="group flex items-center gap-2.5 text-stone-900 dark:text-white"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-[2px] shadow-sm shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white dark:bg-[#0a1e16] rounded-[10px] flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-lg">
              HS
            </div>

            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-[#071812] animate-pulse" />
          </div>

          <div>
            <div className="font-bold tracking-tight text-lg leading-tight flex items-center gap-1.5">
              <span>{personalInfo.name}</span>
              <span className="text-emerald-500 font-extrabold">.</span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-emerald-300/80 font-medium tracking-wide">
              BS CS • Web Dev
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 lg:gap-1.5 bg-stone-100/80 dark:bg-[#0b241b]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200/60 dark:border-emerald-500/25 text-xs font-medium shadow-xs">
          {navItems.map((item) => {
            const isActive =
              activeSection === item.href.substring(1);

            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-2.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-emerald-700 dark:text-emerald-300 font-semibold bg-white dark:bg-[#113528] shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
              >
                {item.label}

                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-emerald-500 rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* View CV Button */}
          <a
            href="/Hafsa_Saeed_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View CV"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-stone-700 dark:text-stone-200 bg-stone-100 hover:bg-emerald-100 dark:bg-[#0b241b] dark:hover:bg-[#103427] hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-200 border border-stone-200/80 dark:border-emerald-500/30 cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold">
              View CV
            </span>
          </a>

          {/* Dark/Light Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark and light theme"
            className="p-2 rounded-xl text-stone-600 dark:text-stone-200 bg-stone-100 hover:bg-stone-200 dark:bg-[#0b241b] dark:hover:bg-[#103427] transition-colors duration-200 border border-stone-200/80 dark:border-emerald-500/30 cursor-pointer shadow-xs"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-emerald-600" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="xl:hidden p-2 rounded-xl text-stone-700 dark:text-stone-200 bg-stone-100 hover:bg-stone-200 dark:bg-[#0b241b] dark:hover:bg-[#103427] transition-colors border border-stone-200/80 dark:border-emerald-500/30 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 dark:bg-[#071812]/98 backdrop-blur-xl border-b border-emerald-500/25 shadow-2xl px-4 pt-3 pb-5 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive =
                activeSection === item.href.substring(1);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-semibold border border-emerald-500/40"
                      : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#0d2a1f]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
