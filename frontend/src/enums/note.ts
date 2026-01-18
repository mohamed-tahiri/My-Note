export const NotePriority = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
} as const;

export type NotePriority = (typeof NotePriority)[keyof typeof NotePriority];
