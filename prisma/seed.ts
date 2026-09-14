import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
const prisma = new PrismaClient();
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

async function main() {
  await prisma.user.upsert({ where: { username: 'admin' }, update: {}, create: { username: 'admin', passwordHash: hash('LumieraAdmin2026!') } });
  const products = [
    ['Paris Japan Burgundy', 'paris-japan-burgundy', 129000, 'Koleksi eksklusif dengan tekstur lembut dan drape sempurna untuk penampilan glamor sehari-hari.', 'Burgundy'],
    ['Paris Japan Oatmeal', 'paris-japan-oatmeal', 129000, 'Warna netral yang elegan, cocok untuk segala kesempatan dan mudah dipadukan dengan berbagai outfit.', 'Oatmeal'],
    ['Viscose Mini Air Flow Stone Grey', 'viscose-mini-air-flow-stone-grey', 99000, 'Teknologi breathable dengan bahan viscose berkualitas tinggi untuk kenyamanan maksimal sepanjang hari.', 'Stone Grey'],
    ['Viscose Mini Air Flow Hydra Sage', 'viscose-mini-air-flow-hydra-sage', 99000, 'Nuansa hijau menenangkan yang sophisticated, sempurna untuk look fresh dan modern.', 'Hydra Sage']
  ] as const;
  for (const [name, slug, price, description, color] of products) await prisma.product.upsert({ where: { slug }, update: { name, price, description, color }, create: { name, slug, price, description, color } });
}
main().finally(() => prisma.$disconnect());
