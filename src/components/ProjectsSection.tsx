import React, { useEffect, useRef, useState } from "react";
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
  const [showcaseProject, setShowcaseProject] =
    useState<ProjectItem | null>(null);
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(
    null,
  );
  const [isHovered, setIsHovered] = useState(false);

  /* ---------------------------------------------------------
     Continuous Carousel Animation
  --------------------------------------------------------- */
  const animationFrameRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);

  /* ---------------------------------------------------------
     Filter Categories
  --------------------------------------------------------- */
  const categories = Array.from(
    new Set(projectsList.map((p) => p.category)),
  ).filter(Boolean);

  // Keep the actual category ID untouched,
  // but display professional labels in the UI.
  const formatCategoryLabel = (category: string) => {
    const normalized = category.toLowerCase().trim();

    if (normalized === "all") return "All Projects";
    if (normalized === "fullstack") return "Fullstack";
    if (normalized === "ai") return "AI";
    if (normalized === "frontend") return "Frontend";

    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const filterButtons = [
    { id: "All", label: "All Projects" },
    ...categories.map((cat) => ({
      id: cat,
      label: formatCategoryLabel(cat),
    })),
  ];

  /* ---------------------------------------------------------
     Filtered Projects
  --------------------------------------------------------- */
  const filteredProjects =
    activeFilter === "All"
      ? projectsList
      : projectsList.filter((p) => p.category === activeFilter);

  /*
   * Duplicate the exact filtered sequence.
   * This creates a seamless 1 → 2 → 3 → 4 → 1 → 2 → ...
   * loop without any visible jump.
   */
  const duplicatedProjects = [
    ...filteredProjects,
    ...filteredProjects,
  ];

  /* ---------------------------------------------------------
     Hover State Sync
  --------------------------------------------------------- */
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  /* ---------------------------------------------------------
     Reset Carousel When Filter Changes
  --------------------------------------------------------- */
  useEffect(() => {
    positionRef.current = 0;
    velocityRef.current = 0;
    lastTimeRef.current = null;

    if (trackRef.current) {
      trackRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  }, [activeFilter]);

  /* ---------------------------------------------------------
     Smooth Continuous Animation
  --------------------------------------------------------- */
  useEffect(() => {
    const track = trackRef.current;

    if (!track || filteredProjects.length <= 0) return;

    // Slow, professional movement.
    const speed = 0.035;

    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = Math.min(time - lastTimeRef.current, 32);
      lastTimeRef.current = time;

      /*
       * Hover does not instantly stop the carousel.
       * It smoothly decelerates to zero.
       */
      const targetVelocity = isHoveredRef.current ? 0 : speed;

      const smoothing = isHoveredRef.current ? 0.055 : 0.035;

      velocityRef.current +=
        (targetVelocity - velocityRef.current) *
        Math.min(1, smoothing * delta);

      positionRef.current += velocityRef.current * delta;

      /*
       * Since the second half is an exact duplicate
       * of the first half, once we reach half the track
       * we can silently move back by that exact width.
       */
      const halfWidth = track.scrollWidth / 2;

      if (halfWidth > 0 && positionRef.current >= halfWidth) {
        positionRef.current -= halfWidth;
      }

      track.style.transform = `translate3d(-${positionRef.current}px, 0, 0)`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = null;
      lastTimeRef.current = null;
    };
  }, [filteredProjects.length, activeFilter]);

  /* ---------------------------------------------------------
     Download Certificate / Document
  --------------------------------------------------------- */
  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement("a");

    link.href = imageUrl;

    const fileName = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}.jpg`;

    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* =========================================================
     DEDICATED PROJECT SHOWCASE PAGE
  ========================================================= */
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
              {formatCategoryLabel(showcaseProject.category)}
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
                Video walkthrough for this project is recorded locally.
                Explore full high-res screenshots and features below!
              </span>
            </div>
          )}

          {/* SECTION 2: Image Gallery Grid */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6 text-emerald-400 font-semibold text-base">
              <ImageIcon className="w-5 h-5" />
              <span>Project Interface Screenshots & UI Views</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(
                (showcaseProject.screenshots &&
                  showcaseProject.screenshots.length > 0)
                  ? showcaseProject.screenshots
                  : (
                      initialProjects.find(
                        (p) => p.id === showcaseProject.id,
                      )?.screenshots &&
                      initialProjects.find(
                        (p) => p.id === showcaseProject.id,
                      )!.screenshots!.length > 0
                    )
                  ? initialProjects.find(
                      (p) => p.id === showcaseProject.id,
                    )!.screenshots!
                  : [showcaseProject.image]
              ).map((imgUrl, idx) => {
                const isZoomed = zoomedImageIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() =>
                      setZoomedImageIndex(isZoomed ? null : idx)
                    }
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
                            <ZoomOut className="w-3.5 h-3.5" />
                            Close
                          </>
                        ) : (
                          <>
                            <ZoomIn className="w-3.5 h-3.5" />
                            Enlarge
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Deep Dive Details */}
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

  /* =========================================================
     STANDARD PROJECT SECTION
  ========================================================= */
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
            expertise in full-stack development, seamless user interactions,
            and responsive design.
          </p>
        </div>

        {/* Professional Filter Buttons */}
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

        {/* =====================================================
            CONTINUOUS PROJECT CAROUSEL
        ===================================================== */}
        {filteredProjects.length > 0 && (
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Left Fade */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-stone-100/90 dark:from-[#05130e]/90 to-transparent" />

            {/* Right Fade */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-stone-100/90 dark:from-[#05130e]/90 to-transparent" />

            <div
              ref={trackRef}
              className="flex gap-6 sm:gap-8 w-max will-change-transform"
            >
              {duplicatedProjects.map((project, idx) => (
                <div
                  key={`${project.id}-${idx}`}
                  className="group flex-none w-[calc(100vw-2rem)] sm:w-[calc((100vw-3rem)/2)] lg:w-[calc((min(1280px,100vw)-4rem)/3)] max-w-[390px] bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl hover:shadow-emerald-500/15 hover:border-emerald-500/50"
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
                        {formatCategoryLabel(project.category)}
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
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <FolderGit2 className="w-10 h-10 mx-auto text-emerald-500/50 mb-3" />

            <p className="text-stone-500 dark:text-stone-400 text-sm">
              No projects available in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
