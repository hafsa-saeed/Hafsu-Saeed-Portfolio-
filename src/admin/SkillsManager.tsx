import React, { useState } from "react";
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Sliders,
  Sparkles,
  Loader2,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { SkillCategory, SkillItem } from "../types";

export const SkillsManager: React.FC = () => {
  const { skillCategories, saveSkillCategories } = usePortfolio();

  const [categories, setCategories] = useState<SkillCategory[]>(skillCategories);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const [editingSkill, setEditingSkill] = useState<{
    catIndex: number;
    skillIndex: number;
    skill: SkillItem;
  } | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{
    type: "category" | "skill";
    catIndex: number;
    skillIndex?: number;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state if context changes
  React.useEffect(() => {
    setCategories(skillCategories);
  }, [skillCategories]);

  // Save changes
  const handlePersist = async (newCats: SkillCategory[]) => {
    setCategories(newCats);
    await saveSkillCategories(newCats);
  };

  // Category Actions
  const handleOpenAddCategory = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      category: "",
      skills: [],
    });
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.category.trim()) return;

    let updated: SkillCategory[];
    const existingIndex = categories.findIndex((c) => c.id === editingCategory.id);
    if (existingIndex >= 0) {
      updated = [...categories];
      updated[existingIndex] = {
        ...updated[existingIndex],
        category: editingCategory.category,
      };
    } else {
      updated = [...categories, editingCategory];
    }

    await handlePersist(updated);
    setIsCatModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (catIndex: number, catName: string) => {
    setDeleteConfirmItem({ type: "category", catIndex, title: catName });
  };

  const handleDeleteSkill = (catIndex: number, skillIndex: number, skillName: string) => {
    setDeleteConfirmItem({ type: "skill", catIndex, skillIndex, title: skillName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      const updated = [...categories];
      if (deleteConfirmItem.type === "category") {
        updated.splice(deleteConfirmItem.catIndex, 1);
      } else if (deleteConfirmItem.type === "skill" && typeof deleteConfirmItem.skillIndex === "number") {
        const targetCat = { ...updated[deleteConfirmItem.catIndex] };
        const skills = [...targetCat.skills];
        skills.splice(deleteConfirmItem.skillIndex, 1);
        targetCat.skills = skills;
        updated[deleteConfirmItem.catIndex] = targetCat;
      }
      await handlePersist(updated);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmItem(null);
    }
  };

  // Skill Actions
  const handleOpenAddSkill = (catIndex: number) => {
    setEditingSkill({
      catIndex,
      skillIndex: -1,
      skill: {
        id: `skill-${Date.now()}`,
        name: "",
        level: 85,
        description: "",
      },
    });
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (catIndex: number, skillIndex: number, skill: SkillItem) => {
    setEditingSkill({
      catIndex,
      skillIndex,
      skill: { ...skill },
    });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.skill.name.trim()) return;

    const updated = [...categories];
    const targetCat = { ...updated[editingSkill.catIndex] };
    const skills = [...(targetCat.skills || [])];

    if (editingSkill.skillIndex >= 0) {
      skills[editingSkill.skillIndex] = editingSkill.skill;
    } else {
      skills.push(editingSkill.skill);
    }

    targetCat.skills = skills;
    updated[editingSkill.catIndex] = targetCat;

    await handlePersist(updated);
    setIsSkillModalOpen(false);
    setEditingSkill(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-purple-400" />
            <span>Skills & Tech Stack Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Manage your skill categories, proficiency levels (0–100%), and descriptions.
          </p>
        </div>

        <button
          onClick={handleOpenAddCategory}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill Category</span>
        </button>
      </div>

      {/* Categories & Skills Grid */}
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div
            key={cat.id || catIdx}
            className="bg-[#0c0e29] border border-purple-500/25 rounded-3xl p-6 shadow-xl space-y-4"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
              <div>
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <span>{cat.category}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    {cat.skills?.length || 0} skills
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddSkill(catIdx)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
                <button
                  onClick={() => handleDeleteCategory(catIdx, cat.category)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Skills List in Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.skills?.map((skill, sIdx) => (
                <div
                  key={skill.id || sIdx}
                  className="p-3.5 rounded-2xl bg-[#14173d] border border-purple-500/15 flex flex-col justify-between hover:border-purple-500/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-white">{skill.name}</span>
                      <span className="text-xs font-mono font-bold text-purple-400">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#0c0e29] h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>

                    {skill.description && (
                      <p className="text-[11px] text-stone-400 line-clamp-2">
                        {skill.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-purple-500/10 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEditSkill(catIdx, sIdx, skill)}
                      className="p-1 rounded text-stone-400 hover:text-purple-400 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(catIdx, sIdx, skill.name)}
                      className="p-1 rounded text-stone-400 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {isCatModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0e29] border border-purple-500/30 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Add / Edit Skill Category</h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={editingCategory.category}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, category: e.target.value })
                  }
                  placeholder="e.g. Cloud & DevOps, Mobile Apps"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#14173d] text-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0e29] border border-purple-500/30 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">
              {editingSkill.skillIndex >= 0 ? "Edit Skill" : "Add Skill"}
            </h3>
            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={editingSkill.skill.name}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      skill: { ...editingSkill.skill, name: e.target.value },
                    })
                  }
                  placeholder="e.g. Docker, TypeScript, Next.js"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                    Proficiency Percentage: {editingSkill.skill.level}%
                  </label>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={editingSkill.skill.level}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      skill: {
                        ...editingSkill.skill,
                        level: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingSkill.skill.description || ""}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      skill: { ...editingSkill.skill, description: e.target.value },
                    })
                  }
                  placeholder="e.g. Hooks, modular state management"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#14173d] text-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                >
                  Save Skill
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
                <h3 className="text-lg font-bold text-white">
                  Delete {deleteConfirmItem.type === "category" ? "Skill Category" : "Skill"}
                </h3>
                <p className="text-xs text-stone-400">Permanently remove this item</p>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-white">"{deleteConfirmItem.title}"</span>
              {deleteConfirmItem.type === "category" && " and all its associated skills"}?
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
