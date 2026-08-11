export async function deriveKey(masterPassword: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(masterPassword),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    const safeSalt = new Uint8Array(salt).buffer;

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: safeSalt,
            iterations: 600000,
            hash: 'SHA-256',
        },
        keyMaterial,
        {
            name: 'AES-GCM', length: 256
        },
        false,
        ['encrypt', 'decrypt']
    );
}


export async function encrypt(text: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = encoder.encode(text);

    const encrypted = await crypto.subtle.encrypt(
        {name: 'AES-GCM', iv: iv},
        key,
        encodedData
    )

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
}

export async function decrypt(encryptedBase64: string, key: CryptoKey): Promise<string> {
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        data
    )

    return new TextDecoder().decode(decrypted)
}

export function saveSalt(salt: Uint8Array) {
    if (typeof window === "undefined") return;
    const saltBase64 = btoa(String.fromCharCode(...salt));
    localStorage.setItem('moly_salt', saltBase64);
}


export function loadSalt(): Uint8Array | null {
    if (typeof window === "undefined") return null;
    const saltBase64 = localStorage.getItem('moly_salt');
    if (!saltBase64) return null;
    return Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
}



const VERIFIER_PLAINTEXT = "moly-verifier-v1";

export async function createVerifier(key: CryptoKey): Promise<string> {
    return encrypt(VERIFIER_PLAINTEXT, key);
}

export async function verifyMasterKey(key: CryptoKey, verifier: string): Promise<boolean> {
    try {
        const decoded = await decrypt(verifier, key);
        return decoded === VERIFIER_PLAINTEXT;
    } catch {
        return false;
    }
}

export function saveVerifier(verifier: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem('moly_verifier', verifier);
}


export function loadVerifier(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem('moly_verifier');
}

export function hasSetup(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem('moly_verifier') && !!localStorage.getItem('moly_salt');
}

/** Создать или загрузить соль устройства. */
export function getOrCreateSalt(): Uint8Array {
    const existing = loadSalt();
    if (existing) return existing;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    saveSalt(salt);
    return salt;
}

/** Полный поток: мастер-пароль -> CryptoKey. */
export async function deriveMasterKey(masterPassword: string): Promise<CryptoKey> {
    const salt = getOrCreateSalt();
    return deriveKey(masterPassword, salt);
}
