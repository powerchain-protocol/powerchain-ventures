import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PowerChain Launchpad",
    short_name: "PowerChain",
    description:
      "Create, participate in, claim from and manage Solana Token-2022 token sales.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F9F7",
    theme_color: "#111315",
    categories: ["finance", "utilities"],
    icons: [
      {
        src: "/assets/brand/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/assets/brand/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/assets/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
