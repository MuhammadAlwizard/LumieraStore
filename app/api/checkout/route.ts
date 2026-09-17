import { prisma } from '@/lib/prisma';
import { expireStaleOrders } from '@/lib/orders';
import { NextResponse } from 'next/server';
import Midtrans from 'midtrans-client';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ORDERS = 5;

type CheckoutItem = { productId: string; quantity: number };

export async function POST(req: Request) {
  try {
    await expireStaleOrders();

    const body = await req.json();
    const { customerName, customerEmail, customerPhone, shippingAddress } = body;
    const items: CheckoutItem[] = Array.isArray(body.items) ? body.items : [];

    if (!shippingAddress || !String(shippingAddress).trim()) return NextResponse.json({ error: 'Alamat pengiriman wajib diisi' }, { status: 400 });
    if (items.length === 0) return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 });
    if (items.some((i) => !i.productId || !Number.isInteger(i.quantity) || i.quantity < 1)) {
      return NextResponse.json({ error: 'Jumlah pesanan tidak valid' }, { status: 400 });
    }

    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const recentCount = await prisma.order.count({ where: { ipAddress, createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) } } });
    if (recentCount >= RATE_LIMIT_MAX_ORDERS) return NextResponse.json({ error: 'Terlalu banyak percobaan checkout. Coba lagi beberapa menit lagi.' }, { status: 429 });

    const products = await prisma.product.findMany({ where: { id: { in: items.map((i) => i.productId) } } });
    if (products.length !== new Set(items.map((i) => i.productId)).size) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 400 });
    }
    const productById = new Map(products.map((p) => [p.id, p]));

    const orderId = `LUM-${Date.now()}`;
    const total = items.reduce((sum, i) => sum + productById.get(i.productId)!.price * i.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const decremented = await tx.product.updateMany({ where: { id: item.productId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
        if (decremented.count === 0) throw new Error('INSUFFICIENT_STOCK');
        await tx.stockMovement.create({ data: { productId: item.productId, type: 'OUT', quantity: item.quantity, note: `Reservasi Order ${orderId}` } });
      }

      return tx.order.create({
        data: {
          orderId, customerName, customerEmail, customerPhone, shippingAddress, total, ipAddress,
          items: { create: items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: productById.get(i.productId)!.price })) },
        },
      });
    });

    if (!process.env.MIDTRANS_SERVER_KEY) return NextResponse.json({ orderId: order.orderId, total: order.total });

    const snap = new Midtrans.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });
    const transaction = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: total },
      item_details: items.map((i) => {
        const product = productById.get(i.productId)!;
        return { id: product.id, price: product.price, quantity: i.quantity, name: product.name };
      }),
      customer_details: { first_name: customerName, email: customerEmail, phone: customerPhone },
    });
    await prisma.order.update({ where: { id: order.id }, data: { snapToken: transaction.token } });

    return NextResponse.json({ orderId, token: transaction.token, total });
  } catch (err) {
    if (err instanceof Error && err.message === 'INSUFFICIENT_STOCK') {
      return NextResponse.json({ error: 'Stok tidak cukup untuk jumlah yang diminta.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Checkout gagal diproses' }, { status: 500 });
  }
}
