import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const RELEASE_STATUSES = ['DENY', 'CANCELLED', 'EXPIRED', 'REFUNDED'];

export async function POST(req: Request) {
  const body = await req.json();
  const expected = createHash('sha512').update(`${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');
  if (body.signature_key !== expected) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  const map: Record<string, string> = { settlement: 'SETTLEMENT', capture: body.fraud_status === 'accept' ? 'CAPTURE' : 'PENDING', pending: 'PENDING', deny: 'DENY', cancel: 'CANCELLED', expire: 'EXPIRED', refund: 'REFUNDED' };
  const nextStatus = map[body.transaction_status];
  const order = await prisma.order.findUnique({ where: { orderId: body.order_id }, include: { items: true } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  if (RELEASE_STATUSES.includes(nextStatus) && order.status === 'PENDING') {
    await prisma.$transaction([
      ...order.items.flatMap((item) => [
        prisma.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } }),
        prisma.stockMovement.create({ data: { productId: item.productId, type: 'IN', quantity: item.quantity, note: `Pembatalan Order ${order.orderId}` } }),
      ]),
    ]);
  }

  await prisma.order.update({ where: { orderId: body.order_id }, data: { status: nextStatus, transactionId: body.transaction_id } });
  return NextResponse.json({ received: true });
}
