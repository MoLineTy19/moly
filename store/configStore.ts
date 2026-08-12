import {create} from "zustand";
import {ConfigStore} from "@/types";
import {persist} from "zustand/middleware";
import {DEFAULT_THEME} from "@/config/theme";

export const useConfigStore = create<ConfigStore>()(
    persist(
        (set) => ({
            currentView: 'table',
            autoLockTimeOut: 5,
            clipboardClearTimeout: 30,
            lockOnTabSwitch: false,
            theme: DEFAULT_THEME,
            setCurrentView: (view) => set({ currentView: view }),
            setAutoLockTimeOut: (timeout) => set({ autoLockTimeOut: timeout }),
            setClipboardClearTimeout: (timeout) => set({ clipboardClearTimeout: timeout }),
            setOnTabSwitch: (enabled) => set({ lockOnTabSwitch: enabled }),
            setTheme: (theme) => set({ theme }),
            resetConfig: () => set({
                currentView: 'table',
                autoLockTimeOut: 5,
                clipboardClearTimeout: 30,
                lockOnTabSwitch: false,
                theme: DEFAULT_THEME,
            }),
        }),
        {
            name: 'moly_user_config'
        }
    )
)
