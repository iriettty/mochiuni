import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dog = searchParams.get('dog'); // 'mochi' or 'uni'

    if (dog !== 'mochi' && dog !== 'uni') {
        return NextResponse.json({ error: 'Invalid dog parameter' }, { status: 400 });
    }

    try {
        const { blobs } = await list({
            prefix: `${dog}/`,
        });

        // Filter out common web-viewable image extensions (Exclude HEIC/HEIF)
        const imageBlobs = blobs.filter(blob => /\.(jpg|jpeg|png|gif|webp)$/i.test(blob.pathname));

        if (imageBlobs.length === 0) {
            return NextResponse.json({ image: null });
        }

        // Pick a random image blob
        const randomBlob = imageBlobs[Math.floor(Math.random() * imageBlobs.length)];

        // Return blob url
        return NextResponse.json({ image: randomBlob.url });
    } catch (error) {
        console.error('Error listing blobs:', error);
        return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
    }
}
