import React, { useState } from "react";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  School,
  Calendar,
  CheckCircle2,
  Sparkles,
  X,
  Award,
  Loader2,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { EducationItem } from "../types";

export const EducationManager: React.FC = () => {
  const { educationList, saveEducation, deleteEducation } = usePortfolio();
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHighlight, setNewHighlight] = useState("");
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem({
      id: `edu-${Date.now()}`,
      degree: "",
      institute: "",
      year: "2023 – 2027",
      grade: "Maintaining 3.71 CGPA",
      status: "In Progress",
      semester: "6th Semester",
      cgpa: "3.71",
      highlights: ["Core academic milestone and technical coursework"],
      description: "",
      displayOrder: educationList.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EducationItem) => {
    setEditingItem({
      ...item,
      highlights: item.highlights ? [...item.highlights] : [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, degree: string) => {
    setDeleteConfirmItem({ id, title: degree });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      await deleteEducation(deleteConfirmItem.id);
    } catch (err) {
      console.error("Delete education error:", err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmItem(null);
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim() || !editingItem) return;
    setEditingItem({
      ...editingItem,
      highlights: [...(editingItem.highlights || []), newHighlight.trim()],
    });
    setNewHighlight("");
  };

  const handleRemoveHighlight = (idx: number) => {
    if (!editingItem) return;
    const updated = [...editingItem.highlights];
    updated.splice(idx, 1);
    setEditingItem({ ...editingItem, highlights: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.degree.trim()) return;
    await saveEducation(editingItem);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-purple-400" />
            <span>Education & Academic Status</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Update your active semester (e.g. 6th to 7th or 8th), CGPA, degree milestones, and academic honors.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Record</span>
        </button>
      </div>

      {/* Education Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educationList.map((item) => (
          <div
            key={item.id}
            className="bg-[#0c0e29] border border-purple-500/25 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-purple-500/40 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.semester || item.status}
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>{item.year}</span>
                </span>
              </div>

              <h3 className="font-bold text-lg text-white mb-1">{item.degree}</h3>
              <div className="text-xs text-stone-300 flex items-center gap-1.5 mb-3">
                <School className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{item.institute}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#14173d] border border-purple-500/20 space-y-1 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Grade / Result:</span>
                  <span className="font-bold text-purple-400">{item.grade}</span>
                </div>
                {item.cgpa && (
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-400">CGPA:</span>
                    <span className="font-mono font-bold text-white">{item.cgpa}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Status:</span>
                  <span className="text-stone-300">{item.status}</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Highlights
                </div>
                {item.highlights?.slice(0, 3).map((h, hIdx) => (
                  <div key={hIdx} className="text-xs text-stone-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-500/15 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(item)}
                className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(item.id, item.degree)}
                className="px-3 py-1.5 rounded-lg bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0e29] border border-purple-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-purple-500/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingItem.degree ? `Edit: ${editingItem.degree}` : "Add Education Record"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-[#14173d] text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Degree / Qualification *
                  </label>
                  <input
                    type="text"
                    value={editingItem.degree}
                    onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                    placeholder="e.g. BS Computer Science"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Institute / University *
                  </label>
                  <input
                    type="text"
                    value={editingItem.institute}
                    onChange={(e) => setEditingItem({ ...editingItem, institute: e.target.value })}
                    placeholder="Superior Group of Colleges, Mianwali"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={editingItem.semester || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, semester: e.target.value })}
                    placeholder="e.g. 6th Semester, 7th Sem"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    CGPA / Score
                  </label>
                  <input
                    type="text"
                    value={editingItem.cgpa || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, cgpa: e.target.value })}
                    placeholder="e.g. 3.71 or 1074/1100"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Year / Timeline
                  </label>
                  <input
                    type="text"
                    value={editingItem.year}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    placeholder="Sep 2023 – 2027"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Grade Display Text
                  </label>
                  <input
                    type="text"
                    value={editingItem.grade}
                    onChange={(e) => setEditingItem({ ...editingItem, grade: e.target.value })}
                    placeholder="Maintaining 3.71 CGPA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Academic Status
                  </label>
                  <input
                    type="text"
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    placeholder="In Progress (2 Semesters Remaining)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Highlights List */}
              <div className="p-4 rounded-2xl bg-[#14173d] border border-purple-500/20 space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Course Highlights & Achievements
                </label>

                <div className="space-y-2">
                  {(editingItem.highlights || []).map((hl, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#0c0e29] border border-purple-500/15 text-xs text-stone-200"
                    >
                      <span className="flex-1">{hl}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(hIdx)}
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
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    placeholder="Add coursework highlight..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#0c0e29] border border-purple-500/30 text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-500/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#14173d] text-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0c0e29] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Education Record</h3>
                <p className="text-xs text-stone-400">Permanently remove this entry</p>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-white">"{deleteConfirmItem.title}"</span>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-500/10">
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
