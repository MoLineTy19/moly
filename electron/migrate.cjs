// Применение drizzle-миграций через чистый better-sqlite3, без зависимости drizzle-orm.
// В standalone-сборке drizzle-orm недоступен (Next бандлит его в серверный код),
// поэтому migrator из scripts/migrate.ts тут не запустить.
//
// Формат учёта совместим с таблицей __drizzle_migrations от drizzle
// (см. node_modules/drizzle-orm/sqlite-core/dialect.cjs, SQLiteSyncDialect.migrate):
// та же таблица, тот же sha256-хэш, тот же признак folderMillis. Поэтому dev-команда
// npm run migrate и упакованное приложение видят одни и те же применённые миграции.
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

/**
 * @param {object} opts
 * @param {string} opts.dbPath — абсолютный путь к файлу БД
 * @param {string} opts.migrationsFolder — папка с миграциями (drizzle/)
 * @param {Function} opts.Database — конструктор better-sqlite3
 * @returns {{ applied: number }} сколько миграций применено
 */
function runMigrations({ dbPath, migrationsFolder, Database }) {
  const sqlite = new Database(dbPath)
  sqlite.pragma('foreign_key = ON')

  sqlite.exec(
    `CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "hash" text NOT NULL,
      "created_at" numeric
    )`
  )

  const journal = JSON.parse(
    fs.readFileSync(path.join(migrationsFolder, 'meta', '_journal.json'), 'utf8')
  )

  // drizzle берёт только последнюю запись и применяет всё новее по folderMillis.
  const last = sqlite
    .prepare('SELECT "created_at" FROM "__drizzle_migrations" ORDER BY "created_at" DESC LIMIT 1')
    .get()
  const lastCreatedAt = last ? Number(last.created_at) : -1

  const pending = journal.entries.filter((e) => e.when > lastCreatedAt)
  if (pending.length === 0) {
    sqlite.close()
    return { applied: 0 }
  }

  const applyAll = sqlite.transaction(() => {
    for (const entry of pending) {
      const sql = fs.readFileSync(path.join(migrationsFolder, entry.tag + '.sql'), 'utf8')
      const hash = crypto.createHash('sha256').update(sql).digest('hex')
      const statements = sql.split('--> statement-breakpoint')
      for (const stmt of statements) {
        const trimmed = stmt.trim()
        if (trimmed) sqlite.exec(trimmed)
      }
      sqlite
        .prepare('INSERT INTO "__drizzle_migrations" ("hash", "created_at") VALUES (?, ?)')
        .run(hash, entry.when)
    }
  })
  applyAll()
  sqlite.close()
  return { applied: pending.length }
}

module.exports = { runMigrations }
