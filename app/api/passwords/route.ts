import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {PasswordTable, TagTable} from "@/lib/schema";
import {eq} from "drizzle-orm";

export async function GET() {
    const passwords = await db.select({
            id: PasswordTable.id,
            url: PasswordTable.url,
            title: PasswordTable.title,
            login: PasswordTable.login,
            password: PasswordTable.password,
            strengthScore: PasswordTable.strength_score,
            note: PasswordTable.note,
            createdAt: PasswordTable.created_at,
            tag: TagTable,
        }).from(PasswordTable).leftJoin(TagTable, eq(PasswordTable.tag_id, TagTable.id))
    return NextResponse.json(passwords)
}