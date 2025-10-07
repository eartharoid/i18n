import type {
	ExtractedMessageObject,
	ParsedMessages,
} from '../types';
import {
	GROUP_OPT_TYPES, PLACEHOLDER_TYPES,
} from './common/enums.js';

const INT = 2 ** 31;

export default class Encoder {
	#messages: ParsedMessages;
	#textEncoder = new TextEncoder();

	public version = 1;

	constructor(messages: ParsedMessages) {
		this.#messages = messages;
	}

	#encodeText(text: string): Uint8Array {
		return this.#textEncoder.encode(text);
	}

	#encodeVarInt(
		number: number,
		target: Uint8Array | Array<number> = [],
		offset = 0,
	): Uint8Array | Array<number> {
		// Based on https://github.com/chrisdickinson/varint/blob/master/encode.js
		if (!Number.isSafeInteger(number)) throw new RangeError('Unsafe');
		while (number >= INT) {
			target[offset++] = (number & 0xFF) | 128;
			number /= 128;
		}
		while (number & -128) {
			target[offset++] = (number & 0xFF) | 128;
			number >>>= 7;
		}
		target[offset] = number | 0;
		return target;
	}

	public toBuffer(): Uint8Array {
		return new Uint8Array(this);
	}

	public *[Symbol.iterator](): Iterator<number> {
		let prefix_parts = [];

		yield this.version;

		for (const [k, v] of this.#messages) {
			const key_parts = k.split('.');
			if (key_parts.length > 1) {
				if (key_parts.length > 255) {
					throw new Error(`"${k}" is too deeply nested (${key_parts.length}>255)`);
				}
				if (key_parts.length - 1 < prefix_parts.length) {
					prefix_parts = prefix_parts.slice(0, key_parts.length - 1);
				}
				let depth = null;
				for (let p = 0; p < key_parts.length - 1; p++) {
					if (key_parts[p] !== prefix_parts[p]) {
						depth = p;
						yield 0; // record type
						yield depth;
						break;
					}
				}
				if (depth !== null) {
					const new_parts = key_parts.slice(depth, key_parts.length - ('q' in v ? 0 : 1));
					prefix_parts = [
						...prefix_parts.slice(0, depth),
						...new_parts,
					];
					const encoded_parts = new_parts.map(part => this.#encodeText(part));
					const part_lengths = encoded_parts.map((buffer, i) => {
						if (buffer.length > 255) {
							throw new Error(`part "${encoded_parts[i]}" is too long (${buffer.length}>255)`);
						}
						return buffer.length;
					});
					yield part_lengths.length;
					yield* part_lengths;
					for (const part of encoded_parts) yield* part;

					if ('q' in v) {
						const lengths: number[] = [];
						const last_part = key_parts[key_parts.length - 1];
						const entries = Object.entries(v.q)
							.map(([ok, ov]) => {
								let ek: number[] | Uint8Array = [],
									ev: number[] | Uint8Array = [];
								switch (ok) {
								case 'cardinal': {
									ek = [GROUP_OPT_TYPES.cardinal];
									if (ov !== last_part) ev = this.#encodeText(ov);
									break;
								}
								case 'ordinal': {
									ek = [GROUP_OPT_TYPES.ordinal];
									if (ov !== last_part) ev = this.#encodeText(ov);
									break;
								}
								default: {
									ek = this.#encodeText(ok);
									ev = this.#encodeText(ov);
									break;
								}
								}
								lengths.push(ek.length);
								lengths.push(ev.length);
								return [...ek, ...ev];
							})
							.flat();
						yield lengths.length;
						yield* lengths; // k, v, ...
						yield* entries;
					}

				}
			} else if (prefix_parts.length > 0) {
				prefix_parts = [];
				yield 0; // record type
				yield 0; // depth
				yield 0; // prefix list length
			}

			if ('q' in v) continue;

			const trimmed_key = prefix_parts.length > 0 ? k.slice(prefix_parts.join('.').length + 1) : k;
			const encoded_trimmed_key = this.#encodeText(trimmed_key);
			yield encoded_trimmed_key.length;
			yield* encoded_trimmed_key;

			const encoded_text = this.#encodeText((<ExtractedMessageObject>v).t);
			yield* this.#encodeVarInt(encoded_text.length);
			yield* encoded_text;

			if ('p' in v) {
				const lengths: number[] = [];
				const placeholders = v.p
					.map(([pos, data]) => {
						let content: Uint8Array;
						if ('v' in data) {
							content = this.#encodeText(data.v);
						} else if ('g' in data) {
							switch (data.g) {
							case '$t': {
								content = new Uint8Array([PLACEHOLDER_TYPES.$t]);
								// TODO: append data.k and data.o{}
								// data.k LK
								// data.o LKV
								break;
							}
							default: {
								content = this.#encodeText(JSON.stringify(data));
								break;
							}
							}
						}

					});
				// NUM_PLACEHOLDERS VARINT_POSITION[] DATA_LENGTH[] DATA[]
				yield placeholders.length;
				// yield* lengths
				// yield* entries
			}

		}
	}
}