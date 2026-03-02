import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const dog = formData.get('dog') as string | null;

        if (!file || !dog || (dog !== 'mochi' && dog !== 'uni')) {
            return NextResponse.json({ error: '入力内容が正しくありません' }, { status: 400 });
        }

        // Generate unique filename
        const originalName = file.name || "";
        const ext = originalName.includes('.') ? originalName.substring(originalName.lastIndexOf('.')) : '.jpg';
        const filename = `${dog}/${Date.now()}${ext}`; // Organize by folder in blob

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: 'public',
        });

        return NextResponse.json({ success: true, url: blob.url });
    } catch (err) {
        console.error('Upload Error:', err);
        return NextResponse.json({ error: 'アップロードに失敗しました' }, { status: 500 });
    }
}
