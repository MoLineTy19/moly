import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {PasswordTable} from "@/lib/schema";

export async function POST(request: NextRequest) {
    const body = await request.json()

    await db.insert(PasswordTable).values(
        body
    )

    return NextResponse.json({ success: true , status: 'success' })
}