import type { ParsedMessage } from '@eartharoid/i18n/types';

export default function* fromBuffer(): Iterable<[string, ParsedMessage]> {
	// ! ReadableStream.from() is not widely supported -- https://www.npmjs.com/package/@sec-ant/readable-stream

	yield;
}