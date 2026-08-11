import {StatusDetails} from "@/types";

export const STRENGTH_WEIGHTS = {
    length: {
        min: 0,
        thresholds: [
            { length: 8, points: 1},
            { length: 12, points: 2},
            { length: 16, points: 3},
        ],
    },
    charTypes: {
        lowercase: 1,
        uppercase: 1,
        digits: 1,
        symbol: 1,
    },
    bonus: {
        uniqueCharsRatio: 0.7,
        noRepeating: 1,
        noSequence: 1,
    },
};

export const STRENGTH_DETAILS: StatusDetails[] = [
    {
        color: "#6b7280",
        backgroundColor: "rgba(107, 114, 128, 0.1)",
        borderColor: "rgba(107, 114, 128, 0.2)",
        title: "Очень слабый"
    },
    {
        color: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "rgba(239, 68, 68, 0.2)",
        title: "Слабый"
    },
    {
        color: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        borderColor: "rgba(249, 115, 22, 0.2)",
        title: "Средний"
    },
    {
        color: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.2)",
        title: "Надежный"
    },
    {
        color: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "rgba(34, 197, 94, 0.2)",
        title: "Очень надежный"
    },
]

