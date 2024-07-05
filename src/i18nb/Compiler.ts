import type { ParsedMessages } from '../types';
import { VarIntEncoder } from '../lib/varint';

export default class Compiler {
	#messages: ParsedMessages;
	#textEncoder = new TextEncoder();
	#varIntEncoder = new VarIntEncoder();

	public version = 1;

	constructor(messages: ParsedMessages) {
		this.#messages = messages;
	}

	#encodeText(text: string): Uint8Array {
		return this.#textEncoder.encode(text);
	}

	public toBuffer(): Uint8Array {
		return new Uint8Array(this);
	}

	public *[Symbol.iterator](): Iterator<number> {
		// let prefix_parts = [];

		yield this.version;

		for (const [k] of this.#messages) {
			const key_bytes = this.#encodeText(k);
			// yield* encodeVarInt(key_bytes.byteLength);
			yield* key_bytes;
		}
	}
}