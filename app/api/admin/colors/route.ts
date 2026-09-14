import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
const guard = async () => getServerSession(authOptions);
export async function GET(){if(!await guard())return NextResponse.json({error:'Unauthorized'},{status:401});return NextResponse.json(await prisma.color.findMany({orderBy:{name:'asc'}}));}
export async function POST(req:Request){if(!await guard())return NextResponse.json({error:'Unauthorized'},{status:401});const {name,hex}=await req.json();if(!name||!/^#[0-9A-Fa-f]{6}$/.test(hex))return NextResponse.json({error:'Nama dan HEX warna valid wajib diisi.'},{status:400});return NextResponse.json(await prisma.color.create({data:{name,hex}}));}
export async function PUT(req:Request){if(!await guard())return NextResponse.json({error:'Unauthorized'},{status:401});const {id,name,hex}=await req.json();return NextResponse.json(await prisma.color.update({where:{id},data:{name,hex}}));}
export async function DELETE(req:Request){if(!await guard())return NextResponse.json({error:'Unauthorized'},{status:401});const {id}=await req.json();const used=await prisma.product.count({where:{colorId:id}});if(used)return NextResponse.json({error:`Warna masih dipakai oleh ${used} produk dan tidak dapat dihapus.`},{status:409});await prisma.color.delete({where:{id}});return NextResponse.json({ok:true});}
