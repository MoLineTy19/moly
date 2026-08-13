import {LockReason, Password, PasswordStore} from "@/types";
import {create} from "zustand";
import {
    createVerifier, deriveMasterKey, encrypt, decrypt,
    hasSetup, loadVerifier, verifyMasterKey, saveVerifier, deriveKey, loadSalt,
    saveVerifierPrev, clearVerifierPrev,
} from "@/lib/encryption";
import {logActivity} from "@/lib/activity";
import {invalidateLocalAudit, clearSecurityAudit} from "@/store/securityStore";

export const usePasswordStore = create<PasswordStore>((set, get) => ({
    masterKey: null,
    isLocked: true,
    masterKeyCreatedAt: null,
    passwords: [],
    passwordCount: 0,
    isSetup: false,
    isLoading: false,
    error: null,

    rehydrate: () => {
        set({isSetup: hasSetup()});
    },

    /** Первичная установка мастер-пароля. */
    setup: async (masterPassword: string) => {
        const key = await deriveMasterKey(masterPassword);
        const verifier = await createVerifier(key);
        saveVerifier(verifier);
        set({masterKey: key, isLocked: false, isSetup: true,
            masterKeyCreatedAt: Date.now()});
        logActivity('unlock', 'Создан сейф');
    },

    /** Разблокировка существующего сейфа. true = успех. */
    unlock: async (masterPassword: string): Promise<boolean> => {
        const verifier = loadVerifier();
        if (!verifier) return false;

        const key = await deriveMasterKey(masterPassword);
        const ok = await verifyMasterKey(key, verifier);
        if (!ok) return false;

        set({masterKey: key, isLocked: false,
            masterKeyCreatedAt: Date.now()});
        logActivity('unlock', 'Успешный вход');
        return true;
    },

    /** Заблокировать сейф: выкинуть ключ из памяти. */
    lock: (reason: LockReason = 'manual') => {
        if (get().isLocked) return;
        set({masterKey: null, isLocked: true, passwords: [],
            masterKeyCreatedAt: null});

        // Результаты аудита — производные от расшифрованных паролей.
        // При блокировке сейфа они не должны оставаться в памяти.
        clearSecurityAudit();

        const messages: Record<LockReason, string> = {
            manual: 'Ручная блокировка',
            auto: 'Автоблокировка по таймауту',
            tab_switch: 'Блокировка при переключении вкладки',
        };
        const eventType = reason === 'auto' ? 'auto_lock'
            : reason === 'tab_switch' ? 'tab_switch_lock' : 'manual_lock';
        logActivity(eventType, messages[reason]);
    },

    /**
     * Смена мастер-пароля.
     * Перешифровывает все записи атомарно, затем меняет verifier и ключ в памяти.
     */
    changeMasterPassword: async (current, next) => {
        const salt = loadSalt();
        const verifier = loadVerifier();
        if (!salt || !verifier) return {ok: false, error: 'Сейф не настроен'};

        const oldKey = await deriveKey(current, salt);
        const valid = await verifyMasterKey(oldKey, verifier);
        if (!valid) return {ok: false, error: 'Неверный текущий пароль'};

        const newKey = await deriveKey(next, salt);
        // Вычисляем новый verifier заранее: после подтверждения серверной
        // перешифровки останется лишь синхронно сохранить его, без await между
        // шагами (иначе окно рассинхрона БД↔localStorage при падении вкладки).
        const newVerifier = await createVerifier(newKey);

        const currentPasswords = get().passwords;
        const items = await Promise.all(currentPasswords.map(async (p) => ({
            id: p.id,
            password: await encrypt(p.password, newKey),
            note: p.note && p.note.length ? await encrypt(p.note, newKey) : null,
        })));

        // Страховка: предыдущий verifier остаётся доступным, если перешифровка
        // подтвердится, а новый verifier не успеем сохранить.
        saveVerifierPrev(verifier);

        const res = await fetch('/api/passwords/reencrypt', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({items}),
        });
        if (!res.ok) {
            clearVerifierPrev();
            return {ok: false, error: 'Не удалось сохранить данные'};
        }

        // Серверная перешифровка атомарна (транзакция) и уже подтверждена.
        // Синхронно заменяем verifier: между этим и успехом выше нет await.
        saveVerifier(newVerifier);
        clearVerifierPrev();
        set({masterKey: newKey, masterKeyCreatedAt: Date.now()});
        logActivity('change_master_password');
        return {ok: true};
    },

    fetchPasswords: async () => {
        const key = get().masterKey;
        if (!key) return;

        set({isLoading: true, error: null});
        try {
            const res = await fetch('/api/passwords');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            // Дешифруем password и note построчно. Используем allSettled, а не
            // Promise.all: одна нечитаемая запись (например, зашифрованная старым
            // мастер-паролем до пересоздания сейфа) не должна обнулять весь
            // список после перезагрузки. Такие записи просто пропускаем.
            const results = await Promise.allSettled(data.map(async (p: any) => ({
                ...p,
                password: await decrypt(p.password, key),
                note: p.note ? await decrypt(p.note, key) : "",
            })));

            const decrypted = results
                .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
                .map((r) => r.value);
            const failed = results.length - decrypted.length;

            set({passwords: decrypted, passwordCount: decrypted.length,
                isLoading: false});

            // После загрузки/расшифровки записей сразу пересчитываем локальные
            // бейджи (слабые/дубликаты/устаревшие), чтобы они были видны без
            // дополнительных действий пользователя.
            invalidateLocalAudit();

            if (failed > 0) {
                console.warn(`[passwordStore] пропущено ${failed} нерасшифрованных записей`);
            }
        } catch (err) {
            set({error: (err as Error).message, isLoading: false});
        }
    },

    addPassword: async (password) => {
        const key = get().masterKey;
        if (!key) throw new Error("Sealed");

        set({error: null});
        try {
            const encPassword = await encrypt(password.password, key);
            const encNote = password.note ? await encrypt(password.note, key) : null;

            const res = await fetch('/api/passwords/add', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    password: {
                        ...password,
                        password: encPassword,
                        note: encNote,
                    },
                }),
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const result = await res.json();
            const newPwd = result.data;

            set((state) => ({
                passwords: [{
                    ...newPwd,
                    password: password.password,
                    note: password.note ?? "",
                }, ...state.passwords],
                passwordCount: state.passwordCount + 1,
            }));
            // Новый пароль мог стать дубликатом/слабым — пересчитываем бейджи.
            invalidateLocalAudit();
        } catch (err) {
            set({error: (err as Error).message});
            throw err;
        }
    },

    deletePassword: async (id: number) => {
        const key = get().masterKey;
        if (!key) throw new Error("Sealed");

        set({error: null});
        try {
            const res = await fetch(`/api/passwords/${id}`, {method: "DELETE"});
            if (!res.ok) throw new Error('Failed to delete');

            set((state) => ({
                passwords: state.passwords.filter((p) => p.id !== id),
                passwordCount: Math.max(0, state.passwordCount - 1),
                error: null,
            }));
            // Удаление могло «разрушить» дубликат — пересчитываем бейджи.
            invalidateLocalAudit();
        } catch (err) {
            set({error: (err as Error).message});
            throw err;
        }
    },

    editPassword: async (editedPassword) => {
        const key = get().masterKey;
        if (!key) throw new Error("Sealed");

        set({error: null});
        try {
            const encPassword = await encrypt(editedPassword.password, key);
            const encNote = editedPassword.note
                ? await encrypt(editedPassword.note, key) : null;

            const res = await fetch(`/api/passwords/${editedPassword.id}`, {
                method: "PATCH",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: editedPassword.title,
                    login: editedPassword.login,
                    url: editedPassword.url,
                    password: encPassword,
                    note: encNote,
                    strength_score: editedPassword.strengthScore,
                    tag_id: editedPassword.tag?.id ?? null,
                    favorite: editedPassword.favorite,
                }),
            });
            if (!res.ok) throw new Error('Failed to fetch');

            set((state) => ({
                passwords: state.passwords.map((p) =>
                    p.id === editedPassword.id ? editedPassword : p
                ),
                error: null,
            }));
            // Сила/значение пароля могли измениться — пересчитываем бейджи.
            invalidateLocalAudit();
        } catch (err) {
            set({error: (err as Error).message});
            throw err;
        }
    },

    toggleFavorite: async (id: number) => {
        const current = get().passwords.find((p) => p.id === id);
        if (!current) return;
        const next = !current.favorite;

        // Оптимистично обновляем UI, затем шлём PATCH только поля favorite.
        set((state) => ({
            passwords: state.passwords.map((p) =>
                p.id === id ? {...p, favorite: next} : p
            ),
            error: null,
        }));

        try {
            const res = await fetch(`/api/passwords/${id}`, {
                method: "PATCH",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({favorite: next}),
            });
            if (!res.ok) throw new Error('Failed to toggle favorite');
        } catch (err) {
            // Откатываем изменение при ошибке.
            set((state) => ({
                passwords: state.passwords.map((p) =>
                    p.id === id ? {...p, favorite: !next} : p
                ),
                error: (err as Error).message,
            }));
            throw err;
        }
    },

    setFavorite: async (ids: number[], favorite: boolean) => {
        if (!ids.length) return;
        const idSet = new Set(ids);

        // Оптимистично обновляем все отмеченные записи.
        set((state) => ({
            passwords: state.passwords.map((p) =>
                idSet.has(p.id) ? {...p, favorite} : p
            ),
            error: null,
        }));

        // Шлём PATCH по каждой записи; allSettled, чтобы одна ошибка не валила остальные.
        const results = await Promise.allSettled(
            ids.map((id) =>
                fetch(`/api/passwords/${id}`, {
                    method: "PATCH",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({favorite}),
                }).then((res) => {
                    if (!res.ok) throw new Error('Failed to set favorite');
                })
            )
        );
        const failed = results.filter((r) => r.status === 'rejected').length;
        if (failed > 0) {
            set({error: `${failed} of ${ids.length} favorite updates failed`});
            throw new Error(`${failed} of ${ids.length} favorite updates failed`);
        }
    },
}));


export const addPassword = (password: Parameters<PasswordStore['addPassword']>[0]) =>
    usePasswordStore.getState().addPassword(password);
export const editPassword = (password: Password) =>
    usePasswordStore.getState().editPassword(password);
export const togglePasswordFavorite = (id: number) =>
    usePasswordStore.getState().toggleFavorite(id);
export const setPasswordsFavorite = (ids: number[], favorite: boolean) =>
    usePasswordStore.getState().setFavorite(ids, favorite);
export const deletePassword = (id: number) =>
    usePasswordStore.getState().deletePassword(id);