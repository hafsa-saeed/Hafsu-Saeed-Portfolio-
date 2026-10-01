import {
  S3Client,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function isPlaceholderKey(val?: string): boolean {
  if (!val) return true;
  const lower = val.toLowerCase();
  return (
    lower.includes("your_") ||
    lower.includes("your-") ||
    lower.includes("placeholder") ||
    lower.includes("yourbucket") ||
    lower.includes("youraccount") ||
    lower.length < 5
  );
}

export function getR2Client(): { client: S3Client; bucketName: string; publicBaseUrl: string } | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim() || "hafsa-portfolio";
  const publicBaseUrl =
    process.env.R2_PUBLIC_URL?.trim() ||
    (accountId ? `https://${bucketName}.${accountId}.r2.cloudflarestorage.com` : "");

  if (
    isPlaceholderKey(accountId) ||
    isPlaceholderKey(accessKeyId) ||
    isPlaceholderKey(secretAccessKey)
  ) {
    return null;
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });

  return { client, bucketName, publicBaseUrl };
}

function sanitizeFileName(fileName: string): string {
  return fileName.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
}

export const storageController = {
  // Check whether R2 and Supabase credentials are configured
  getStatus(req: any, res: any) {
    const hasR2 = !isPlaceholderKey(process.env.R2_ACCOUNT_ID) &&
      !isPlaceholderKey(process.env.R2_ACCESS_KEY_ID) &&
      !isPlaceholderKey(process.env.R2_SECRET_ACCESS_KEY);

    const supaUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supaKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const hasSupabase = Boolean(
      supaUrl &&
        supaKey &&
        !isPlaceholderKey(supaUrl) &&
        !isPlaceholderKey(supaKey) &&
        supaKey.length > 25
    );

    return res.json({
      r2Configured: hasR2,
      supabaseConfigured: hasSupabase,
      bucketName: process.env.R2_BUCKET_NAME || "hafsa-portfolio",
    });
  },

  // 1. Single Direct Presigned PUT for Images/PDFs/Small Videos
  async getPresignedUrl(req: any, res: any) {
    try {
      const { fileName, fileType, folder = "projects" } = req.body;

      if (!fileName) {
        return res.status(400).json({ error: "fileName is required" });
      }

      const r2 = getR2Client();
      const safeName = sanitizeFileName(fileName);
      const key = `${folder}/${Date.now()}-${safeName}`;

      if (!r2) {
        // Fallback: save to local server file system
        return res.json({
          fallback: true,
          key,
          uploadUrl: `/api/storage/local-upload?key=${encodeURIComponent(key)}`,
          publicUrl: `/uploads/${key}`,
          message: "R2 keys not configured. Storing locally on server.",
        });
      }

      const command = new PutObjectCommand({
        Bucket: r2.bucketName,
        Key: key,
      });

      // Presigned URL valid for 2 hours
      const uploadUrl = await getSignedUrl(r2.client, command, { expiresIn: 7200 });
      const publicUrl = r2.publicBaseUrl.endsWith("/")
        ? `${r2.publicBaseUrl}${key}`
        : `${r2.publicBaseUrl}/${key}`;

      return res.json({
        uploadUrl,
        publicUrl,
        key,
      });
    } catch (err: any) {
      console.error("[R2 Presign Error]:", err);
      return res.status(500).json({ error: err.message || "Failed to generate presigned URL" });
    }
  },

  // 2. Multipart Upload Init for Large 300MB+ Demo Videos
  async initMultipart(req: any, res: any) {
    try {
      const { fileName, fileType, folder = "videos" } = req.body;

      if (!fileName) {
        return res.status(400).json({ error: "fileName is required" });
      }

      const r2 = getR2Client();
      const safeName = sanitizeFileName(fileName);
      const key = `${folder}/${Date.now()}-${safeName}`;

      if (!r2) {
        return res.json({
          fallback: true,
          uploadId: `local-upload-${Date.now()}`,
          key,
          uploadUrl: `/api/storage/local-upload?key=${encodeURIComponent(key)}`,
          publicUrl: `/uploads/${key}`,
          message: "R2 keys not configured. Storing locally on server.",
        });
      }

      const command = new CreateMultipartUploadCommand({
        Bucket: r2.bucketName,
        Key: key,
        ContentType: fileType || "video/mp4",
      });

      const response = await r2.client.send(command);

      return res.json({
        uploadId: response.UploadId,
        key,
      });
    } catch (err: any) {
      console.error("[R2 Multipart Init Error]:", err);
      return res.status(500).json({ error: err.message || "Failed to initialize multipart upload" });
    }
  },

  // 3. Presigned Part URL for Multipart Chunk
  async getPartUrl(req: any, res: any) {
    try {
      const { uploadId, key, partNumber } = req.body;

      if (!uploadId || !key || !partNumber) {
        return res.status(400).json({ error: "uploadId, key, and partNumber are required" });
      }

      const r2 = getR2Client();
      if (!r2) {
        return res.json({
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

      return res.json({
        partUploadUrl,
        partNumber,
      });
    } catch (err: any) {
      console.error("[R2 Part URL Error]:", err);
      return res.status(500).json({ error: err.message || "Failed to generate part upload URL" });
    }
  },

  // 4. Complete Multipart Upload
  async completeMultipart(req: any, res: any) {
    try {
      const { uploadId, key, parts } = req.body;

      if (!uploadId || !key || !parts || !Array.isArray(parts)) {
        return res.status(400).json({ error: "uploadId, key, and parts array are required" });
      }

      const r2 = getR2Client();
      if (!r2) {
        return res.json({
          fallback: true,
          publicUrl: `/videos/${key.split("/").pop()}`,
          key,
        });
      }

      // S3 requires parts to be sorted in ascending order of PartNumber
      const sortedParts = [...parts].sort((a, b) => a.PartNumber - b.PartNumber);

      const command = new CompleteMultipartUploadCommand({
        Bucket: r2.bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: sortedParts,
        },
      });

      await r2.client.send(command);

      const publicUrl = r2.publicBaseUrl.endsWith("/")
        ? `${r2.publicBaseUrl}${key}`
        : `${r2.publicBaseUrl}/${key}`;

      return res.json({
        publicUrl,
        key,
      });
    } catch (err: any) {
      console.error("[R2 Multipart Complete Error]:", err);
      return res.status(500).json({ error: err.message || "Failed to complete multipart upload" });
    }
  },

  // 5. Abort Multipart Upload
  async abortMultipart(req: any, res: any) {
    try {
      const { uploadId, key } = req.body;
      const r2 = getR2Client();
      if (r2 && uploadId && key) {
        const command = new AbortMultipartUploadCommand({
          Bucket: r2.bucketName,
          Key: key,
          UploadId: uploadId,
        });
        await r2.client.send(command);
      }
      return res.json({ success: true });
    } catch (err: any) {
      console.warn("[R2 Abort Notice]:", err.message);
      return res.json({ success: false });
    }
  },
};
