import {index, integer, sqliteTable, text,} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";


export const TagTable = sqliteTable('tags', {
    id: integer().primaryKey({autoIncrement: true}),
    title: text().notNull().unique(),
    icon_id: integer().notNull(),
    color: text().notNull(),
    background_color: text().notNull(),
    border_color: text().notNull(),
    count_uses: integer().default(0),
    position: integer()
})

export const PasswordTable = sqliteTable('passwords', {
    id: integer().primaryKey({autoIncrement: true}),
    url: text().notNull(),
    title: text().notNull(),
    login: text().notNull(),
    password: text().notNull(),
    strength_score: integer().notNull(),
    tag_id: integer().references(() => TagTable.id),
    note: text(),
    created_at: text().notNull().default(sql`(current_timestamp)`),
    updated_at: text().notNull().default(sql`(current_timestamp)`),
    }, (table) => ({
        tagIdIdx: index('tagId_idx').on(table.tag_id)
    })
)


