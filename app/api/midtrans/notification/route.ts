import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const body = await req.json(); const expected = createHash('sha512').update(`${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');
  if (body.signature_key !== expected) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  const map: Record<string, string> = { settlement: 'SETTLEMENT', capture: body.fraud_status === 'accept' ? 'CAPTURE' : 'PENDING', pending: 'PENDING', deny: 'DENY', cancel: 'CANCELLED', expire: 'EXPIRED', refund: 'REFUNDED' };
  await prisma.order.update({ where: { orderId: body.order_id }, data: { status: map[body.transaction_status] as never, transactionId: body.transaction_id } });
  return NextResponse.json({ received: true });
}
