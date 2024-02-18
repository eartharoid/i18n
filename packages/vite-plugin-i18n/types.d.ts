import type { ParsedMessages } from '@eartharoid/i18n';

declare module '@eartharoid/cif' {

	export function ctom(cif: string): ParsedMessages;

	export function mtoc(messages: ParsedMessages): string;

}