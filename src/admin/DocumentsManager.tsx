import React, { useState } from "react";
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Eye,
  Sparkles,
  Download,
  Loader2,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { DocumentItem } from "../types";
import { uploadToR2 } from "../services/r2StorageService";

export const DocumentsManager: React.FC = () => {
  const { documentsList, saveDocument, deleteDocument, personalInfo, updatePersonalInfo } =
    usePortfolio();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToR2(file, "documents", (percent) => {
        setUploadProgress(percent);
      });

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: `Hafsa Saeed CV (${new Date().toLocaleDateString()})`,
        description: "Official Curriculum Vitae updated from Admin CMS",
        category: "cv",
        fileUrl: result.url,
        r2Key: result.key,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        isActiveCv: true,
      };

      await saveDocument(newDoc);
      // Also update personalInfo resumeUrl
      await updatePersonalInfo({
        ...personalInfo,
        resumeUrl: result.url,
      });

      alert("New CV uploaded and set as active public resume!");
    } catch (err: any) {
      alert(`CV Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSetActiveCV = async (doc: DocumentItem) => {
    await saveDocument({ ...doc, isActiveCv: true });
    await updatePersonalInfo({
      ...personalInfo,
      resumeUrl: doc.fileUrl,
    });
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteConfirmItem({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      await deleteDocument(deleteConfirmItem.id);
    } catch (err) {
      console.error("Delete document error:", err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-purple-400" />
            <span>Documents & CV Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Upload, replace, and manage your official CV PDF and academic transcripts in Cloudflare R2.
          </p>
        </div>

        <label className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{uploading ? `Uploading ${uploadProgress}%` : "Upload New CV PDF"}</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleCVUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Active Public CV Card */}
      <div className="bg-gradient-to-r from-purple-950/80 to-[#0c0e29] border-2 border-purple-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white uppercase tracking-wider">
                  Active Public CV
                </span>
                <span className="text-xs text-stone-400">Linked to Public Homepage</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {personalInfo.resumeUrl.split("/").pop() || "Hafsa_Saeed_CV.pdf"}
              </h2>
              <p className="text-xs text-stone-300">
                This document is served when visitors click "Download CV" or "View Full CV" on your portfolio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#14173d] border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-900/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview PDF</span>
            </a>
            <a
              href={personalInfo.resumeUrl}
              download="Hafsa_Saeed_CV.pdf"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/25"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          </div>
        </div>
      </div>

      {/* Documents History Table */}
      <div className="bg-[#0c0e29] border border-purple-500/20 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base">Archived & Uploaded Documents</h3>

        <div className="divide-y divide-purple-500/10">
          {documentsList.map((doc) => (
            <div
              key={doc.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#14173d] border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{doc.title}</span>
                    {doc.isActiveCv && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400">{doc.description || doc.fileName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {!doc.isActiveCv && (
                  <button
                    onClick={() => handleSetActiveCV(doc)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Set as Active CV
                  </button>
                )}
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-[#14173d] text-stone-300 hover:text-white border border-purple-500/20 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(doc.id, doc.title)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In-App Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0c0e29] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Document</h3>
                <p className="text-xs text-stone-400">Permanently remove this file</p>
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
