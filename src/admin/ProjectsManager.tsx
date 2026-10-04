import React, { useState, useEffect } from "react";
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Loader2,
  ExternalLink,
  Play,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { ProjectItem, ProjectCategory } from "../types";
import { uploadToR2 } from "../services/r2StorageService";

export const ProjectsManager: React.FC = () => {
  const { projectsList, saveProject, deleteProject, reorderProjects } = usePortfolio();

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "media" | "features">("info");

  // Media upload progress states
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);

  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoProgressText, setVideoProgressText] = useState("");
  const [videoError, setVideoError] = useState<string | null>(null);

  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const [screenshotProgress, setScreenshotProgress] = useState(0);

  // Form input helper states
  const [newTagInput, setNewTagInput] = useState("");
  const [newFeatureInput, setNewFeatureInput] = useState("");

  // In-app Delete Confirmation Modal State (replaces blocked window.confirm)
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isR2Ready, setIsR2Ready] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/storage/status")
      .then((r) => r.json())
      .then((data) => setIsR2Ready(Boolean(data.r2Configured)))
      .catch(() => setIsR2Ready(false));
  }, []);

  const handleOpenAdd = () => {
    const newId = `proj-${Date.now()}`;
    setEditingProject({
      id: newId,
      slug: `project-${Date.now()}`,
      title: "",
      category: "fullstack",
      description: "",
      longDescription: "",
      image: "/projects/cognisphere/hero.jpg",
      tags: ["React", "Node.js", "Tailwind CSS"],
      features: ["Responsive interface with high performance architecture"],
      liveUrl: "",
      githubUrl: "",
      videoUrl: "",
      screenshots: [],
      featured: false,
      displayOrder: projectsList.length + 1,
    });
    setActiveTab("info");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setEditingProject({
      ...project,
      tags: project.tags ? [...project.tags] : [],
      features: project.features ? [...project.features] : [],
      screenshots: project.screenshots ? [...project.screenshots] : [],
    });
    setActiveTab("info");
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteConfirmProject({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmProject) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteConfirmProject.id);
    } catch (err) {
      console.error("Delete project error:", err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmProject(null);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projectsList.length) return;
    const items = [...projectsList];
    const [moved] = items.splice(index, 1);
    items.splice(newIndex, 0, moved);
    await reorderProjects(items);
  };

  // Upload hero image to R2
  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setHeroUploading(true);
    setHeroProgress(0);

    try {
      const result = await uploadToR2(file, "projects", (percent) => {
        setHeroProgress(percent);
      });
      setEditingProject((prev) => (prev ? { ...prev, image: result.url } : null));
    } catch (err: any) {
      alert(`Hero image upload failed: ${err.message}`);
    } finally {
      setHeroUploading(false);
    }
  };

  // Upload large demo video to R2 (Direct server-relayed upload with progress)
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setVideoUploading(true);
    setVideoProgress(0);
    setVideoError(null);
    setVideoProgressText(`Preparing direct upload for ${(file.size / (1024 * 1024)).toFixed(1)} MB file...`);

    try {
      const result = await uploadToR2(file, "videos", (percent, loaded, total) => {
        setVideoProgress(percent);
        const loadedMB = (loaded / (1024 * 1024)).toFixed(1);
        const totalMB = (total / (1024 * 1024)).toFixed(1);
        setVideoProgressText(`Uploading to Cloudflare R2: ${percent}% (${loadedMB} MB / ${totalMB} MB)`);
      });

      setEditingProject((prev) => (prev ? { ...prev, videoUrl: result.url } : null));
      setVideoProgressText("Upload finished successfully!");
    } catch (err: any) {
      console.error("Video upload error:", err);
      setVideoError(err.message || "Failed to upload video");
    } finally {
      setVideoUploading(false);
    }
  };

  // Upload screenshots to R2
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProject) return;

    setScreenshotUploading(true);
    setScreenshotProgress(0);

    const newScreenshots: string[] = [...(editingProject.screenshots || [])];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadToR2(file, "projects", (percent) => {
          const overall = Math.round(((i + percent / 100) / files.length) * 100);
          setScreenshotProgress(overall);
        });
        newScreenshots.push(result.url);
      }
      setEditingProject((prev) => (prev ? { ...prev, screenshots: newScreenshots } : null));
    } catch (err: any) {
      alert(`Screenshot upload failed: ${err.message}`);
    } finally {
      setScreenshotUploading(false);
    }
  };

  const handleAddTag = () => {
    if (!newTagInput.trim() || !editingProject) return;
    const currentTags = editingProject.tags || [];
    if (!currentTags.includes(newTagInput.trim())) {
      setEditingProject({
        ...editingProject,
        tags: [...currentTags, newTagInput.trim()],
      });
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      tags: editingProject.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim() || !editingProject) return;
    setEditingProject({
      ...editingProject,
      features: [...(editingProject.features || []), newFeatureInput.trim()],
    });
    setNewFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingProject) return;
    const updated = [...editingProject.features];
    updated.splice(index, 1);
    setEditingProject({ ...editingProject, features: updated });
  };

  const handleRemoveScreenshot = (index: number) => {
    if (!editingProject) return;
    const updated = [...(editingProject.screenshots || [])];
    updated.splice(index, 1);
    setEditingProject({ ...editingProject, screenshots: updated });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title.trim()) {
      alert("Please provide a project title.");
      return;
    }

    try {
      await saveProject(editingProject);
    } catch (err: any) {
      console.warn("Save project notice:", err);
    } finally {
      setIsModalOpen(false);
      setEditingProject(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-purple-400" />
            <span>Project Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Manage your {projectsList.length} portfolio projects, hero covers, multiple screenshots, and large 300MB+ demo video files.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List Table / Cards */}
      <div className="bg-[#0c0e29] border border-purple-500/20 rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-purple-500/10">
          {projectsList.map((project, idx) => (
            <div
              key={`${project.id}-${idx}`}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-purple-950/20 transition-colors"
            >
              {/* Left: Thumbnail & Main Info */}
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden bg-black shrink-0 border border-purple-500/20">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {project.videoUrl && (
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-purple-400 font-bold flex items-center gap-0.5">
                      <Video className="w-2.5 h-2.5" />
                      <span>Video</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Featured</span>
                      </span>
                    )}
                    <span className="text-[11px] text-stone-500">
                      Order: #{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base truncate">
                    {project.title}
                  </h3>

                  <p className="text-xs text-stone-400 line-clamp-1 mt-0.5 max-w-xl">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-400">
                    <span>
                      {project.screenshots?.length || 0} Screenshot{project.screenshots?.length === 1 ? "" : "s"}
                    </span>
                    <span>•</span>
                    <span>{project.tags?.length || 0} Tags</span>
                    {project.liveUrl && (
                      <>
                        <span>•</span>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 hover:underline flex items-center gap-1"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Reorder & Action Buttons */}
              <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  title="Move Up"
                  className="p-2 rounded-xl bg-[#14173d] border border-purple-500/20 text-stone-300 hover:text-white hover:border-purple-500/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === projectsList.length - 1}
                  title="Move Down"
                  className="p-2 rounded-xl bg-[#14173d] border border-purple-500/20 text-stone-300 hover:text-white hover:border-purple-500/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(project)}
                  title="Edit Project"
                  className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  title="Delete Project"
                  className="p-2 rounded-xl bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0e29] border border-purple-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-purple-500/20 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingProject.id ? `Edit: ${editingProject.title || "Project"}` : "Add New Project"}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Configure project metadata, upload large video demo, and manage gallery images.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-[#14173d] text-stone-400 hover:text-white hover:bg-purple-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 pt-3 border-b border-purple-500/15 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer ${
                  activeTab === "info"
                    ? "bg-[#14173d] text-purple-400 border-t border-x border-purple-500/30"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                1. General Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "media"
                    ? "bg-[#14173d] text-purple-400 border-t border-x border-purple-500/30"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>2. Media & 300MB+ Demo Video</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("features")}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer ${
                  activeTab === "features"
                    ? "bg-[#14173d] text-purple-400 border-t border-x border-purple-500/30"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                3. Features & Tech Stack
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: General Info */}
              {activeTab === "info" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, title: e.target.value })
                        }
                        placeholder="e.g. CogniSphere - Enterprise SaaS"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                        Category *
                      </label>
                      <select
                        value={editingProject.category}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            category: e.target.value as ProjectCategory,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                      >
                        <option value="fullstack">Full Stack</option>
                        <option value="frontend">Frontend</option>
                        <option value="ai">AI & Computing</option>
                        <option value="big">Big / Enterprise</option>
                        <option value="mini">Mini Project</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Short Description (Card preview) *
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.description}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, description: e.target.value })
                      }
                      placeholder="Brief 1-2 sentence description shown on the public project card..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Full Detailed Description (Showcase View)
                    </label>
                    <textarea
                      rows={4}
                      value={editingProject.longDescription}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, longDescription: e.target.value })
                      }
                      placeholder="Comprehensive architectural overview and problem statement..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.githubUrl || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, githubUrl: e.target.value })
                        }
                        placeholder="https://github.com/hafsa-saeed/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                        Live / Demo URL
                      </label>
                      <input
                        type="text"
                        value={editingProject.liveUrl || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, liveUrl: e.target.value })
                        }
                        placeholder="https://... or #demo"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={Boolean(editingProject.featured)}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-purple-500 focus:ring-purple-400 focus:ring-offset-0 bg-[#14173d] border-purple-500/30 cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-xs font-semibold text-stone-300 cursor-pointer">
                      Mark as Featured Project on Public Homepage
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: Media & Large Demo Video */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  {/* Hero Cover Image */}
                  <div className="p-4 rounded-2xl bg-[#14173d] border border-purple-500/20 space-y-3">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider">
                      Featured Hero Cover Image
                    </label>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-32 h-20 rounded-xl overflow-hidden bg-black border border-purple-500/30 shrink-0">
                        <img
                          src={editingProject.image || "/projects/cognisphere/hero.jpg"}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="text"
                          value={editingProject.image}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, image: e.target.value })
                          }
                          placeholder="/projects/... or R2 URL"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0c0e29] border border-purple-500/30 text-white text-xs focus:outline-none"
                        />

                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-600/30 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{heroUploading ? `Uploading ${heroProgress}%` : "Upload to Cloudflare R2"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleHeroUpload}
                              className="hidden"
                              disabled={heroUploading}
                            />
                          </label>
                          {heroUploading && (
                            <div className="w-24 bg-stone-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-purple-400 h-full transition-all duration-300"
                                style={{ width: `${heroProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Demo Video (Cloudflare R2 Direct Multipart Upload) */}
                  <div className="p-4 rounded-2xl bg-[#14173d] border border-purple-500/30 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-400" />
                        <span>Project Demo Video (Actual 300MB+ File)</span>
                      </label>
                      <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                        Direct-to-R2 Multipart Resumable
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed">
                      Upload your actual mp4, webm, or mov walkthrough recording. The video uploads directly to Cloudflare R2 in chunks with zero size bottlenecks.
                    </p>

                    {/* Video Player Preview if exists */}
                    {editingProject.videoUrl && (
                      <div className="aspect-video max-h-56 rounded-xl overflow-hidden bg-black border border-purple-500/30 relative">
                        {editingProject.videoUrl.endsWith(".mp4") ||
                        editingProject.videoUrl.endsWith(".webm") ||
                        editingProject.videoUrl.includes("/videos/") ||
                        editingProject.videoUrl.startsWith("blob:") ? (
                          <video
                            src={editingProject.videoUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <iframe
                            src={editingProject.videoUrl}
                            title="Video Preview"
                            className="w-full h-full"
                          />
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingProject.videoUrl || ""}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, videoUrl: e.target.value })
                          }
                          placeholder="Video URL or upload file directly below"
                          className="flex-1 px-3 py-2 rounded-lg bg-[#0c0e29] border border-purple-500/30 text-white text-xs focus:outline-none"
                        />
                        {editingProject.videoUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProject({ ...editingProject, videoUrl: "" })
                            }
                            className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Notice if R2 is not yet configured in Vercel */}
                      {isR2Ready === false && (
                        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-1.5 animate-in fade-in">
                          <div className="flex items-center gap-2 font-bold text-amber-300">
                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                            <span>Action Required: Add Cloudflare R2 Keys in Vercel Settings</span>
                          </div>
                          <p className="text-[11px] text-stone-300 leading-relaxed">
                            To upload large 300MB+ videos without Vercel's 4.5MB payload limit, you must add your Cloudflare R2 credentials to Vercel:
                            Go to <strong className="text-white">Vercel Dashboard $\rightarrow$ Settings $\rightarrow$ Environment Variables</strong> and add:
                            <br />
                            <code className="text-amber-300 font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded">R2_ACCOUNT_ID</code>,{" "}
                            <code className="text-amber-300 font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded">R2_ACCESS_KEY_ID</code>,{" "}
                            <code className="text-amber-300 font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded">R2_SECRET_ACCESS_KEY</code>,{" "}
                            <code className="text-amber-300 font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded">R2_BUCKET_NAME</code>, and{" "}
                            <code className="text-amber-300 font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded">R2_PUBLIC_URL</code>.
                          </p>
                        </div>
                      )}

                      {/* Direct Upload Button & Real-time Progress Bar */}
                      <div className="pt-2">
                        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>
                            {videoUploading
                              ? `Uploading to R2 (${videoProgress}%)...`
                              : "Upload Actual Video File (MP4/WEBM)"}
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                            disabled={videoUploading}
                          />
                        </label>

                        {videoUploading && (
                          <div className="mt-3 space-y-1.5 animate-in fade-in">
                            <div className="flex justify-between text-xs text-stone-300 font-semibold">
                              <span>{videoProgressText}</span>
                              <span className="text-purple-400">{videoProgress}%</span>
                            </div>
                            <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden border border-purple-500/30">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full transition-all duration-200"
                                style={{ width: `${videoProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {videoError && (
                          <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>{videoError}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Multiple Screenshots Gallery */}
                  <div className="p-4 rounded-2xl bg-[#14173d] border border-purple-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-purple-400" />
                        <span>Project Screenshots & UI Views</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600/30 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 text-xs font-semibold cursor-pointer">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Screenshots to R2</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="hidden"
                          disabled={screenshotUploading}
                        />
                      </label>
                    </div>

                    {screenshotUploading && (
                      <div className="space-y-1">
                        <div className="text-xs text-stone-300">
                          Uploading screenshots: {screenshotProgress}%
                        </div>
                        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-400 h-full transition-all"
                            style={{ width: `${screenshotProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {(!editingProject.screenshots || editingProject.screenshots.length === 0) && !screenshotUploading && (
                      <div className="py-6 text-center rounded-xl border border-dashed border-purple-500/20 text-stone-400 text-xs">
                        No screenshots uploaded yet. Click &quot;Add Screenshots to R2&quot; above to select image files.
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {(editingProject.screenshots || []).map((imgUrl, sIdx) => (
                        <div
                          key={sIdx}
                          className="group relative aspect-16/10 rounded-xl overflow-hidden bg-black border border-purple-500/20"
                        >
                          <img
                            src={imgUrl}
                            alt={`Screenshot ${sIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveScreenshot(sIdx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-rose-400 hover:bg-rose-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Features & Tech Stack */}
              {activeTab === "features" && (
                <div className="space-y-6">
                  {/* Tags */}
                  <div className="p-4 rounded-2xl bg-[#14173d] border border-purple-500/20 space-y-3">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider">
                      Technologies & Tech Stack Tags
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {(editingProject.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-500/30"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add technology (e.g. Next.js, Redux, PostgreSQL)..."
                        className="flex-1 px-3 py-2 rounded-xl bg-[#0c0e29] border border-purple-500/30 text-white text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="p-4 rounded-2xl bg-[#14173d] border border-purple-500/20 space-y-3">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider">
                      Key Technical Features & Highlights
                    </label>

                    <div className="space-y-2">
                      {(editingProject.features || []).map((feature, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-[#0c0e29] border border-purple-500/15 text-xs text-stone-200"
                        >
                          <span className="flex-1">{feature}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(fIdx)}
                            className="text-stone-400 hover:text-rose-400 cursor-pointer shrink-0 mt-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        placeholder="Add architectural feature bullet..."
                        className="flex-1 px-3 py-2 rounded-xl bg-[#0c0e29] border border-purple-500/30 text-white text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Add Bullet
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-purple-500/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#14173d] text-stone-300 hover:text-white border border-purple-500/20 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-purple-600/30 cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Project Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal (100% reliable inside iframes) */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0c0e29] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Project</h3>
                <p className="text-xs text-stone-400">Permanently remove this project</p>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-white">"{deleteConfirmProject.title}"</span>?
              This will remove the project from Supabase PostgreSQL and your live portfolio.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-500/10">
              <button
                type="button"
                onClick={() => setDeleteConfirmProject(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
