import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FolderGit2,
  Award,
  GraduationCap,
  Briefcase,
  Wrench,
  FileText,
  Mail,
  UserCheck,
  Plus,
  RefreshCw,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { useAuth } from "../context/AuthContext";
import { portfolioService } from "../services/portfolioService";

export const DashboardPage: React.FC = () => {
  const {
    projectsList,
    credentialsList,
    educationList,
    experienceList,
    skillCategories,
    messagesList,
    personalInfo,
    refreshData,
  } = usePortfolio();

  const { isConfigured, user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Live Supabase table diagnostics
  const [tablesReady, setTablesReady] = useState<boolean | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false);
  const [isCheckingTables, setIsCheckingTables] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [copiedPerms, setCopiedPerms] = useState<boolean>(false);

  const checkSupabaseStatus = async () => {
    setIsCheckingTables(true);
    try {
      const res = await fetch("/api/supabase/status");
      const data = await res.json();
      setTablesReady(Boolean(data.tablesReady));
      setIsPermissionDenied(Boolean(data.isPermissionDenied));
    } catch (e) {
      setTablesReady(false);
    } finally {
      setIsCheckingTables(false);
    }
  };

  useEffect(() => {
    checkSupabaseStatus();
  }, []);

  const handleCopySql = async () => {
    try {
      const res = await fetch("/api/supabase/schema-sql");
      const data = await res.json();
      if (data.sql) {
        await navigator.clipboard.writeText(data.sql);
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 3000);
      }
    } catch (err) {
      alert("Please open supabase-schema.sql in the project root to copy.");
    }
  };

  const handleCopyPermissionsSql = async () => {
    try {
      const res = await fetch("/api/supabase/fix-permissions-sql");
      const data = await res.json();
      if (data.sql) {
        await navigator.clipboard.writeText(data.sql);
        setCopiedPerms(true);
        setTimeout(() => setCopiedPerms(false), 3000);
      }
    } catch (err) {
      alert("Please open fix-permissions.sql in the project root to copy.");
    }
  };

  const totalSkillsCount = skillCategories.reduce(
    (acc, cat) => acc + (cat.skills?.length || 0),
    0,
  );
  const unreadMessages = messagesList.filter((m) => !m.isRead).length;

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await portfolioService.syncInitialDataToSupabase();
      setSyncStatus(res);
      if (res.success) {
        setTablesReady(true);
      }
      await refreshData();
    } catch (err: any) {
      setSyncStatus({
        success: false,
        message: err.message || "Failed to trigger sync.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const statCards = [
    {
      title: "Featured Projects",
      value: projectsList.length,
      desc: "Live with hero, screenshots & demo videos",
      icon: FolderGit2,
      to: "/admin/projects",
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "Credentials & Docs",
      value: credentialsList.length,
      desc: "DigiSkills & academic distinctions",
      icon: Award,
      to: "/admin/credentials",
      color: "from-teal-600 to-emerald-700",
    },
    {
      title: "Education Milestones",
      value: educationList.length,
      desc: `Active: ${educationList[0]?.semester || "6th Semester"}`,
      icon: GraduationCap,
      to: "/admin/education",
      color: "from-emerald-700 to-green-700",
    },
    {
      title: "Work Experience",
      value: experienceList.length,
      desc: "STS Networking & Teaching records",
      icon: Briefcase,
      to: "/admin/experience",
      color: "from-emerald-800 to-teal-800",
    },
    {
      title: "Technical Skills",
      value: totalSkillsCount,
      desc: `${skillCategories.length} Categories organized`,
      icon: Wrench,
      to: "/admin/skills",
      color: "from-teal-700 to-emerald-600",
    },
    {
      title: "Inquiries Received",
      value: messagesList.length,
      desc: `${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}`,
      icon: Mail,
      to: "/admin/messages",
      color: "from-emerald-600 to-cyan-700",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-[#071912] to-[#092218] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Portfolio CMS Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, Hafsa!
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Manage your projects, upload actual 300MB+ demo video files to Cloudflare R2, update your semester/CGPA, add future credentials, and edit any portfolio section without touching code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/projects"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#0a281c] hover:bg-[#0e3525] text-stone-200 border border-emerald-500/30 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-4 h-4 text-emerald-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in ${
            syncStatus.success
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/60 border-rose-500/40 text-rose-200"
          }`}
        >
          {syncStatus.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div>
            <div className="font-bold">{syncStatus.success ? "Sync Succeeded" : "Notice"}</div>
            <p className="mt-0.5 opacity-90">{syncStatus.message}</p>
          </div>
        </div>
      )}

      {/* Architecture & Infrastructure Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supabase Status Card */}
        <div className="bg-[#071912] border border-emerald-500/25 rounded-3xl p-6 shadow-lg backdrop-blur-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Supabase Database</h3>
                <p className="text-xs text-stone-400">PostgreSQL Relational DB & Auth</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  isConfigured
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {isConfigured ? "Connected" : "Local Sync Mode"}
              </span>
              {tablesReady !== null && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    tablesReady
                      ? "bg-emerald-950 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-950 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {tablesReady ? "Tables Ready" : "Tables Missing in DB"}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-stone-300 mt-4 leading-relaxed">
            {tablesReady
              ? "All 10 relational PostgreSQL tables are active in your Supabase project. You can push all portfolio records with 1-click below."
              : "Your Supabase project is connected, but the database tables have not been created yet in Supabase SQL Editor. Copy the SQL below, run it in Supabase, and click Sync."}
          </p>

          {/* Quick Database Setup Helper if tables are missing or permission denied */}
          {!tablesReady && (
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200/90 space-y-2.5">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>
                  {isPermissionDenied
                    ? "Almost Done! Enable API Access in Supabase:"
                    : "One-Time Database Schema Setup:"}
                </span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-stone-300">
                {isPermissionDenied ? (
                  <>
                    <li>Click <strong>Copy Permissions SQL</strong> below.</li>
                    <li>Click <strong>Open Supabase SQL Editor</strong> and paste the query.</li>
                    <li>Click the green <strong>Run</strong> button in Supabase.</li>
                    <li>Click <strong>Check Status</strong>, then click <strong>Sync All Data to Supabase</strong>!</li>
                  </>
                ) : (
                  <>
                    <li>Click <strong>Copy Full Schema SQL</strong> below.</li>
                    <li>Click <strong>Open Supabase SQL Editor</strong> and paste the query.</li>
                    <li>Click the green <strong>Run</strong> button in Supabase.</li>
                    <li>Click <strong>Sync All Data to Supabase</strong> below.</li>
                  </>
                )}
              </ol>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {isPermissionDenied ? (
                  <button
                    type="button"
                    onClick={handleCopyPermissionsSql}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white font-medium text-xs border border-emerald-500/40 cursor-pointer transition-colors"
                  >
                    {copiedPerms ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPerms ? "Permissions SQL Copied!" : "Copy Permissions SQL"}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white font-medium text-xs border border-amber-500/40 cursor-pointer transition-colors"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? "SQL Copied to Clipboard!" : "Copy Full Schema SQL"}</span>
                  </button>
                )}
                <a
                  href="https://supabase.com/dashboard/project/fabsnyxmgwaelwrbcrfe/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-600 transition-colors"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
                <button
                  type="button"
                  onClick={checkSupabaseStatus}
                  disabled={isCheckingTables}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-400 text-xs border border-stone-700 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isCheckingTables ? "animate-spin" : ""}`} />
                  <span>Check Status</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleSyncToSupabase}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing to Supabase..." : "Sync All Data to Supabase"}</span>
            </button>

            <span className="text-[11px] text-stone-400">Schema: 10 Relational Tables</span>
          </div>
        </div>

        {/* Cloudflare R2 Media Card */}
        <div className="bg-[#071912] border border-emerald-500/25 rounded-3xl p-6 shadow-lg backdrop-blur-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Cloudflare R2 Storage</h3>
                <p className="text-xs text-stone-400">Direct Presigned & 300MB+ Multipart Video</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Active Pipeline
            </span>
          </div>

          <p className="text-xs text-stone-300 mt-4 leading-relaxed">
            Direct-to-R2 upload engine is integrated. Large demo videos (over 20MB up to 1GB+) are sliced into chunks on the client and uploaded directly to R2 without passing through Vercel serverless functions.
          </p>

          <div className="mt-5 pt-4 border-t border-emerald-500/15 flex items-center justify-between text-xs">
            <span className="text-stone-400">Zero Vercel Payload Limits</span>
            <span className="text-emerald-400 font-medium">MP4 / WEBM / PDF / JPG</span>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="group bg-[#071912] border border-emerald-500/20 hover:border-emerald-500/40 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 transition-colors" />
              </div>

              <div className="text-3xl font-black text-white">{card.value}</div>
              <div className="text-sm font-bold text-stone-200 mt-1">{card.title}</div>
            </div>

            <p className="text-xs text-stone-400 mt-3 pt-3 border-t border-emerald-500/10">
              {card.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-[#071912] border border-emerald-500/20 rounded-3xl p-6">
        <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
          <span>Quick Actions</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/projects"
            className="p-4 rounded-2xl bg-[#092218] border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-[#0c2f21] transition-all text-center group cursor-pointer"
          >
            <FolderGit2 className="w-5 h-5 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-white">Add Project</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Upload video & images</div>
          </Link>

          <Link
            to="/admin/education"
            className="p-4 rounded-2xl bg-[#092218] border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-[#0c2f21] transition-all text-center group cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-white">Update Semester</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Change CGPA & progress</div>
          </Link>

          <Link
            to="/admin/documents"
            className="p-4 rounded-2xl bg-[#092218] border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-[#0c2f21] transition-all text-center group cursor-pointer"
          >
            <FileText className="w-5 h-5 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-white">Upload New CV</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Replace PDF in R2</div>
          </Link>

          <Link
            to="/admin/credentials"
            className="p-4 rounded-2xl bg-[#092218] border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-[#0c2f21] transition-all text-center group cursor-pointer"
          >
            <Award className="w-5 h-5 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-white">Add Certificate</div>
            <div className="text-[11px] text-stone-400 mt-0.5">DigiSkills or course</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
