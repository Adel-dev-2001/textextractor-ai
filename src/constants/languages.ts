export interface Language {
    name: string;
    dir: 'ltr' | 'rtl';
}

export const LANGUAGES: Record<string, Language> = {
    en: {
        name: 'English',
        dir: 'ltr'
    },
    ar: {
        name: 'العربية',
        dir: 'rtl'
    },
    ru: {
        name: 'Русский',
        dir: 'ltr'
    }
};
