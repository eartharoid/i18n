import type { ParsedMessages } from '@eartharoid/i18n/types';
import fromStream from './fromStream.js';

export default function* fromBuffer(buffer: Uint8Array, namespace?: string): ParsedMessages {
	// ! https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/from_static#browser_compatibility
	if (!('from' in ReadableStream)) {
		throw new Error('ReadableStream.from is not supported. Please use a polyfill such as @sec-ant/readable-stream');
	}
	// @ts-ignore
	yield* fromStream(ReadableStream.from(buffer), namespace);
}