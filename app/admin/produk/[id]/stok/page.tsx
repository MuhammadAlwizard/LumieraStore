import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import StockForm from '@/components/StockForm';
export const dynamic='force-dynamic';
export default async function StockPage({params}:{params:{id:string}}){const product=await prisma.product.findUnique({where:{id:params.id}});if(!product)return notFound();return <main className="admin-body"><h1>Tambah Stok</h1><p>{product.name} · Stok saat ini: {product.stock}</p><div className="admin-card"><StockForm productId={product.id}/></div></main>}
