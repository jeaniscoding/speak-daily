
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = path.join(process.cwd(), 'storage', 'videos');

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const filename = (await params).filename;

    if (!filename) {
        return new NextResponse('Filename is required', { status: 400 });
    }

    const filepath = path.join(UPLOAD_DIR, filename);

    try {
        // Check if file exists
        await fs.access(filepath);

        const fileBuffer = await fs.readFile(filepath);

        // Return file with correct content type
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'video/webm',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (e) {
        return new NextResponse('File not found', { status: 404 });
    }
}
