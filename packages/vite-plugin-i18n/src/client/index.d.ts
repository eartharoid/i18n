import type { ParsedMessages } from '@eartharoid/i18n/types/types';

export interface JSONModule {
	json: ParsedMessages,
	locale_id: string,
}

export function importJSON(...modules: JSONModule[]): [string, ParsedMessages]