export function calculatePasswordStrength(password: string): number {
    if (!password) return 0;

    let score = 0;

    // Длина
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Комбинация символов
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;


    // Бонус за длину + разнообразие
    const uniqueChars = new Set(password).size;
    if (uniqueChars > password.length * 0.7) score++;

    if (score < 4) return 1;
    if (score < 6) return 2;
    if (score < 8) return 3;
    return 4;
}