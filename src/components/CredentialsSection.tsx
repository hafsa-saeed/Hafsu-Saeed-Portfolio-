import React, { useState } from "react";
import {
  Eye,
  Download,
  CheckCircle2,
  X,
  Calendar,
  FileBadge,
} from "lucide-react";
import { credentialsList } from "../data/portfolioData";
import { CredentialItem } from "../types";

export const CredentialsSection: React.FC = () => {
  const [activeCert, setActiveCert] = useState<CredentialItem | null>(null);

  // Download Handler for Real Image/Document File
  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    // Cleans title to construct a proper file name
    const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="credentials"
      className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-stone-100/50 dark:bg-[#05130e]/70"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <FileBadge className="w-4 h-4" />
            <span>Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Docs &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Credentials
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            Professional certifications, DigiSkills government credentials, and
            academic distinctions.
          </p>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {credentialsList.map((cred) => (
            <div
              key={cred.id}
              className="group bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/40 shadow-xl backdrop-blur-md"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                  <img
                    src={cred.imageThumbnail}
                    alt={cred.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge Category */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold">
                    {cred.category}
                  </div>

                  {/* Issuer on Thumbnail */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs text-emerald-300 font-semibold">
                      {cred.issuer}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{cred.date}</span>
                    {cred.credentialId && (
                      <span className="ml-auto font-mono text-[10px] bg-stone-100 dark:bg-[#092218] px-2 py-0.5 rounded text-stone-600 dark:text-stone-300 border border-transparent dark:border-emerald-500/20">
                        {cred.credentialId}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-3">
                    {cred.title}
                  </h3>

                  {/* Skills / Key points */}
                  <div className="space-y-1.5 mb-4">
                    {cred.skillsLearned.slice(0, 3).map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex gap-2">
                <button
                  onClick={() => setActiveCert(cred)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Real Image Preview Modal */}
        {activeCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#071912] rounded-3xl p-4 sm:p-6 shadow-2xl border border-emerald-500/30 flex flex-col overflow-hidden">
              {/* Close Button */}
              <button
                onClick={() => setActiveCert(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 dark:bg-[#092218] text-stone-600 dark:text-stone-300 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="text-left mb-4 pr-10 shrink-0">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                  Verified Document
                </span>
                <h3 className="text-lg sm:text-2xl font-bold text-stone-900 dark:text-white mt-1">
                  {activeCert.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {activeCert.issuer} • {activeCert.date}
                </p>
              </div>

              {/* Real Full Image Display Container */}
              <div className="flex-1 min-h-0 bg-stone-900/50 rounded-2xl border border-emerald-500/20 overflow-y-auto p-2 flex items-center justify-center">
                <img
                  src={activeCert.imageThumbnail}
                  alt={activeCert.title}
                  className="max-w-full max-h-[58vh] object-contain rounded-lg shadow-md"
                />
              </div>

              {/* Competencies Mastered */}
              <div className="my-3 shrink-0">
                <div className="flex flex-wrap gap-1.5">
                  {activeCert.skillsLearned.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-emerald-50 dark:bg-[#092218] text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 shrink-0 pt-2 border-t border-emerald-500/20">
                <button
                  onClick={() =>
                    handleDownload(activeCert.imageThumbnail, activeCert.title)
                  }
                  className="flex-1 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-500/25"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Actual Document Image</span>
                </button>
                <button
                  onClick={() => setActiveCert(null)}
                  className="py-2.5 sm:py-3 px-5 rounded-xl bg-stone-100 dark:bg-[#092218] hover:bg-stone-200 dark:hover:bg-[#103427] text-stone-700 dark:text-stone-300 font-semibold text-xs sm:text-sm transition-colors border border-stone-200 dark:border-emerald-500/25 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
