import type Locale from './core/Locale.js';
export interface FormatterFactory {
	get result(): string;
}

export interface FactoryLocaleInserter<FactoryBuilder> {
	(locales: Intl.Locale[]): FactoryBuilder;
}

export type Getter = {
	get(
		locale: Locale,
		original: [
			locale_id: string,
			key: string,
			args: NamedArgs,
			cycle: number
		],
		data: unknown
	): string,
	parse(args: string): unknown,
}

export interface I18nCoreOptions {
	default_locale_id: string,
	formatters: Record<string, FactoryLocaleInserter<unknown>>,
	getters: Record<string, Omit<Getter, 'parse'>>,
	nested_limit: number,
}

export interface I18nOptions extends I18nCoreOptions {
	defer_extraction: boolean,
	placeholder_regex: RegExp,
}

export type Fallen = {
	[locale_id: string]: Array<[string, string]>
}

export interface RawMessages {
	[key: string]: RawMessages | string
}

export type Locales = Map<string, Locale>;

export type NamedArg =
	string
	| number
	| number[]
	| ((formatters: Record<string, FormatterFactory>) => FormatterFactory)

export interface NamedArgs {
	[name: string]: NamedArg | NamedArgs
}

export interface GetterPlaceholder {
	g: string
	d?: unknown
}

export interface VariablePlaceholder {
	v: string
}

export type Placeholder = GetterPlaceholder | VariablePlaceholder;

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