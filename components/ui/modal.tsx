"use client";

import {ReactNode, useEffect} from "react";
import {createPortal} from "react-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxWidth?: string;
}

export default function Modal({open, onClose, title, children, maxWidth = 'max-w-lg'}: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open || typeof window === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`w-full ${maxWidth} bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft max-h-[90vh] flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-(--border-color)">
                        <h3 className="text-base font-semibold text-(--text-color)">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-(--text-muted) hover:text-(--text-color) transition-colors"
                            aria-label="Закрыть"
                        >
                            <FontAwesomeIcon icon={faXmark}/>
                        </button>
                    </div>
                )}
                <div className="overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}