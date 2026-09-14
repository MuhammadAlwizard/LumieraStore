import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const body = await req.json(); const expected = createHash('sha512').update(`${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');
  if (body.signature_key !== expected) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  const map: Record<string, string> = { settlement: 'SETTLEMENT', capture: body.fraud_status === 'accept' ? 'CAPTURE' : 'PENDING', pending: 'PENDING', deny: 'DENY', cancel: 'CANCELLED', expire: 'EXPIRED', refund: 'REFUNDED' };
  const nextStatus = map[body.transaction_status];
  const order = await prisma.order.findUnique({ where: { orderId: body.order_id }, include: { items: true } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  const success = nextStatus === 'SETTLEMENT' || nextStatus === 'CAPTURE';
  if (success) {
    const alreadyProcessed = await prisma.stockMovement.findFirst({ where: { type: 'OUT', note: `Penjualan Order ${order.orderId}` } });
    if (!alreadyProcessed) await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
        await tx.stockMovement.create({ data: { productId: item.productId, type: 'OUT', quantity: item.quantity, note: `Penjualan Order ${order.orderId}` } });
      }
    });
  }
  await prisma.order.update({ where: { orderId: body.order_id }, data: { status: nextStatus, transactionId: body.transaction_id } });
  return NextResponse.json({ received: true });
}
