/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make sure the tool's HTML file is bundled into the /tool serverless function on Vercel.
  outputFileTracingIncludes: {
    "/tool": ["./tool/signal-desk.html"],
  },
};

export default nextConfig;
