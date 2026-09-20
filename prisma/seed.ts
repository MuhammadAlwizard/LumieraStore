import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
const prisma = new PrismaClient();
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

async function main() {
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!adminPassword) throw new Error('Set ADMIN_SEED_PASSWORD in .env before seeding (never commit a real password).');
  // update: {} so re-running the seed never overwrites an existing admin's password.
  await prisma.user.upsert({ where: { username: 'admin' }, update: {}, create: { username: 'admin', passwordHash: hash(adminPassword) } });
  const colors = [
    ['Burgundy', '#8B3A3A'],
    ['Oatmeal', '#F5E6D3'],
    ['Stone Grey', '#9B9C9E'],
    ['Hydra Sage', '#7A9B8E']
  ] as const;
  const colorMap: Record<string, string> = {};
  for (const [name, hex] of colors) colorMap[name] = (await prisma.color.upsert({ where: { name }, update: { hex }, create: { name, hex } })).id;
  const products = [
    ['Paris Japan Burgundy', 'paris-japan-burgundy', 129000, 'Koleksi eksklusif dengan tekstur lembut dan drape sempurna untuk penampilan glamor sehari-hari.', 'Burgundy'],
    ['Paris Japan Oatmeal', 'paris-japan-oatmeal', 129000, 'Warna netral yang elegan, cocok untuk segala kesempatan dan mudah dipadukan dengan berbagai outfit.', 'Oatmeal'],
    ['Viscose Mini Air Flow Stone Grey', 'viscose-mini-air-flow-stone-grey', 99000, 'Teknologi breathable dengan bahan viscose berkualitas tinggi untuk kenyamanan maksimal sepanjang hari.', 'Stone Grey'],
    ['Viscose Mini Air Flow Hydra Sage', 'viscose-mini-air-flow-hydra-sage', 99000, 'Nuansa hijau menenangkan yang sophisticated, sempurna untuk look fresh dan modern.', 'Hydra Sage']
  ] as const;
  for (const [name, slug, price, description, color] of products) await prisma.product.upsert({ where: { slug }, update: { name, price, description, colorId: colorMap[color], stock: 10 }, create: { name, slug, price, description, colorId: colorMap[color], stock: 10 } });
}
main().finally(() => prisma.$disconnect());
