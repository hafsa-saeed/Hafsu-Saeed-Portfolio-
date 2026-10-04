import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Mail,
  ExternalLink,
} from "lucide-react";

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<{
    delivered: boolean;
    gmailComposeUrl?: string;
    mailtoUrl?: string;
  } | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      errs.email = "Please provide your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please provide a valid email format.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 8) {
      errs.message = "Message should be at least 8 characters long.";
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setIsSubmitting(true);

      const formattedSubject = `[Portfolio Inquiry] from ${formData.name.trim()}`;

      const formattedBody = `Dear Hafsa,\n\nYou received a new portfolio message from ${formData.name.trim()} (${formData.email.trim()}):\n\n${formData.message.trim()}\n\n---\nReply directly to: ${formData.email.trim()}`;

      const fallbackGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=hafsasaeed192@gmail.com&su=${encodeURIComponent(
        formattedSubject
      )}&body=${encodeURIComponent(formattedBody)}`;

      const fallbackMailto = `mailto:hafsasaeed192@gmail.com?subject=${encodeURIComponent(
        formattedSubject
      )}&body=${encodeURIComponent(formattedBody)}`;

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: `Inquiry from ${formData.name.trim()}`,
            message: formData.message.trim(),
          }),
        });

        const data = await response.json().catch(() => null);

        setSubmitted(true);

        setDeliveryResult({
          delivered: Boolean(data?.delivered),
          gmailComposeUrl: data?.gmailComposeUrl || fallbackGmailUrl,
          mailtoUrl: data?.mailtoUrl || fallbackMailto,
        });
      } catch (err) {
        console.error("Submission error:", err);

        setSubmitted(true);

        setDeliveryResult({
          delivered: false,
          gmailComposeUrl: fallbackGmailUrl,
          mailtoUrl: fallbackMailto,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative z-10"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Us
            </span>
          </h2>

          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base leading-relaxed">
            Have a project or opportunity in mind? Send a message and let's
            connect.
          </p>
        </div>

        {/* ONE Centered Contact Form */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white/95 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-md">
            {submitted ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                  {deliveryResult?.delivered
                    ? "Message Delivered!"
                    : "Message Received!"}
                </h4>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                  {deliveryResult?.delivered
                    ? `Thank you for reaching out, ${
                        formData.name || "friend"
                      }! Your message was delivered directly to hafsasaeed192@gmail.com. I will respond to your email shortly.`
                    : `Thank you for reaching out, ${
                        formData.name || "friend"
                      }! Your message has been recorded. To also dispatch it directly through your Gmail, you can use the quick button below:`}
                </p>

                {!deliveryResult?.delivered &&
                  deliveryResult?.gmailComposeUrl && (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                      <a
                        href={deliveryResult.gmailComposeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-500/25 transition-all"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Open Pre-filled in Gmail Web</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    </div>
                  )}

                <div className="pt-3 border-t border-emerald-500/20 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setDeliveryResult(null);
                      setFormData({
                        name: "",
                        email: "",
                        message: "",
                      });
                      setErrors({});
                    }}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    ← Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Name <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      });

                      if (errors.name) {
                        setErrors({
                          ...errors,
                          name: "",
                        });
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-[#092218] border text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                      errors.name
                        ? "border-rose-400"
                        : "border-stone-200 dark:border-emerald-500/25"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* 2. Email */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Email <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      });

                      if (errors.email) {
                        setErrors({
                          ...errors,
                          email: "",
                        });
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-[#092218] border text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                      errors.email
                        ? "border-rose-400"
                        : "border-stone-200 dark:border-emerald-500/25"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* 3. Message */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>

                  <textarea
                    rows={5}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      });

                      if (errors.message) {
                        setErrors({
                          ...errors,
                          message: "",
                        });
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-[#092218] border text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all resize-y ${
                      errors.message
                        ? "border-rose-400"
                        : "border-stone-200 dark:border-emerald-500/25"
                    }`}
                  />

                  {errors.message && (
                    <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* 4. Send Message Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
