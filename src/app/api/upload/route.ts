import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const dog = formData.get('dog') as string | null;

        if (!file || !dog || (dog !== 'mochi' && dog !== 'uni')) {
            return NextResponse.json({ error: '入力内容が正しくありません' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure the directory exists
        const dir = path.join(process.cwd(), 'public', 'images', dog);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Attempt to keep original extension, fallback to .jpg
        const originalName = file.name || 'image.jpg';
        const ext = path.extname(originalName) || '.jpg';

        // Generate unique filename and write to disk
        const filename = `${Date.now()}${ext}`;
        const filepath = path.join(dir, filename);
        fs.writeFileSync(filepath, buffer);

        return NextResponse.json({ success: true, filename });
    } catch (err) {
        console.error('Upload Error:', err);
        return NextResponse.json({ error: 'アップロードに失敗しました' }, { status: 500 });
    }
}
