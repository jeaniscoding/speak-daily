
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Progress from '../../../models/Progress';

export async function GET() {
    await dbConnect();
    try {
        const history = await Progress.find({}).sort({ day: 1 });
        return NextResponse.json(history);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const progress = await Progress.create(body);
        return NextResponse.json(progress);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
    }
}
