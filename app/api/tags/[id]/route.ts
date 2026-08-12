import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {PasswordTable, TagTable} from "@/lib/schema";
import {eq} from "drizzle-orm";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const { id: idStr } = await params;
    const id = Number(idStr);

    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid id", status: 400 });
    }

    const body = await request.json();
    const { title, iconId, color, backgroundColor, borderColor, countUses, position } = body.tag;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (iconId !== undefined) updateData.icon_id = iconId;
    if (color !== undefined) updateData.color = color;
    if (backgroundColor !== undefined) updateData.background_color = backgroundColor;
    if (borderColor !== undefined) updateData.border_color = borderColor;
    if (countUses !== undefined) updateData.count_uses = countUses;
    if (position !== undefined) updateData.position = position;   // ручной порядок тега в списке

    await db.update(TagTable).set(updateData).where(eq(TagTable.id, id));
    return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    // Сначала отвязываем пароли от тега (tag_id = null), затем удаляем сам тег.
    await db.update(PasswordTable).set({ tag_id: null }).where(eq(PasswordTable.tag_id, id));
    await db.delete(TagTable).where(eq(TagTable.id, id));

    return NextResponse.json({ success: true, id });
}

