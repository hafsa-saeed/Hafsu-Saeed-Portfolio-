import React from "react";
import {
  ArrowUp,
  Linkedin,
  Instagram,
  Github,
  Mail,
  MessageCircle,
} from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/hafsa-saeed-90b53b2a6?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      icon: Linkedin,
      color: "hover:text-[#0A66C2]",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/abuzarsaeed164?stkn=b2ZvenA1cHVhb2ly",
      icon: Instagram,
      color: "hover:text-[#E4405F]",
    },
    {
      label: "GitHub",
      href: "https://github.com/hafsa-saeed",
      icon: Github,
      color: "hover:text-white",
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/923461617836",
      icon: MessageCircle,
      color: "hover:text-[#25D366]",
    },
    {
      label: "Gmail",
      href: "mailto:hafsasaeed192@gmail.com",
      icon: Mail,
      color: "hover:text-[#EA4335]",
    },
  ];

  return (
    <footer className="relative z-10 bg-[#040e09] text-stone-300 border-t border-emerald-500/15">
      
      {/* Subtle Top Accent */}
      <div className="absolute top-0 left-0 w-28 h-px bg-gradient-to-r from-emerald-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="min-h-[92px] flex flex-col sm:flex-row items-center justify-between gap-6 py-6">

          {/* Brand */}
          <div className="flex items-center gap-3">
            
            <a
              href="#home"
              aria-label="Back to Home"
              className="group shrink-0"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-[2px] shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                
                <div className="w-full h-full bg-[#071812] rounded-[10px] flex items-center justify-center font-bold text-emerald-400 text-base">
                  HS
                </div>

                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#040e09]" />
              </div>
            </a>

            <div className="h-8 w-px bg-stone-700/60" />

            <div>
              <p className="text-sm font-semibold text-stone-200 leading-none">
                Hafsa Saeed
              </p>

              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-1.5">
                © 2026 All rights reserved.
              </p>
            </div>

          </div>


          {/* Social Links */}
          <div className="flex items-center gap-2.5">

            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === "Gmail" ? undefined : "_blank"}
                  rel={
                    item.label === "Gmail"
                      ? undefined
                      : "noopener noreferrer"
                  }
                  aria-label={item.label}
                  title={item.label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center
                    text-stone-500 ${item.color}
                    bg-white/[0.025]
                    border border-white/[0.06]
                    hover:border-emerald-500/25
                    hover:bg-white/[0.06]
                    hover:-translate-y-0.5
                    transition-all duration-200`}
                >
                  <Icon
                    className="w-[17px] h-[17px]"
                    strokeWidth={1.8}
                  />
                </a>
              );
            })}

          </div>


          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl
              bg-emerald-500/[0.08]
              border border-emerald-500/20
              text-emerald-400
              hover:bg-emerald-500
              hover:text-white
              hover:border-emerald-400
              hover:-translate-y-0.5
              transition-all duration-200"
          >
            <span className="text-[11px] font-semibold">
              Back to Top
            </span>

            <ArrowUp
              className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </button>

        </div>
      </div>
    </footer>
  );
};
