import {create} from "zustand";
import {ConfigStore} from "@/types";
import {persist} from "zustand/middleware";

export const useConfigStore = create<ConfigStore>()(
    persist(
        (set) => ({
            currentView: 'table',
            autoLockTimeOut: 5,
            clipboardClearTimeout: 30,
            lockOnTabSwitch: false,
            setCurrentView: (view) => set({ currentView: view }),
            setAutoLockTimeOut: (timeout) => set({ autoLockTimeOut: timeout }),
            setClipboardClearTimeout: (timeout) => set({ clipboardClearTimeout: timeout }),
            setOnTabSwitch: (enabled) => set({ lockOnTabSwitch: enabled }),
            resetConfig: () => set({
                currentView: 'table',
                autoLockTimeOut: 5,
                clipboardClearTimeout: 30,
                lockOnTabSwitch: false,
            }),
        }),
        {
            name: 'moly_user_config'
        }
    )
)