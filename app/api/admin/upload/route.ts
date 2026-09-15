import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { supabaseAdmin, PRODUCT_IMAGES_BUCKET } from '@/lib/supabase';

export async function POST(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'File wajib diisi' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Hanya gambar' }, { status: 400 });
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  try {
    const { error } = await supabaseAdmin.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filename, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
    if (error) return NextResponse.json({ error: 'Gagal mengupload gambar', detail: error.message }, { status: 500 });
    const { data } = supabaseAdmin.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filename);
    return NextResponse.json({ path: data.publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: 'Gagal mengupload gambar', detail: String(e?.message || e) }, { status: 500 });
  }
}
