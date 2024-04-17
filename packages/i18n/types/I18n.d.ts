import type { ExtractedMessageObject, Fallen, I18nOptions, ParsedMessages, RawMessages } from './types.js';
import type Locale from './Locale.js';
import I18nLite from './I18nLite.js';
export default class I18n extends I18nLite {
    defer_extraction: boolean;
    placeholder_regex: RegExp;
    constructor(options?: Partial<I18nOptions>);
    extract(message: string): ExtractedMessageObject;
    fallback(fallback_map?: Record<string, string[]>): Fallen;
    load(locale_id: string, messages: RawMessages, namespace?: string): Locale;
    parse(messages: RawMessages, namespace?: string): ParsedMessages;
}
