import type { ExtractedMessageObject, ParsedMessages } from '@eartharoid/i18n/types/types.js';
import control from './control.js';

export default function mtoc(messages: ParsedMessages): string {
	let cif = '';
	let prefix_parts = [];
	for (let i = 0; i < messages.length; i++) {
		const [key, value] = messages[i];
		const key_parts = key.split('.');
		if (key_parts.length > 1) {
			let depth = null;
			for (let p = 0; p < key_parts.length - 1; p++) {
				if (key_parts[p] !== prefix_parts[p]) {
					depth = p;
					cif += control.GS + depth + control.US;
					continue;
				}
			}

			if (depth !== null)  {
				const new_parts = key_parts.slice(depth, key_parts.length - ('q' in value ? 0 : 1));
				prefix_parts = [
					...prefix_parts.slice(0, depth),
					...new_parts,
				];
				cif += new_parts.join('.');
				if ('q' in value) {
					// TODO: cardinal -> #
					cif += control.US + Object.entries(value.q).map(([k, v]) => k + control.HT + v).join(control.HT);
				}
				cif += control.RS;
				console.log({depth, new_parts});
			}
		} else if (prefix_parts.length > 0) {
			prefix_parts = [];
			cif += control.GS + '-1' + control.RS;
		}
		/** FIXME: change -1 behaviour?
{
  key: 'placeholder_getters.together',
  key_parts: [ 'placeholder_getters', 'together' ],
  prefix_parts: [ 'placeholder_getters', 'girls' ],
  revised_key: 'er',
  q: false
}
		 */
		console.log({
			key,
			key_parts,
			prefix_parts,
			revised_key: prefix_parts.length > 0 ? key.slice(prefix_parts.join('.').length + 1) : key,
			q: 'q' in value && value.q,
		}, '\n');
		if ('q' in value) continue;
		const trimmed_key = prefix_parts.length > 0 ? key.slice(prefix_parts.join('.').length + 1) : key;
		cif += trimmed_key + control.US + (<ExtractedMessageObject>value).t;
		if ('p' in value) {
			const placeholders = value.p
				.map(([pos, data]) => {
					let name: string;
					if ('v' in data) name = data.v;
					else name = JSON.stringify(data);
					return pos + control.HT + name;
				})
				.join(control.HT);
			cif += control.US + placeholders;
		}
		if (i !== messages.length - 1) cif += control.RS;
		
	}
	return cif;
}