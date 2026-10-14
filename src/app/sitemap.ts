import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sfypapua.org";
  const now = new Date();

  const routes = [
    "",
    "/tentang-kami",
    "/program",
    "/kegiatan",
    "/transparansi",
    "/jadi-relawan",
    "/donasi",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/kegiatan" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/program" || route === "/jadi-relawan" ? 0.9 : 0.8,
  }));
}

