import type { MetadataRoute } from "next";
import { businessDefaults } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = businessDefaults.siteUrl.replace(/\/$/, "");

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
