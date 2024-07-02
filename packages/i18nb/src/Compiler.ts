import type { ParsedMessage } from '@eartharoid/i18n/types';
import { encode as encodeVarInt } from 'varint';

// const version = 1;

// const textEncoder = new TextEncoder();
// const encodeText = (text: string) => textEncoder.encode(text); // ? encodeInto

// export default function* compile(messages: Iterable<[string, ParsedMessage]>): Iterable<number> {
// 	let prefix_parts = [];

// 	yield version;

// 	for (const [k, v] of messages) {
// 		const key_bytes = encodeText(k);
// 		yield* encodeVarInt(key_bytes.byteLength);
// 		yield* key_bytes;
// 	}
// }

// compile.toBuffer = function (messages: Iterable<[string, ParsedMessage]>) {
// 	return new Uint8Array(this(messages));
// };

// interface Compiler {
// 	messages: Iterable<[string, ParsedMessage]>;
// 	compile(messages: Iterable<[string, ParsedMessage]>): this;
// 	toBuffer(messages: Iterable<[string, ParsedMessage]>): Uint8Array;
// 	[Symbol.iterator](): Iterable<number>;
// }

// const compiler: Compiler = {
// 	messages: [],
// 	compile(messages: Iterable<[string, ParsedMessage]>) {
// 		this.messages = messages;
// 		return this;
// 	},
//	toBuffer(): Uint8Array {
// 		return new Uint8Array(this);
// 	},
// 	// [Symbol.iterator]: function* () {},
// 	*[Symbol.iterator](): Iterable<number> {
// 		const prefix_parts = [];

// 		yield version;

// 		for (const [k, v] of this.messages) {
// 			const key_bytes = encodeText(k);
// 			yield* encodeVarInt(key_bytes.byteLength);
// 			yield* key_bytes;
// 		}
// 	},
// };

type ParsedMessages = Iterable<[string, ParsedMessage]>;

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
		// const prefix_parts = [];

		yield this.version;

		for (const [k] of this.#messages) {
			const key_bytes = this.#encodeText(k);
			yield* encodeVarInt(key_bytes.byteLength);
			yield* key_bytes;
		}
	}
}