import {db} from "@/lib/db";
import {PasswordTable, TagTable} from "@/lib/schema";
import {NextRequest, NextResponse} from "next/server";
import {eq} from "drizzle-orm";
import {z} from "zod";

const PatchSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    login: z.string().min(1).max(500).optional(),
    url: z.string().max(2000).optional(),
    password: z.string().min(1).optional(),       // шифртекст
    strength_score: z.number().int().min(0).max(4).optional(),
    note: z.string().nullable().optional(),
    tag_id: z.number().int().nullable().optional(),
    favorite: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid id", status: 400 });
    }

    const parsed = PatchSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
    }

    const updateData: Partial<typeof PasswordTable.$inferInsert> = {};
    const v = parsed.data;
    if (v.title !== undefined)         updateData.title = v.title;
    if (v.login !== undefined)         updateData.login = v.login;
    if (v.url !== undefined)           updateData.url = v.url;
    if (v.password !== undefined)      updateData.password = v.password;
    if (v.strength_score !== undefined) updateData.strength_score = v.strength_score;
    if (v.note !== undefined)          updateData.note = v.note;
    if (v.tag_id !== undefined)        updateData.tag_id = v.tag_id;
    if (v.favorite !== undefined)      updateData.is_favorite = v.favorite ? 1 : 0;
    updateData.updated_at = new Date().toISOString();   // обновляем timestamp редактирования (колонка updated_at)

    await db.update(PasswordTable).set(updateData).where(eq(PasswordTable.id, id));
    return NextResponse.json({success: true});

}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid id", status: 400 });
    }

    const [row] = await db.select({
        id: PasswordTable.id,
        url: PasswordTable.url,
        title: PasswordTable.title,
        login: PasswordTable.login,
        password: PasswordTable.password,
        strengthScore: PasswordTable.strength_score,
        note: PasswordTable.note,
        favorite: PasswordTable.is_favorite,
        createdAt: PasswordTable.created_at,
        updatedAt: PasswordTable.updated_at,
        tag: TagTable,
    })
    .from(PasswordTable)
    .leftJoin(TagTable, eq(PasswordTable.tag_id, TagTable.id))
    .where(eq(PasswordTable.id, id));

    if (!row) return NextResponse.json({ error: "Password not found", status: 404 });
    // SQLite boolean → JS boolean на границе API.
    const password = {...row, favorite: Boolean(row.favorite)};

    return NextResponse.json({ success: true, data: password })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) {
        return NextResponse.json({error: "Invalid id"}, {status: 400});
    }

    const deleted = await db
        .delete(PasswordTable)
        .where(eq(PasswordTable.id, id))
        .returning({ id: PasswordTable.id });

    if (deleted.length === 0) {
        return NextResponse.json({error: "Password not found"}, {status: 404});
    }

    return NextResponse.json({success: true, id});
}
