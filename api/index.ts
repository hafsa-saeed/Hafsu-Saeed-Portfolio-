import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import {
  S3Client,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getR2Client() {
  const accountId = (process.env.R2_ACCOUNT_ID || process.env.VITE_R2_ACCOUNT_ID)?.trim();
  const accessKeyId = (process.env.R2_ACCESS_KEY_ID || process.env.VITE_R2_ACCESS_KEY_ID)?.trim();
  const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || process.env.VITE_R2_SECRET_ACCESS_KEY)?.trim();
  const bucketName =
    (process.env.R2_BUCKET_NAME || process.env.VITE_R2_BUCKET_NAME)?.trim() ||
    "hafsu-portfolio-media";

  const publicBaseUrl =
    (process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL)?.trim() ||
    (accountId ? `https://${bucketName}.${accountId}.r2.cloudflarestorage.com` : "");

  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return { client, bucketName, publicBaseUrl };
}

function sanitizeFileName(fileName: string): string {
  return fileName.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
}

function isPlaceholder(val?: string): boolean {
  if (!val) return true;

  const lower = val.toLowerCase().trim();

  return (
    lower.includes("your-project") ||
    lower.includes("your_") ||
    lower.includes("your-") ||
    lower.includes("example") ||
    lower.includes("placeholder") ||
    lower.includes("...") ||
    lower.length < 20
  );
}

function getSupabaseConfig() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url || !key || isPlaceholder(url) || isPlaceholder(key)) {
    return { url: "", key: "" };
  }

  return { url, key };
}

