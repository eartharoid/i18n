import type { ParsedMessages } from '@eartharoid/i18n/types';
import { encode as encodeVarInt } from 'varint';

export default class Compiler {
	#messages: ParsedMessages;
	#textEncoder = new TextEncoder();

	public version = 1;

	constructor(messages: ParsedMessages) {
		this.#messages = messages;
		return this;
	}

	#encodeText(text: string): Uint8Array {
		return this.#textEncoder.encode(text);
	}

	public toBuffer(): Uint8Array {
		return new Uint8Array(this as unknown as Iterable<number>);
	}

	public *[Symbol.iterator](): Iterable<number> {
		// let prefix_parts = [];

		yield this.version;

		for (const [k] of this.#messages) {
			const key_bytes = this.#encodeText(k);
			yield* encodeVarInt(key_bytes.byteLength);
			yield* key_bytes;
		}
	}
}