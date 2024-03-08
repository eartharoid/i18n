import type {
	NamedArgs,
	ParsedMessage,
	ParsedMessages,
	Translator
} from './types.js';
import type I18nLite from './I18nLite.js';

export default class Locale extends Map<string, ParsedMessage> {
	public readonly i18n: I18nLite;
	public readonly locale_id: string;

	constructor(i18n: I18nLite, locale_id: string,  messages: ParsedMessages) {
		super(messages);
		this.i18n = i18n;
		this.locale_id = locale_id;
	}

	/**
	 * Create a shortcut function for translating to this locale
	 */
	public createTranslator(): Translator {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const locale = this;
		function t(key: string, args?: NamedArgs): string {
			return locale.i18n.t(locale.locale_id, key, args);
		}
		t.locale = locale;
		return t;
	}

	/**
	 * Get a message from this locale
	 * @param {string} key - The message to get
	 * @param {NamedArgs} [args] - Placeholder values
	 * @returns {string}
	 */
	public t(
		key: string,
		args?: NamedArgs
	): string {
		return this.i18n.t(this.locale_id, key, args);
	}
}