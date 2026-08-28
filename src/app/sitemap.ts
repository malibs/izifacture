import type { MetadataRoute } from "next";

/** Seules les pages publiques sont indexables. */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, priority: 1 },
    { url: `${baseUrl}/login`, lastModified, priority: 0.5 },
    { url: `${baseUrl}/signup`, lastModified, priority: 0.8 },
  ];
}
