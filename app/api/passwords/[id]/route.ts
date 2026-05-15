import {db} from "@/lib/db";
import {PasswordTable, TagTable} from "@/lib/schema";
import {NextRequest, NextResponse} from "next/server";
import {eq} from "drizzle-orm";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid id", status: 400 });
    }

    const body = await request.json();
    const { title, login, password, strengthScore, url, tag_id, note } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (login !== undefined) updateData.login = login;
    if (password !== undefined) updateData.password = password;
    if (strengthScore !== undefined) updateData.strengthScore = strengthScore;
    if (url !== undefined) updateData.url = url;
    if (tag_id !== undefined) updateData.tag_id = tag_id;
    if (note !== undefined) updateData.note = note;
    updateData.updatedAt = new Date().toISOString();

    await db
        .update(PasswordTable)
        .set(updateData)
        .where(eq(PasswordTable.id, id))

    return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid id", status: 400 });
    }

    const [password] = await db.select({
        id: PasswordTable.id,
        url: PasswordTable.url,
        title: PasswordTable.title,
        login: PasswordTable.login,
        password: PasswordTable.password,
        strengthScore: PasswordTable.strength_score,
        note: PasswordTable.note,
        createdAt: PasswordTable.created_at,
        tag: TagTable,
    })
    .from(PasswordTable)
    .leftJoin(TagTable, eq(PasswordTable.tag_id, TagTable.id))
    .where(eq(PasswordTable.id, id));

    if (!password) return NextResponse.json({ error: "Password not found", status: 404 });

    return NextResponse.json({ success: true, data: password })
}

