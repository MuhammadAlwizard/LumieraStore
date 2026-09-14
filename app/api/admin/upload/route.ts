import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
export async function POST(req:Request){const s=await getServerSession(authOptions);if(!s)return NextResponse.json({error:'Unauthorized'},{status:401});const form=await req.formData();const file=form.get('file');if(!(file instanceof File))return NextResponse.json({error:'File wajib diisi'},{status:400});if(!file.type.startsWith('image/'))return NextResponse.json({error:'Hanya gambar'},{status:400});const ext=file.name.split('.').pop()?.toLowerCase()||'jpg';const filename=`${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;const dir=path.join(process.cwd(),'public','uploads','products');await mkdir(dir,{recursive:true});await writeFile(path.join(dir,filename),Buffer.from(await file.arrayBuffer()));return NextResponse.json({path:`/uploads/products/${filename}`})}
