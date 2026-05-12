import {db} from "@/lib/db";
import {TagTable} from "@/lib/schema";
import {NextResponse} from "next/server";
import {asc} from "drizzle-orm";

export async function GET() {
    const tags = await db.select({
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
    .orderBy(asc(TagTable.position));
    return NextResponse.json(tags);
}