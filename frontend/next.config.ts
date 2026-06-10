import type { NextConfig } from "next";

// URL of the backend Express API (see /backend). Used server-side only to
// proxy /api/feedback/* requests, so the browser can call relative `/api/...`
// paths without needing CORS or a public env var.
const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  async rewrites() {
    return [
      // Proxy survey/feedback requests to the backend so the frontend can
      // call "/api/feedback" as a same-origin path.
      // (Next's own routes under /api/admin/* are file-based and are
      // checked before rewrites, so they are unaffected.)
      {
        source: "/api/feedback",
        destination: `${BACKEND_API_URL}/api/feedback`,
      },
      {
        source: "/api/feedback/:path*",
        destination: `${BACKEND_API_URL}/api/feedback/:path*`,
      },
    ];
  },
};

export default nextConfig;
