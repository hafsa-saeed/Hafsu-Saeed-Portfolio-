
import React from "react";
import { ArrowUp, Heart, Coffee } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 bg-[#040e09] text-stone-300 py-8 border-t border-emerald-500/25 overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">

          {/* Copyright */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start text-center sm:text-left">
            <span>
              © 2026 Hafsa Saeed. All rights reserved.
            </span>

            <span className="hidden sm:inline">•</span>

            {/* Crafted with */}
            <span className="flex items-center gap-1">
              Crafted with
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              &
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
            </span>
          </div>

          {/* Back to Top */}
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
