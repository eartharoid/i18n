import {
	ParsedMessages,
	RawMessages
} from '@eartharoid/i18n/types/types';

export interface CIFModule {
	cif: string,
	locale_id: string,
}

export interface JSONModule {
	json: ParsedMessages,
	locale_id: string,
}

export interface I18nPluginOptions {
	compact?: boolean,
	exclude?: string | RegExp | Array<string | RegExp>,
	default?: string,
	fallback?: Record<string, string[]>,
	generate_fallback_file?: boolean,
	id_regex?: RegExp,
	include: string | RegExp | Array<string | RegExp>,
	parser?(src: string): Promise<RawMessages>,
}

export interface I18nVitePlugin {
	// enforce: string,
	name: string,
	// resolveId(id: string): string | void,
	// load(id: string): Promise<string | void>,
	transform(code: string, id: string): Promise<unknown>,
	generateBundle(): void,
}
