import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {Tag} from "@/types/components";

export interface Password {
    id: string;
    url: string;
    title: string;
    login: string;
    password: string;
    strengthScore: number;
    tag: Tag;
    note: string;
    lastModified: number;
    createdAt: number;
}


export interface TagStore {
    tags: Array<Tag>;
    fetchTags: () => Promise<void>;
    addTag: (tag: Omit<Tag, 'id'>) => Promise<void>;
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
    masterKey: string | null;
    masterKeyCreatedAt: number | null;
    passwords: Password[];
    passwordCount: number;
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


export interface statusDetails {
    color: string
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