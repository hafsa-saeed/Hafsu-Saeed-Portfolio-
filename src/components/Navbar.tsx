import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { PortfolioSearch } from "./PortfolioSearch";

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
          ? "bg-white/85 dark:bg-[#08091a]/90 backdrop-blur-md shadow-md border-b border-purple-500/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          className="group flex items-center gap-2.5 text-stone-900 dark:text-white"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-500 p-[2px] shadow-sm shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white dark:bg-[#0e102c] rounded-[10px] flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 text-lg">
              HS
            </div>

            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-[#08091a] animate-pulse" />
          </div>

          <div>
            <div className="font-bold tracking-tight text-lg leading-tight flex items-center gap-1.5">
              <span>{personalInfo.name}</span>
              <span className="text-purple-500 font-extrabold">.</span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-purple-300/80 font-medium tracking-wide">
              BS CS • Web Dev
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 lg:gap-1.5 bg-stone-100/80 dark:bg-[#0e102c]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200/60 dark:border-purple-500/25 text-xs font-medium shadow-xs">
          {navItems.map((item) => {
            const isActive =
              activeSection === item.href.substring(1);

            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-2.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-purple-700 dark:text-purple-300 font-semibold bg-white dark:bg-[#161a45] shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                {item.label}

                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-purple-500 rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Responsive Search Bar (replaces View CV button) */}
          <PortfolioSearch />

          {/* Dark/Light Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark and light theme"
            className="p-2 rounded-xl text-stone-600 dark:text-stone-200 bg-stone-100 hover:bg-stone-200 dark:bg-[#0e102c] dark:hover:bg-[#14173d] transition-colors duration-200 border border-stone-200/80 dark:border-purple-500/30 cursor-pointer shadow-xs"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-purple-600" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="xl:hidden p-2 rounded-xl text-stone-700 dark:text-stone-200 bg-stone-100 hover:bg-stone-200 dark:bg-[#0e102c] dark:hover:bg-[#14173d] transition-colors border border-stone-200/80 dark:border-purple-500/30 cursor-pointer"
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
        <div className="xl:hidden bg-white/95 dark:bg-[#08091a]/98 backdrop-blur-xl border-b border-purple-500/25 shadow-2xl px-4 pt-3 pb-5 animate-in slide-in-from-top-4 duration-300">
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
                      ? "bg-purple-500/20 text-purple-600 dark:text-purple-300 font-semibold border border-purple-500/40"
                      : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#14173d]"
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