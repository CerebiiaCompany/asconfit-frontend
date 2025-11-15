
export const COLORS = {
    primary: '#FF9411',
    primaryHover: '#E68410',
    primaryDark: '#CC7A0E',
} as const;

export type ColorKey = keyof typeof COLORS;
