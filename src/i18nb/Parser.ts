import type { ParsedMessage } from '../types';
import { VarIntDecoder } from '../lib/varint';

export default class Parser {
	#textDecoder = new TextDecoder();
	#varIntDecoder = new VarIntDecoder();
	#stream: ReadableStream<Uint8Array>;
	#length: number;
	#namespace?: string;

	constructor(response: Response, namespace?: string) {
		this.#stream = response.body;
		this.#length = +response.headers.get('content-length');
		this.#namespace = namespace;
	}

	#decodeText(bytes: Uint8Array): string {
		return this.#textDecoder.decode(bytes);
	}

	async *#chunksToBytes(chunks: AsyncIterable<Uint8Array>): AsyncIterable<number> {
		for await (const chunk of chunks) {
			yield* chunk;
		}
	}

	public async toArray(): Promise<Array<[string, ParsedMessage]>> {
		const array: Array<[string, ParsedMessage]> = [];
		for await (const message of this) {
			array.push(message);
		}
		return array;
	}

	public [Symbol.asyncIterator] = async function* (this: Parser): AsyncIterator<[string, ParsedMessage]> {
		let buffer = new ArrayBuffer(this.#length);
		
		try {
			const reader = this.#stream.getReader({ mode: 'byob' });
			try {
				let offset = 0;
				// eslint-disable-next-line no-constant-condition
				while (true) {
					const view = new Uint8Array(buffer, offset, buffer.byteLength - offset);
					const { done, value } = await reader.read(view);
					if (done) break;
					buffer = value.buffer;
					offset += value.byteLength;
				}
			} finally {
				reader.releaseLock();
			}
		} catch {
			const reader = this.#stream.getReader();
			try {
				// eslint-disable-next-line no-constant-condition
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
				}
			} finally {
				reader.releaseLock();
			}
		}
	
		yield;
	}
}