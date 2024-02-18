import type { ParsedMessages } from '@eartharoid/i18n';

export default function mtoc(messages: ParsedMessages): string {
	let cif = '#version=3\n';
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
			Object.entries(value.p).forEach(([name, pos]) => {
				cif += ' ' + name + ' ' + pos;
			});
		}
		cif += '\n' + value.t.replace(/\n/g, '\\n') + '\n';
	}
	return cif.slice(0, -1); // remove trailing new line
}