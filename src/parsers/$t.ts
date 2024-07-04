import type { Getter } from '../types.js';
import $t, { type Parsed } from '../core/functions/$t.js';

export default <Getter>{
	...$t,
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