import {db} from "@/lib/db";
import {PasswordTable} from "@/lib/schema";
import {NextRequest, NextResponse} from "next/server";
import {eq} from "drizzle-orm";
import {z} from "zod";

const ItemSchema = z.object({
    id: z.number().int().positive(),
    password: z.string().min(1),     // шифртекст (base64)
    note: z.string().nullable(),
});

const ReencryptSchema = z.object({
    items: z.array(ItemSchema).min(1),
});

export async function POST(request: NextRequest) {
    const parsed = ReencryptSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
    }

    const now = new Date().toISOString();

    // Атомарно: при смене мастер-пароля все записи перешифровываются целиком,
    // частичный результат недопустим. now считаем один раз на всю партию.
    db.transaction(() => {
        for (const item of parsed.data.items) {
            db.update(PasswordTable)
                .set({password: item.password, note: item.note, updated_at: now})
                .where(eq(PasswordTable.id, item.id));
        }
    });

    return NextResponse.json({success: true, count: parsed.data.items.length});
}