import type {
	ExtractedMessageObject,
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

	private flatten(messages: RawMessages) {
		const flattened: Array<[string, string | MetaMessageObject['q']]> = [];
		for (const [k, v] of Object.entries(messages)) {
			let key = k;
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
				flattened.push([key, v]);
			} else if (typeof v === 'object') {
				if (query) {
					flattened.push([key, query]);
				}
				const nested = this.flatten(v);
				for (const [nested_k, ...nested_v] of nested) {
					flattened.push([key + '.' + nested_k, ...nested_v]);
				}
			}
		}
		return flattened;
	}

	/**
	 * Parse then load messages
	 * @param {string} locale_id 
	 * @param {RawMessages} messages 
	 */
	public load(locale_id: string, messages: RawMessages, namespace?: string): Locale {
		return this.loadParsed(locale_id, this.parse(messages, namespace));
	}

	public parse(messages: RawMessages, namespace?: string): ParsedMessages {
		const flattened = this.flatten(messages);
		const parsed: ParsedMessages = [];
		for (const [k, v] of flattened) {
			const key = namespace ? namespace + ':' + k : k;
			if (typeof v === 'string') {
				parsed.push([
					key,
					this.defer_extraction ? { o: v } : this.extract(v)
				]);
			} else {
				parsed.push([
					key,
					{ q: v }
				]);
			}

		}
		return parsed;
	}
}