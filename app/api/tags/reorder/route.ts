import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {TagTable} from "@/lib/schema";
import {asc, eq} from "drizzle-orm";

export async function POST(request: NextRequest) {
    const { ids }: { ids: number[] } = await request.json();

    for (let i = 0; i < ids.length; i++) {
        await db
            .update(TagTable)
            .set({position: i})
            .where(eq(TagTable.id, ids[i]));
    }

    const updatedTags = await db
        .select({
            id: TagTable.id,
            title: TagTable.title,
            iconId: TagTable.icon_id,
            color: TagTable.color,
            backgroundColor: TagTable.background_color,
            borderColor: TagTable.border_color,
            countUses: TagTable.count_uses,
            position: TagTable.position,
        })
        .from(TagTable)
        .orderBy(asc(TagTable.position))
    return NextResponse.json(updatedTags)
}