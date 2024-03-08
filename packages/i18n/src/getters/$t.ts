import { Getter } from '../types';

type Parsed = {
	k: string,
	o?: {
		[key: string]: string
	}
};

export default <Getter>{
	get(locale, original, data: Parsed) {
		const [, , args] = original;
		return locale.t(data.k, {
			...args,
			...Object.fromEntries(Object.entries(data.o || {}).map(([k, v]) => [k, locale.i18n.resolve(args, v)])),
		});
	},
	parse(args) {
		const [key, options] = args.replace(/\s/g, '').split(',');
		const d: Parsed = {
			k: key
		};
		if (options) {
			d.o = Object.fromEntries(new URLSearchParams(options).entries());
		}
		return d;
	}
};