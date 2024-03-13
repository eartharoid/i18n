declare module '@eartharoid/i18n' {

	type Getter = {
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

	type Getters = Record<string, Getter>

	interface I18nLiteOptions {
		default_locale_id: string,
		getters: Getters,
	}

	interface I18nOptions extends I18nLiteOptions {
		defer_extraction: boolean,
		placeholder_regex: RegExp,
	}

	interface RawMessages {
		[key: string]: RawMessages | string
	}

	type Locales = Map<string, Locale>;

	interface NamedArgs {
		[name: string]: string | number | number[] | NamedArgs
	}

	interface GetterPlaceholder {
		g: string
		d?: unknown
	}

	interface NamedPlaceholder {
		v: string
	}

	type Placeholder = GetterPlaceholder | NamedPlaceholder;

	interface MessageObject {
		o: string,
	}

	interface MetaMessageObject {
		q: {
			[key: string]: string
		}
	}

	interface ExtractedMessageObject extends Partial<MessageObject> {
		t: string,
		p?: Array<[number, Placeholder]>
	}

	type ParsedMessage = ExtractedMessageObject | MessageObject | MetaMessageObject;

	type ParsedMessages = Array<[string, ParsedMessage]>;

	interface Translator {
		(key: string, args?: NamedArgs): string,
		locale: Locale,
	}
	class Locale extends Map<string, ParsedMessage> {
		public readonly i18n: I18nLite;
		public readonly locale_id: string;

		constructor(i18n: I18nLite, locale_id: string, messages: ParsedMessages)

		public createTranslator(): (key: string, args?: NamedArgs) => string

		public t(
			key: string,
			args?: NamedArgs
		): string
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

	export class I18n extends I18nLite {
		public defer_extraction: boolean
		public placeholder_regex: RegExp;

		constructor(options?: Partial<I18nOptions>)

		public extract(message: string): ParsedMessage

		private flatten(messages: RawMessages): Array<[string, string]>

		public load(locale_id: string, messages: RawMessages, namespace?: string): Locale

		public parse(messages: RawMessages, namespace?: string): ParsedMessages
	}
}