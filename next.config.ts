import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              // n8n's host is gone — lib/api.ts now posts to this site's own
              // /api/intake and /api/chat instead of calling n8n directly from
              // the browser. Supabase is needed for the dashboard's client-side
              // Auth JS; the LiveKit host is RetellAI's Web Call SDK's
              // hardcoded WebSocket endpoint (verified in
              // node_modules/retell-client-js-sdk/src/index.ts), not project-specific.
              "connect-src 'self' https://vgygzogmchvrdpqzzbtd.supabase.co wss://retell-ai-4ihahnq7.livekit.cloud",
              "frame-src https://www.google.com https://maps.google.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
