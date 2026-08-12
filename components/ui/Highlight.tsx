"use client";

import {splitHighlight} from "@/utils/highlight";

interface HighlightProps {
    text: string;
    query: string;
}

/**
 * Подсвечивает в тексте совпадения с поисковым запросом.
 */
export default function Highlight({text, query}: HighlightProps) {
    const segments = splitHighlight(text, query);

    return (
        <>
            {segments.map((segment, i) => (
                segment.match
                    ? (
                        <mark key={i}
                              className="bg-(--accent-color)/25 text-(--text-color) rounded px-0.5">
                            {segment.text}
                        </mark>
                    )
                    : <span key={i}>{segment.text}</span>
            ))}
        </>
    );
}