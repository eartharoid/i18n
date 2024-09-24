import type {
	ExtractedMessageObject,
	ParsedMessages,
} from '../types';
import { GROUP_OPT_TYPES, PLACEHOLDER_TYPES } from './common/enums.js';

const MSB = 0b10000000; // 128
const REST = 0b01111111; // 127
const INVERTED = ~REST; // -128
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
		offset = 0
	): Uint8Array | Array<number> {
		// Based on https://github.com/chrisdickinson/varint/blob/master/encode.js
		if (!Number.isSafeInteger(number)) throw new RangeError('Unsafe');
		while (number >= INT) {
			target[offset++] = (number & 0xFF) | MSB;
			number /= 128;
		}
		while (number & INVERTED) {
			target[offset++] = (number & 0xFF) | MSB;
			number >>>= 7;
		}
		target[offset] = number | 0;
		return target;
	}

	public toBuffer(): Uint8Array {
		return new Uint8Array(this);
	}

	public *[Symbol.iterator](): Iterator<number> {
		let prefix_segments = [];

		yield this.version;

		for (const [k, v] of this.#messages) {
			const key_segments = k.split('.');
			if (key_segments.length > 1) {
				if (key_segments.length > 255) {
					throw new Error(`"${k}" is too deeply nested (${key_segments.length}>255)`);
				}
				if (key_segments.length - 1 < prefix_segments.length) {
					prefix_segments = prefix_segments.slice(0, key_segments.length - 1);
				}
				let depth = null;
				for (let p = 0; p < key_segments.length - 1; p++) {
					if (key_segments[p] !== prefix_segments[p]) {
						depth = p;
						yield 0; // record type
						yield depth;
						break;
					}
				}
				if (depth !== null) {
					const new_segments = key_segments.slice(depth, key_segments.length - ('q' in v ? 0 : 1));
					prefix_segments = [
						...prefix_segments.slice(0, depth),
						...new_segments,
					];
					const encoded_segments = new_segments.map(segment => this.#encodeText(segment));
					const segment_lengths = encoded_segments.map((buffer, i) => {
						if (buffer.length > 255) {
							throw new Error(`Segment "${encoded_segments[i]}" is too long (${buffer.length}>255)`);
						}
						return buffer.length;
					});
					yield segment_lengths.length;
					yield* segment_lengths;
					for (const segment of encoded_segments) yield* segment;

					if ('q' in v) {
						const lengths: number[] = [];
						const last_segment = key_segments[key_segments.length - 1];
						const entries = Object.entries(v.q)
							.map(([ok, ov]) => {
								let ek: number[] | Uint8Array = [],
									ev: number[] | Uint8Array = [];
								switch (ok) {
								case 'cardinal': {
									ek = [GROUP_OPT_TYPES.cardinal];
									if (ov !== last_segment) ev = this.#encodeText(ov);
									break;
								}
								case 'ordinal': {
									ek = [GROUP_OPT_TYPES.ordinal];
									if (ov !== last_segment) ev = this.#encodeText(ov);
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
			} else if (prefix_segments.length > 0) {
				prefix_segments = [];
				yield 0; // record type
				yield 0; // depth
				yield 0; // prefix list length
			}

			if ('q' in v) continue;

			const trimmed_key = prefix_segments.length > 0 ? k.slice(prefix_segments.join('.').length + 1) : k;
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
								content = new Uint8Array([PLACEHOLDER_TYPES.$t, /* ... */]);
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