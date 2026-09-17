import { prisma } from './prisma';

export const ORDER_EXPIRY_HOURS = 24;

export async function expireStaleOrders() {
  const cutoff = new Date(Date.now() - ORDER_EXPIRY_HOURS * 60 * 60 * 1000);
  const staleOrders = await prisma.order.findMany({
    where: { status: 'PENDING', createdAt: { lt: cutoff } },
    include: { items: true },
  });

  for (const order of staleOrders) {
    await prisma.$transaction([
      ...order.items.flatMap((item) => [
        prisma.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } }),
        prisma.stockMovement.create({
          data: { productId: item.productId, type: 'IN', quantity: item.quantity, note: `Order kadaluarsa ${order.orderId}` },
        }),
      ]),
      prisma.order.update({ where: { id: order.id }, data: { status: 'EXPIRED' } }),
    ]);
  }

  return staleOrders.length;
}
