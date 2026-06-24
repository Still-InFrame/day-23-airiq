import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AirIQ — Local Air Quality",
    short_name: "AirIQ",
    description:
      "Check your local air quality by ZIP code, with health guidance tailored to you.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f3",
    theme_color: "#0f6e6e",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
