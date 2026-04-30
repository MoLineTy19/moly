export interface SensitiveData {
    password: string;
    url?: string;
    notes? : string;
}

export interface PasswordEntry {
    id: string;
    service: string;
    login: string;
    category: string,
    expiresAt: number;
    lastModified: string;
    strengthScore: number;
    encryptedData: string;
}

export interface PasswordState {
    masterKey: CryptoKey | null;
    salt: Uint8Array;
    entries: PasswordEntry[];
    isUnlocked: boolean;
    unlock: (masterPassword: string) => Promise<boolean>;
    lock: () => void;
    addEntry: (entry: Omit<PasswordEntry, 'id' | 'lastModified' | 'encryptedData'> & SensitiveData) => Promise<void>;
    updateEntry: (id: string, updated: Partial<PasswordEntry> & Partial<SensitiveData>) => Promise<void>;
    getDecryptedData: (id: string) => Promise<SensitiveData> | null;
    removeEntry: (id: string) => void;
}