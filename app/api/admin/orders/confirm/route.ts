import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  if (!await getServerSession(authOptions)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { orderId } = await req.json();
  const order = await prisma.order.findUnique({ where: { orderId }, include: { items: true } });
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
  const alreadyProcessed = await prisma.stockMovement.findFirst({ where: { type: 'OUT', note: `Penjualan Order ${order.orderId}` } });
  if (!alreadyProcessed) await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
      await tx.stockMovement.create({ data: { productId: item.productId, type: 'OUT', quantity: item.quantity, note: `Penjualan Order ${order.orderId}` } });
    }
  });
  await prisma.order.update({ where: { orderId }, data: { status: 'SETTLEMENT' } });
  return NextResponse.json({ ok: true });
}
