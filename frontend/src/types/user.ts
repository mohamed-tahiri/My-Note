export const ThemePreference = {
    LIGHT: 'light',
    DARK: 'dark',
} as const;

export type ThemePreference = (typeof ThemePreference)[keyof typeof ThemePreference];

export interface User {
    id: number;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    themePreference?: ThemePreference;
    isActive: boolean;
    language: string;
    createdAt: string;
    updatedAt: string;
    isOnline: boolean;
}

export interface CreateUserDto {
    email: string;
    password: string;
    role: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}

export interface UpdateUserDto {
    email?: string;
    password?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    themePreference?: ThemePreference;
}
