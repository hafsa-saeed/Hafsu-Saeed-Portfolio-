import React, { useState } from "react";
import {
  UserCheck,
  CheckCircle2,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Quote,
  Target,
  Sparkles,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { PersonalInfo } from "../types";
import { uploadToR2 } from "../services/r2StorageService";

export const ProfileManager: React.FC = () => {
  const { personalInfo, updatePersonalInfo } = usePortfolio();

  const [formData, setFormData] = useState<PersonalInfo>(personalInfo);
  const [titlesString, setTitlesString] = useState(personalInfo.titles?.join(", ") || "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploading(true);
    try {
      const result = await uploadToR2(file, "profile");
      setFormData((prev) => ({ ...prev, profileImage: result.url }));
    } catch (err: any) {
      alert(`Photo upload failed: ${err.message}`);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    const updatedTitles = titlesString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedData: PersonalInfo = {
      ...formData,
      titles: updatedTitles.length > 0 ? updatedTitles : formData.titles,
    };

    await updatePersonalInfo(updatedData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-purple-400" />
            <span>Profile & Personal Information</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Update your bio, titles, contact numbers, address, social accounts, and profile photo.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Profile updated successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Personal Identity */}
        <div className="bg-[#0c0e29] border border-purple-500/25 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="font-bold text-white text-base pb-3 border-b border-purple-500/15">
            Identity & Bio
          </h3>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-black border-2 border-purple-500/40 shrink-0 relative">
                <img
                  src={formData.profileImage}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="px-3 py-1.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-900/40 text-xs font-semibold cursor-pointer transition-colors">
                <span>{photoUploading ? "Uploading..." : "Change Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={photoUploading}
                />
              </label>
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Animated Hero Titles (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={titlesString}
                    onChange={(e) => setTitlesString(e.target.value)}
                    placeholder="Full Stack Developer, BS CS Student, AI Specialist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Professional Bio *
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Inspirational Quote
                  </label>
                  <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Quote Author
                  </label>
                  <input
                    type="text"
                    value={formData.quoteAuthor}
                    onChange={(e) =>
                      setFormData({ ...formData, quoteAuthor: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Demographics */}
        <div className="bg-[#0c0e29] border border-purple-500/25 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-base pb-3 border-b border-purple-500/15">
            Contact & Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Primary Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Phone 1
              </label>
              <input
                type="text"
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Phone 2 / Alternate
              </label>
              <input
                type="text"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Address / Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Age
              </label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Social Accounts */}
        <div className="bg-[#0c0e29] border border-purple-500/25 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-base pb-3 border-b border-purple-500/15">
            Social Profiles & Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.socials.github || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, github: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.socials.linkedin || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, linkedin: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                WhatsApp Link
              </label>
              <input
                type="text"
                value={formData.socials.whatsapp || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, whatsapp: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Twitter / X URL
              </label>
              <input
                type="text"
                value={formData.socials.twitter || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, twitter: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14173d] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save All Profile Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
