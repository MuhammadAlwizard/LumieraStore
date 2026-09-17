import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { expireStaleOrders } from '@/lib/orders';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!await getServerSession(authOptions)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { orderId } = await req.json();

  await expireStaleOrders();

  const order = await prisma.order.findUnique({ where: { orderId } });
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
  if (order.status === 'EXPIRED') return NextResponse.json({ error: 'Order ini sudah kadaluarsa dan stoknya sudah dikembalikan otomatis.' }, { status: 409 });
  if (order.status !== 'PENDING') return NextResponse.json({ error: `Order sudah berstatus ${order.status}.` }, { status: 409 });

  await prisma.order.update({ where: { orderId }, data: { status: 'SETTLEMENT' } });
  return NextResponse.json({ ok: true });
}
