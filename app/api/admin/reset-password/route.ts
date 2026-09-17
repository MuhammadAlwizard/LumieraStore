import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'Password minimal 8 karakter.' }, { status: 400 });

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hash(token) } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Link reset tidak valid atau sudah kedaluwarsa.' }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash: hash(password) } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: resetToken.userId, id: { not: resetToken.id }, usedAt: null } }),
  ]);

  return NextResponse.json({ message: 'Password berhasil diganti, silakan login.' });
}
