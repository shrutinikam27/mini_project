import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ subscription: null });
    }
    // Implement your subscription fetching logic here, e.g., from database
    const subscription = null; // Replace with actual subscription data

    return NextResponse.json({ subscription });
}
