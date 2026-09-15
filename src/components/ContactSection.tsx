import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  PhoneCall,
  ExternalLink,
  Clock,
  Navigation,
  Copy,
  Check,
  Compass,
  Globe,
} from "lucide-react";
import { personalInfo } from "../data/portfolioData";

interface LocationPreset {
  id: string;
  name: string;
  tag: string;
  query: string;
  zoom: number;
  description: string;
}

const LOCATION_PRESETS: LocationPreset[] = [
  {
    id: "mianwali",
    name: "Mianwali City",
    tag: "City Center",
    query: "Mianwali, Punjab, Pakistan",
    zoom: 13,
    description: "Home District & Central Punjab Tech Hub",
  },
  {
    id: "superior",
    name: "Superior College",
    tag: "Campus Base",
    query: "Superior Group of Colleges, PAF Road, Mianwali",
    zoom: 16,
    description: "BS Computer Science Faculty (PAF Road Campus)",
  },
  {
    id: "kundian",
    name: "Kundian City",
    tag: "Sub-Division",
    query: "Kundian, Mianwali, Punjab, Pakistan",
    zoom: 14,
    description: "Academic Milestones & Kundian Junction Area",
  },
];

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionMode, setSubmissionMode] = useState<
    "gmail_web" | "form_server" | null
  >(null);
  const [serverFeedback, setServerFeedback] = useState<{
    success: boolean;
    message: string;
    delivered?: boolean;
    needsActivation?: boolean;
    authNotice?: boolean;
    gmailComposeUrl?: string;
    whatsappUrl?: string;
    mailtoUrl?: string;
  } | null>(null);

  // Interactive Location State
  const [activeLocation, setActiveLocation] = useState<LocationPreset>(
    LOCATION_PRESETS[0],
  );
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [pktTime, setPktTime] = useState<string>("");

  // Live Pakistan Standard Time (PKT) Clock
  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Karachi",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setPktTime(formatted);
      } catch {
        setPktTime("PKT (UTC+5)");
      }
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyCoords = () => {
    navigator.clipboard.writeText("32.5853, 71.5436");
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2200);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Please enter your name.";
    if (!formData.email.trim()) {
      errs.email = "Please provide your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please provide a valid email format.";
    }
    if (!formData.subject.trim()) errs.subject = "Please enter a subject.";
    if (!formData.message.trim() || formData.message.trim().length < 8) {
      errs.message = "Message should be at least 8 characters long.";
    }
    return errs;
  };

  const buildGmailUrl = () => {
    const s = formData.subject.trim() || "Portfolio Inquiry";
    const senderName = formData.name.trim() || "Visitor";
    const senderEmail = formData.email.trim() || "Not provided";
    const messageBody = formData.message.trim() || "";

    const formattedBody = [
      `Dear Hafsa Saeed,`,
      ``,
      `You have received a new inquiry from your portfolio website:`,
      ``,
      `════════════════════════════════════════`,
      `👤 SENDER INFORMATION`,
      `• Full Name: ${senderName}`,
      `• Email Address: ${senderEmail}`,
      `════════════════════════════════════════`,
      `📋 INQUIRY DETAILS`,
      `• Subject: ${s}`,
      `• Date: ${new Date().toLocaleDateString("en-US", { dateStyle: "full" })}`,
      `════════════════════════════════════════`,
      `💬 MESSAGE:`,
      `${messageBody}`,
      ``,
      `════════════════════════════════════════`,
      `↩️ HOW TO REPLY TO THIS MESSAGE:`,
      `To contact ${senderName} back, simply click "Reply" in your Gmail window, or write to: ${senderEmail}`,
      `════════════════════════════════════════`,
      `Sent via Hafsa Saeed's Portfolio Website.`,
    ].join("\n");

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}&su=${encodeURIComponent(`[Portfolio Inquiry] ${s} - from ${senderName}`)}&body=${encodeURIComponent(formattedBody)}`;
  };

  const buildMailtoUrl = () => {
    const s = formData.subject.trim() || "Portfolio Inquiry";
    const senderName = formData.name.trim() || "Visitor";
    const senderEmail = formData.email.trim() || "Not provided";
    const messageBody = formData.message.trim() || "";

    const formattedBody = [
      `Dear Hafsa Saeed,`,
      ``,
      `Sender Name: ${senderName}`,
      `Sender Email: ${senderEmail}`,
      `Subject: ${s}`,
      ``,
      `Message:`,
      `${messageBody}`,
      ``,
      `---`,
      `Reply directly to: ${senderEmail}`,
    ].join("\n");

    return `mailto:${encodeURIComponent(personalInfo.email)}?subject=${encodeURIComponent(`[Portfolio Inquiry] ${s} - from ${senderName}`)}&body=${encodeURIComponent(formattedBody)}`;
  };

  const buildWhatsappUrl = () => {
    const txt = `Hi Hafsa! I am ${formData.name || "a visitor"} (${formData.email || "email not specified"}). Regarding ${formData.subject || "your portfolio"}: ${formData.message || "Hello!"}`;
    return `https://wa.me/923275535987?text=${encodeURIComponent(txt)}`;
  };

  // 100% Reliable Method: Send via Gmail Web
  const handleSendViaGmailWeb = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      const composeUrl = buildGmailUrl();
      const mailto = buildMailtoUrl();
      const wa = buildWhatsappUrl();

      // Log asynchronously on the server archive
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch((err) => console.log("Background log note:", err));

      // Open Gmail compose in a new tab immediately
      window.open(composeUrl, "_blank", "noopener,noreferrer");

      setSubmissionMode("gmail_web");
      setSubmitted(true);
      setServerFeedback({
        success: true,
        delivered: true,
        message: `We opened Gmail Web in a new tab with your message pre-filled to hafsasaeed192@gmail.com. Just click "Send" in that Gmail tab to deliver it directly!`,
        gmailComposeUrl: composeUrl,
        mailtoUrl: mailto,
        whatsappUrl: wa,
      });
    }
  };

  // Alternative Method: Submit through the backend form endpoint
  const handleSendViaForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setIsSubmitting(true);
      setServerFeedback(null);
      setSubmissionMode("form_server");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        setSubmitted(true);

        if (response.ok && data.success) {
          setServerFeedback({
            success: true,
            delivered: data.delivered,
            needsActivation: data.needsActivation,
            message:
              data.message || "Your inquiry has been recorded successfully.",
            gmailComposeUrl: data.gmailComposeUrl || buildGmailUrl(),
            mailtoUrl: data.mailtoUrl || buildMailtoUrl(),
            whatsappUrl: data.whatsappUrl || buildWhatsappUrl(),
          });
        } else {
          setServerFeedback({
            success: false,
            delivered: false,
            message:
              data.error ||
              'Server dispatch could not deliver directly. Please use "Open in Gmail Web" below.',
            gmailComposeUrl: buildGmailUrl(),
            mailtoUrl: buildMailtoUrl(),
            whatsappUrl: buildWhatsappUrl(),
          });
        }
      } catch (err) {
        console.error("Submission error:", err);
        setSubmitted(true);
        setServerFeedback({
          success: true,
          delivered: false,
          message:
            'Your message was drafted! Click "Open in Gmail Web" below to send it directly.',
          gmailComposeUrl: buildGmailUrl(),
          mailtoUrl: buildMailtoUrl(),
          whatsappUrl: buildWhatsappUrl(),
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeLocation.query)}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeLocation.query)}`;

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquare className="w-4 h-4" />
            <span>Direct Messaging & Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Me
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm sm:text-base">
            Have an opportunity, collaboration request, or project inquiry? Send
            a message directly to my Gmail inbox or connect on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Contact Cards & Real Interactive Location Map */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-white/90 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                  Get In Touch
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Available for Hire
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                Connect directly through verified communication channels.
                Official emails arrive straight at{" "}
                <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {personalInfo.email}
                </strong>
                .
              </p>

              {/* Primary Email Card */}
              <a
                href={buildGmailUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-[#092218] border border-stone-200/80 dark:border-emerald-500/25 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-[#0d2e20] transition-all duration-200 hover:-translate-y-0.5 group shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center justify-between">
                    <span>Primary Gmail</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span>Compose</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-stone-900 dark:text-white truncate">
                    {personalInfo.email}
                  </div>
                </div>
              </a>

              {/* Phone Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-[#092218] border border-stone-200/80 dark:border-emerald-500/25 hover:border-emerald-500/50 transition-all duration-200 hover:-translate-y-0.5 group shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    Direct Phone Numbers
                  </div>
                  <div className="text-sm font-semibold text-stone-900 dark:text-white">
                    <a
                      href={`tel:${personalInfo.phone1}`}
                      className="hover:text-emerald-500 transition-colors"
                    >
                      {personalInfo.phone1}
                    </a>{" "}
                    <span className="text-stone-400">/</span>{" "}
                    <a
                      href={`tel:${personalInfo.phone2}`}
                      className="hover:text-emerald-500 transition-colors"
                    >
                      {personalInfo.phone2}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Quick Chat */}
              <a
                href={personalInfo.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Instant WhatsApp Chat (+92 327 5535987)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            {/* REAL INTERACTIVE LOCATION MAP CARD */}
            <div className="bg-white/90 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-5 sm:p-6 overflow-hidden shadow-xl backdrop-blur-md">
              {/* Header with Live PKT Clock */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200/80 dark:border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                      {activeLocation.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Punjab, Pakistan • 42200
                    </p>
                  </div>
                </div>

                {/* Live Pakistan Standard Time Widget */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-[#092218] border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-mono">
                  <Clock className="w-3.5 h-3.5 text-emerald-500 animate-spin-slow" />
                  <span className="font-semibold">
                    {pktTime || "PKT (UTC+5)"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              {/* Location Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-[#092218] rounded-xl mb-3 text-xs">
                {LOCATION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setActiveLocation(preset)}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all text-center cursor-pointer truncate ${
                      activeLocation.id === preset.id
                        ? "bg-white dark:bg-emerald-600 text-stone-900 dark:text-white shadow-xs font-semibold"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                    }`}
                  >
                    {preset.tag}
                  </button>
                ))}
              </div>

              {/* Interactive Google Maps Frame */}
              <div className="rounded-2xl overflow-hidden aspect-16/10 relative bg-stone-200 dark:bg-[#05140e] border border-emerald-500/25 shadow-inner group">
                <iframe
                  title={`Google Map - ${activeLocation.name}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(activeLocation.query)}&t=m&z=${activeLocation.zoom}&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Overlay Badge with Click to Expand */}
                <div className="absolute top-2.5 right-2.5 pointer-events-none">
                  <div className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 border border-white/10 shadow-md">
                    <Compass
                      className="w-3 h-3 text-emerald-400 animate-spin"
                      style={{ animationDuration: "8s" }}
                    />
                    <span>Live Interactive Map</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Under the Map */}
              <div className="mt-3.5 grid grid-cols-3 gap-2">
                <a
                  href={googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-[#092218] dark:hover:bg-[#0f3424] text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1 border border-emerald-500/20 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>

                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-[#092218] dark:hover:bg-[#0f3424] text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1 border border-emerald-500/20 transition-colors"
                >
                  <Navigation className="w-3 h-3 text-emerald-500" />
                  <span>Directions</span>
                </a>

                <button
                  onClick={handleCopyCoords}
                  className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#092218] dark:hover:bg-[#0f3424] text-stone-700 dark:text-stone-300 text-[11px] font-semibold flex items-center justify-center gap-1 border border-stone-200 dark:border-emerald-500/20 transition-colors cursor-pointer"
                >
                  {copiedCoords ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-stone-500" />
                      <span>GPS Coords</span>
                    </>
                  )}
                </button>
              </div>

              {/* Location Description note */}
              <div className="mt-3 p-3 rounded-xl bg-stone-50 dark:bg-[#092218]/60 border border-stone-200/70 dark:border-emerald-500/15 text-[11px] text-stone-600 dark:text-stone-400">
                <span className="font-semibold text-stone-900 dark:text-stone-200">
                  {activeLocation.name}:
                </span>{" "}
                {activeLocation.description}. Open for on-site projects across
                Mianwali / Punjab as well as worldwide remote full-stack roles.
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form with Dual Guaranteed Delivery Options */}
          <div className="lg:col-span-7">
            <div className="bg-white/90 dark:bg-[#071912] border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                  Send a Message to Hafsa Saeed
                </h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0 w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Direct to hafsasaeed192@gmail.com
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mb-6">
                Fill out the form below. You can send directly using our{" "}
                <strong>1-Click Gmail Web</strong> pathway (which guarantees
                100% immediate delivery into Hafsa's inbox) or dispatch via our
                online web server.
              </p>

              {submitted ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                    {submissionMode === "gmail_web"
                      ? "Gmail Web Compose Window Opened!"
                      : serverFeedback?.delivered
                        ? "Delivered Directly to Gmail!"
                        : "Message Recorded on Server!"}
                  </h4>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto leading-relaxed">
                    {serverFeedback?.message}
                  </p>

                  {/* If not delivered directly through SMTP/FormSubmit, guide to Gmail Web */}
                  {!serverFeedback?.delivered && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-xs text-amber-800 dark:text-amber-200 space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>
                          Recommended Step to Guarantee Direct Delivery:
                        </span>
                      </div>
                      <p>
                        Public cloud servers can sometimes be filtered by
                        Google's anti-spam rules. To ensure your message lands
                        directly in Hafsa's primary inbox right this second,
                        click the <strong>"Open in Gmail Web"</strong> button
                        below — your subject and message are already completely
                        pre-filled!
                      </p>
                    </div>
                  )}

                  {/* 1-Click Direct Sending Action Buttons */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={serverFeedback?.gmailComposeUrl || buildGmailUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer hover:-translate-y-0.5"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open Pre-filled in Gmail Web</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    <a
                      href={serverFeedback?.whatsappUrl || buildWhatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#092218] dark:hover:bg-[#0f3022] text-stone-800 dark:text-stone-100 text-xs sm:text-sm font-bold border border-emerald-500/25 transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-500" />
                      <span>Send on WhatsApp</span>
                    </a>
                  </div>

                  <div className="pt-4 border-t border-emerald-500/20">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setServerFeedback(null);
                        setSubmissionMode(null);
                        setFormData({
                          name: "",
                          email: "",
                          subject: "",
                          message: "",
                        });
                      }}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      ← Send another message or start new inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendViaForm} className="space-y-5">
                  {serverFeedback && !serverFeedback.success && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{serverFeedback.message}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name Field */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ayesha Khan"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
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

                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                        Your Email Address{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. ayesha@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
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
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Full Stack Project Collaboration / Hiring Inquiry"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject)
                          setErrors({ ...errors, subject: "" });
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-[#092218] border text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.subject
                          ? "border-rose-400"
                          : "border-stone-200 dark:border-emerald-500/25"
                      }`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Type your message here. You can send it directly to Hafsa's Gmail inbox or WhatsApp..."
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message)
                          setErrors({ ...errors, message: "" });
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

                  {/* ACTION BUTTONS: Primary 1-Click Gmail Web & Online Server Send */}
                  <div className="pt-2 space-y-3">
                    {/* Primary Button: 1-Click Gmail Web (100% Guaranteed Delivery) */}
                    <button
                      type="button"
                      onClick={handleSendViaGmailWeb}
                      className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer group"
                    >
                      <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>
                        Send via Gmail Web (100% Guaranteed Direct Delivery)
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </button>

                    {/* Secondary Row: Server Dispatch & WhatsApp */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#092218] dark:hover:bg-[#0f3223] text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 border border-stone-200 dark:border-emerald-500/25 transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <span>Dispatching...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Send via Web Form</span>
                          </>
                        )}
                      </button>

                      <a
                        href={buildWhatsappUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#092218] dark:hover:bg-[#0f3223] text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 border border-stone-200 dark:border-emerald-500/25 transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Instant WhatsApp</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>

                    <div className="text-[11px] text-center text-stone-500 dark:text-stone-400 pt-1">
                      <Sparkles className="w-3 h-3 inline text-emerald-500 mr-1" />
                      Tip: <strong>Send via Gmail Web</strong> opens your Gmail
                      with everything filled in, guaranteeing your email lands
                      directly in Hafsa's inbox without getting trapped by spam
                      filters.
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
