import type { ParsedMessages } from '@eartharoid/i18n/types';

// if (!ReadableStream.prototype[Symbol.asyncIterator]) {
// 	// eslint-disable-next-line no-console
// 	console.warn('INSERTING POLYFILL: `ReadableStream.prototype[@@asyncIterator]`');
// 	ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
// 		const reader = this.getReader();
// 		try {
// 			while (true) {
// 				const { done, value } = await reader.read();
// 				if (done) {
// 					return;
// 				}
// 				yield value;
// 			}
// 		}
// 		finally {
// 			reader.releaseLock();
// 		}
// 	};
// }

async function* syncToAsync(iterable: Iterable<number>): AsyncIterable<number> {
	yield* iterable;
}

async function* chunksToBytes(chunks: AsyncIterable<Uint8Array>): AsyncIterable<number> {
	for await (const chunk of chunks) {
		yield* chunk;
	}
}

export default async function* parse(iterable: Iterable<number> | AsyncIterable<Uint8Array>, namespace?: string): ParsedMessages {
	// ! https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#browser_compatibility
	// ! try ReadableStreamBYOBReader else default
	let bytes: AsyncIterable<number>;

	if (Symbol.iterator in iterable) {
		bytes = syncToAsync(iterable);
	} else {
		if (!iterable[Symbol.asyncIterator]) {
			iterable[Symbol.asyncIterator] = async function* () {
				const reader = this.getReader();
				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) {
							return;
						}
						yield value;
					}
				}
				finally {
					reader.releaseLock();
				}
			};
		}
		bytes = chunksToBytes(iterable);
	}

	// but now parse is an asyncIterator..?
	for await (const byte of bytes) {
		yield byte;
	}
	
}