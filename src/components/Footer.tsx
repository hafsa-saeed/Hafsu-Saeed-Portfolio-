import React from "react";
import {
  ArrowUp,
  Heart,
  Linkedin,
  Github,
  Twitter,
  Mail,
  PhoneCall,
  Sparkles,
  Coffee,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { Lock } from "lucide-react";

export const Footer: React.FC = () => {
  const { personalInfo } = usePortfolio();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About Me", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Skills", href: "#skills" },
    { label: "Hobbies", href: "#hobbies" },
    { label: "Projects", href: "#projects" },
    { label: "Achievements", href: "#credentials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative z-10 bg-[#040e09] text-stone-300 pt-16 pb-12 border-t border-emerald-500/25 overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-emerald-500/15">
          {/* Brand & Summary */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] shadow-sm">
                <div className="w-full h-full bg-[#06140e] rounded-[10px] flex items-center justify-center font-bold text-emerald-400 text-lg">
                  HS
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  {personalInfo.name}
                </span>
                <span className="text-emerald-400 font-extrabold text-xl">
                  .
                </span>
                <p className="text-xs text-stone-400 font-medium">
                  BS Computer Science • Full Stack Web Developer
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Motivated computer science student and developer building
              responsive applications with React, Node, Python, and AI
              toolchains.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
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
                {
                  label: "Email",
                  icon: Mail,
                  href: personalInfo.socials.email,
                },
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
                  className="w-9 h-9 rounded-xl bg-[#092017] hover:bg-emerald-600 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-1 border border-emerald-500/20"
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Quick Navigation</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-stone-400 hover:text-emerald-400 transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Direct Contact Summary */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <div className="text-stone-400">
              <span className="block text-stone-500 font-semibold">
                Location:
              </span>
              <span>{personalInfo.location}</span>
            </div>
            <div className="text-stone-400">
              <span className="block text-stone-500 font-semibold">Email:</span>
              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:text-emerald-400"
              >
                {personalInfo.email}
              </a>
            </div>
            <div className="text-stone-400">
              <span className="block text-stone-500 font-semibold">Phone:</span>
              <span>
                {personalInfo.phone1} / {personalInfo.phone2}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span>
              © {new Date().getFullYear()} {personalInfo.name}. All rights
              reserved.
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Crafted with{" "}
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />{" "}
              & <Coffee className="w-3.5 h-3.5 text-amber-400" /> in Mianwali,
              Pakistan.
            </span>
            <span className="hidden sm:inline">•</span>
            <a
              href="/admin"
              className="text-stone-500 hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              title="Admin CMS Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </a>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#092017] hover:bg-emerald-600 text-stone-300 hover:text-white transition-all duration-200 cursor-pointer shadow-md hover:-translate-y-1 border border-emerald-500/20"
          >
            <span className="text-xs font-semibold">Back to Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
