import type {
	ExtractedMessageObject,
	Fallen,
	I18nOptions,
	MetaMessageObject,
	ParsedMessage,
	ParsedMessages,
	RawMessages,
} from './types.js';
import type Locale from './Locale.js';
import I18nLite from './I18nLite.js';

export default class I18n extends I18nLite {
	public defer_extraction: boolean;
	public placeholder_regex: RegExp;

	constructor(options?: Partial<I18nOptions>) {
		super(options);
		this.defer_extraction = options?.defer_extraction ?? true; // ?? not ||
		this.placeholder_regex = options?.placeholder_regex || /\\?{\s?(?:(?<variable>[-a-z0-9._]+)|(?:(?<getter>[$a-z0-9_]+)(?:\((?<args>[-a-z0-9()!@:%_+.~#?&/= ,]*)\))?))\s?}/gi;
	}

	/**
	 * Extract placeholder data from a message
	 * @param {string} message
	 * @returns {ExtractedMessageObject}
	 */
	public extract(message: string): ExtractedMessageObject {
		// {data | formatter1(arg1,a=1&b=2&c=3)}
		const extracted: ParsedMessage = { t: message };
		const excluded: string[] = [];
		let match: RegExpExecArray | null = null;
		while ((match = this.placeholder_regex.exec(extracted.t)) !== null) {
			if (match[0].startsWith('\\')) {
				excluded.push(match[0]);
				continue;
			}
			extracted.t = extracted.t.substring(0, match.index) + extracted.t.substring(match.index + match[0].length);
			this.placeholder_regex.lastIndex -= match[0].length;
			if (extracted.p === undefined) extracted.p = [];
			if (match.groups.variable) {
				extracted.p.push([
					match.index,
					{
						v: match.groups.variable
					}
				]);
			} else {
				const g = match.groups.getter;
				const getter = this.getters[g];
				if (!getter) throw new Error(`Getter "${g}" is not registered`);
				extracted.p.push([
					match.index,
					{
						g,
						d: getter.parse(match.groups.args),
					}
				]);
			}
		}
		// unescape escaped placeholders
		excluded.forEach(str => extracted.t = extracted.t.replace(str, str.slice(1)));
		return extracted;
	}

	/**
	 * Resolve missing translations
	 * @param {Record<string, string[]>} [fallback_map]
	 * @returns {Fallen}
	 */
	public fallback(fallback_map?: Record<string, string[]>): Fallen {
		if (!this.default_locale_id) throw new Error('No default locale is set');
		let ordered_ids: string[];
		const default_locale = this.locales.get(this.default_locale_id);
		const locale_ids = Array.from(this.locales.keys());
		const fallen: Fallen = {};

		if (fallback_map) {
			const set = new Set(Object.keys(fallback_map));
			for (const locale_id of locale_ids) set.add(locale_id);
			ordered_ids = [...set.values()];
		} else {
			ordered_ids = locale_ids;
		}

		for (const locale_id of ordered_ids) {
			fallen[locale_id] = [];
			let fallback_order: string[];
			if (fallback_map) {
				fallback_order = [
					...(fallback_map[locale_id] || []),
					this.default_locale_id
				];
			} else {
				const base_language = new Intl.Locale(locale_id).language;
				if (base_language !== locale_id && this.locales.has(base_language)) fallback_order = [base_language, this.default_locale_id];
				else fallback_order = [this.default_locale_id];
			}
			const locale = this.locales.get(locale_id);
			for (const [key] of default_locale) {
				if (locale.has(key)) continue;
				for (const fallback_id of fallback_order) {
					const fallback_locale = this.locales.get(fallback_id);
					if (fallback_locale.has(key)) {
						locale.set(key, fallback_locale.get(key));
						fallen[locale_id].push([key, fallback_id]);
						break;
					}
				}
			}

		}

		return fallen;
	}

	/**
	 * Parse then load raw messages
	 * @param {string} locale_id 
	 * @param {RawMessages} messages
	 * @returns {Locale}
	 */
	public load(locale_id: string, messages: RawMessages, namespace?: string): Locale {
		return this.loadParsed(locale_id, this.parse(messages, namespace));
	}

	/**
	 * Parse raw messages
	 * @param {RawMessages} messages 
	 * @param {string} [namespace] 
	 * @returns {ParsedMessages}
	 */
	public parse(messages: RawMessages, namespace?: string): ParsedMessages {
		const parsed: ParsedMessages = [];
		for (const [k, v] of Object.entries(messages)) {
			let key = namespace ? namespace + ':' + k : k;
			let query: MetaMessageObject['q'];
			const fi = key.indexOf('#');
			if (fi !== -1) {
				query = { cardinal: k.substring(fi + 1) };
				key = k.substring(0, fi);
			} else {
				const qi = key.indexOf('?');
				if (qi !== -1) {
					query = Object.fromEntries(new URLSearchParams(k.substring(qi + 1)).entries());
					key = k.substring(0, qi);
				}
			}
			if (typeof v === 'string') {
				parsed.push([
					key,
					this.defer_extraction ? { o: v } : this.extract(v)
				]);
			} else if (typeof v === 'object') {
				if (query) {
					parsed.push([
						key,
						{ q: query }
					]);
				}
				const nested = this.parse(v);
				for (const [nested_k, ...nested_v] of nested) {
					parsed.push([
						key + '.' + nested_k,
						...nested_v
					]);
				}
			}
		}
		return parsed;
	}
}