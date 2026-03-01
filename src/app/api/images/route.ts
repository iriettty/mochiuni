import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dog = searchParams.get('dog'); // 'mochi' or 'uni'

    if (dog !== 'mochi' && dog !== 'uni') {
        return NextResponse.json({ error: 'Invalid dog parameter' }, { status: 400 });
    }

    try {
        const dir = path.join(process.cwd(), 'public', 'images', dog);
        if (!fs.existsSync(dir)) {
            return NextResponse.json({ image: null });
        }

        const files = fs.readdirSync(dir);
        // Filter out common image extensions
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

        if (imageFiles.length === 0) {
            return NextResponse.json({ image: null });
        }

        // Pick a random image
        const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];

        // Return relative path from public root
        return NextResponse.json({ image: `/images/${dog}/${randomImage}` });
    } catch (error) {
        console.error('Error reading image directory:', error);
        return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
    }
}
