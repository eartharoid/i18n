import type { ParsedMessage } from '@eartharoid/i18n/types';

export default function* fromStream(): Iterable<[string, ParsedMessage]> {
	// ! ReadableStream.@@asyncIterator (check support) -- https://www.npmjs.com/package/@sec-ant/readable-stream
	// ! try ReadableStreamBYOBReader else default

	yield;
}