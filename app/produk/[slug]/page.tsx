import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SiteHeader from '@/components/SiteHeader';
import CheckoutForm from '@/components/CheckoutForm';
export const dynamic='force-dynamic';
export default async function ProductPage({params}:{params:{slug:string}}){const p=await prisma.product.findUnique({where:{slug:params.slug},include:{color:true}});if(!p)return notFound();return <><SiteHeader/><main className="detail"><div className="container detail-grid"><div className="product-visual detail-visual" style={{background:p.color.hex}}>{p.imagePath?<img src={p.imagePath} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:p.name}</div><div><div className="eyebrow">{p.color.name}</div><h1>{p.name.replace(` ${p.color.name}`,'')}</h1><div className="price">Rp {p.price.toLocaleString('id-ID')}</div><p className="description">{p.description}</p>{p.stock<=0?<p className="error">Habis — stok produk sedang kosong.</p>:<CheckoutForm product={p}/>}</div></div></main></>}
