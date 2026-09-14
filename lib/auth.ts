import { createHash } from 'crypto';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export const authOptions: NextAuthOptions = { session: { strategy: 'jwt' }, providers: [CredentialsProvider({ name: 'Admin', credentials: { username: {}, password: {} }, async authorize(credentials) { if (!credentials?.username || !credentials.password) return null; const user = await prisma.user.findUnique({ where: { username: credentials.username } }); if (!user || user.passwordHash !== hash(credentials.password)) return null; return { id: user.id, name: user.username, role: user.role }; } })], callbacks: { async jwt({ token, user }) { if (user) token.role = (user as { role?: string }).role; return token; }, async session({ session, token }) { if (session.user) session.user.name = token.name; return session; } } };
