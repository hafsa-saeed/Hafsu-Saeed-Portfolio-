import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Database,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useAuth, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const { signIn, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fillDefaultCredentials = () => {
    setEmail(DEFAULT_ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    const result = await signIn(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate("/admin");
    } else {
      setErrorMessage(result.error || "Invalid login credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070818] text-stone-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-500 p-[2px] shadow-xl shadow-purple-500/20 mb-4">
            <div className="w-full h-full bg-[#0e102c] rounded-[14px] flex items-center justify-center font-black text-2xl text-purple-400">
              HS
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Portfolio Admin CMS
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Private management portal for Hafsa Saeed
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0e102c] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Status Indicator */}
          <div className="mb-6 pb-4 border-b border-purple-500/15 flex items-center justify-between text-xs">
            <span className="text-stone-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>Authentication</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                isConfigured
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {isConfigured ? "Supabase Auth Active" : "Local Dev Fallback"}
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick-Fill Admin Credentials Helper */}
          <div className="mb-5 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-stone-300 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Login Access</span>
              </span>
              <button
                type="button"
                onClick={fillDefaultCredentials}
                className="px-2.5 py-1 rounded-lg bg-purple-600/40 hover:bg-purple-600 text-purple-200 hover:text-white font-medium text-[11px] transition-colors border border-purple-500/40 cursor-pointer"
              >
                Auto-Fill Credentials
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-stone-400 font-mono">
              <div>Email: <span className="text-purple-300">hafsasaeed192@gmail.com</span></div>
              <div>Password: <span className="text-purple-300">Hafsa@Saeed2026</span></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hafsasaeed192@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#14173d] border border-purple-500/30 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#14173d] border border-purple-500/30 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-purple-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Admin CMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Informative Guidance */}
          <div className="mt-6 pt-5 border-t border-purple-500/15 text-stone-400 text-xs space-y-2">
            <p className="flex items-center gap-1.5 text-stone-300">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Direct Supabase Row-Level Security Protected</span>
            </p>
            {!isConfigured && (
              <p className="text-[11px] text-amber-300/90 leading-relaxed">
                Tip: In local testing, enter Hafsa's email (e.g.{" "}
                <code className="bg-purple-950 px-1 py-0.5 rounded text-purple-300">
                  hafsasaeed192@gmail.com
                </code>
                ) and any password to access the panel. To link to your live Supabase project,
                add <code className="text-purple-300">VITE_SUPABASE_URL</code> and{" "}
                <code className="text-purple-300">VITE_SUPABASE_ANON_KEY</code>.
              </p>
            )}
          </div>
        </div>

        {/* Back to Portfolio Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-stone-400 hover:text-purple-400 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
          >
            <span>← Return to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
