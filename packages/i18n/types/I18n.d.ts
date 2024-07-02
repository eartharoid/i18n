import type { ExtractedMessageObject, Fallen, Getter, I18nOptions, ParsedMessage, RawMessages } from './types.js';
import type Locale from './core/Locale.js';
import I18nCore from './core/I18nCore.js';
export default class I18n extends I18nCore {
    defer_extraction: boolean;
    placeholder_regex: RegExp;
    getters: Record<string, Getter>;
    constructor(options?: Partial<I18nOptions>);
    extract(message: string): ExtractedMessageObject;
    fallback(fallback_map?: Record<string, string[]>): Fallen;
    load(locale_id: string, messages: RawMessages, namespace?: string): Locale;
    parse(messages: RawMessages, namespace?: string): Generator<[string, ParsedMessage]>;
}
