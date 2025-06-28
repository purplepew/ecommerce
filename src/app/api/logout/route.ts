import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const cookies = req.cookies

    if (!cookies.get('refreshToken')) {
        return NextResponse.json({ message: 'Cookie already cleared' })
    }

    const response = NextResponse.json({ message: 'Successfully logged out' })

    response.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0
    })

    return response
}