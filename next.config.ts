import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/chat',
        destination: 'http://localhost:8000/chat'
      },
      {
        source: '/transcribe',
        destination: 'http://localhost:8000/transcribe'
      },
      {
        source: '/generate-speech',
        destination: 'http://localhost:8000/generate-speech'
      },
      {
        source: '/validate',
        destination: 'http://localhost:8000/validate'
      }
    ];
  }
};

export default nextConfig;
