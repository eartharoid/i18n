import type { ParsedMessages } from '@eartharoid/i18n';

export default function mtoc(messages: ParsedMessages): string {
	let cif = '#version=1\n';
	let prefix = '';
	for (const [key, value] of messages) {
		const parts = key.split('.');
		if (parts.length > 1) {
			const c_prefix = parts.slice(0, -1).join('.');
			if (c_prefix !== prefix) {
				prefix = c_prefix;
				cif += '::' + c_prefix + '\n';
			}
		}
		cif += key.slice(prefix.length + 1);
		if (value.p) {
			value.p.forEach(([pos, name]) => {
				cif += ' ' + pos + ' ' + name;
			});
		}
		cif += '\n' + value.t.replace(/\n/g, '\\n') + '\n';
	}
	return cif.slice(0, -1); // remove trailing new line
}