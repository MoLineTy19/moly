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
            iterations: 100000,
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