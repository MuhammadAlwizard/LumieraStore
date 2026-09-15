// Vercel doesn't always have NEXTAUTH_URL set correctly; fall back to the
// platform-provided deployment URL so builds/logins don't break on a
// missing or malformed value.
try {
  new URL(process.env.NEXTAUTH_URL ?? '');
} catch {
  if (process.env.VERCEL_URL) process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = { images: { unoptimized: true } };
export default nextConfig;
