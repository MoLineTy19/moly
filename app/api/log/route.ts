import {db} from "@/lib/db";
import {ActivityLogTable} from "@/lib/schema";
import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";

const LogSchema = z.object({
    type: z.string().min(1).max(50),
    message: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
    const parsed = LogSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
    }
    await db.insert(ActivityLogTable).values({
        event_type: parsed.data.type,
        message: parsed.data.message ?? null,
    });
    return NextResponse.json({success: true});
}