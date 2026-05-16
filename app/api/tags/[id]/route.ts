import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {TagTable} from "@/lib/schema";
import {eq} from "drizzle-orm";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const { id: idStr } = await params;
    const id = Number(idStr);

    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid id", status: 400 });
    }

    const body = await request.json();

    const { title, iconId, color, backgroundColor, borderColor, countUses, position } = body.tag;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (iconId !== undefined) updateData.icon_id = iconId;
    if (color !== undefined) updateData.color = color;
    if (backgroundColor !== undefined) updateData.background_color = backgroundColor;
    if (borderColor !== undefined) updateData.border_color = borderColor;
    if (countUses !== undefined) updateData.count_uses = countUses;
    if (position !== undefined) updateData.note = position;

    await db
        .update(TagTable)
        .set(updateData)
        .where(eq(TagTable.id, id))

    return NextResponse.json({ success: true });
}