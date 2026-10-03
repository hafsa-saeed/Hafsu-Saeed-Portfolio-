import React, { useState, useEffect } from "react";
import { ParticleBackground } from "./ParticleBackground";
import { CursorFollower } from "./CursorFollower";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { ExperienceSection } from "./ExperienceSection";
import { EducationSection } from "./EducationSection";
import { SkillsSection } from "./SkillsSection";
import { HobbiesSection } from "./HobbiesSection";
import { ProjectsSection } from "./ProjectsSection";
import { CredentialsSection } from "./CredentialsSection";
import { ContactSection } from "./ContactSection";
import { CVModal } from "./CVModal";
import { Footer } from "./Footer";

export const PublicPortfolio: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("portfolio_theme");
    if (saved) return saved === "dark";
    return false; // Pristine light emerald theme
  });

  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("portfolio_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("portfolio_theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-stone-50 dark:bg-[#06120d] text-stone-900 dark:text-stone-100 selection:bg-emerald-500 selection:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Animated Glowing Cursor Follower */}
      <CursorFollower />

      {/* Sticky Navigation Bar */}
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="relative">
        {/* Animated Particle & Leaf Floating Canvas in Hero */}
        <div className="relative">
          <ParticleBackground />
          <HeroSection />
        </div>

        {/* 2. About Me Section */}
        <AboutSection />

        {/* 3. Work Experience Section */}
        <ExperienceSection />

        {/* 4. Education & Qualifications Section */}
        <EducationSection />

        {/* 5. Technical & Soft Skills Section */}
        <SkillsSection />

        {/* 6. Hobbies & Passions Section */}
        <HobbiesSection />

        {/* 7. Featured Projects Section */}
        <ProjectsSection />

        {/* 8. Achievements Section */}
        <CredentialsSection />

        {/* 9. Contact Me Section */}
        <ContactSection />
      </main>

      {/* 11. Footer with Back to Top */}
      <Footer />

      {/* Full-screen Interactive CV Document Modal */}
      <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} />
    </div>
  );
};
