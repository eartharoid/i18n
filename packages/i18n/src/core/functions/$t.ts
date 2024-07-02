import type { Getter } from '../../types.js';

export type Parsed = {
	k: string,
	o?: {
		[key: string]: string
	}
};

export default <Omit<Getter, 'parse'>>{
	get(locale, original, data: Parsed) {
		const [, , args, cycle] = original;
		return locale.i18n.t(
			locale.locale_id,
			data.k,
			{
				...args,
				...Object.fromEntries(Object.entries(data.o || {}).map(([k, v]) => [k, locale.i18n.resolve(args, v)])),
			},
			cycle + 1
		);
	},
};