import type { ParsedMessages } from '@eartharoid/i18n/types';
import toBinary from './toBinary.js';

export default function toBuffer(messages: ParsedMessages): Uint8Array {
	return new Uint8Array(toBinary(messages));
}