/**
 * Одноразовая миграция: зашифровать поля password/note в database.db.
 *
 * Запуск:
 *   MASTER_PASSWORD="ваш мастер-пароль" npx tsx scripts/migrate-encryption.ts
 *
 * Что делает:
 *   1. Читает salt из ../app (нет — salt хранится в localStorage браузера).
 *      Поэтому salt генерируется СВЕШНЫЙ и печатается — его нужно руками
 *      положить в localStorage браузера (ключ moly_salt) для существующей сессии.
 *      ⚠ Если у вас УЖЕ есть сессия с солью в браузере, вытащите её оттуда
 *         и передайте через SALT_BASE64 env (см. ниже).
 *
 * Логика:
 *   - Если запись уже не декодируется как base64-шифртекст (нет IV) → шифруем.
 *   - Записи, которые уже похожи на шифртекст (расшифровываются) → пропускаем.
 */
import Database from "better-sqlite3";
import path from "node:path";
import { webcrypto } from "node:crypto";

const dbPath = path.join(process.cwd(), "database.db");
const sqlite = new Database(dbPath);
sqlite.pragma("foreign_key = ON");

const subtle = webcrypto.subtle;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function deriveKey(master: string, salt: Uint8Array): Promise<CryptoKey> {
    const material = await subtle.importKey(
        "raw", encoder.encode(master), "PBKDF2", false, ["deriveKey"]
    );
    return subtle.deriveKey(
        {name: "PBKDF2", salt, iterations: 600000, hash: "SHA-256"},
        material,
        {name: "AES-GCM", length: 256},
        false,
        ["encrypt"]
    );
}

async function encrypt(text: string, key: CryptoKey): Promise<string> {
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    const data = encoder.encode(text);
    const ct = await subtle.encrypt({name: "AES-GCM", iv}, key, data);
    const combined = new Uint8Array(iv.length + ct.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ct), iv.length);
    return Buffer.from(combined).toString("base64");
}

async function main() {
    const master = '123';
    if (!master) {
        console.error("Укажите MASTER_PASSWORD в env");
        process.exit(1);
    }

    // Salt: либо из env (если уже есть в браузере), либо создаём новый
    let salt: Uint8Array;
    if (process.env.SALT_BASE64) {
        salt = new Uint8Array(Buffer.from(process.env.SALT_BASE64, "base64"));
        console.log("Используется salt из SALT_BASE64");
    } else {
        salt = webcrypto.getRandomValues(new Uint8Array(16));
        console.log("\n⚠ НОВЫЙ SALT (положите в localStorage браузера: moly_salt):");
        console.log(Buffer.from(salt).toString("base64"));
        console.log("");
    }

    const key = await deriveKey(master, salt);

    const rows = sqlite.prepare("SELECT id, password, note FROM passwords").all() as
        Array<{ id: number; password: string; note: string | null }>;

    console.log(`Найдено записей: ${rows.length}`);

    const update = sqlite.prepare(
        "UPDATE passwords SET password = ?, note = ? WHERE id = ?"
    );

    let migrated = 0;
    for (const row of rows) {
        // Эвристика: plaintext-пароли обычно короче 100 символов и не base64.
        // Base64 шифртекст у нас всегда длиннее (12 байт IV + 16 байт tag минимум).
        const looksPlaintext = row.password.length < 40 || !/^[A-Za-z0-9+/=]+$/.test(row.password);

        if (!looksPlaintext) {
            console.log(`  #${row.id}: пропущен (похож на шифртекст)`);
            continue;
        }

        const encPwd = await encrypt(row.password, key);
        const encNote = row.note ? await encrypt(row.note, key) : null;
        update.run(encPwd, encNote, row.id);
        migrated++;
        console.log(`  #${row.id}: зашифрован`);
    }

    console.log(`\nГотово. Мигрировано: ${migrated}, пропущено: ${rows.length - migrated}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(() => sqlite.close());