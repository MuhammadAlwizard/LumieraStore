import { createHash, randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const GENERIC_MESSAGE = 'Kalau username terdaftar dan punya email, link reset sudah dikirim.';

export async function POST(req: Request) {
  const { username } = await req.json();
  if (!username) return NextResponse.json({ error: 'Username wajib diisi.' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { username } });
  if (user?.email) {
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });

    const rawToken = randomBytes(32).toString('hex');
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hash(rawToken),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? new URL(req.url).origin;
    const resetUrl = `${baseUrl}/admin/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (err) {
      // Keep the response generic (no user enumeration) but leave a trace in the server logs.
      console.error('[forgot-password] failed to send reset email:', err);
    }
  }

  return NextResponse.json({ message: GENERIC_MESSAGE });
}
