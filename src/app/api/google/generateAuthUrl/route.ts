import client from "@/lib/OAuth2Client";
import { NextResponse } from "next/server";

export async function GET() {
    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['openid', 'email', 'profile']
    })

    return NextResponse.json({ url })
}