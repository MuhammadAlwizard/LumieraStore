// Vercel doesn't always have NEXTAUTH_URL set correctly; fall back to the
// platform-provided deployment URL so builds/logins don't break on a
// missing or malformed value.
try {
  new URL(process.env.NEXTAUTH_URL ?? '');
} catch {
  if (process.env.VERCEL_URL) process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  // One canonical host: www and the bare domain served identical pages (duplicate content in Search Console).
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.lumierastore.online' }],
        destination: 'https://lumierastore.online/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};
export default nextConfig;
