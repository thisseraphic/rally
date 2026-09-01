import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // The source photographs are 5–7 MB exports; these widths cover every
    // slot they land in, from a 375px phone to the 1312px content column.
    deviceSizes: [390, 640, 828, 1024, 1280, 1512, 1920],
  },
};

export default nextConfig;
