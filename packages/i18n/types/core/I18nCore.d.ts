import type { FactoryLocaleInserter, Getter, I18nCoreOptions, Locales, NamedArg, NamedArgs, ParsedMessage, Translator } from '../types.js';
import Locale from './Locale.js';
export default class I18nCore {
    default_locale_id: string;
    formatters: Record<string, FactoryLocaleInserter<unknown>>;
    getters: Record<string, Omit<Getter, 'parse'>>;
    locales: Locales;
    nested_limit: number;
    constructor(options?: Partial<I18nCoreOptions>);
    createTranslator(locale_id: string): Translator;
    loadParsed(locale_id: string, messages: Iterable<[string, ParsedMessage]>): Locale;
    resolve(obj: NamedArgs, key: string): NamedArg | undefined;
    t(locale_id: string, key: string, args?: NamedArgs, nested?: number): string;
}
