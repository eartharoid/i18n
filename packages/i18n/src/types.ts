import type Locale from './Locale.js';

export interface I18nLiteOptions {
	default_locale_id: string,
	named_placeholder_regex: RegExp,
	positional_placeholder_regex: RegExp,
}

export interface I18nOptions extends I18nLiteOptions {
	defer_parsing: boolean,
}

export type JSONMessage = string;

export interface JSONMessages {
	[key: string]: JSONMessages | JSONMessage
}

export type Locales = Map<string, Locale>;

export type MessageArgs = (string | number | number[] | NamedArgs)[]

export interface NamedArgs {
	[name: string]: string | number | NamedArgs
}

export interface ParsedMessage {
	o?: string,
	t?: string,
	p?: Record<number | string, number>
}

// export type ParsedMessages = Map<string, ParsedMessage | ParsedMessage[]>;
// ? this increases load performance by 6%
export type ParsedMessages = Array<[string, ParsedMessage]>;
