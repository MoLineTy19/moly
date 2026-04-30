export const DEFAULT_SETTINGS = {
    // Настройки генератора паролей
    passwordLength: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,

    // Безопасность
    autoClearClipboardSeconds: 30,
    lockTimeoutMinutes: 5,
    requireMasterPasswordOnStart: true,

    // Интерфейс
    theme: 'system',
    language: 'ru',
    defaultView: 'grid',
    showPasswordStrength: true,
}

export type Settings = typeof DEFAULT_SETTINGS;