import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {Tag} from "@/types/components";

export interface Password {
    id: number;
    url: string;
    title: string;
    login: string;
    password: string;
    strengthScore: number;
    tag: Tag | null;
    note: string;
    lastModified: number;
    createdAt: number;
}


export interface TagStore {
    tags: Array<Tag>;
    fetchTags: () => Promise<void>;
    addTag: (tag: Omit<Tag, 'id' | 'countUses' | 'position'>) => Promise<void>;
    editTag: (tag: Tag) => Promise<void>;
    deleteTag: (id: number) => Promise<void>;
    reorderTags: (tags: Tag[]) => Promise<void>;
    isLoading: boolean;
    error: string | null;
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


export interface PasswordStore {
    masterKey: CryptoKey | null;
    isLocked: boolean;
    masterKeyCreatedAt: number | null;
    passwords: Password[];
    passwordCount: number;
    isSetup: boolean;

    unlock: (masterPassword: string) => Promise<boolean>;
    setup: (masterPassword: string) => Promise<void>;
    lock: (reason?: LockReason) => void;
    rehydrate: () => void;
    changeMasterPassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>;

    fetchPasswords: () => Promise<void>;
    addPassword: (entry: Omit<Password, 'id' | 'createdAt' | 'lastModified'>) => Promise<void>;
    editPassword: (entry: Password) => Promise<void>;
    deletePassword: (id: number) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}



export interface SectionButtonDetails {
    title: string;
    href: string;
    icon: IconDefinition,
    data?: string;
}


export interface StatusDetails {
    color: string;
    backgroundColor: string;
    borderColor: string;
    title: string;
}

export interface ConfigStore {
    currentView: string;
    autoLockTimeOut: number;
    clipboardClearTimeout: number;
    lockOnTabSwitch: boolean;
    setCurrentView: (view: string) => void;
    setAutoLockTimeOut: (timeout: number) => void;
    setClipboardClearTimeout: (timeout: number) => void;
    setOnTabSwitch: (enabled: boolean) => void;
    resetConfig: () => void;
}

export type ActivityEventType =
    | 'unlock'
    | 'manual_lock'
    | 'auto_lock'
    | 'tab_switch_lock'
    | 'change_master_password'
    | 'export'
    | 'import';

export interface ActivityEntry {
    id: number;
    type: ActivityEventType;
    message: string | null;
    createdAt: string;
}

export type LockReason = 'manual' | 'auto' | 'tab_switch';