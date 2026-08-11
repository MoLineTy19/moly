import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {PasswordTable, TagTable} from "@/lib/schema";
import {eq} from "drizzle-orm";
import {z} from "zod";

const AddSchema = z.object({
    password: z.object({
        title: z.string().min(1).max(200),
        login: z.string().min(1).max(500),
        url: z.string().max(2000).optional().default(""),
        password: z.string().min(1),                    // шифртекст (base64)
        strengthScore: z.number().int().min(0).max(4),
        note: z.string().nullable().optional(),
        tag: z.object({ id: z.number().int() }).nullable(),
    }),
});


export async function POST(request: NextRequest) {
    const parsed = AddSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
    }

    const {title, login, password, strengthScore, url, note, tag} = parsed.data.password;

    const [inserted] = await db.insert(PasswordTable).values({
        url,
        title,
        login,
        password,                  // это уже шифртекст
        strength_score: strengthScore,
        tag_id: tag?.id ?? null,
        note,
    }).returning({ id: PasswordTable.id });

    // Возвращаем запись в той же форме, что и GET /api/passwords:
    // camelCase-алиасы + вложенный tag — чтобы стор сразу корректно отрисовал строку.
    const [row] = await db.select({
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
        .where(eq(PasswordTable.id, inserted.id));

    return NextResponse.json({success: true, data: row});
}
