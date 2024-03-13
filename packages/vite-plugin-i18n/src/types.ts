import { ParsedMessages } from '@eartharoid/i18n';
export interface CIFModule {
	cif?: string,
	json?: ParsedMessages,
	locale_id: string,
}

export interface I18nPluginOptions {
	compact?: boolean,
	exclude?: string | RegExp | Array<string | RegExp>,
	id_regex?: RegExp,
	include: string | RegExp | Array<string | RegExp>,
	parser?(src: string): string,
}

export interface I18nPlugin {
	enforce: string,
	name: string,
	transform(code: string, id: string): unknown,
}
