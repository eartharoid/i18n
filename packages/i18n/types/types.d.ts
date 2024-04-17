import type Locale from './Locale.js';
export interface FormatterFactory {
    get result(): string;
}
export interface FactoryLocaleInserter<FactoryBuilder> {
    (locales: Intl.Locale[]): FactoryBuilder;
}
export declare type Getter = {
    get(locale: Locale, original: [
        locale_id: string,
        key: string,
        args: NamedArgs,
        cycle: number
    ], data: unknown): string;
    parse(args: string): unknown;
};
export declare type Getters = Record<string, Getter>;
export interface I18nLiteOptions {
    default_locale_id: string;
    formatters: Record<string, FactoryLocaleInserter<unknown>>;
    getters: Getters;
    nested_limit: number;
}
export interface I18nOptions extends I18nLiteOptions {
    defer_extraction: boolean;
    placeholder_regex: RegExp;
}
export declare type Fallen = {
    [locale_id: string]: Array<[string, string]>;
};
export interface RawMessages {
    [key: string]: RawMessages | string;
}
export declare type Locales = Map<string, Locale>;
export declare type NamedArg = string | number | number[] | ((formatters: Record<string, FormatterFactory>) => FormatterFactory);
export interface NamedArgs {
    [name: string]: NamedArg | NamedArgs;
}
export interface GetterPlaceholder {
    g: string;
    d?: unknown;
}
export interface VariablePlaceholder {
    v: string;
}
export declare type Placeholder = GetterPlaceholder | VariablePlaceholder;
export interface MessageObject {
    o: string;
}
export interface MetaMessageObject {
    q: {
        [key: string]: string;
    };
}
export interface ExtractedMessageObject extends Partial<MessageObject> {
    t: string;
    p?: Array<[number, Placeholder]>;
}
export declare type ParsedMessage = ExtractedMessageObject | MessageObject | MetaMessageObject;
export declare type ParsedMessages = Array<[string, ParsedMessage]>;
export interface Translator {
    (key: string, args?: NamedArgs): string;
    locale: Locale;
}
