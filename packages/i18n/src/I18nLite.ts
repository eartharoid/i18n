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
	public default_locale_id: string;
	public locales: Locales;

	constructor(options?: Partial<I18nLiteOptions>) {
		this.default_locale_id = options?.default_locale_id;
		this.locales = new Map();
	}

	/**
	 * Load parsed messages
	 * @param {string} locale_id 
	 * @param {ParsedMessages} messages 
	 */
	public loadParsed(locale_id: string, messages: ParsedMessages): Locale {
		const locale = new Locale(this, locale_id, messages);
		this.locales.set(locale_id, locale);
		return locale;
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
	 * @param {string} [locale_id] - The locale to get the message from
	 * @param {string} key - The message to get
	 * @param {MessageArgs} args - Placeholder values
	 * @returns {string}
	 */
	public t(
		locale_id: string = this.default_locale_id,
		key: string,
		...args: MessageArgs
	): string {
		// fallback to default locale if provided one is an empty string
		locale_id ||= this.default_locale_id;

		// locale does not exist
		if (!this.locales.has(locale_id)) {
			throw new Error(`A locale with the name of "${locale_id}" does not exist`);
		}

		// must come before the next check
		const plural_type = (/\.\?(c(ardinal)?)?$/.test(key) && 'cardinal') || (/\.\?(o(rdinal)?)?$/.test(key) && 'ordinal');
		// temporary to check it exists
		if (plural_type) key = key.split('.').slice(0, -1).join('.') + '.other';

		// locales exists but key does not, no default locale
		if (!this.locales.get(locale_id).has(key) && this.default_locale_id === undefined) {
			throw new Error(`The "${locale_id}" locale does not contain a message with the key "${key}" and no default locale was provided`);
		}

		// locales exists but key does not, default locale does not exist
		if (!this.locales.get(locale_id).has(key) && !this.locales.has(this.default_locale_id)) {
			throw new Error(`The "${locale_id}" locale does not contain a message with the key "${key}" and the default locale does not exist`);
		}

		// locale and default locale exist but key exists in neither
		if (!this.locales.get(locale_id).has(key) && !this.locales.get(this.default_locale_id).has(key)) {
			throw new Error(`A message with the key "${key}" does not exist in the "${locale_id}" locale or the default locale ("${this.default_locale_id}")`);
		}
		
		// the key exists in either the current or default locale, 
		// fallback to the default locale if the key doesn't exist in the current locale
		if (!this.locales.get(locale_id).has(key)) locale_id = this.default_locale_id;

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
			const pr = new Intl.PluralRules(locale_id, { type: plural_type });
			// @ts-ignore yes it does
			const rule: Intl.LDMLPluralRule = Array.isArray(number) ? pr.selectRange(...<number[]>number) : pr.select(<number>number);
			// remove the temporary ".other" and add the correct rule
			key = key.slice(0, -6) + '.' + rule;

			// the previous checks only ensures `.other` exists
			if (!this.locales.get(locale_id).has(key)) { // key does not exist in the selected locale
				if (locale_id === this.default_locale_id) {
					throw new Error(`Pluralisation failed: the "${locale_id}" locale is missing the "${key}" key.`);
				} else if (!this.locales.get(this.default_locale_id).has(key)) { // also doesn't exist in the default locale
					throw new Error(`Pluralisation failed: "${key}" does not exist in the "${locale_id}" locale or the default locale ("${this.default_locale_id}")`);
				} else { // exists in the default locale
					locale_id = this.default_locale_id;
				}
			}
		}

		let message = this.locales.get(locale_id).get(key);

		if (message.o && this instanceof I18n) {
			// `extract` exists on I18n, and if `o` exists, I18nLite is being used through I18n
			// (<I18n><unknown>this)
			const parsed = this.extract(message.o);
			// const map = this.locales.get(locale).has(key) ? this.locales.get(locale) : this.locales.get(this.default_locale_id);
			let tmp = this.locales.get(locale_id).get(key);
			tmp = parsed;
			this.locales.get(locale_id).set(key, tmp);
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
