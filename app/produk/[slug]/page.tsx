import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SiteHeader from '@/components/SiteHeader';
import CheckoutForm from '@/components/CheckoutForm';
export const dynamic='force-dynamic';
export default async function ProductPage({params}:{params:{slug:string}}){const p=await prisma.product.findUnique({where:{slug:params.slug}});if(!p)return notFound();const cls=p.color==='Burgundy'?'color-burgundy':p.color==='Oatmeal'?'color-oatmeal':p.color==='Stone Grey'?'color-stone':'color-sage';return <><SiteHeader/><main className="detail"><div className="container detail-grid"><div className={`product-visual detail-visual ${cls}`}>{p.imagePath?<img src={p.imagePath} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:p.name}</div><div><div className="eyebrow">{p.color}</div><h1>{p.name.replace(` ${p.color}`,'')}</h1><div className="price">Rp {p.price.toLocaleString('id-ID')}</div><p className="description">{p.description}</p><CheckoutForm product={p}/></div></div></main></>}
