import { drizzle } from 'drizzle-orm/better-sqlite3'
import path from "node:path";
import Database from "better-sqlite3";
import * as schema from "./schema";

// В упакованном Electron-приложении main-процесс задаёт путь через env
// (app.getPath('userData')). Вне Electron (dev, CLI-скрипты) берём cwd.
const dbPath = process.env.MOLY_DB_PATH ?? path.join(process.cwd(), 'database.db')
const sqlite = new Database(dbPath);

// В SQLite проверки внешних ключей по умолчанию выключены; включаем явно,
// иначе orphan-записи (например, пароли с удалённым tag_id) не отбрасываются.
sqlite.pragma('foreign_key = ON')

export const db = drizzle(sqlite, { schema })