import type { ParsedMessages } from '@eartharoid/i18n';
import control from './control.js';

export default function mtoc(messages: ParsedMessages): string {
	let cif = 'version=1' + control.RS;
	let prefix = '';
	for (const [key, value] of messages) {
		const parts = key.split('.');
		if (parts.length > 1) {
			const c_prefix = parts.slice(0, -1).join('.');
			if (c_prefix !== prefix) {
				prefix = c_prefix;
				cif += control.GS + c_prefix + control.RS;
			}
		}
		cif += prefix.length > 0 ? key.slice(prefix.length + 1) : key;
		if (value.p) {
			value.p.forEach(([pos, name]) => {
				cif += '\t' + pos + '\t' + name;
			});
		}
		cif += control.US + value.t + control.RS;
	}
	return cif.slice(0, -1); // remove trailing new line
}