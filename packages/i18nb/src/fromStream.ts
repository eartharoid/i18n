import type { ParsedMessages } from '@eartharoid/i18n/types';

export default function* fromStream(stream: ReadableStream, namespace?: string): ParsedMessages {
	// ! https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#browser_compatibility
	// ! try ReadableStreamBYOBReader else default

	yield;
}