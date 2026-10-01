import React, { useState } from "react";
import {
  ExternalLink,
  Github,
  Sparkles,
  FolderGit2,
  ArrowLeft,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Play,
  ZoomOut,
  ZoomIn,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { ProjectItem } from "../types.ts";
import { projectsList as initialProjects } from "../data/portfolioData";

export const ProjectsSection: React.FC = () => {
  const { projectsList } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showcaseProject, setShowcaseProject] = useState<ProjectItem | null>(
    null,
  );
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);

  const categories = Array.from(
    new Set(projectsList.map((p) => p.category)),
  ).filter(Boolean);

  const filterButtons = [
    { id: "All", label: "All Projects" },
    ...categories.map((cat) => ({ id: cat, label: cat })),
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projectsList
      : projectsList.filter((p) => p.category === activeFilter);

  // Dedicated Showcase View Page
  if (showcaseProject) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/95 dark:bg-[#030d0a]/98 text-stone-100 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-6 mb-8">
            <button
              onClick={() => {
                setShowcaseProject(null);
                setZoomedImageIndex(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-sm font-semibold cursor-pointer border border-emerald-500/30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </button>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              {showcaseProject.category}
            </span>
          </div>

          {/* Title Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
              {showcaseProject.title}
            </h1>
            <p className="text-stone-300 text-base sm:text-lg max-w-3xl leading-relaxed">
              {showcaseProject.description}
            </p>
          </div>

          {/* SECTION 1: Video Walkthrough */}
          {showcaseProject.videoUrl ? (
            <div className="mb-12 rounded-3xl overflow-hidden border border-emerald-500/30 bg-black/60 p-2 sm:p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold text-sm px-2">
                <Video className="w-4 h-4" />
                <span>Video Walkthrough Demo</span>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                {showcaseProject.videoUrl.endsWith(".mp4") ||
                showcaseProject.videoUrl.endsWith(".webm") ||
                showcaseProject.videoUrl.endsWith(".mov") ||
                showcaseProject.videoUrl.includes("/videos/") ||
                showcaseProject.videoUrl.startsWith("blob:") ? (
                  <video
                    src={showcaseProject.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    playsInline
                  />
                ) : (
                  <iframe
                    src={showcaseProject.videoUrl}
                    title={showcaseProject.title}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="mb-12 p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 text-sm">
              <Video className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>
                Video walkthrough for this project is recorded locally. Explore
                full high-res screenshots and features below!
              </span>
            </div>
          )}

          {/* SECTION 2: Image Gallery Grid with In-Card Zoom Effect */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6 text-emerald-400 font-semibold text-base">
              <ImageIcon className="w-5 h-5" />
              <span>Project Interface Screenshots & UI Views</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {((showcaseProject.screenshots && showcaseProject.screenshots.length > 0)
                ? showcaseProject.screenshots
                : (initialProjects.find((p) => p.id === showcaseProject.id)?.screenshots &&
                   initialProjects.find((p) => p.id === showcaseProject.id)!.screenshots!.length > 0)
                  ? initialProjects.find((p) => p.id === showcaseProject.id)!.screenshots!
                  : [showcaseProject.image]
              ).map((imgUrl, idx) => {
                const isZoomed = zoomedImageIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setZoomedImageIndex(isZoomed ? null : idx)}
                    className={`group relative aspect-16/10 rounded-2xl overflow-hidden border bg-stone-950 cursor-pointer transition-all duration-300 ${
                      isZoomed
                        ? "z-30 scale-125 -translate-y-2 border-emerald-400 shadow-2xl shadow-emerald-500/20"
                        : "z-10 border-emerald-500/20 hover:border-emerald-500 hover:shadow-lg"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${showcaseProject.title} preview ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />

                    {/* Floating Zoom Action Badge */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="p-1.5 rounded-lg bg-black/80 text-emerald-400 text-xs font-semibold flex items-center gap-1 backdrop-blur-md border border-emerald-500/30">
                        {isZoomed ? (
                          <>
                            <ZoomOut className="w-3.5 h-3.5" /> Close
                          </>
                        ) : (
                          <>
                            <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Deep Dive Details & Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-emerald-500/20 pt-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Project Overview
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed">
                  {showcaseProject.longDescription}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Architecture & Features</span>
                </h3>
                <div className="space-y-2">
                  {showcaseProject.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-start gap-2.5 text-sm text-stone-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tech Stack & Links Sidebar */}
            <div className="bg-[#071912] p-6 rounded-2xl border border-emerald-500/30 h-fit space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-3">
                  Technologies Employed
                </span>
                <div className="flex flex-wrap gap-2">
                  {showcaseProject.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-emerald-500/20 pt-4">
                {showcaseProject.liveUrl &&
                  showcaseProject.liveUrl !== "#demo" && (
                    <a
                      href={showcaseProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Launch Live Application</span>
                    </a>
                  )}
                {showcaseProject.githubUrl && (
                  <a
                    href={showcaseProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-stone-700 transition-all cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Section View
  return (
    <section
      id="projects"
      className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-stone-100/50 dark:bg-[#05130e]/70"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <FolderGit2 className="w-4 h-4" />
            <span>Featured Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Projects
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            Engineered with modern tools, disciplined architectures, and
            optimized for performance, these projects showcase my hands-on
            expertise in full-stack development, seamless user interactions, and
            responsive design.
          </p>
        </div>

        {/* Dynamic Filter Badges */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeFilter === btn.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30 scale-105"
                  : "bg-white dark:bg-[#071912] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#0f3424] border border-stone-200 dark:border-emerald-500/25"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={`${project.id}-${idx}`}
              className="group bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/15 hover:border-emerald-500/50 shadow-xl backdrop-blur-md"
            >
              <div>
                {/* Thumbnail Container */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600/95 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                    {project.category}
                  </span>

                  {/* Quick Inspect Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-emerald-950/40 backdrop-blur-[2px]">
                    <button
                      onClick={() => setShowcaseProject(project)}
                      className="px-4 py-2 rounded-xl bg-white text-stone-900 font-bold text-xs shadow-lg hover:bg-emerald-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>View Case Study Page</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-[#092218] text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => setShowcaseProject(project)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>View Demo & Showcase</span>
                </button>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#092218] dark:hover:bg-[#103427] text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-200/80 dark:border-emerald-500/25 cursor-pointer"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Code</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
