import type { ParsedMessage } from '../types';

const MSB = 0b10000000;
const REST = 0b01111111;

export default class Decoder {
	#textDecoder = new TextDecoder();
	#stream: ReadableStream<Uint8Array>;
	#length: number;
	#namespace?: string;

	constructor(response: Response, namespace?: string) {
		this.#stream = response.body;
		this.#length = +response.headers.get('content-length');
		// TODO:
		this.#namespace = namespace;
	}

	#decodeText(bytes: Uint8Array): string {
		return this.#textDecoder.decode(bytes);
	}

	#decodeVarInt(
		buffer: Uint8Array,
		offset = 0
	): number {
		/**
		 * Based on https://github.com/martinheidegger/protobuf-varint/blob/main/lib/uint32.mjs
		 * https://qiita.com/martinheidegger/items/dfd3d495b2dfe34616eb#turtle-slow-javascript-code
		 * 30% faster than "varint"
 		*/

		let byte = buffer[offset++];

		if (!(byte & MSB)) {
			// this.bytes = 1;
			return byte;
		}

		let result = byte & REST;

		const nextByte = (count: number, x: number, y: number) => {
			byte = buffer[offset++];
			if (byte === undefined) throw new Error('Unexpected end of bytes');
			if (x) result |= (byte & REST) << x;
			if (!(byte & MSB)) {
				// this.bytes = count;
				return result | (byte << y);
			}
			return null;
		};

		let final = nextByte(2, 0, 7);
		if (final !== null) return final;

		final = nextByte(3, 7, 14);
		if (final !== null) return final;

		final = nextByte(4, 14, 21);
		if (final !== null) return final;

		return nextByte(5, 21, 28);
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

	public [Symbol.asyncIterator] = async function* (this: Decoder): AsyncIterator<[string, ParsedMessage]> {
		// TODO: make this not a generator and use yield for pausing/resuming the actual parser?
		let buffer = new ArrayBuffer(this.#length);

		try {
			const reader = this.#stream.getReader({ mode: 'byob' });
			let write_offset = 0;
			try {
				// eslint-disable-next-line no-constant-condition
				while (true) {
					const view = new Uint8Array(buffer, write_offset, buffer.byteLength - write_offset);
					const { done, value } = await reader.read(view);
					if (done) break;
					buffer = value.buffer;
					write_offset += value.length;
				}
			} finally {
				reader.releaseLock();
			}
		} catch {
			const reader = this.#stream.getReader();
			const view = new Uint8Array(buffer);
			let write_offset = 0;
			try {
				// eslint-disable-next-line no-constant-condition
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					view.set(value, write_offset);
					write_offset += value.length;
				}
			} finally {
				reader.releaseLock();
			}
		}

		yield;
	}
}