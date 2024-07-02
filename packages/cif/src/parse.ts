import type {
	ParsedMessage,
} from '@eartharoid/i18n/types/types.js';
import control from './control.js';

export function parseRecord(record: string): [string, ParsedMessage] | null {
	let prefix = '';
	// start on the second record
	if (record[0] === control.GS && record.length > 1) {
		// nest = ["a", "b", "c"], prefix = a.b.c
		// [GS] \t 1 \t B
		// ["a", "B"]
		prefix = record.substring(1) + '.';
		return null;
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
			m.p = [];
			for (let i = 1; i < parts.length; i += 2) {
				const pos = Number(parts[i]);
				const name = parts[i + 1];
				m.p.push([pos, name[0] === '{' ? JSON.parse(name) : { v: name }]);
			}
		}
	}
	return [key, m];
}

export async function parseStream(body: ReadableStream): Promise<Array<[string, ParsedMessage]>> {
	const decoder = new TextDecoderStream('utf-8');
	const reader = body.pipeThrough(decoder).getReader(); // { mode: 'byob' }
	const unmap: Array<[string, ParsedMessage]> = [];
	let buffer = '';
	let version: number | null = null;
	try {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			// for (const char of value)
			for (let i = 0, length = value.length; i < length; i++) {
				const char = value[i];
				if (char === control.RS) {
					if (version === null) {
						const meta = new URLSearchParams(buffer);
						if (meta.has('version')) {
							// @ts-ignore
							version = +meta.get('version');
							if (version !== 1) throw new Error('Unsupported CIF version');
						}
					} else {
						const parsed = parseRecord(buffer);
						buffer = '';
						if (parsed) unmap[unmap.length] = parsed;
					}
				} else {
					buffer += char;
				}
			}
		}
		return unmap;
	} finally {
		reader.releaseLock();
	}
}

// record types
const RT = {
	DEF: 0, // default
	PRE: 1, // prefix
};

// TODO: namespace
export async function parseStreamV2(body: ReadableStream): Promise<Array<[string, ParsedMessage]>> {
	const decoder = new TextDecoderStream('utf-8');
	const reader = body.pipeThrough(decoder).getReader(); // { mode: 'byob' }
	const unmap: Array<[string, ParsedMessage]> = [];
	let prefix_parts: string[] = [];
	let prefix_depth = 0;
	let prefix = '';
	let rt: number | null = null;
	let buffer = '';
	
	function reset() {
		buffer = '';
		rt = RT.DEF;
	}

	try {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			for (let i = 0, length = value.length; i < length; i++) {
				const char = value[i];
				switch (rt) {
				case RT.DEF: {
					if (char === control.GS) {
						rt = RT.PRE;
						break;
					}
					break;
				}
				case RT.PRE: {
					switch (char) {
					case control.HT: {
						// depth is required as the parser may increment it from the last real value
						prefix_depth = +buffer;
						// remove anything deeper than current
						if (prefix_depth > 0) {
							prefix_parts = prefix_parts.slice(0, prefix_depth);
						}
						buffer = '';
						break;
					}
					case '.': {
						prefix_parts[prefix_depth] = buffer;
						buffer = '';
						prefix_depth++;
						break;
					}
					case control.RS: {
						if (prefix_depth === -1) {
							prefix_parts = [];
							prefix = '';
						} else {
							prefix = prefix_parts.join('.') + '.';
						}
						reset();
						break;
					}
					default: {
						buffer += char;
					}
					}
					break;
				}
				}
			}
		}

		return unmap;
	} finally {
		reader.releaseLock();
	}
}

export async function parse(body: string | ReadableStream): Promise<Array<[string, ParsedMessage]>> {
	if (typeof body === 'string') {
		const unmap: Array<[string, ParsedMessage]> = [];
		const records = body.split(control.RS);
		let version = 1;
		const meta = new URLSearchParams(records[0]);
		if (meta.has('version')) {
			version = Number(meta.get('version'));
		}
		if (version === 1) {
			for (let i = 1, length = records.length; i < length; i++) {
				const parsed = parseRecord(records[i]);
				if (parsed) unmap[unmap.length] = parsed;
			}
			return unmap;
		} else {
			throw new Error('Unsupported CIF version');
		}
	} else {
		return parseStream(body);
	}
}