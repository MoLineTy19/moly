"use client";

import {ReactNode, useState} from "react";
import Modal from "./modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Деструктивное действие — кнопка подтверждения становится красной, появляется иконка-предупреждение. */
    danger?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

/**
 * Диалог подтверждения поверх Modal. Заменяет нативный window.confirm(),
 * который выглядел инородно и не подчинялся темам оформления.
 */
export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Подтвердить",
    cancelLabel = "Отмена",
    danger = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-md">
            <div className="flex gap-4">
                {danger && (
                    <div
                        className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center text-red-400 shrink-0">
                        <FontAwesomeIcon icon={faTriangleExclamation}/>
                    </div>
                )}
                <div className="text-sm text-(--text-secondary) leading-relaxed pt-1.5">
                    {message}
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-(--text-muted) hover:text-(--text-color) transition-colors disabled:opacity-50"
                >
                    {cancelLabel}
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${
                        danger
                            ? "bg-red-500/90 hover:bg-red-500 text-white"
                            : "bg-(--accent-color)/90 hover:bg-(--accent-color) text-(--text-color)"
                    }`}
                >
                    {loading ? "…" : confirmLabel}
                </button>
            </div>
        </Modal>
    );
}
