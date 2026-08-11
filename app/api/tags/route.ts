import {db} from "@/lib/db";
import {PasswordTable, TagTable} from "@/lib/schema";
import {NextRequest, NextResponse} from "next/server";
import {asc, sql} from "drizzle-orm";
import {z} from "zod";



export async function GET() {
    const tags = await db.select({
        id: TagTable.id,
        title: TagTable.title,
        iconId: TagTable.icon_id,
        color: TagTable.color,
        backgroundColor: TagTable.background_color,
        borderColor: TagTable.border_color,
        position: TagTable.position,
        countUses: sql<number>`coalesce((select count(*) from ${PasswordTable} where ${PasswordTable.tag_id} = ${TagTable.id}), 0)`,
    })
        .from(TagTable)
        .orderBy(asc(TagTable.position));
    return NextResponse.json(tags);
}

const CreateSchema = z.object({
    tag: z.object({
        title: z.string().min(1).max(100),
        iconId: z.number().int().min(0),
        color: z.string().min(1),
        backgroundColor: z.string().min(1),
        borderColor: z.string().min(1),
    }),
});

export async function POST(request: NextRequest) {
    const parsed = CreateSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
    }
    const {title, iconId, color, backgroundColor, borderColor} = parsed.data.tag;

    // position = max(existing) + 1 - новый тег в конце списка
    const [row] = await db
        .select({m: sql<number>`coalesce(max(${TagTable.position}), -1)`})
        .from(TagTable);
    const position = (row?.m ?? -1) + 1;

    try {
        const [tag] = await db.insert(TagTable).values({
            title,
            icon_id: iconId,
            color,
            background_color: backgroundColor,
            border_color: borderColor,
            count_uses: 0,
            position,
        }).returning({
            id: TagTable.id,
            title: TagTable.title,
            iconId: TagTable.icon_id,
            color: TagTable.color,
            backgroundColor: TagTable.background_color,
            borderColor: TagTable.border_color,
            position: TagTable.position,
        });
        return NextResponse.json({success: true, data: {...tag, countUses: 0}});
    } catch {
        return NextResponse.json({error: "Тег с таким названием уже существует"}, {status: 409});
    }
}
