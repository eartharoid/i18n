export interface FormatterFactory {
	get result(): string;
}

export interface FormatterFactoryBuilder {
	(locales: Intl.Locale[]): (value: unknown) => FormatterFactory;
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

export type Getters = Record<string, Getter>

export interface I18nLiteOptions {
	default_locale_id: string,
	formatters: Record<string, FormatterFactoryBuilder>,
	getters: Getters,
	nested_limit: number,
}

export interface I18nOptions extends I18nLiteOptions {
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
	| ((formatters: Record<string, FormatterFactory>) => string)

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



// !



export class Locale extends Map<string, ParsedMessage> {
	public readonly i18n: I18nLite;
	public readonly locale_id: string;

	constructor(i18n: I18nLite, locale_id: string, messages: ParsedMessages)

	public createTranslator(): (key: string, args?: NamedArgs) => string

	public t(
		key: string,
		args?: NamedArgs
	): string
}

export class I18n extends I18nLite {
	public defer_extraction: boolean
	public placeholder_regex: RegExp;

	constructor(options?: Partial<I18nOptions>)

	public extract(message: string): ParsedMessage

	public load(locale_id: string, messages: RawMessages, namespace?: string): Locale

	public parse(messages: RawMessages, namespace?: string): ParsedMessages
}

export class I18nLite {
	public defer_extraction: boolean;
	public default_locale_id: string;
	public locales: Locales;

	constructor(options: Partial<I18nLiteOptions>);

	public createTranslator(locale_id: string): (key: string, args?: NamedArgs) => string

	public loadParsed(locale_id: string, messages: ParsedMessages): Locale

	public resolve(
		obj: NamedArgs,
		key: string
	): string | number | undefined

	public t(
		locale_id: string,
		key: string,
		args?: NamedArgs,
		cycle?: number
	): string
}