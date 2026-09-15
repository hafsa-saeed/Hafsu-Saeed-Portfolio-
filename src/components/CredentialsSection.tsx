import React, { useState } from "react";
import {
  Award,
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

        {/* Certificate Modal */}
        {activeCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl bg-white dark:bg-[#071912] rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30">
              <button
                onClick={() => setActiveCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 dark:bg-[#092218] text-stone-600 dark:text-stone-300 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-5">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Verified Completion
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mt-2">
                  {activeCert.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Issued by{" "}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {activeCert.issuer}
                  </span>{" "}
                  • {activeCert.date}
                </p>
              </div>

              {/* Certificate Decorative Frame */}
              <div className="border-4 border-double border-emerald-500/30 rounded-2xl p-6 bg-gradient-to-b from-emerald-50/40 via-white to-stone-50 dark:from-[#092218] dark:via-[#071912] dark:to-[#040f0a] text-center mb-6 shadow-inner">
                <Award className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <div className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-1">
                  Certificate of Achievement
                </div>
                <div className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                  Hafsa Saeed
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                  Has successfully fulfilled all curriculum requirements,
                  practical examinations, and project assignments in{" "}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {activeCert.title}
                  </span>
                  .
                </p>
                {activeCert.credentialId && (
                  <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-stone-500 dark:text-stone-400">
                    Credential ID: {activeCert.credentialId}
                  </div>
                )}
              </div>

              {/* Competencies Mastered */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                  Competencies Mastered:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeCert.skillsLearned.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs bg-emerald-50 dark:bg-[#092218] text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob(
                      [
                        `Certificate: ${activeCert.title}\nRecipient: Hafsa Saeed\nIssuer: ${activeCert.issuer}\nDate: ${activeCert.date}\nCredential ID: ${activeCert.credentialId || "N/A"}`,
                      ],
                      { type: "text/plain" },
                    );
                    element.href = URL.createObjectURL(file);
                    element.download = `${activeCert.id}-credential.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-500/25"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Verified Document</span>
                </button>
                <button
                  onClick={() => setActiveCert(null)}
                  className="py-3 px-5 rounded-xl bg-stone-100 dark:bg-[#092218] hover:bg-stone-200 dark:hover:bg-[#103427] text-stone-700 dark:text-stone-300 font-semibold text-xs sm:text-sm transition-colors border border-stone-200 dark:border-emerald-500/25 cursor-pointer"
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
