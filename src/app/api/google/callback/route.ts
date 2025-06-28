import client from "@/lib/OAuth2Client";
import { prisma } from "@/lib/prisma";
import type { User } from "@/lib/prisma";
import { TokenPayload } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'


export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code')
    if (!code) {
        return NextResponse.json({ message: 'Missing code' }, { status: 400 })
    }

    let payload: TokenPayload | undefined
    let user: User | undefined

    try {
        const { tokens } = await client.getToken(code)
        client.setCredentials(tokens)

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        payload = ticket.getPayload()

        if (!payload) {
            return NextResponse.json({ message: 'Ticket\'s payload is missing. ' }, { status: 500 })
        }

    } catch (error) {
        return NextResponse.json({ error: 'An error occurred during authentication.' }, { status: 500 });
    }

    try {
        if (payload.email) {
            user = await prisma.user.upsert({
                where: { email: payload.email },
                update: {},
                create: {
                    email: payload.email,
                    name: payload.name,
                    pfp: payload.picture,
                }
            })
            console.log("USER: ", user)
        }
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred during credential checking.' }, { status: 500 });
    }

    try {
        if (user) {
            const refreshToken = jwt.sign(
                {
                    "UserInfo": {
                        id: user.id,
                    }
                },
                process.env.JWT_REFRESH_TOKEN_SECRET!,
                { expiresIn: '1d' }
            )

            const response = NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL!)

            response.cookies.set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 3600
            })

            return response
        }
    } catch (error) {

    }
}