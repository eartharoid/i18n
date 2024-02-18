import type {
	ParsedMessage,
	ParsedMessages
} from '@eartharoid/i18n';

export default function ctom(cif: string): ParsedMessages {
	const unmap = [];
	const lines = cif.split(/\r?\n/);
	let version = 3;
	if (lines[0].startsWith('#')) {
		const comment = lines.shift().replace(/#\s*/, ''); // ! this mutates lines
		const meta = new URLSearchParams(comment);
		if (meta.has('version')) version = Number(meta.get('version'));
	}
	if (version === 3) {
		let prefix = '';
		let op = 1;
		for (const line of lines) {
			if (op === 1) {
				if (line.substring(0, 2) === '::') {
					prefix = line.substring(2) + '.';
					continue;
				}
				const parts = line.split(' ');
				const key = prefix + parts[0];
				const m: ParsedMessage = { t: '' };
				if (parts.length > 1) {
					m.p = {};
				}
				for (let i = 1; i < parts.length; i += 2) {
					m.p[parts[i]] = Number(parts[i + 1]);
				}
				unmap[unmap.length] = [key, m]; // supposed to be faster than push
				op = 2;
			} else {
				unmap[unmap.length - 1][1].t = line.replace(/\\n/g, '\n');
				op = 1;
			}
		}
		return unmap;
	} else {
		throw new Error('Unsupported CIF version');
	}
}