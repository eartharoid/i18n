import type {
	I18nLiteOptions,
	Locales,
	MessageArgs,
	NamedArgs,
	ParsedMessages,
} from './types.js';
import I18n from './I18n.js';
import Locale from './Locale.js';

export default class I18nLite {
	public defer_parsing: boolean;
	public default_locale: string;
	public locales: Locales;
	

	constructor(options?: Partial<I18nLiteOptions>) {
		this.default_locale = options?.default_locale;
		this.locales = new Map();
	}

	/**
	 * Load parsed messages
	 * @param {string} locale 
	 * @param {ParsedMessages} messages 
	 */
	public loadParsed(locale: string, messages: ParsedMessages): void {
		this.locales.set(locale, new Locale(this, locale, messages));
	}

	private resolve(
		obj: NamedArgs,
		key: string
	): string | number | undefined {
		// @ts-ignore I hate TypeScript
		return key
			.split(/\./g)
			.reduce((acc, part) => acc && acc[part], obj);
	}

	/**
	 * Get a message from a locale
	 * @param {string} [locale] - The locale to get the message from
	 * @param {string} key - The message to get
	 * @param {MessageArgs} args - Placeholder values
	 * @returns {string}
	 */
	public t(
		locale: string = this.default_locale,
		key: string,
		...args: MessageArgs
	): string {
		// fallback to default locale if provided one is an empty string
		locale ||= this.default_locale;

		// locale does not exist
		if (!this.locales.has(locale)) {
			throw new Error(`A locale with the name of "${locale}" does not exist`);
		}

		// must come before the next check
		const plural_type = (/\.\?(c(ardinal)?)?$/.test(key) && 'cardinal') || (/\.\?(o(rdinal)?)?$/.test(key) && 'ordinal');
		if (plural_type) key = key.split('.').slice(0, -1).join('.') + '.other';

		// locales exists but key does not, no default locale
		if (!this.locales.get(locale).has(key) && this.default_locale === undefined) {
			throw new Error(`The "${locale}" locale does not contain a message with the key "${key}" and no default locale was provided`);
		}

		// locales exists but key does not, default locale does not exist
		if (!this.locales.get(locale).has(key) && !this.locales.has(this.default_locale)) {
			throw new Error(`The "${locale}" locale does not contain a message with the key "${key}" and the default locale does not exist`);
		}

		// locale and default locale exist but key exists in neither
		if (!this.locales.get(locale).has(key) && !this.locales.get(this.default_locale).has(key)) {
			throw new Error(`A message with the key "${key}" does not exist in the "${locale}" locale or the default locale ("${this.default_locale}")`);
		}
		
		// the key exists in either the current or default locale, 
		// fallback to the default locale if the key doesn't exist in the current locale
		if (!this.locales.get(locale).has(key)) locale = this.default_locale;

		// pluralisation
		if (plural_type) {
			// const identifier = this.locales.get(locale).get('$meta.locale');

			// if (identifier === undefined) {
			// 	throw new Error(`The "${locale}" locale does not have the "$meta.locale" key required for pluralisation.`);
			// }
			
			if (!args || args.length === 0) {
				throw new Error('You attempted to use pluralisation variants without providing a number.');
			}
				
			const number = args.shift(); // ! this mutates args

			if (isNaN(Number(number)) && !Array.isArray(number)) {
				throw new Error('You attempted to use pluralisation variants without providing a number.');
			}
			
			// fallback to `o` because JIT parsing hasn't happened yet
			// const pr = new Intl.PluralRules(identifier.t || identifier.o, { type: plural_type });
			const pr = new Intl.PluralRules(locale, { type: plural_type });
			// @ts-ignore yes it does
			const rule: Intl.LDMLPluralRule = Array.isArray(number) ? pr.selectRange(...<number[]>number) : pr.select(<number>number);
			// remove the temporary ".other" and add the correct rule
			key = key.slice(0, -6) + '.' + rule;

			// the previous checks only ensures `.other` exists
			if (!this.locales.get(locale).has(key)) { // key does not exist in the selected locale
				if (locale === this.default_locale) {
					throw new Error(`Pluralisation failed: the "${locale}" locale is missing the "${key}" key.`);
				} else if (!this.locales.get(this.default_locale).has(key)) { // also doesn't exist in the default locale
					throw new Error(`Pluralisation failed: "${key}" does not exist in the "${locale}" locale or the default locale ("${this.default_locale}")`);
				} else { // exists in the default locale
					locale = this.default_locale;
				}
			}
		}

		let message = this.locales.get(locale).get(key);

		if (message.o && this instanceof I18n) {
			// `extract` exists on I18n, and if `o` exists, I18nLite is being used through I18n
			// (<I18n><unknown>this)
			const parsed = this.extract(message.o);
			// const map = this.locales.get(locale).has(key) ? this.locales.get(locale) : this.locales.get(this.default_locale);
			let tmp = this.locales.get(locale).get(key);
			tmp = parsed;
			this.locales.get(locale).set(key, tmp);
			message = parsed;
		}

		let offset = 0;
		let filled = message.t;
		if (!message.p) return filled;
		for (const [name, position] of Object.entries(message.p)) {
			if (Array.isArray(args[0])) {
				throw new Error('Arrays are for pluralisation and cannot be used for interpolation.');
			}
			const corrected = position + offset;
			const value = (typeof args[0] === 'object' ? this.resolve(args[0], name) : args[Number(name)])?.toString();
			if (value === undefined) throw new Error(`A value for the "${name}" placeholder is required`);
			filled = filled.slice(0, corrected) + value + filled.slice(corrected);
			offset += value.length;
		}
		return filled;
	}
}
