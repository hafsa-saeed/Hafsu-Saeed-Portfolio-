import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  X,
  Network,
  BookOpen,
  Loader2,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { ExperienceItem } from "../types";

export const ExperienceManager: React.FC = () => {
  const { experienceList, saveExperience, deleteExperience } = usePortfolio();

  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResp, setNewResp] = useState("");
  const [newTech, setNewTech] = useState("");
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem({
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      duration: "2024",
      type: "Practical Experience",
      description: "",
      keyResponsibilities: ["Collaborated on software development and troubleshooting."],
      technologies: ["React", "TypeScript"],
      iconName: "Briefcase",
      displayOrder: experienceList.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExperienceItem) => {
    setEditingItem({
      ...item,
      keyResponsibilities: item.keyResponsibilities ? [...item.keyResponsibilities] : [],
      technologies: item.technologies ? [...item.technologies] : [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, role: string) => {
    setDeleteConfirmItem({ id, title: role });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      await deleteExperience(deleteConfirmItem.id);
    } catch (err) {
      console.error("Delete experience error:", err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmItem(null);
    }
  };

  const handleAddResp = () => {
    if (!newResp.trim() || !editingItem) return;
    setEditingItem({
      ...editingItem,
      keyResponsibilities: [...(editingItem.keyResponsibilities || []), newResp.trim()],
    });
    setNewResp("");
  };

  const handleRemoveResp = (idx: number) => {
    if (!editingItem) return;
    const updated = [...editingItem.keyResponsibilities];
    updated.splice(idx, 1);
    setEditingItem({ ...editingItem, keyResponsibilities: updated });
  };

  const handleAddTech = () => {
    if (!newTech.trim() || !editingItem) return;
    setEditingItem({
      ...editingItem,
      technologies: [...(editingItem.technologies || []), newTech.trim()],
    });
    setNewTech("");
  };

  const handleRemoveTech = (idx: number) => {
    if (!editingItem) return;
    const updated = [...editingItem.technologies];
    updated.splice(idx, 1);
    setEditingItem({ ...editingItem, technologies: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.role.trim() || !editingItem.company.trim()) return;
    await saveExperience(editingItem);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-emerald-400" />
            <span>Work Experience & Roles</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Manage your networking internships, educational mentorship positions, and technical roles.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experienceList.map((item) => (
          <div
            key={item.id}
            className="bg-[#071912] border border-emerald-500/25 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.type}
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.duration}</span>
                </span>
              </div>

              <h3 className="font-bold text-lg text-white mb-0.5">{item.role}</h3>
              <p className="text-xs font-semibold text-emerald-400 mb-3">{item.company}</p>

              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Responsibilities */}
              <div className="space-y-1.5 mb-4">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Key Responsibilities
                </div>
                {item.keyResponsibilities?.map((resp, rIdx) => (
                  <div key={rIdx} className="text-xs text-stone-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>

              {/* Tech */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-emerald-500/15">
                {item.technologies?.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded bg-[#092218] text-stone-300 text-[10px] border border-emerald-500/15"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(item)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(item.id, item.role)}
                className="px-3 py-1.5 rounded-lg bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#071912] border border-emerald-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-emerald-500/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingItem.role ? `Edit: ${editingItem.role}` : "Add Experience Record"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-[#092218] text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Job / Role Title *
                  </label>
                  <input
                    type="text"
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. Networking Specialist & Intern"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    value={editingItem.company}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="e.g. STS (Success Training System)"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingItem.duration}
                    onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                    placeholder="June 2023 – December 2023"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Employment / Position Type
                  </label>
                  <input
                    type="text"
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                    placeholder="6 Months Practical Experience"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Role Overview Description
                </label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Summary of day-to-day contributions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Responsibilities */}
              <div className="p-4 rounded-2xl bg-[#092218] border border-emerald-500/20 space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Key Responsibilities
                </label>

                <div className="space-y-2">
                  {(editingItem.keyResponsibilities || []).map((resp, rIdx) => (
                    <div
                      key={rIdx}
                      className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#071912] border border-emerald-500/15 text-xs text-stone-200"
                    >
                      <span className="flex-1">{resp}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResp(rIdx)}
                        className="text-stone-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newResp}
                    onChange={(e) => setNewResp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddResp();
                      }
                    }}
                    placeholder="Add responsibility bullet..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#071912] border border-emerald-500/30 text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddResp}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Technologies */}
              <div className="p-4 rounded-2xl bg-[#092218] border border-emerald-500/20 space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Tools & Technologies Handled
                </label>

                <div className="flex flex-wrap gap-2">
                  {(editingItem.technologies || []).map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tIdx)}
                        className="hover:text-rose-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="Add technology or skill..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#071912] border border-emerald-500/30 text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-500/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#092218] text-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Experience</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#071912] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Experience</h3>
                <p className="text-xs text-stone-400">Permanently remove this work experience</p>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-white">"{deleteConfirmItem.title}"</span>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-500/10">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
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
                    <span>Yes, Delete</span>
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
