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

        // Filter out common web-viewable image extensions
        const imageBlobs = blobs.filter(blob => /\.(jpg|jpeg|png|gif|webp)$/i.test(blob.pathname));

        // Return array of urls sorted by newest first (assuming blob names have timestamps)
        const sortedUrls = imageBlobs
            .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
            .map(blob => blob.url);

        return NextResponse.json({ images: sortedUrls });
    } catch (error) {
        console.error('Error listing all blobs:', error);
        return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
    }
}
