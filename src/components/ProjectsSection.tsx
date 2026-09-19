import React, { useState } from "react";
import {
  ExternalLink,
  Github,
  Sparkles,
  FolderGit2,
  X,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { projectsList } from "../data/portfolioData";
import { ProjectItem } from "../types.ts";

export const ProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );

  // Dynamic filter buttons generated directly from project categories
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
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/15 hover:border-emerald-500/50 shadow-xl backdrop-blur-md"
            >
              <div>
                {/* Thumbnail Container with Zoom Overlay */}
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
                      onClick={() => setSelectedProject(project)}
                      className="px-4 py-2 rounded-xl bg-white text-stone-900 font-bold text-xs shadow-lg hover:bg-emerald-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>View Deep Dive</span>
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
                  onClick={() => setSelectedProject(project)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
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

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#071912] rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 dark:bg-[#092218] text-stone-600 dark:text-stone-300 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-white mt-2">
                  {selectedProject.title}
                </h3>
              </div>

              {/* Modal Image */}
              <div className="rounded-2xl overflow-hidden aspect-16/9 bg-slate-900 mb-6">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Long Description */}
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed mb-5">
                {selectedProject.longDescription}
              </p>

              {/* Key Features */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Key Architecture & Features</span>
                </h4>
                <div className="space-y-2">
                  {selectedProject.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="border-t border-stone-200 dark:border-emerald-500/20 pt-4 mb-6">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                  Technologies Employed:
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-[#092218] text-emerald-700 dark:text-emerald-300 border border-emerald-500/25"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Live Application</span>
                </a>
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-stone-100 dark:bg-[#092218] hover:bg-stone-200 dark:hover:bg-[#103427] text-stone-800 dark:text-stone-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors border border-stone-200 dark:border-emerald-500/25 cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
