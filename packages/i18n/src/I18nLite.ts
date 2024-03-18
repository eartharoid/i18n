import type {
	ExtractedMessageObject,
	Getters,
	I18nLiteOptions,
	Locales,
	NamedArgs,
	ParsedMessages,
	Translator
} from './types.js';
import I18n from './I18n.js';
import Locale from './Locale.js';
import $t from './getters/$t.js';

export default class I18nLite {
	public getters: Getters;
	public locales: Locales;
	public nested_limit: number;

	constructor(options?: Partial<I18nLiteOptions>) {
		this.getters = {
			$t,
			...options?.getters,
		};
		this.locales = new Map();
		this.nested_limit = options?.nested_limit ?? 3;
	}

	/**
	 * Create a shortcut function for translating to a specific locale
	 * @param {string} locale_id - The locale to create a shortcut for
	 */
	public createTranslator(locale_id: string): Translator {
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
	 * @param {string} locale_id - The locale to get the message from
	 * @param {string} key - The message to get
	 * @param {NamedArgs} [args] - Placeholder values
	 * @param {number} [nested] - The cycle number
	 * @returns {string}
	 */
	public t(
		locale_id: string,
		key: string,
		args: NamedArgs = {},
		nested = 0
	): string {
		if (nested > this.nested_limit) {
			throw new Error(`Potential circular translation, "${key}" exceeded nesting limit (${this.nested_limit})`);
		}

		// locale does not exist
		if (!this.locales.has(locale_id)) {
			throw new Error(`A locale with the name of "${locale_id}" does not exist`);
		}

		// locale exists but key does not
		if (!this.locales.get(locale_id).has(key)) {
			throw new Error(`The "${locale_id}" locale does not contain a message with the key "${key}"`);
		}

		let message = this.locales.get(locale_id).get(key);

		// pluralisation
		if ('q' in message) {		
			const plural_type = (message.q.cardinal && 'cardinal') || (message.q.ordinal && 'ordinal') || null;
			if (plural_type) {
				const input = this.resolve(args, message.q[plural_type]);
				if (isNaN(Number(input)) && !Array.isArray(input)) {
					throw new Error(`A number/array value for the "${message.q[plural_type]}" variable is required`);
				}
				const literal = `${key}.=${input}`;
				if (this.locales.get(locale_id).has(literal)) {
					key = literal;
				} else {
					const pr = new Intl.PluralRules(locale_id, { type: plural_type });
					// @ts-ignore yes it does
					const rule: Intl.LDMLPluralRule = Array.isArray(input) ? pr.selectRange(...input) : pr.select(input);
					key = key + '.' + rule;
					if (!this.locales.get(locale_id).has(key)) {
						throw new Error(`Pluralisation failed: the "${locale_id}" locale does not contain a message with the key "${key}"`);
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
					[locale_id, key, args, nested],
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
