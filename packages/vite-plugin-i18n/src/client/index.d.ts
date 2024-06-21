import type { ParsedMessages } from '@eartharoid/i18n/types/types';

export interface CIFModule {
	cif: string,
	locale_id: string,
}

export interface JSONModule {
	json: ParsedMessages,
	locale_id: string,
}

export function importCIF(...modules: CIFModule[]): [string, ParsedMessages]

export function importJSON(...modules: JSONModule[]): [string, ParsedMessages]