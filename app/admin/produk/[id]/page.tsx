import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AdminProductForm from '@/components/AdminProductForm';
export const dynamic='force-dynamic';
export default async function EditProduct({params}:{params:{id:string}}){const p=await prisma.product.findUnique({where:{id:params.id}});if(!p)return notFound();return <main className="admin-body"><h1>Edit Produk</h1><div className="admin-card" style={{maxWidth:'none'}}><AdminProductForm product={p}/></div></main>}
