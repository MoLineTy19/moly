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

export const STRENGTH_LEVELS: Record<number, string> = {
    0: 'Очень слабый',
    1: 'Слабый',
    2: 'средний',
    3: 'Надежный',
    4: 'Очень надежный'
} as const;


export const STRENGTH_COLORS: Record<number, string> = {
    0: '#ef4444',
    1: '#f97316',
    2: '#eab308',
    3: '#22c55e',
    4: '#10b981',
} as const;
// text-(--accent-color)

