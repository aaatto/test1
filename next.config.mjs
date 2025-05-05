// File: next.config.mjs (or next.config.js)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true, // Default is true, enable if needed for development checks
  // Add other Next.js specific configurations here if necessary
  // For example, image domains, redirects, experimental features etc.
  // By default, no specific config is needed here for Tailwind to work.
};

export default nextConfig; // Use export default for .mjs

// --- OR --- If your file is named next.config.js, use CommonJS:
// module.exports = nextConfig;
