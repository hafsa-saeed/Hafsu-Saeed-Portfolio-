export interface UploadProgressCallback {
  (percentage: number, loaded: number, total: number): void;
}

export interface UploadResult {
  url: string;
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

const CHUNK_SIZE = 6 * 1024 * 1024; // 6MB per part for multipart uploads (S3/R2 requires min 5MB per part)

/**
 * Server-relayed upload fallback (bypasses browser CORS restrictions completely)
 */
async function uploadViaServerRelay(
  file: File,
  folder: string,
  onProgress?: UploadProgressCallback,
): Promise<UploadResult> {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
  const key = `${folder}/${Date.now()}-${safeName}`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/storage/server-upload?key=${encodeURIComponent(key)}`);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent, event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (onProgress) onProgress(100, file.size, file.size);
          resolve({
            url: data.publicUrl,
            key: data.key,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          });
        } catch (e: any) {
          reject(new Error(`Failed to parse upload response: ${e.message}`));
        }
      } else {
        reject(new Error(`Server-relayed upload failed with HTTP ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during server-relayed upload"));
    };

    xhr.send(file);
  });
}

/**
 * Upload any file (Image, PDF, Document, or large 300MB+ Demo Video)
 * Uses Direct-to-R2 Presigned PUT which streams directly to Cloudflare R2,
 * completely bypassing cloud proxy payload limits and providing real-time progress.
 * Falls back to server-relayed upload if direct upload fails.
 */
export async function uploadToR2(
  file: File,
  folder: "videos" | "projects" | "credentials" | "documents" | "profile" = "projects",
  onProgress?: UploadProgressCallback,
): Promise<UploadResult> {
  try {
    return await uploadSingleFile(file, folder, onProgress);
  } catch (directErr: any) {
    console.warn("[Direct R2 upload error, falling back to server-relayed upload]:", directErr);
    try {
      return await uploadViaServerRelay(file, folder, onProgress);
    } catch (relayErr: any) {
      console.error("[All upload methods failed]:", relayErr);
      throw new Error(`Upload failed: ${directErr.message || relayErr.message || "Network error"}`);
    }
  }
}

/**
 * Direct Single Presigned PUT upload to Cloudflare R2
 */
async function uploadSingleFile(
  file: File,
  folder: string,
  onProgress?: UploadProgressCallback,
): Promise<UploadResult> {
  // 1. Get presigned PUT URL from API
  const presignRes = await fetch("/api/storage/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      folder,
    }),
  });

  if (!presignRes.ok) {
    const errText = await presignRes.text();
    throw new Error(`Failed to initialize upload: ${errText}`);
  }

  const { uploadUrl, publicUrl, key, fallback } = await presignRes.json();

  if (!uploadUrl) {
    if (fallback) {
      const blobUrl = URL.createObjectURL(file);
      if (onProgress) onProgress(100, file.size, file.size);
      return {
        url: blobUrl,
        key: `local-${file.name}`,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };
    }
    throw new Error("No upload URL returned from server.");
  }

  // 2. Upload file directly to R2 using XMLHttpRequest for real-time progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.timeout = 7200000; // 2 hours for large video files
    if (file.type) {
      xhr.setRequestHeader("Content-Type", file.type);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent, event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100, file.size, file.size);
        resolve({
          url: publicUrl,
          key,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        });
      } else {
        reject(new Error(`Direct storage upload returned HTTP ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network connection error during direct file transfer"));
    };

    xhr.ontimeout = () => {
      reject(new Error("Upload timed out after 2 hours"));
    };

    xhr.send(file);
  });
}

/**
 * Direct Multipart Resumable Upload to Cloudflare R2 for Large 300MB+ Videos
 * File is sliced client-side and sent directly to R2 in chunks.
 * Falls back to local streaming upload if R2 keys are not yet configured.
 */
async function uploadLargeFileMultipart(
  file: File,
  folder: string,
  onProgress?: UploadProgressCallback,
): Promise<UploadResult> {
  // 1. Initialize Multipart Upload
  const initRes = await fetch("/api/storage/multipart/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type || "video/mp4",
      folder,
    }),
  });

  if (!initRes.ok) {
    const errText = await initRes.text();
    throw new Error(`Failed to initialize upload: ${errText}`);
  }

  const { uploadId, key, fallback, uploadUrl, publicUrl } = await initRes.json();

  // If running in local server mode without R2, upload directly via stream to local server storage
  if (fallback && uploadUrl) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent, event.loaded, event.total);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (onProgress) onProgress(100, file.size, file.size);
          resolve({
            url: publicUrl,
            key,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          });
        } else {
          reject(new Error(`Local video upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during local video upload"));
      };

      xhr.send(file);
    });
  }

  const totalParts = Math.ceil(file.size / CHUNK_SIZE);
  const completedParts: { PartNumber: number; ETag: string }[] = [];
  let uploadedBytes = 0;

  try {
    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      // Get presigned URL for this specific chunk
      const partUrlRes = await fetch("/api/storage/multipart/part-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId, key, partNumber }),
      });

      if (!partUrlRes.ok) {
        throw new Error(`Failed to get presigned URL for part ${partNumber}`);
      }

      const { partUploadUrl } = await partUrlRes.json();

      // Upload chunk directly to R2
      const chunkUploadRes = await fetch(partUploadUrl, {
        method: "PUT",
        body: chunk,
      });

      if (!chunkUploadRes.ok) {
        throw new Error(`Failed to upload part ${partNumber} to R2 (status ${chunkUploadRes.status})`);
      }

      let etag = chunkUploadRes.headers.get("ETag") || chunkUploadRes.headers.get("etag");
      if (!etag) {
        // Fallback ETag if headers are restricted
        etag = `"${partNumber}-${Date.now()}"`;
      }

      completedParts.push({ PartNumber: partNumber, ETag: etag });

      uploadedBytes += chunk.size;
      if (onProgress) {
        const percent = Math.min(99, Math.round((uploadedBytes / file.size) * 100));
        onProgress(percent, uploadedBytes, file.size);
      }
    }

    // Complete Multipart Upload
    const completeRes = await fetch("/api/storage/multipart/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadId,
        key,
        parts: completedParts,
      }),
    });

    if (!completeRes.ok) {
      const errText = await completeRes.text();
      throw new Error(`Failed to complete multipart upload: ${errText}`);
    }

    const { publicUrl } = await completeRes.json();
    if (onProgress) onProgress(100, file.size, file.size);

    return {
      url: publicUrl,
      key,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };
  } catch (err: any) {
    // Abort multipart upload on error to avoid orphan storage
    try {
      await fetch("/api/storage/multipart/abort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId, key }),
      });
    } catch (abortErr) {
      console.warn("Failed to abort multipart upload:", abortErr);
    }
    throw err;
  }
}
