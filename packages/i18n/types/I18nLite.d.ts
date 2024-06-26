import type { FactoryLocaleInserter, Getters, I18nCoreOptions, Locales, NamedArg, NamedArgs, ParsedMessages, Translator } from './types.js';
import Locale from './Locale.js';
export default class I18nCore {
    default_locale_id: string;
    formatters: Record<string, FactoryLocaleInserter<unknown>>;
    getters: Getters;
    locales: Locales;
    nested_limit: number;
    constructor(options?: Partial<I18nCoreOptions>);
    createTranslator(locale_id: string): Translator;
    loadParsed(locale_id: string, messages: ParsedMessages): Locale;
    resolve(obj: NamedArgs, key: string): NamedArg | undefined;
    t(locale_id: string, key: string, args?: NamedArgs, nested?: number): string;
}
