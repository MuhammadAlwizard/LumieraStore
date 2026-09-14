import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import Midtrans from 'midtrans-client';
export async function POST(req: Request) {
  try {
    const { productId, quantity = 1, customerName, customerEmail, customerPhone } = await req.json();
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || quantity < 1) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 400 });
    if (product.stock < quantity) return NextResponse.json({ error: `Stok tidak cukup. Sisa stok: ${product.stock}.` }, { status: 409 });
    const orderId = `LUM-${Date.now()}`, total = product.price * quantity;
    const order = await prisma.order.create({ data: { orderId, customerName, customerEmail, customerPhone, total, items: { create: { productId, quantity, price: product.price } } } });
    if (!process.env.MIDTRANS_SERVER_KEY) return NextResponse.json({ orderId: order.orderId, message: 'Midtrans belum dikonfigurasi' });
    const snap = new Midtrans.Snap({ isProduction: false, serverKey: process.env.MIDTRANS_SERVER_KEY, clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY });
    const transaction = await snap.createTransaction({ transaction_details: { order_id: orderId, gross_amount: total }, item_details: [{ id: product.id, price: product.price, quantity, name: product.name }], customer_details: { first_name: customerName, email: customerEmail, phone: customerPhone } });
    await prisma.order.update({ where: { id: order.id }, data: { snapToken: transaction.token } });
    return NextResponse.json({ orderId, token: transaction.token });
  } catch { return NextResponse.json({ error: 'Checkout gagal diproses' }, { status: 500 }); }
}
