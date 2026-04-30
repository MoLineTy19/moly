import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

export interface Category {
    id: number;
    name: string;
    icon: string;
    color: string;
}

export interface Password {
    id: string;
    title: string;
    login: string;
    password: string;
    category: number;
    strengthScore: number;
    lastModified: number;
    createdAt: number;
}

export interface PasswordStrengthConfig {
    minLength: number;
    requireLowercase: boolean;
    requireUppercase: boolean;
    requireNumber: boolean;
    requireSymbol: boolean;
}


export interface SensitiveData {
    password: string;
    notes? : string;
}


export interface PasswordState {
    masterKey: CryptoKey | null;
    salt: Uint8Array;
    entries: Password[];
    isUnlocked: boolean;
    unlock: (masterPassword: string) => Promise<boolean>;
    lock: () => void;
    addEntry: (entry: Omit<Password, 'id' | 'lastModified' | 'encryptedData'> & SensitiveData) => Promise<void>;
    updateEntry: (id: string, updated: Partial<Password> & Partial<SensitiveData>) => Promise<void>;
    getDecryptedData: (id: string) => Promise<SensitiveData> | null;
    removeEntry: (id: string) => void;
}


export interface RouteConfig {
    title: string,
    icon: IconDefinition
}


export interface SectionButtonDetails {
    title: string;
    href: string;
    icon: IconDefinition,
    data?: string;
}


export interface RowConfig {
    isSelected: boolean;
    title: string;
    login: string;
    password: string;
    category: number;
    strengthScore: number;
    createdAt: number;
}


export interface statusDetails {
    color: string
}