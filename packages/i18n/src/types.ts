import type Locale from './Locale.js';

export type Getter = {
	get(
		locale: Locale,
		original: [
			locale_id: string,
			key: string,
			args?: NamedArgs
		],
		data: unknown
	): string,
	parse(args: string): unknown,
}

export type Getters = {
	[name: string]: Getter
}

export interface I18nLiteOptions {
	default_locale_id: string,
	getters: Getters,
	placeholder_regex: RegExp,
	positional_placeholder_regex: RegExp,
}

export interface I18nOptions extends I18nLiteOptions {
	defer_extraction: boolean,
}

export interface RawMessages {
	[key: string]: RawMessages | string
}

export type Locales = Map<string, Locale>;

export interface NamedArgs {
	[name: string]: string | number | number[] | NamedArgs
}

export interface GetterPlaceholder {
	g: string
	d?: unknown
}

export interface NamedPlaceholder {
	v: string
}

export type Placeholder = GetterPlaceholder | NamedPlaceholder;

export interface MessageObject {
	o: string,
}

export interface MetaMessageObject {
	q: {
		[key: string]: string
	}
}

export interface ExtractedMessageObject extends Partial<MessageObject> {
	t: string,
	p?: Array<[number, Placeholder]>	
}

export type ParsedMessage = ExtractedMessageObject | MessageObject | MetaMessageObject;

export type ParsedMessages = Array<[string, ParsedMessage]>;

export interface Translator {
	(key: string, args?: NamedArgs): string,
	locale: Locale,
}