import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderGit2,
  Award,
  GraduationCap,
  Briefcase,
  Wrench,
  FileText,
  UserCheck,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Database,
  Cloud,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePortfolio } from "../context/PortfolioContext";

export const AdminLayout: React.FC = () => {
  const { user, signOut, isConfigured } = useAuth();
  const { messagesList, projectsList } = usePortfolio();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = messagesList.filter((m) => !m.isRead).length;

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    {
      to: "/admin/projects",
      label: "Projects",
      icon: FolderGit2,
      badge: projectsList.length > 0 ? projectsList.length : undefined,
    },
    { to: "/admin/credentials", label: "Credentials", icon: Award },
    { to: "/admin/education", label: "Education & CGPA", icon: GraduationCap },
    { to: "/admin/experience", label: "Experience", icon: Briefcase },
    { to: "/admin/skills", label: "Skills & Tech", icon: Wrench },
    { to: "/admin/documents", label: "Documents & CV", icon: FileText },
    { to: "/admin/profile", label: "Profile & Bio", icon: UserCheck },
    {
      to: "/admin/messages",
      label: "Inquiries",
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: "bg-emerald-500 text-white animate-pulse",
    },
  ];

  return (
    <div className="min-h-screen bg-[#040e0a] text-stone-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-white">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#071912] border-b border-emerald-500/20 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
            HS
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-1">
              <span>Hafsa CMS</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                Admin
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/25 text-emerald-400"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay on Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#071912] border-r border-emerald-500/20 flex flex-col justify-between z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Logo & Title */}
          <div className="p-5 border-b border-emerald-500/20">
            <Link
              to="/admin"
              className="flex items-center gap-3 group"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[2px] shadow-sm shadow-emerald-500/30">
                <div className="w-full h-full bg-[#071912] rounded-[10px] flex items-center justify-center font-bold text-emerald-400 text-base">
                  HS
                </div>
              </div>
              <div>
                <div className="font-bold tracking-tight text-white flex items-center gap-1.5 leading-tight">
                  <span>Hafsa Saeed</span>
                </div>
                <div className="text-[11px] text-emerald-400/80 font-medium flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Admin CMS</span>
                </div>
              </div>
            </Link>

            {/* Quick Status Pill */}
            <div className="mt-4 px-2.5 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-stone-300">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Supabase</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  isConfigured
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {isConfigured ? "Connected" : "Local Sync"}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "text-stone-300 hover:text-white hover:bg-emerald-950/40"
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor || "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer Section in Sidebar */}
          <div className="p-3 border-t border-emerald-500/20 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Public Site</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>

            <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between px-2">
              <div className="truncate max-w-[140px]">
                <div className="text-xs font-medium text-white truncate">
                  {user?.email || "Admin User"}
                </div>
                <div className="text-[10px] text-emerald-400">Authenticated</div>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex h-16 bg-[#071912]/80 border-b border-emerald-500/20 px-8 items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-stone-400">Admin Control Panel</span>
            <span className="text-stone-600">/</span>
            <span className="text-xs font-semibold text-emerald-400">
              Database & R2 Media Management
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/25 text-xs text-stone-300">
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cloudflare R2 Direct Uploads</span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all text-xs font-semibold"
            >
              <span>Public Portfolio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