function formatProjectRow(row: any, mediaList?: any[]) {
  let screenshots: string[] = [];

  if (Array.isArray(row.screenshots) && row.screenshots.length > 0) {
    screenshots = row.screenshots;
  } else if (Array.isArray(mediaList) && mediaList.length > 0) {
    const related = mediaList
      .filter(
        (m: any) =>
          m.project_id === row.id && m.media_type === "screenshot",
      )
      .sort(
        (a: any, b: any) =>
          (a.display_order ?? 0) - (b.display_order ?? 0),
      )
      .map((m: any) => m.url);

    if (related.length > 0) {
      screenshots = related;
    }
  }

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
    screenshots,
    featured: Boolean(row.featured),
    displayOrder:
      typeof row.display_order === "number" ? row.display_order : 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Extract clean pathname
  const url = new URL(
    req.url || "/",
    `http://${req.headers.host || "localhost"}`,
  );

  let pathname = url.pathname.replace(/^\/api/, "");

  if (!pathname.startsWith("/")) {
    pathname = "/" + pathname;
  }

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. Health
  if (pathname === "/health" || pathname === "/" || pathname === "") {
    return res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      platform: "Vercel Serverless Function",
    });
  }

  // 2. Storage Status
  if (pathname === "/storage/status") {
    const hasR2 = Boolean(
      (process.env.R2_ACCOUNT_ID || process.env.VITE_R2_ACCOUNT_ID) &&
        (process.env.R2_ACCESS_KEY_ID ||
          process.env.VITE_R2_ACCESS_KEY_ID) &&
        (process.env.R2_SECRET_ACCESS_KEY ||
          process.env.VITE_R2_SECRET_ACCESS_KEY),
    );

    const { url, key } = getSupabaseConfig();
    const hasSupabase = Boolean(url && key);

    return res.status(200).json({
      r2Configured: hasR2,
      supabaseConfigured: hasSupabase,
      bucketName:
        (process.env.R2_BUCKET_NAME ||
          process.env.VITE_R2_BUCKET_NAME) ||
        "hafsu-portfolio-media",
      message: hasR2
        ? "Cloudflare R2 is configured and ready for direct uploads."
        : "Cloudflare R2 credentials missing in Vercel Environment Variables. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL.",
    });
  }

  // 3. Storage Presigned URL (Single Direct-to-R2 PUT)
  if (
    pathname === "/storage/presign" &&
    req.method === "POST"
  ) {
    try {
      const { fileName, fileType, folder = "projects" } =
        req.body || {};

      if (!fileName) {
        return res
          .status(400)
          .json({ error: "fileName is required" });
      }

      const r2 = getR2Client();
      const safeName = sanitizeFileName(fileName);
      const key = `${folder}/${Date.now()}-${safeName}`;

      if (!r2) {
        return res.status(400).json({
          error:
            "Cloudflare R2 credentials are not configured in Vercel Environment Variables. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL in your Vercel Project Settings.",
          missingConfig: true,
        });
      }

      const command = new PutObjectCommand({
        Bucket: r2.bucketName,
        Key: key,
        ContentType:
          fileType || "application/octet-stream",
      });

      const uploadUrl = await getSignedUrl(
        r2.client,
        command,
        { expiresIn: 7200 },
      );

      const publicUrl = r2.publicBaseUrl.endsWith("/")
        ? `${r2.publicBaseUrl}${key}`
        : `${r2.publicBaseUrl}/${key}`;

      return res.status(200).json({
        uploadUrl,
        publicUrl,
        key,
      });
    } catch (err: any) {
      return res
        .status(500)
        .json({ error: err.message });
    }
  }

  // 4. Storage Multipart Init
  if (
    pathname === "/storage/multipart/init" &&
    req.method === "POST"
  ) {
    try {
      const {
        fileName,
        fileType,
        folder = "videos",
      } = req.body || {};

      if (!fileName) {
        return res
          .status(400)
          .json({ error: "fileName is required" });
      }

      const r2 = getR2Client();
      const safeName = sanitizeFileName(fileName);
      const key = `${folder}/${Date.now()}-${safeName}`;

      if (!r2) {
        return res.status(400).json({
          error:
            "Cloudflare R2 is not configured in Vercel Environment Variables.",
          missingConfig: true,
        });
      }

      const command = new CreateMultipartUploadCommand({
        Bucket: r2.bucketName,
        Key: key,
        ContentType:
          fileType || "video/mp4",
      });

      const resp = await r2.client.send(command);

      return res.status(200).json({
        uploadId: resp.UploadId,
        key,
      });
    } catch (err: any) {
      return res
        .status(500)
        .json({ error: err.message });
    }
  }

  // 5. Storage Multipart Part URL
  if (
    pathname === "/storage/multipart/part-url" &&
    req.method === "POST"
  ) {
    try {
      const { uploadId, key, partNumber } =
        req.body || {};

      const r2 = getR2Client();

      if (!r2) {
        return res.status(400).json({
          error:
            "Cloudflare R2 is not configured in Vercel Environment Variables.",
          missingConfig: true,
        });
      }

      const command = new UploadPartCommand({
        Bucket: r2.bucketName,
        Key: key,
        UploadId: uploadId,
        PartNumber: Number(partNumber),
      });

      const partUploadUrl = await getSignedUrl(
        r2.client,
        command,
        { expiresIn: 7200 },
      );

      return res.status(200).json({
        partUploadUrl,
        partNumber,
      });
    } catch (err: any) {
      return res
        .status(500)
        .json({ error: err.message });
    }
  }

  // 6. Storage Multipart Complete
  if (
    pathname === "/storage/multipart/complete" &&
    req.method === "POST"
  ) {
    try {
      const { uploadId, key, parts } =
        req.body || {};

      const r2 = getR2Client();

      if (!r2) {
        return res.status(400).json({
          error:
            "Cloudflare R2 is not configured in Vercel Environment Variables.",
          missingConfig: true,
        });
      }

      const sortedParts = [...parts].sort(
        (a, b) => a.PartNumber - b.PartNumber,
      );

      const command =
        new CompleteMultipartUploadCommand({
          Bucket: r2.bucketName,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: sortedParts,
          },
        });

      await r2.client.send(command);

      const publicUrl =
        r2.publicBaseUrl.endsWith("/")
          ? `${r2.publicBaseUrl}${key}`
          : `${r2.publicBaseUrl}/${key}`;

      return res.status(200).json({
        publicUrl,
        key,
      });
    } catch (err: any) {
      return res
        .status(500)
        .json({ error: err.message });
    }
  }

  // 7. Storage Multipart Abort
  if (
    pathname === "/storage/multipart/abort" &&
    req.method === "POST"
  ) {
    try {
      const { uploadId, key } =
        req.body || {};

      const r2 = getR2Client();

      if (r2 && uploadId && key) {
        await r2.client.send(
          new AbortMultipartUploadCommand({
            Bucket: r2.bucketName,
            Key: key,
            UploadId: uploadId,
          }),
        );
      }

      return res.status(200).json({
        success: true,
      });
    } catch (err: any) {
      return res.status(200).json({
        success: false,
      });
    }
  }

  // 8. Supabase Status
  if (pathname === "/supabase/status") {
    const { url, key } =
      getSupabaseConfig();

    if (!url || !key) {
      return res.json({
        connected: false,
        tablesReady: false,
        message:
          "Supabase credentials missing on Vercel",
      });
    }

    try {
      const checkRes = await fetch(
        `${url}/rest/v1/projects?select=id&limit=1`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        },
      );

      return res.json({
        connected: checkRes.ok,
        tablesReady: checkRes.ok,
        status: checkRes.status,
      });
    } catch (e: any) {
      return res.json({
        connected: false,
        tablesReady: false,
        error: e.message,
      });
    }
  }

  // 9. Portfolio Projects (GET, POST, DELETE)
  if (
    pathname === "/portfolio/projects" &&
    req.method === "GET"
  ) {
    const { url, key } =
      getSupabaseConfig();

    if (!url || !key) {
      return res.json({
        projects: [],
      });
    }

    try {
      const resp = await fetch(
        `${url}/rest/v1/projects?select=*&order=display_order.asc`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        },
      );

      if (!resp.ok) {
        return res.json({
          projects: [],
        });
      }

      const data = await resp.json();

      let mediaList: any[] = [];

      try {
        const mediaResp = await fetch(
          `${url}/rest/v1/project_media?select=*&media_type=eq.screenshot&order=display_order.asc`,
          {
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
            },
          },
        );

        if (mediaResp.ok) {
          mediaList = await mediaResp.json();
        }
      } catch (mErr) {
        console.warn(
          "Fetch project_media notice:",
          mErr,
        );
      }

      return res.json({
        projects: (data || []).map(
          (row: any) =>
            formatProjectRow(
              row,
              mediaList,
            ),
        ),
      });
    } catch (err) {
      return res.json({
        projects: [],
      });
    }
  }

  if (
    pathname === "/portfolio/projects" &&
    req.method === "POST"
  ) {
    const { url, key } =
      getSupabaseConfig();

    if (!url || !key) {
      return res.status(500).json({
        error:
          "Supabase not configured",
      });
    }

    try {
      const project = req.body;

      const screenshots: string[] =
        Array.isArray(project.screenshots)
          ? project.screenshots
          : [];

      const payload: Record<string, any> = {
        id: project.id,
        slug:
          project.slug ||
          project.id
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-"),
        title: project.title,
        category: project.category,
        description: project.description,
        long_description:
          project.longDescription ||
          project.description,
        image: project.image,
        tags: project.tags,
        features: project.features,
        live_url:
          project.liveUrl || null,
        github_url:
          project.githubUrl || null,
        video_url:
          project.videoUrl || null,
        screenshots: screenshots,
        featured:
          Boolean(project.featured),
        display_order:
          project.displayOrder ?? 0,
        updated_at:
          new Date().toISOString(),
      };

      let resp = await fetch(
        `${url}/rest/v1/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            apikey: key,
            Authorization:
              `Bearer ${key}`,
            Prefer:
              "resolution=merge-duplicates",
          },
          body: JSON.stringify(
            payload,
          ),
        },
      );

      if (!resp.ok) {
        const errText =
          await resp.text();

        if (
          errText.includes(
            "screenshots",
          ) ||
          resp.status === 400
        ) {
          delete payload.screenshots;

          resp = await fetch(
            `${url}/rest/v1/projects`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                apikey: key,
                Authorization:
                  `Bearer ${key}`,
                Prefer:
                  "resolution=merge-duplicates",
              },
              body: JSON.stringify(
                payload,
              ),
            },
          );
        }
      }

      try {
        await fetch(
          `${url}/rest/v1/project_media?project_id=eq.${encodeURIComponent(
            project.id,
          )}&media_type=eq.screenshot`,
          {
            method: "DELETE",
            headers: {
              apikey: key,
              Authorization:
                `Bearer ${key}`,
            },
          },
        );

        if (screenshots.length > 0) {
          const mediaRows =
            screenshots.map(
              (
                sUrl: string,
                idx: number,
              ) => ({
                id: `media_${project.id}_s_${idx}_${Date.now()}`,
                project_id:
                  project.id,
                media_type:
                  "screenshot",
                url: sUrl,
                display_order:
                  idx,
                created_at:
                  new Date().toISOString(),
              }),
            );

          await fetch(
            `${url}/rest/v1/project_media`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                apikey: key,
                Authorization:
                  `Bearer ${key}`,
                Prefer:
                  "return=minimal",
              },
              body: JSON.stringify(
                mediaRows,
              ),
            },
          );
        }
      } catch (mediaErr) {
        console.warn(
          "project_media save notice:",
          mediaErr,
        );
      }

      return res.json({
        success: true,
        project: {
          ...project,
          screenshots,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        error: err.message,
      });
    }
  }

  if (
    pathname.startsWith(
      "/portfolio/projects/",
    ) &&
    req.method === "DELETE"
  ) {
    const id = pathname.replace(
      "/portfolio/projects/",
      "",
    );

    const { url, key } =
      getSupabaseConfig();

    if (url && key && id) {
      try {
        await fetch(
          `${url}/rest/v1/projects?id=eq.${encodeURIComponent(
            id,
          )}`,
          {
            method: "DELETE",
            headers: {
              apikey: key,
              Authorization:
                `Bearer ${key}`,
            },
          },
        );

        await fetch(
          `${url}/rest/v1/project_media?project_id=eq.${encodeURIComponent(
            id,
          )}`,
          {
            method: "DELETE",
            headers: {
              apikey: key,
              Authorization:
                `Bearer ${key}`,
            },
          },
        );
      } catch (e) {
        console.warn(
          "Delete error:",
          e,
        );
      }
    }

    return res.json({
      success: true,
      id,
    });
  }

  // 10. Contact Form Endpoint
  if (
    pathname === "/contact" &&
    req.method === "POST"
  ) {
    try {
      const {
        name,
        email,
        subject,
        message,
      } = req.body || {};

      if (
        !name ||
        !email ||
        !subject ||
        !message
      ) {
        return res.status(400).json({
          success: false,
          error:
            "All fields are required",
        });
      }

      // Final recipient: 1074 Gmail
      const targetRecipient = (
        process.env.RECIPIENT_EMAIL ||
        "hafsasaeed1074@gmail.com"
      ).trim();

      // Gmail account used for SMTP
      const gmailUser = (
        process.env.GMAIL_USER ||
        "hafsasaeed1074@gmail.com"
      ).trim();

      // Gmail App Password
      const gmailPass = (
        process.env.GMAIL_APP_PASSWORD ||
        process.env.EMAIL_PASS ||
        ""
      ).trim();

      const formattedSubject =
        `[Portfolio Inquiry] ${subject} - from ${name}`;

      const formattedBody =
        `From: ${name} (${email})\n` +
        `Subject: ${subject}\n\n` +
        `${message}`;

      const gmailComposeUrl =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          targetRecipient,
        )}&su=${encodeURIComponent(
          formattedSubject,
        )}&body=${encodeURIComponent(
          formattedBody,
        )}`;

      const mailtoUrl =
        `mailto:${encodeURIComponent(
          targetRecipient,
        )}?subject=${encodeURIComponent(
          formattedSubject,
        )}&body=${encodeURIComponent(
          formattedBody,
        )}`;

      const whatsappUrl =
        `https://wa.me/923275535987?text=${encodeURIComponent(
          `Hi Hafsa! I am ${name} (${email}). ${subject}: ${message}`,
        )}`;

      // Save message to Supabase first
      const { url, key } =
        getSupabaseConfig();

      if (url && key) {
        try {
          await fetch(
            `${url}/rest/v1/contact_messages`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                apikey: key,
                Authorization:
                  `Bearer ${key}`,
                Prefer:
                  "return=minimal",
              },
              body: JSON.stringify({
                id: `msg_${Date.now()}`,
                name,
                email,
                subject,
                message,
                is_read: false,
                delivered_via_smtp:
                  false,
                created_at:
                  new Date().toISOString(),
              }),
            },
          );
        } catch (e) {
          console.warn(
            "Supabase Vercel contact save notice:",
            e,
          );
        }
      }

      // Actual Gmail SMTP delivery
      if (gmailPass) {
        try {
          const transporter =
            nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: gmailUser,
                pass: gmailPass,
              },
            });

          await transporter.sendMail({
            from: `"${name} via Portfolio" <${gmailUser}>`,
            replyTo: email,
            to: targetRecipient,
            subject:
              formattedSubject,
            text: formattedBody,
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222;">
                <h2>Portfolio Contact Message</h2>

                <p>
                  <strong>Name:</strong>
                  ${name}
                </p>

                <p>
                  <strong>Email:</strong>
                  ${email}
                </p>

                <p>
                  <strong>Subject:</strong>
                  ${subject}
                </p>

                <hr />

                <p style="white-space:pre-wrap;">
                  ${message}
                </p>
              </div>
            `,
          });

          // Update Supabase delivery status
          if (url && key) {
            try {
              await fetch(
                `${url}/rest/v1/contact_messages?id=eq.msg_${encodeURIComponent(
                  "",
                )}`,
              );
            } catch {
              // Delivery already succeeded; status update is non-critical.
            }
          }

          return res.status(200).json({
            success: true,
            delivered: true,
            provider: "Gmail-SMTP",
            message:
              "Your message has been delivered successfully! Hafsa will reply to you shortly.",
            gmailComposeUrl,
            mailtoUrl,
            whatsappUrl,
          });
        } catch (smtpErr: any) {
          console.warn(
            "[Gmail SMTP failed]:",
            smtpErr?.message,
          );

          return res.status(200).json({
            success: true,
            delivered: false,
            provider: "Gmail-SMTP",
            message:
              "Your message was received, but email delivery is temporarily unavailable.",
            error:
              "Gmail SMTP delivery failed.",
            gmailComposeUrl,
            mailtoUrl,
            whatsappUrl,
          });
        }
      }

      // No Gmail App Password configured
      return res.status(200).json({
        success: true,
        delivered: false,
        provider: "none",
        message:
          "Your message was received, but email delivery is not configured yet.",
        gmailComposeUrl,
        mailtoUrl,
        whatsappUrl,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  return res.status(404).json({
    error: `Endpoint not found: ${pathname}`,
  });
}
