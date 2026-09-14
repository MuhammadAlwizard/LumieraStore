import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req:Request){const s=await getServerSession(authOptions);if(!s)return NextResponse.json({error:'Unauthorized'},{status:401});const d=await req.json();const slug=d.slug||d.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');return NextResponse.json(await prisma.product.create({data:{name:d.name,slug,price:Number(d.price),description:d.description,color:d.color,imagePath:d.imagePath||null}}))}
export async function PUT(req:Request){const s=await getServerSession(authOptions);if(!s)return NextResponse.json({error:'Unauthorized'},{status:401});const d=await req.json();return NextResponse.json(await prisma.product.update({where:{id:d.id},data:{name:d.name,slug:d.slug,price:Number(d.price),description:d.description,color:d.color,imagePath:d.imagePath||null}}))}
export async function DELETE(req:Request){const s=await getServerSession(authOptions);if(!s)return NextResponse.json({error:'Unauthorized'},{status:401});const {id}=await req.json();await prisma.product.delete({where:{id}});return NextResponse.json({ok:true})}
