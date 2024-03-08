import type {
	ExtractedMessageObject,
	Getters,
	I18nLiteOptions,
	Locales,
	MessageObject,
	NamedArgs,
	ParsedMessages,
	Translator
} from './types.js';
import I18n from './I18n.js';
import Locale from './Locale.js';
import $t from './getters/$t.js';

export default class I18nLite {
	public default_locale_id: string;
	public getters: Getters;
	public locales: Locales;

	constructor(options?: Partial<I18nLiteOptions>) {
		this.default_locale_id = options?.default_locale_id;
		this.getters = {
			$t,
			...options?.getters,
		};
		this.locales = new Map();
	}

	/**
	 * Create a shortcut function for translating to a specific locale
	 * @param {string} [locale_id] - The locale to create a shortcut for
	 */
	public createTranslator(locale_id: string = this.default_locale_id): Translator {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const i18n = this;
		function t(key: string, args?: NamedArgs): string {
			return i18n.t(locale_id, key, args);
		}
		t.locale = this.locales.get(locale_id);
		return t;
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

	public resolve(
		obj: NamedArgs,
		key: string
	): string | number | number[] | undefined {
		// @ts-ignore I hate TypeScript
		return key
			.split(/\./g)
			.reduce((acc, part) => acc && acc[part], obj);
	}

	/**
	 * Get a message from a locale
	 * @param {string} [locale_id] - The locale to get the message from
	 * @param {string} key - The message to get
	 * @param {NamedArgs} [args] - Placeholder values
	 * @returns {string}
	 */
	public t(
		locale_id: string = this.default_locale_id,
		key: string,
		args?: NamedArgs
	): string {
		// fallback to default locale if provided one is an empty string
		locale_id ||= this.default_locale_id;

		// locale does not exist
		if (!this.locales.has(locale_id)) {
			throw new Error(`A locale with the name of "${locale_id}" does not exist`);
		}

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

		let message = this.locales.get(locale_id).get(key);

		// pluralisation
		if ('q' in message) {		
			const plural_type = (message.q.cardinal && 'cardinal') || (message.q.ordinal && 'ordinal') || null;
			if (plural_type) {
				if (typeof args !== 'object') throw new Error('An argument object is required.');
				const input = this.resolve(args, message.q[plural_type]);
				if (isNaN(Number(input)) && !Array.isArray(input)) throw new Error(`"${message.q[plural_type]}" number/array is required.`);
				const idm = this.locales.get(locale_id).get('$meta.locale_id');
				const cldr_id = (<ExtractedMessageObject>idm)?.t || (<MessageObject>idm)?.o || locale_id;
				const pr = new Intl.PluralRules(cldr_id, { type: plural_type });
				// @ts-ignore yes it does
				const rule: Intl.LDMLPluralRule = Array.isArray(input) ? pr.selectRange(...input) : pr.select(input);
				key = key + '.' + rule;
				if (!this.locales.get(locale_id).has(key)) { // key does not exist in the selected locale
					if (locale_id === this.default_locale_id) {
						throw new Error(`Pluralisation failed: the "${locale_id}" locale is missing the "${key}" key.`);
					} else if (!this.locales.get(this.default_locale_id).has(key)) { // also doesn't exist in the default locale
						throw new Error(`Pluralisation failed: "${key}" does not exist in the "${locale_id}" locale or the default locale ("${this.default_locale_id}")`);
					} else { // exists in the default locale
						locale_id = this.default_locale_id;
					}
				}
				message = this.locales.get(locale_id).get(key);
			}
		}

		let extracted: ExtractedMessageObject;

		if (!('t' in message)) {
			if (!(this instanceof I18n) || !('o' in message)) {
				throw new Error(`Message "${key}" in the "${locale_id}" locale has not been extracted`);
			}
			const parsed = this.extract(message.o);
			this.locales.get(locale_id).set(key, parsed);
			extracted = parsed;
		} else {
			extracted = message;
		}

		let offset = 0;
		let filled = extracted.t;
		if (extracted.p === undefined) return filled;
		for (const [position, placeholder] of extracted.p) {
			if (args[0] instanceof Array) throw new Error('Arrays are for pluralisation and cannot be used for interpolation.');
			const corrected = position + offset;
			let value: string | undefined;
			let name: string;
			if ('v' in placeholder) {
				name = placeholder.v;
				value = this.resolve(args, String(placeholder.v))?.toString();
			} else {
				name = placeholder.g;
				value = this.getters[placeholder.g].get(
					this.locales.get(locale_id),
					[locale_id, key, args],
					placeholder.d
				);
			}
			if (value === undefined) throw new Error(`A value for the "${name}" placeholder is required`);
			filled = filled.slice(0, corrected) + value + filled.slice(corrected);
			offset += value.length;
		}
		return filled;
	}
}
