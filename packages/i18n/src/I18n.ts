import type {
	I18nOptions,
	JSONMessage,
	JSONMessages,
	ParsedMessage,
	ParsedMessages,
} from './types.js';
import type Locale from './Locale.js';
import I18nLite from './I18nLite.js';

export default class I18n extends I18nLite {
	public readonly named_placeholder_regex: RegExp;
	public readonly positional_placeholder_regex: RegExp;

	constructor(options?: Partial<I18nOptions>) {
		super(options);
		this.defer_extraction = options?.defer_extraction ?? true;
		/**
		 * ? Negative lookbehind is now supported in Safari so could be used,
		 * ? but we want to match escaped placeholders so we can unescape them 
		 */
		// this.named_placeholder_regex = options?.named_placeholder_regex || /(?<!\\){\s?(?<name>[a-z0-9\-._:]+)\s?}/gi;
		// this.positional_placeholder_regex = options?.positional_placeholder_regex || /(?<!\\)%(?<type>d|s)/g;

		this.named_placeholder_regex = options?.named_placeholder_regex || /\\?{\s?(?<name>[a-z0-9\-._]+)\s?}/gi;
		this.positional_placeholder_regex = options?.positional_placeholder_regex || /\\?%(?<type>d|s)/g;
		// this.named_placeholder_regex = options?.named_placeholder_regex || /\\?{\s{0,1}(?<name>[a-z0-9\-._]+)(\s{0,1}\|\s{0,1}(?<formatter>[a-z0-9\-_]+)\((?<params>[a-z0-9\-._?=&]+(,\s{0,1})?)*\))*\s{0,1}}/gi;
	}

	public extract(message: string): ParsedMessage {
		// {data | formatter1?param1=...&param2=...}
		// {data | formatter1(arg1,arg2)}
		const extracted: ParsedMessage = { t: message };
		const excluded: string[] = [];
		let count = 0;
		let match: RegExpExecArray | null = null;

		// extract positional placeholders
		while ((match = this.positional_placeholder_regex.exec(extracted.t)) !== null) {
			if (match[0].startsWith('\\')) {
				excluded.push(match[0]);
				continue;
			}
			extracted.t = extracted.t.substring(0, match.index) + extracted.t.substring(match.index + match[0].length);
			this.named_placeholder_regex.lastIndex -= match[0].length;
			if (extracted.p === undefined) extracted.p = [];
			extracted.p.push([match.index, count++]);
		}

		// if there are no positional placeholders, extract named placeholders
		if (count === 0) {
			while ((match = this.named_placeholder_regex.exec(extracted.t)) !== null) {
				if (match[0].startsWith('\\')) {
					excluded.push(match[0]);
					continue;
				}
				extracted.t = extracted.t.substring(0, match.index) + extracted.t.substring(match.index + match[0].length);
				this.named_placeholder_regex.lastIndex -= match[0].length;
				if (extracted.p === undefined) extracted.p = [];
				extracted.p.push([match.index, match.groups.name]);
			}
		}

		// unescape escaped placeholders
		excluded.forEach(str => extracted.t = extracted.t.replace(str, str.slice(1)));

		return extracted;
	}

	private flatten(messages: JSONMessages) {
		const flattened: Array<[string, string]> = [];
		for (const [k, v] of Object.entries(messages)) {
			if (typeof v === 'string') {
				flattened.push([k, v]);
			} else if (typeof v === 'object') {
				const nested = this.flatten(v);
				for (const [nested_k, nested_v] of nested) {
					flattened.push([k + '.' + nested_k, nested_v]);
				}
			}
		}
		return flattened;
	}

	/**
	 * Parse then load messages
	 * @param {string} locale_id 
	 * @param {JSONMessages} messages 
	 */
	public load(locale_id: string, messages: JSONMessages): Locale {
		return this.loadParsed(locale_id, this.parse(messages));
	}

	public parse(messages: JSONMessages): ParsedMessages {
		const flattened = this.flatten(messages);
		const parsed: ParsedMessages = [];
		for (const [k, v] of flattened) {
			parsed.push([
				k,
				this.defer_extraction ? { o: v } : this.extract(v)
			]);
		}
		return parsed;
	}
}