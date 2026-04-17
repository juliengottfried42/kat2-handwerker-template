import type { MetadataRoute } from "next";
import { businessDefaults } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = businessDefaults.siteUrl.replace(/\/$/, "");
  const now = new Date();

  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/konfigurator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
