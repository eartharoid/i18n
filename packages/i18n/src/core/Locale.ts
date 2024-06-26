import type {
	FormatterFactory,
	NamedArgs,
	ParsedMessage,
	Translator
} from '../types.js';
import type I18nCore from './I18nCore.js';

export default class Locale extends Map<string, ParsedMessage> {
	public formatters: Record<string, FormatterFactory>;
	public readonly i18n: I18nCore;
	public readonly locale_id: string;

	constructor(
		i18n: I18nCore,
		locale_id: string,
		messages: Iterable<[string, ParsedMessage]>,
	) {
		super(messages);
		this.formatters = Object
			.entries(i18n.formatters)
			.reduce((acc, [name, builder]) => {
				const locales = [new Intl.Locale(locale_id)];
				if (i18n.default_locale_id) locales.push(new Intl.Locale(i18n.default_locale_id));
				acc[name] = builder(locales);
				return acc;
			}, {});
		this.i18n = i18n;
		this.locale_id = locale_id;
	}

	/**
	 * Create a shortcut function for translating to this locale
	 */
	public createTranslator(): Translator {
		return this.i18n.createTranslator(this.locale_id);
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