import {db} from "@/lib/db";
import {ActivityLogTable} from "@/lib/schema";
import {NextRequest, NextResponse} from "next/server";
import {desc} from "drizzle-orm";

export async function GET(request: NextRequest) {
    const raw = Number(request.nextUrl.searchParams.get('limit') ?? 50);
    const limit = Math.min(Math.max(Number.isFinite(raw) ? raw : 50, 1), 500);

    const rows = await db.select({
        id: ActivityLogTable.id,
        type: ActivityLogTable.event_type,
        message: ActivityLogTable.message,
        createdAt: ActivityLogTable.created_at,
    })
        .from(ActivityLogTable)
        .orderBy(desc(ActivityLogTable.id))
        .limit(limit);

    return NextResponse.json(rows);
}

export async function DELETE() {
    await db.delete(ActivityLogTable);
    return NextResponse.json({success: true});
}