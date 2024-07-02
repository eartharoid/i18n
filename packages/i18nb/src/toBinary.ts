import type { ParsedMessage } from '@eartharoid/i18n/types';

export default function* toBinary(messages: Record<string, ParsedMessage>): Generator<number> {
	let prefix_parts = [];
	yield 1; // version
}