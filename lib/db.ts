import { drizzle } from 'drizzle-orm/better-sqlite3'
import path from "node:path";
import Database from "better-sqlite3";
import * as schema from "./schema";

const dbPath = path.join(process.cwd(), 'database.db')
const sqlite = new Database(dbPath);

sqlite.pragma('foreign_key = ON')

export const db = drizzle(sqlite, { schema })