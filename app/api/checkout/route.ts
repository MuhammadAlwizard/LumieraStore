import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const { productId, quantity = 1, customerName, customerEmail, customerPhone, shippingAddress } = await req.json();
    if (!shippingAddress || !String(shippingAddress).trim()) return NextResponse.json({ error: 'Alamat pengiriman wajib diisi' }, { status: 400 });
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || quantity < 1) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 400 });
    if (product.stock < quantity) return NextResponse.json({ error: `Stok tidak cukup. Sisa stok: ${product.stock}.` }, { status: 409 });
    const orderId = `LUM-${Date.now()}`, total = product.price * quantity;
    const order = await prisma.order.create({ data: { orderId, customerName, customerEmail, customerPhone, shippingAddress, total, items: { create: { productId, quantity, price: product.price } } } });
    return NextResponse.json({ orderId: order.orderId, total: order.total });
  } catch { return NextResponse.json({ error: 'Checkout gagal diproses' }, { status: 500 }); }
}
