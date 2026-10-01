import React, { useState } from "react";
import {
  Mail,
  Trash2,
  CheckCircle2,
  Calendar,
  ExternalLink,
  MessageSquare,
  Search,
  Filter,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { portfolioService } from "../services/portfolioService";

export const MessagesManager: React.FC = () => {
  const { messagesList, refreshData } = usePortfolio();

  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredMessages = messagesList.filter((m) => {
    if (activeFilter === "unread" && m.isRead) return false;
    if (activeFilter === "read" && !m.isRead) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.subject.toLowerCase().includes(term) ||
        m.message.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
    await portfolioService.markMessageRead(id, !currentReadStatus);
    await refreshData();
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await portfolioService.deleteMessage(deleteConfirmId);
      await refreshData();
    } catch (err) {
      console.error("Delete message error:", err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Mail className="w-7 h-7 text-emerald-400" />
            <span>Contact Inquiries</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Private inquiries received from your portfolio contact form.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#071912] border border-emerald-500/20 text-xs">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeFilter === "all"
                ? "bg-emerald-600 text-white"
                : "text-stone-400 hover:text-white"
            }`}
          >
            All ({messagesList.length})
          </button>
          <button
            onClick={() => setActiveFilter("unread")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeFilter === "unread"
                ? "bg-emerald-600 text-white"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Unread ({messagesList.filter((m) => !m.isRead).length})
          </button>
          <button
            onClick={() => setActiveFilter("read")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeFilter === "read"
                ? "bg-emerald-600 text-white"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Read ({messagesList.filter((m) => m.isRead).length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search inquiries by sender, email, subject, or message content..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071912] border border-emerald-500/25 text-white text-xs sm:text-sm placeholder-stone-500 focus:outline-none focus:border-emerald-400"
        />
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-[#071912] border border-emerald-500/20 rounded-3xl p-12 text-center text-stone-400 space-y-2">
          <MessageSquare className="w-10 h-10 mx-auto text-emerald-500/40" />
          <p className="text-sm font-semibold text-stone-300">No contact messages found</p>
          <p className="text-xs">
            {searchTerm
              ? "Try adjusting your search query."
              : "When visitors fill in your portfolio contact form, their inquiries will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => {
            const dateStr = new Date(msg.createdAt).toLocaleString();
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email)}&su=${encodeURIComponent(`Re: ${msg.subject}`)}`;
            const mailtoUrl = `mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent(`Re: ${msg.subject}`)}`;

            return (
              <div
                key={msg.id}
                className={`bg-[#071912] border rounded-3xl p-6 transition-all duration-200 ${
                  msg.isRead
                    ? "border-emerald-500/20 opacity-80 hover:opacity-100"
                    : "border-emerald-500/50 shadow-lg shadow-emerald-500/5"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/15">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        msg.isRead ? "bg-stone-600" : "bg-emerald-400 animate-pulse"
                      }`}
                    />
                    <div>
                      <span className="font-bold text-base text-white">{msg.name}</span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-emerald-400 hover:underline block"
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center text-xs text-stone-400">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{dateStr}</span>
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Subject: <span className="text-white normal-case">{msg.subject}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#092218] border border-emerald-500/15 text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={gmailUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <span>Reply via Gmail Web</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={mailtoUrl}
                      className="px-3 py-1.5 rounded-xl bg-[#092218] border border-emerald-500/30 text-stone-200 hover:text-white text-xs font-semibold"
                    >
                      Email Client
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(msg.id, msg.isRead)}
                      className="px-3 py-1.5 rounded-xl bg-[#092218] border border-emerald-500/20 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      {msg.isRead ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Mark Unread</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mark Read</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#071912] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Message</h3>
                <p className="text-xs text-stone-400">Permanently remove this inquiry</p>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Are you sure you want to permanently delete this contact message? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-500/10">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
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
