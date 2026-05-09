// lib/cloudinary.ts
// Server-side Cloudinary helper — do NOT import this in client components

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Extracts the Cloudinary public_id from a secure URL.
 * e.g. "https://res.cloudinary.com/<cloud>/image/upload/v123456/folder/image.jpg"
 * → "folder/image"
 */
export function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(\.[^.]+)?$/);
    if (!match) return null;
    return match[1];
  } catch {
    return null;
  }
}

/**
 * Deletes a single Cloudinary asset by its secure URL.
 * resourceType: "image" | "raw" (PDF = "raw")
 */
export async function deleteFromCloudinary(
  url: string,
  resourceType: "image" | "raw" = "image"
): Promise<void> {
  const publicId = extractPublicId(url);
  if (!publicId) {
    console.warn("deleteFromCloudinary: Could not extract public_id from", url);
    return;
  }
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (err) {
    console.error("deleteFromCloudinary: Failed to delete", publicId, err);
  }
}

/**
 * Deletes multiple image URLs and optionally a PDF URL from Cloudinary.
 */
export async function deleteMediaFromCloudinary(
  imageUrls: string[],
  pdfUrl?: string | null
): Promise<void> {
  const tasks: Promise<void>[] = [
    ...imageUrls.map((url) => deleteFromCloudinary(url, "image")),
  ];
  if (pdfUrl) {
    tasks.push(deleteFromCloudinary(pdfUrl, "raw"));
  }
  await Promise.allSettled(tasks);
}
