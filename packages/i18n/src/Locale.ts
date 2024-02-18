import type {
	MessageArgs,
	ParsedMessage,
	ParsedMessages
} from './types.js';
import type I18nLite from './I18nLite.js';

export default class Locale extends Map<string, ParsedMessage> {
	public readonly i18n: I18nLite;
	public readonly locale: string;

	constructor(i18n: I18nLite, locale: string,  messages: ParsedMessages) {
		super(messages);
		this.i18n = i18n;
		this.locale = locale;
	}

	/**
	 * Get a message from this locale
	 * @param {string} key - The message to get
	 * @param {MessageArgs} args - Placeholder values
	 * @returns {string}
	 */
	public t(
		key: string,
		...args: MessageArgs
	): string {
		return this.i18n.t(this.locale, key, ...args);
	}
}