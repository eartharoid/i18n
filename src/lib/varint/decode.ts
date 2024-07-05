/**
 * Based on https://github.com/martinheidegger/protobuf-varint/blob/main/lib/uint32.mjs
 * https://qiita.com/martinheidegger/items/dfd3d495b2dfe34616eb#turtle-slow-javascript-code
 * 20% faster than "varint"
 */

const MSB = 0b10000000;
const REST = 0b01111111;

export default class VarIntDecoder {
	public bytes: number;

	constructor() {
		this.bytes = 0;
	}

	decode(
		buffer: Uint8Array,
		offset = 0
	): number {
		let b = buffer[offset];
		if (!(b & MSB)) {
			this.bytes = 1;
			return b;
		}

		let result = b & REST;
		b = buffer[offset + 1];
		if (!(b & MSB)) {
			this.bytes = 2;
			return result | (b << 7);
		}

		result |= (b & REST) << 7;
		b = buffer[offset + 2];
		if (!(b & MSB)) {
			this.bytes = 3;
			return result | (b << 14);
		}

		result |= (b & REST) << 14;
		b = buffer[offset + 3];
		if (!(b & MSB)) {
			this.bytes = 4;
			return result | (b << 21);
		}

		this.bytes = 5;
		return (result | ((b & REST) << 21)) + buffer[offset + 4] * 0x10000000;
	}
}