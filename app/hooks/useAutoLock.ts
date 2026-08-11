"use client";

import {usePasswordStore} from "@/store/passwordStore";
import {useConfigStore} from "@/store/configStore";
import {useEffect, useRef} from "react";

const ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll", "wheel"];

export function useAutoLock() {
    const isLocked = usePasswordStore((s) => s.isLocked);
    const lock = usePasswordStore((s) => s.lock);
    const autoLockTimeOut = useConfigStore((s) => s.autoLockTimeOut);
    const lockOnTabSwitch = useConfigStore((s) => s.lockOnTabSwitch);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    // Автоблокировка по неактивности
    useEffect(() => {
        if (autoLockTimeOut <= 0 || isLocked) return;

        const schedule = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                lock('auto');
            }, autoLockTimeOut * 60 * 1000);
        };

        schedule();
        ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, schedule, {passive: true}));

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, schedule));
        };
    }, [autoLockTimeOut, isLocked, lock]);

    // Блокировка при сворачивании / переключении вкладки
    useEffect(() => {
        if (!lockOnTabSwitch || isLocked) return;

        const onVisibility = () => {
            if (document.visibilityState === 'hidden') lock('tab_switch');
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, [lockOnTabSwitch, isLocked, lock]);
}
