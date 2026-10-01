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
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || "hafsa-portfolio";
  const publicBaseUrl =
    process.env.R2_PUBLIC_URL ||
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract path
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname.replace(/^\/api/, "");

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. Health
  if (pathname === "/health" || pathname === "") {
    return res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      platform: "Vercel Serverless Function",
    });
  }

  // 2. Storage Status
  if (pathname === "/storage/status") {
    const hasR2 = Boolean(
      process.env.R2_ACCOUNT_ID &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_ACCESS_KEY,
    );
    const hasSupabase = Boolean(
      (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL) &&
        (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY),
    );
    return res.status(200).json({
      r2Configured: hasR2,
      supabaseConfigured: hasSupabase,
      bucketName: process.env.R2_BUCKET_NAME || "hafsa-portfolio",
    });
  }

  // 3. Storage Presigned URL (Single Put)
  if (pathname === "/storage/presign" && req.method === "POST") {
    try {
      const { fileName, fileType, folder = "projects" } = req.body || {};
      if (!fileName) return res.status(400).json({ error: "fileName is required" });

      const r2 = getR2Client();
      const safeName = sanitizeFileName(fileName);
      const key = `${folder}/${Date.now()}-${safeName}`;

      if (!r2) {
        return res.status(200).json({
          fallback: true,
          key,
          uploadUrl: `/api/storage/mock-upload?key=${encodeURIComponent(key)}`,
          publicUrl: `/projects/${safeName}`,
        });
      }

      const command = new PutObjectCommand({
        Bucket: r2.bucketName,
        Key: key,
        ContentType: fileType || "application/octet-stream",
      });

      const uploadUrl = await getSignedUrl(r2.client, command, { expiresIn: 1800 });
      const publicUrl = r2.publicBaseUrl.endsWith("/")
        ? `${r2.publicBaseUrl}${key}`
        : `${r2.publicBaseUrl}/${key}`;

      return res.status(200).json({ uploadUrl, publicUrl, key });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 4. Storage Multipart Init
  if (pathname === "/storage/multipart/init" && req.method === "POST") {
    try {
      const { fileName, fileType, folder = "videos" } = req.body || {};
      if (!fileName) return res.status(400).json({ error: "fileName is required" });

      const r2 = getR2Client();
      const safeName = sanitizeFileName(fileName);
      const key = `${folder}/${Date.now()}-${safeName}`;

      if (!r2) {
        return res.status(200).json({
          fallback: true,
          uploadId: `mock-upload-${Date.now()}`,
          key,
        });
      }

      const command = new CreateMultipartUploadCommand({
        Bucket: r2.bucketName,
        Key: key,
        ContentType: fileType || "video/mp4",
      });

      const resp = await r2.client.send(command);
      return res.status(200).json({ uploadId: resp.UploadId, key });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 5. Storage Multipart Part URL
  if (pathname === "/storage/multipart/part-url" && req.method === "POST") {
    try {
      const { uploadId, key, partNumber } = req.body || {};
      const r2 = getR2Client();
      if (!r2) {
        return res.status(200).json({
          fallback: true,
          partUploadUrl: `/api/storage/mock-part?partNumber=${partNumber}`,
        });
      }

      const command = new UploadPartCommand({
        Bucket: r2.bucketName,
        Key: key,
        UploadId: uploadId,
        PartNumber: Number(partNumber),
      });

      const partUploadUrl = await getSignedUrl(r2.client, command, { expiresIn: 1800 });
      return res.status(200).json({ partUploadUrl, partNumber });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 6. Storage Multipart Complete
  if (pathname === "/storage/multipart/complete" && req.method === "POST") {
    try {
      const { uploadId, key, parts } = req.body || {};
      const r2 = getR2Client();
      if (!r2) {
        return res.status(200).json({
          fallback: true,
          publicUrl: `/videos/${key.split("/").pop()}`,
          key,
        });
      }

      const sortedParts = [...parts].sort((a, b) => a.PartNumber - b.PartNumber);
      const command = new CompleteMultipartUploadCommand({
        Bucket: r2.bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: { Parts: sortedParts },
      });

      await r2.client.send(command);

      const publicUrl = r2.publicBaseUrl.endsWith("/")
        ? `${r2.publicBaseUrl}${key}`
        : `${r2.publicBaseUrl}/${key}`;

      return res.status(200).json({ publicUrl, key });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 7. Storage Multipart Abort
  if (pathname === "/storage/multipart/abort" && req.method === "POST") {
    try {
      const { uploadId, key } = req.body || {};
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
      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(200).json({ success: false });
    }
  }

  // 8. Contact Form Endpoint
  if (pathname === "/contact" && req.method === "POST") {
    try {
      const { name, email, subject, message } = req.body || {};
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: "All fields are required" });
      }

      const targetRecipient = process.env.RECIPIENT_EMAIL || "hafsasaeed1074@gmail.com";
      const formattedSubject = `[Portfolio Inquiry] ${subject} - from ${name}`;
      const formattedBody = `From: ${name} (${email})\nSubject: ${subject}\n\n${message}`;

      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetRecipient)}&su=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
      const mailtoUrl = `mailto:${encodeURIComponent(targetRecipient)}?subject=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
      const whatsappUrl = `https://wa.me/923275535987?text=${encodeURIComponent(`Hi Hafsa! I am ${name} (${email}). ${subject}: ${message}`)}`;

      // Save to Supabase if credentials are present
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        try {
          await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              id: `msg_${Date.now()}`,
              name,
              email,
              subject,
              message,
              is_read: false,
              delivered_via_smtp: false,
              created_at: new Date().toISOString(),
            }),
          });
        } catch (e) {
          console.warn("Supabase Vercel contact save notice:", e);
        }
      }

      return res.status(200).json({
        success: true,
        delivered: true,
        message: "Your message has been received! Hafsa will reply to you shortly.",
        gmailComposeUrl,
        mailtoUrl,
        whatsappUrl,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(404).json({ error: "Endpoint not found" });
}
