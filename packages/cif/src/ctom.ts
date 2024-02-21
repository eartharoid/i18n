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
	// const meta = new URLSearchParams(records.shift());
	if (meta.has('version')) {
		version = Number(meta.get('version'));
	}
	if (version === 1) {
		let prefix = '';
		// start on the second record
		for (let i = 1; i < records.length; i++) {
			const record = records[i];
			// for (const record of records) {
			if (record[0] === control.GS && record[0].length > 1) {
				prefix = record.substring(1) + '.';
				continue;
			}
			const dp = record.indexOf(control.US); // much faster than split, there's only one per record
			const fields = [record.substring(0, dp), record.substring(dp + 1)]; // slightly faster than slice?
			const parts = fields[0].split('\t'); // [key, ...placeholders]
			const key = prefix + parts[0];
			const m: ParsedMessage = { t: fields[1] };
			if (parts.length > 1) {
				m.p = [];
				for (let i = 1; i < parts.length; i += 2) {
					m.p.push([Number(parts[i]), parts[i + 1]]);
				}
			}
			unmap[unmap.length] = [key, m]; // supposed to be faster than push?
		}
		return unmap;
	} else {
		throw new Error('Unsupported CIF version');
	}
}