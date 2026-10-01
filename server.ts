import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import { createServer as createViteServer } from "vite";
import { storageController, getR2Client } from "./src/server/storageController";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve local uploaded videos, images, and documents
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// ==========================================
// Cloudflare R2 & Local Storage API Endpoints
// ==========================================
app.get("/api/storage/status", storageController.getStatus);
app.post("/api/storage/presign", storageController.getPresignedUrl);
app.post("/api/storage/multipart/init", storageController.initMultipart);
app.post("/api/storage/multipart/part-url", storageController.getPartUrl);
app.post("/api/storage/multipart/complete", storageController.completeMultipart);
app.post("/api/storage/multipart/abort", storageController.abortMultipart);

// Direct raw upload handler for local server storage (videos & files up to 500MB)
app.put(
  "/api/storage/local-upload",
  express.raw({ type: "*/*", limit: "500mb" }),
  async (req, res) => {
    try {
      const rawKey = req.query.key as string;
      if (!rawKey) {
        return res.status(400).json({ error: "Storage key required" });
      }

      // Sanitize key to prevent path traversal
      const safeKey = rawKey.replace(/\.\./g, "").replace(/^\//, "");
      const fullPath = path.join(uploadsDir, safeKey);

      await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.promises.writeFile(fullPath, req.body);

      const publicUrl = `/uploads/${safeKey}`;
      console.log(`[Local Upload Succeeded]: ${publicUrl} (${req.body?.length || 0} bytes)`);

      return res.json({
        success: true,
        publicUrl,
        key: safeKey,
      });
    } catch (err: any) {
      console.error("[Local Upload Error]:", err);
      return res.status(500).json({ error: err.message || "Failed to save file on server" });
    }
  }
);

// High-speed server-relayed upload (Bypasses all browser CORS restrictions and uploads directly to R2)
app.post(
  "/api/storage/server-upload",
  express.raw({ type: "*/*", limit: "500mb" }),
  async (req, res) => {
    try {
      const rawKey = req.query.key as string;
      const contentType = (req.headers["content-type"] as string) || "application/octet-stream";

      if (!rawKey) {
        return res.status(400).json({ error: "Storage key required" });
      }

      const safeKey = rawKey.replace(/\.\./g, "").replace(/^\//, "");
      const r2 = getR2Client();

      if (r2) {
        // Direct Server-to-R2 upload with credentials (100% immune to browser CORS!)
        const command = new PutObjectCommand({
          Bucket: r2.bucketName,
          Key: safeKey,
          Body: req.body,
          ContentType: contentType,
        });

        await r2.client.send(command);

        const publicUrl = r2.publicBaseUrl.endsWith("/")
          ? `${r2.publicBaseUrl}${safeKey}`
          : `${r2.publicBaseUrl}/${safeKey}`;

        console.log(`[R2 Direct Upload via Server Succeeded]: ${publicUrl} (${req.body?.length || 0} bytes)`);

        return res.json({
          success: true,
          publicUrl,
          key: safeKey,
          storage: "r2",
        });
      } else {
        // Local server storage fallback
        const fullPath = path.join(uploadsDir, safeKey);
        await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.promises.writeFile(fullPath, req.body);

        const publicUrl = `/uploads/${safeKey}`;
        console.log(`[Local Upload via Server Succeeded]: ${publicUrl} (${req.body?.length || 0} bytes)`);

        return res.json({
          success: true,
          publicUrl,
          key: safeKey,
          storage: "local",
        });
      }
    } catch (err: any) {
      console.error("[Server Upload Error]:", err);
      return res.status(500).json({ error: err.message || "Failed to upload file to storage" });
    }
  }
);

// ==========================================
// Supabase Database Diagnostic Endpoints
// ==========================================
app.get("/api/supabase/status", async (req, res) => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    return res.json({
      connected: false,
      tablesReady: false,
      message: "Supabase URL and API Key not configured.",
    });
  }

  try {
    const checkRes = await fetch(`${supabaseUrl}/rest/v1/projects?select=id&limit=1`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (checkRes.ok) {
      return res.json({
        connected: true,
        tablesReady: true,
        projectUrl: supabaseUrl,
        message: "Database tables are ready and accessible in Supabase!",
      });
    }

    const errJson = await checkRes.json();
    const isTableMissing =
      errJson?.code === "PGRST205" ||
      errJson?.message?.toLowerCase().includes("schema cache") ||
      errJson?.message?.toLowerCase().includes("could not find the table");

    const isPermissionDenied =
      errJson?.code === "42501" ||
      errJson?.message?.toLowerCase().includes("permission denied");

    return res.json({
      connected: true,
      tablesReady: false,
      isTableMissing,
      isPermissionDenied,
      projectUrl: supabaseUrl,
      sqlEditorUrl: `https://supabase.com/dashboard/project/fabsnyxmgwaelwrbcrfe/sql/new`,
      message: isPermissionDenied
        ? "Tables exist in Supabase, but API permissions need to be enabled. Run fix-permissions.sql in Supabase SQL Editor."
        : isTableMissing
        ? "Tables not found in Supabase database yet. Please run supabase-schema.sql in the Supabase SQL Editor."
        : errJson?.message || "Error querying Supabase.",
    });
  } catch (err: any) {
    return res.json({
      connected: false,
      tablesReady: false,
      message: err.message || "Failed to connect to Supabase endpoint.",
    });
  }
});

// Endpoint to fetch fix-permissions SQL text
app.get("/api/supabase/fix-permissions-sql", async (req, res) => {
  try {
    const sqlPath = path.join(process.cwd(), "fix-permissions.sql");
    const sqlContent = await fs.promises.readFile(sqlPath, "utf-8");
    return res.json({ success: true, sql: sqlContent });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint to fetch schema SQL text for quick 1-click clipboard copy
app.get("/api/supabase/schema-sql", async (req, res) => {
  try {
    const sqlPath = path.join(process.cwd(), "supabase-schema.sql");
    const sqlContent = await fs.promises.readFile(sqlPath, "utf-8");
    return res.json({ success: true, sql: sqlContent });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Portfolio Supabase Backend Proxy Endpoints
// ==========================================
function getSupabaseServer() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function formatProjectRow(row: any) {
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title || "Untitled Project",
    category: row.category || "fullstack",
    description: row.description || "",
    longDescription: row.long_description || row.description || "",
    image: row.image || "/projects/placeholder.jpg",
    tags: Array.isArray(row.tags) ? row.tags : [],
    features: Array.isArray(row.features) ? row.features : [],
    liveUrl: row.live_url || undefined,
    githubUrl: row.github_url || undefined,
    videoUrl: row.video_url || undefined,
    screenshots: Array.isArray(row.screenshots) ? row.screenshots : [],
    featured: Boolean(row.featured),
    displayOrder: typeof row.display_order === "number" ? row.display_order : 99,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Fetch all projects directly from Supabase
app.get("/api/portfolio/projects", async (req, res) => {
  const supabase = getSupabaseServer();
  if (!supabase) {
    return res.json({ projects: [] });
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("[Fetch projects error from Supabase]:", error);
      return res.json({ projects: [] });
    }

    return res.json({ projects: (data || []).map(formatProjectRow) });
  } catch (err: any) {
    console.error("[Fetch projects failed]:", err);
    return res.json({ projects: [] });
  }
});

// Create or update a project in Supabase (Handles missing screenshots column gracefully)
app.post("/api/portfolio/projects", async (req, res) => {
  const supabase = getSupabaseServer();
  const project = req.body;
  if (!project || !project.id || !project.title) {
    return res.status(400).json({ error: "Missing project id or title" });
  }

  if (!supabase) {
    return res.json({ success: true, localOnly: true, project });
  }

  try {
    const payload: Record<string, any> = {
      id: project.id,
      slug: project.slug || project.id.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      title: project.title,
      category: project.category || "fullstack",
      description: project.description || "",
      long_description: project.longDescription || project.description || "",
      image: project.image || "/projects/placeholder.jpg",
      tags: Array.isArray(project.tags) ? project.tags : [],
      features: Array.isArray(project.features) ? project.features : [],
      live_url: project.liveUrl || null,
      github_url: project.githubUrl || null,
      video_url: project.videoUrl || null,
      featured: Boolean(project.featured),
      display_order: typeof project.displayOrder === "number" ? project.displayOrder : 0,
      updated_at: new Date().toISOString(),
    };

    if (Array.isArray(project.screenshots) && project.screenshots.length > 0) {
      payload.screenshots = project.screenshots;
    }

    // Try upserting with screenshots
    let { data, error } = await supabase.from("projects").upsert(payload, { onConflict: "id" }).select();

    // If screenshots column does not exist in schema, retry without it
    if (error && (error.code === "PGRST204" || error.message.includes("screenshots"))) {
      delete payload.screenshots;
      const retry = await supabase.from("projects").upsert(payload, { onConflict: "id" }).select();
      error = retry.error;
      data = retry.data;
    }

    if (error) {
      console.error("[Supabase save project error]:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`[Supabase Project Saved Successfully]: ${project.id} - ${project.title}`);
    return res.json({ success: true, project: data?.[0] ? formatProjectRow(data[0]) : project });
  } catch (err: any) {
    console.error("[API Project Save Error]:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete a project from Supabase
app.delete("/api/portfolio/projects/:id", async (req, res) => {
  const supabase = getSupabaseServer();
  const { id } = req.params;
  if (supabase) {
    try {
      await supabase.from("projects").delete().eq("id", id);
      console.log(`[Supabase Project Deleted]: ${id}`);
    } catch (err) {
      console.warn("[Delete project error]:", err);
    }
  }
  return res.json({ success: true, id });
});

// In-memory archive for submitted inquiries so no inquiry is ever lost
interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  deliveredViaSMTP: boolean;
}

const messageArchive: StoredMessage[] = [];

// Helper to save message to Supabase PostgreSQL if configured
async function saveToSupabase(record: StoredMessage) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        id: record.id,
        name: record.name,
        email: record.email,
        subject: record.subject,
        message: record.message,
        is_read: false,
        delivered_via_smtp: record.deliveredViaSMTP,
        created_at: record.createdAt,
      }),
    });
    if (!res.ok) {
      console.warn("[Supabase contact save notice]:", await res.text());
    } else {
      console.log(`[Supabase]: Contact message saved for ${record.name}`);
    }
  } catch (err) {
    console.warn("[Supabase contact save error]:", err);
  }
}

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    recipient: "hafsasaeed1074@gmail.com",
    archivedCount: messageArchive.length,
  });
});

// Endpoint to view received inquiries
app.get("/api/messages", (req, res) => {
  res.json({
    total: messageArchive.length,
    messages: messageArchive,
  });
});

// API endpoint for Contact form submissions
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Please fill in all fields (name, email, subject, message).",
      });
    }

    const targetRecipient =
      process.env.RECIPIENT_EMAIL || "hafsasaeed1074@gmail.com";
    const gmailUser = process.env.GMAIL_USER || "hafsasaeed1074@gmail.com";
    const gmailPass = (
      process.env.GMAIL_APP_PASSWORD ||
      process.env.EMAIL_PASS ||
      ""
    ).trim();

    // Prepare direct 1-click fallback URLs
    const formattedSubject = `[Portfolio Inquiry] ${subject} - from ${name}`;
    const formattedBody = [
      `Dear Hafsa,`,
      ``,
      `You have received a new inquiry from your portfolio website:`,
      ``,
      `═══════════════════════════════════════`,
      `👤 SENDER DETAILS`,
      `• Name: ${name}`,
      `• Email: ${email}`,
      `═══════════════════════════════════════`,
      `📋 INQUIRY SUBJECT:`,
      `${subject}`,
      ``,
      `💬 MESSAGE:`,
      `${message}`,
      ``,
      `═══════════════════════════════════════`,
      `HOW TO REPLY:`,
      `Hit 'Reply' in your email client or reply directly to ${email}.`,
      `═══════════════════════════════════════`,
      `Sent via Hafsa Saeed's Portfolio Website.`,
    ].join("\n");

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetRecipient)}&su=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(targetRecipient)}?subject=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
    const whatsappUrl = `https://wa.me/923275535987?text=${encodeURIComponent(`Hi Hafsa! I am ${name} (${email}). ${subject}: ${message}`)}`;

    // Store in message archive immediately
    const record: StoredMessage = {
      id: `msg_${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      deliveredViaSMTP: false,
    };
    messageArchive.unshift(record);
    saveToSupabase(record);

    console.log(
      `[Contact Form Received] From: ${name} <${email}> | Subject: ${subject}`,
    );

    // If a Gmail password or App Password is provided, try sending via Nodemailer
    if (gmailPass && gmailPass.length > 5) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        const mailOptions = {
          from: `"${name} via Portfolio" <${gmailUser}>`,
          replyTo: email,
          to: targetRecipient,
          subject: formattedSubject,
          text: formattedBody,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #10b981; border-radius: 16px; background-color: #ffffff; color: #1f2937;">
              <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 20px; border-radius: 12px; text-align: center; color: #ffffff;">
                <h2 style="margin: 0; font-size: 22px;">New Portfolio Message!</h2>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Hafsa Saeed - Portfolio Contact Form</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
                <p style="margin: 6px 0;"><strong>Sender Name:</strong> ${name}</p>
                <p style="margin: 6px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #059669;">${email}</a></p>
                <p style="margin: 6px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 6px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
              </div>

              <div style="margin-top: 20px;">
                <h3 style="color: #065f46; margin-bottom: 8px; font-size: 16px;">Message Content:</h3>
                <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; border-radius: 8px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
              </div>

              <div style="margin-top: 25px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                <p>Direct reply is configured to <strong>${email}</strong>. Simply click "Reply" in your email client.</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        record.deliveredViaSMTP = true;
        console.log(
          `[Email Sent Successfully] Delivered to ${targetRecipient}`,
        );

        return res.json({
          success: true,
          delivered: true,
          message:
            "Your message has been delivered directly to Hafsa Saeed at hafsasaeed1074@gmail.com!",
          gmailComposeUrl,
          mailtoUrl,
          whatsappUrl,
        });
      } catch (smtpErr: any) {
        console.warn(
          "[Gmail SMTP Notice]: Google SMTP rejected login credentials.",
          smtpErr?.message,
        );

        // Detect Google 535 Bad Credentials / App Password requirement
        const isBadCredentials =
          smtpErr?.code === "EAUTH" ||
          String(smtpErr?.message || "").includes("535") ||
          String(smtpErr?.message || "").includes("BadCredentials");

        return res.json({
          success: true,
          delivered: false,
          authNotice: true,
          isBadCredentials,
          message: isBadCredentials
            ? "Your message was successfully logged! Note: Google requires a 16-character App Password for direct SMTP. You can also click the button below to send directly via Gmail Web."
            : "Your message was saved! You can also click below to open in Gmail directly.",
          gmailComposeUrl,
          mailtoUrl,
          whatsappUrl,
        });
      }
    }

    // Try FormSubmit email forwarder (free service delivering to targetRecipient)
    try {
      const formSubmitRes = await fetch(
        `https://formsubmit.co/ajax/${targetRecipient}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Referer:
              (req.headers.referer as string) ||
              (req.headers.origin as string) ||
              "https://hafsasaeed-portfolio.app",
            Origin:
              (req.headers.origin as string) ||
              "https://hafsasaeed-portfolio.app",
            "User-Agent": "Mozilla/5.0 (Portfolio-Contact-Service)",
          },
          body: JSON.stringify({
            name,
            email,
            _replyto: email,
            _subject: formattedSubject,
            message,
            _captcha: "false",
          }),
        },
      );

      const formSubmitData: any = await formSubmitRes.json();
      console.log("[FormSubmit response]:", formSubmitData);

      if (
        formSubmitData &&
        (formSubmitData.success === "true" || formSubmitData.success === true)
      ) {
        record.deliveredViaSMTP = true;
        return res.json({
          success: true,
          delivered: true,
          provider: "FormSubmit",
          message:
            "Your message has been delivered directly to Hafsa Saeed at hafsasaeed1074@gmail.com!",
          gmailComposeUrl,
          mailtoUrl,
          whatsappUrl,
        });
      } else if (
        formSubmitData &&
        formSubmitData.message &&
        formSubmitData.message.includes("Activation")
      ) {
        return res.json({
          success: true,
          delivered: false,
          needsActivation: true,
          message:
            'Your message was logged on the server. FormSubmit sent a one-time activation email to hafsasaeed1074@gmail.com. Once activated, automated emails will deliver automatically. To send immediately right now, click "Open in Gmail Web" below!',
          gmailComposeUrl,
          mailtoUrl,
          whatsappUrl,
        });
      }
    } catch (fsErr) {
      console.warn("[FormSubmit fallback error]:", fsErr);
    }

    // Fallback if neither SMTP nor FormSubmit was activated yet
    console.log(`[Message Saved to Server Archive] From: ${name} (${email})`);

    return res.json({
      success: true,
      delivered: false,
      isSimulated: true,
      message:
        'Your message was recorded on the server! To deliver it directly to Hafsa\'s Gmail inbox right now, click "Send via Gmail Web" below (everything is prefilled).',
      gmailComposeUrl,
      mailtoUrl,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error("Error handling contact submission:", error);
    return res.status(500).json({
      success: false,
      error:
        "An error occurred while handling your message. Please reach out directly on WhatsApp or Gmail.",
    });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
  server.timeout = 600000;
  server.keepAliveTimeout = 610000;
}

startServer();
