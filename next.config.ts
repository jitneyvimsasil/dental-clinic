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
              // primary-production-bb684 (n8n) stays until Phase 5 replaces lib/api.ts's
              // direct calls; Supabase is the new project URL; the LiveKit host is
              // RetellAI's Web Call SDK's hardcoded WebSocket endpoint (verified in
              // node_modules/retell-client-js-sdk/src/index.ts), not project-specific.
              "connect-src 'self' https://primary-production-bb684.up.railway.app https://vgygzogmchvrdpqzzbtd.supabase.co wss://retell-ai-4ihahnq7.livekit.cloud",
              "frame-src https://www.google.com https://maps.google.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
