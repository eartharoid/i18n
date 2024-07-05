/**
 * Based on https://github.com/chrisdickinson/varint/blob/master/encode.js
 */

const MSB = 0b10000000;
const REST = 0b01111111;
const MSBALL = ~REST;
const INT = 2 ** 31;

export default class VarIntEncoder {
	public bytes: number;

	constructor() {
		this.bytes = 0;
	}

	encode(
		number: number,
		target: Uint8Array | Array<number> = [],
		offset = 0
	): Uint8Array | Array<number> {
		if (!Number.isSafeInteger(number)) {
			this.bytes = 0;
			throw new RangeError('Unsafe');
		}

		const original_offset = offset;

		while (number >= INT) {
			target[offset++] = (number & 0xFF) | MSB;
			number /= 128;
		}

		while (number & MSBALL) {
			target[offset++] = (number & 0xFF) | MSB;
			number >>>= 7;
		}

		target[offset] = number | 0;

		this.bytes = offset - original_offset + 1;

		return target;
	}
}