declare module '@eartharoid/i18n' {

	interface I18nLiteOptions {
		default_locale_id: string,
		named_placeholder_regex: RegExp,
		positional_placeholder_regex: RegExp,
	}

	interface I18nOptions extends I18nLiteOptions {
		defer_extraction: boolean,
	}

	type JSONMessage = string;

	interface JSONMessages {
		[key: string]: JSONMessages | JSONMessage
	}

	type Locales = Map<string, Locale>;

	type MessageArgs = (string | number | number[] | NamedArgs)[]

	interface NamedArgs {
		[name: string]: string | number | NamedArgs
	}

	interface ParsedMessage {
		o?: string,
		t?: string,
		p?: Array<[number, number | string]>
	}

	type ParsedMessages = Array<[string, ParsedMessage]>;

	class Locale extends Map<string, ParsedMessage> {
		public readonly i18n: I18nLite;
		public readonly locale_id: string;

		constructor(i18n: I18nLite, locale_id: string, messages: ParsedMessages)

		public createTranslator(): (key: string, ...args: MessageArgs) => string 

		public t(
			key: string,
			...args: MessageArgs
		): string
	}

	class I18nLite {
		public defer_extraction: boolean;
		public default_locale_id: string;
		public locales: Locales;

		constructor(options: Partial<I18nLiteOptions>);

		public createTranslator(locale_id: string): (key: string, ...args: MessageArgs) => string 

		public loadParsed(locale_id: string, messages: ParsedMessages): Locale

		private resolve(
			obj: NamedArgs,
			key: string
		): string | number | undefined

		public t(
			locale_id: string,
			key: string,
			...args: MessageArgs
		): string
	}

	class I18n extends I18nLite {
		public readonly named_placeholder_regex: RegExp;
		public readonly positional_placeholder_regex: RegExp;

		constructor(options?: Partial<I18nOptions>)

		public extract(message: string): ParsedMessage

		private flatten(messages: JSONMessage | JSONMessages): Record<string, JSONMessage>

		public load(locale_id: string, messages: JSONMessages): Locale

		public parse(messages: JSONMessages): ParsedMessages
	}
}