import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {PasswordTable, TagTable} from "@/lib/schema";
import {eq} from "drizzle-orm";

export async function GET() {
    const rows = await db.select({
            id: PasswordTable.id,
            url: PasswordTable.url,
            title: PasswordTable.title,
            login: PasswordTable.login,
            password: PasswordTable.password,
            strengthScore: PasswordTable.strength_score,
            note: PasswordTable.note,
            favorite: PasswordTable.is_favorite,
            createdAt: PasswordTable.created_at,
            tag: TagTable,
        }).from(PasswordTable).leftJoin(TagTable, eq(PasswordTable.tag_id, TagTable.id))
    // SQLite хранит boolean как integer (0/1), приводим к boolean на границе API.
    const passwords = rows.map((p) => ({...p, favorite: Boolean(p.favorite)}));
    return NextResponse.json(passwords)
}