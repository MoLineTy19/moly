import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {PasswordTable} from "@/lib/schema";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { title, login, password, strengthScore, url, tag, note } = body.password;
    console.log(tag)
    const [newPassword] = await db.insert(PasswordTable).values({
        url,
        title,
        login,
        password,
        strength_score: strengthScore,
        tag_id: tag.id,
        note: note,
        }).returning()

    return NextResponse.json({ success: true, data: newPassword })
}