import { NextRequest, NextResponse } from "next/server";
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import prisma, { User } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const cookies = req.cookies

    if (!cookies.get('refreshToken')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const refreshToken = cookies.get('refreshToken')?.value

    let foundUser: User | null

    try {
        const decoded = jwt.verify(
            refreshToken!,
            process.env.JWT_REFRESH_TOKEN_SECRET!
        ) as { UserInfo: { id: number } }

        foundUser = await prisma.user.findUnique({
            where: { id: decoded.UserInfo.id }
        })

        if (!foundUser) {
            return NextResponse.json({ message: 'Internal server error. Could not find user' }, { status: 500 })
        }
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error: ' + error }, { status: 500 })
    }

    try {

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    name: foundUser.name,
                    email: foundUser.email,
                    pfp: foundUser.pfp,
                    id: foundUser.id
                }
            },
            process.env.JWT_ACCESS_TOKEN_SECRET!,
            { expiresIn: '20m' }
        )

        return NextResponse.json({ accessToken })

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return NextResponse.json({ message: 'Token has expired' }, { status: 401 })
        }
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
}