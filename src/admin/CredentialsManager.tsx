import React, { useState } from "react";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  Upload,
  ExternalLink,
  X,
  FileBadge,
  Loader2,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { CredentialItem } from "../types";
import { uploadToR2 } from "../services/r2StorageService";

export const CredentialsManager: React.FC = () => {
  const { credentialsList, saveCredential, deleteCredential } = usePortfolio();

  const [editingItem, setEditingItem] = useState<CredentialItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem({
      id: `cred-${Date.now()}`,
      title: "",
      issuer: "",
      date: `Certified ${new Date().getFullYear()}`,
      credentialId: "",
      skillsLearned: ["Core Competency"],
      category: "Web Development",
      imageThumbnail: "/credentials/wordpress-certificate.jpg",
      displayOrder: credentialsList.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CredentialItem) => {
    setEditingItem({
      ...item,
      skillsLearned: item.skillsLearned ? [...item.skillsLearned] : [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteConfirmItem({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      await deleteCredential(deleteConfirmItem.id);
    } catch (err) {
      console.error("Delete credential error:", err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmItem(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToR2(file, "credentials", (percent) => {
        setUploadProgress(percent);
      });
      setEditingItem((prev) =>
        prev
          ? {
              ...prev,
              imageThumbnail: result.url,
              fileUrl: result.url,
            }
          : null,
      );
    } catch (err: any) {
      alert(`File upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim() || !editingItem) return;
    setEditingItem({
      ...editingItem,
      skillsLearned: [...(editingItem.skillsLearned || []), newSkillInput.trim()],
    });
    setNewSkillInput("");
  };

  const handleRemoveSkill = (idx: number) => {
    if (!editingItem) return;
    const updated = [...editingItem.skillsLearned];
    updated.splice(idx, 1);
    setEditingItem({ ...editingItem, skillsLearned: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title.trim()) return;
    await saveCredential(editingItem);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-emerald-400" />
            <span>Credentials & Certificates</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Manage your verified DigiSkills credentials, transcripts, and academic honors.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credential</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {credentialsList.map((item) => (
          <div
            key={item.id}
            className="bg-[#071912] border border-emerald-500/25 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300"
          >
            <div>
              <div className="relative aspect-16/10 bg-black overflow-hidden">
                <img
                  src={item.imageThumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  {item.category}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.date}</span>
                  </span>
                  {item.credentialId && (
                    <span className="font-mono text-[10px] bg-[#092218] px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/20">
                      {item.credentialId}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base leading-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-emerald-400 font-medium mb-3">{item.issuer}</p>

                <div className="flex flex-wrap gap-1.5">
                  {item.skillsLearned?.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded bg-[#092218] text-stone-300 text-[10px] border border-emerald-500/15"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-emerald-500/15 flex items-center justify-end gap-2 bg-[#071912]">
              <button
                onClick={() => handleOpenEdit(item)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(item.id, item.title)}
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
                {editingItem.title ? `Edit: ${editingItem.title}` : "Add Credential"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-[#092218] text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Certificate / Document Title *
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. WordPress Development Certification"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={editingItem.issuer}
                    onChange={(e) => setEditingItem({ ...editingItem, issuer: e.target.value })}
                    placeholder="DigiSkills Training Program"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="Web Development / Academic Distinction"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Date Awarded
                  </label>
                  <input
                    type="text"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    placeholder="Certified 2023"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Credential ID / Roll No
                  </label>
                  <input
                    type="text"
                    value={editingItem.credentialId || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, credentialId: e.target.value })
                    }
                    placeholder="DS-WP-89241"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Upload Certificate Image/PDF */}
              <div className="p-4 rounded-2xl bg-[#092218] border border-emerald-500/20 space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Certificate Image / PDF Scan
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-black border border-emerald-500/30 shrink-0">
                    <img
                      src={editingItem.imageThumbnail}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editingItem.imageThumbnail}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, imageThumbnail: e.target.value })
                      }
                      placeholder="/credentials/... or R2 URL"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#071912] border border-emerald-500/30 text-white text-xs focus:outline-none"
                    />

                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? `Uploading ${uploadProgress}%` : "Upload to Cloudflare R2"}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Skills Learned */}
              <div className="p-4 rounded-2xl bg-[#092218] border border-emerald-500/20 space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Skills Learned & Highlights
                </label>

                <div className="flex flex-wrap gap-2">
                  {(editingItem.skillsLearned || []).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sIdx)}
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
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add verified skill (e.g. WordPress, SEO)..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#071912] border border-emerald-500/30 text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
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
                  <span>Save Credential</span>
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
                <h3 className="text-lg font-bold text-white">Delete Credential</h3>
                <p className="text-xs text-stone-400">Permanently remove this certificate</p>
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
