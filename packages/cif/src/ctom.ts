import type {
	ParsedMessage,
	ParsedMessages
} from '@eartharoid/i18n';
import control from './control.js';

export default function ctom(cif: string): ParsedMessages {
	const unmap = [];
	const records = cif.split(control.RS);
	let version = 1;
	const meta = new URLSearchParams(records[0]);
	if (meta.has('version')) {
		version = Number(meta.get('version'));
	}
	if (version === 1) {
		let prefix = '';
		// start on the second record
		for (let i = 1, length = records.length; i < length; i++) {
			const record = records[i];
			if (record[0] === control.GS && record.length > 1) {
				prefix = record.substring(1) + '.';
				continue;
			}
			const dp = record.indexOf(control.US); // much faster than split, there's only one per record
			const fields = [record.substring(0, dp), record.substring(dp + 1)]; // slightly faster than slice?
			const parts = fields[0].split('\t'); // [key, ...placeholders]
			const key = prefix + parts[0];
			let m: ParsedMessage;
			if (fields[1][0] === control.NUL) {
				m = { q: Object.fromEntries(new URLSearchParams(fields[1].substring(1))) };
			} else {
				m = { t: fields[1] };
				if (parts.length > 1) {
					m.p =[];
					for (let i = 1; i < parts.length; i += 2) {
						const pos = Number(parts[i]);
						const name = parts[i + 1];
						m.p.push([pos, name[0] === '{' ? JSON.parse(name) : { v: name }]);
					}
				}
			} 
			unmap[unmap.length] = [key, m]; // supposed to be faster than push?
		}
		return unmap;
	} else {
		throw new Error('Unsupported CIF version');
	}
}