import type { ExtractedMessageObject, ParsedMessages } from '@eartharoid/i18n';
import control from './control.js';

export default function mtoc(messages: ParsedMessages): string {
	const sorted = messages.sort(([a], [b]) => a.split('.').length - b.split('.').length);
	let cif = 'version=1' + control.RS;
	let prefix = '';
	for (const [key, value] of sorted) {
		const parts = key.split('.');
		if (parts.length > 1) {
			const c_prefix = parts.slice(0, -1).join('.');
			if (c_prefix !== prefix) {
				prefix = c_prefix;
				cif += control.GS + c_prefix + control.RS;
			}
		}
		cif += prefix.length > 0 ? key.slice(prefix.length + 1) : key;
		if ('p' in value) {
			value.p.forEach(([pos, data]) => {
				let name: string;
				if ('v' in data) name = data.v;
				else name = JSON.stringify(data);	
				cif += '\t' + pos + '\t' + name;
			});
		}
		if ('q' in value) {
			cif += control.US + control.NUL + new URLSearchParams(value.q).toString() + control.RS;
		} else { // if ('t' in value)
			cif += control.US + (<ExtractedMessageObject>value).t + control.RS;
		}
		
	}
	return cif.slice(0, -1); // remove trailing new line
}