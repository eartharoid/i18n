import type { Getter } from '../../types.js';

export type Parsed = {
	k: string,
	o?: {
		[key: string]: string
	}
};

export default <Omit<Getter, 'parse'>>{
	get(locale, original, data: Parsed) {
		const [, original_key, args, cycle] = original;
		const new_ns_index = data.k.indexOf(':');
		let key = data.k;

		if (new_ns_index === -1) { // no new prefix
			// add original if exists
			const original_ns_index = original_key.indexOf(':');
			if (original_ns_index !== -1) {
				const original_ns = original_key.slice(0, original_ns_index);
				key = `${original_ns}:${data.k}`;
			}
		} else if (new_ns_index === 0) { // empty prefix
			// remove first char
			key = data.k.slice(1);
		}

		return locale.i18n.t(
			locale.locale_id,
			key,
			{
				...args,
				...Object.fromEntries(Object.entries(data.o || {}).map(([k, v]) => [k, locale.i18n.resolve(args, v)])),
			},
			cycle + 1
		);
	},
};