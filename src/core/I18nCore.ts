import type {
	ExtractedMessageObject,
	FactoryLocaleInserter,
	Getter,
	I18nCoreOptions,
	Locales,
	NamedArg,
	NamedArgs,
	ParsedMessages,
	Translator
} from '../types.js';
import I18n from '../I18n.js';
import Locale from './Locale.js';
import $t from './functions/$t.js';

export default class I18nCore {
	public default_locale_id: string;
	public formatters: Record<string, FactoryLocaleInserter<unknown>>;
	public getters: Record<string, Omit<Getter, 'parse'>>;
	public locales: Locales;
	public nested_limit: number;

	constructor(options?: Partial<I18nCoreOptions>) {
		this.default_locale_id = options?.default_locale_id;
		this.formatters = options?.formatters ?? {};
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
	public load(locale_id: string, messages: ParsedMessages): Locale {
		let locale: Locale;
		if (this.locales.has(locale_id)) {
			locale = this.locales.get(locale_id);
			for (const [k, v] of messages) locale.set(k, v);
		} else {
			locale = new Locale(this, locale_id, messages);
			this.locales.set(locale_id, locale);
		}
		return locale;
	}

	public resolve(
		obj: NamedArgs,
		key: string
	): NamedArg | undefined {
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
	public t = (
		locale_id: string,
		key: string,
		args: NamedArgs = {},
		nested = 0
	): string => {
		const human_id = `${locale_id}/${key}`; 
		if (nested > this.nested_limit) {
			throw new Error(`Potential circular translation, "${human_id}" exceeded nesting limit (${this.nested_limit})`);
		}

		// locale does not exist
		if (!this.locales.has(locale_id)) {
			throw new Error(`Locale "${locale_id}" does not exist`);
		}

		const locale = this.locales.get(locale_id);

		// locale exists but key does not
		if (!locale.has(key)) {
			throw new Error(`Message "${human_id}" does not exist`);
		}

		let message = locale.get(key);

		// pluralisation
		if ('q' in message) {
			const plural_type = (message.q.cardinal && 'cardinal') || (message.q.ordinal && 'ordinal') || null;
			if (plural_type) {
				const input = this.resolve(args, message.q[plural_type]);
				if (isNaN(Number(input)) && !Array.isArray(input)) {
					throw new Error(`A number/array value for the "${message.q[plural_type]}" variable is required`);
				}
				const literal = `${key}.=${input}`;
				if (locale.has(literal)) {
					key = literal;
				} else {
					const pr = new Intl.PluralRules(locale_id, { type: plural_type });
					// @ts-ignore yes it does
					const rule: Intl.LDMLPluralRule = Array.isArray(input) ? pr.selectRange(...input) : pr.select(input);
					key = key + '.' + rule;
					if (!locale.has(key)) {
						throw new Error(`"${locale_id}" locale does not contain a message with the key "${key}" required for pluralisation`);
					}
				}
				message = locale.get(key);
			}
		}

		let extracted: ExtractedMessageObject;

		if (!('t' in message)) {
			if (!(this instanceof I18n) || !('o' in message)) {
				throw new Error(`Message "${key}" in the "${locale_id}" locale has not been extracted`);
			}
			const parsed = this.extract(message.o);
			locale.set(key, parsed);
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
				const resolved = this.resolve(args, String(placeholder.v));
				if (typeof resolved === 'function') {
					value = resolved(locale.formatters).result;
				} else {
					value = resolved?.toString();
				}

			} else {
				name = placeholder.g;
				value = this.getters[placeholder.g].get(
					locale,
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
