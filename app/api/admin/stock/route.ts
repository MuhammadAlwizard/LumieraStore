import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req:Request){if(!await getServerSession(authOptions))return NextResponse.json({error:'Unauthorized'},{status:401});const {productId,quantity,note}=await req.json();const amount=Number(quantity);if(!productId||!Number.isInteger(amount)||amount<=0)return NextResponse.json({error:'Jumlah stok harus bilangan bulat positif.'},{status:400});await prisma.$transaction([prisma.product.update({where:{id:productId},data:{stock:{increment:amount}}}),prisma.stockMovement.create({data:{productId,type:'IN',quantity:amount,note:note||null}})]);return NextResponse.json({ok:true});}
