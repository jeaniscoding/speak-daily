
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'storage', 'videos');

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure directory exists
        try {
            await fs.access(UPLOAD_DIR);
        } catch {
            await fs.mkdir(UPLOAD_DIR, { recursive: true });
        }

        // Generate unique filename
        const filename = `${uuidv4()}.webm`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Write file
        await fs.writeFile(filepath, buffer);

        // Return the URL to access the video
        // We'll create a route to serve this: /api/videos/[filename]
        const videoUrl = `/api/videos/${filename}`;

        return NextResponse.json({ url: videoUrl });
    } catch (e) {
        console.error('Upload error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
