import type { Context, Language, Translation, Translations } from './types';

export default class Translator {
  private lang = '';

  constructor(
    private translations: Translations,
    private fallback: Language,
  ) {}

  private getLang(): string {
    if (this.lang === '') {
      this.lang = document.documentElement.getAttribute('lang') ?? this.fallback;
    }

    return this.lang;
  }

  private getTranslations(): Record<string, Translation> | undefined {
    const lang = this.getLang();
    return this.translations[lang] ?? this.getFallbackTranslations();
  }

  private getFallbackTranslations(): Record<string, Translation> | undefined {
    return this.translations[this.fallback];
  }

  private getFallbackTranslation(key: string): Translation | undefined {
    const translations = this.getFallbackTranslations();
    return translations?.[key];
  }

  private resolveTranslation(translation: Translation, ctx?: Context | null): string {
    if (typeof translation === 'string') {
      return translation;
    }

    if (!ctx) {
      return translation.other;
    }

    let format = ctx.count === 1 ? (translation.one ?? translation.other) : translation.other;
    for (const name in ctx) {
      format = format.replace(`{${name}}`, String(ctx[name]));
    }

    return format;
  }

  translate(key: string, ctx?: Context | null, fallback = ''): string {
    const translations = this.getTranslations();
    if (!translations) {
      return fallback === '' ? key : fallback;
    }

    const translation = translations[key] ?? this.getFallbackTranslation(key);
    if (!translation) {
      return fallback === '' ? key : fallback;
    }

    return this.resolveTranslation(translation, ctx);
  }
}
