import type { FormatterFactory, NamedArgs, ParsedMessage, ParsedMessages, Translator } from '../types.js';
import type I18nCore from './I18nCore.js';
export default class Locale extends Map<string, ParsedMessage> {
    formatters: Record<string, FormatterFactory>;
    readonly i18n: I18nCore;
    readonly locale_id: string;
    constructor(i18n: I18nCore, locale_id: string, messages: ParsedMessages);
    createTranslator(): Translator;
    t(key: string, args?: NamedArgs): string;
}
