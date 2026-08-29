export type Language = string;

export type PluralTranslation = {
  one?: string;
  other: string;
};
export type Translation = string | PluralTranslation;
export type Translations = Record<Language, Record<string, Translation>>;
export type Context = Record<string, number | string>;
