import type { Plugin } from 'vite';
import type { ParsedMessages } from '@eartharoid/i18n/types/types';

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
	id_regex?: RegExp,
	include: string | RegExp | Array<string | RegExp>,
	parser?(src: string): string,
}

export interface I18nVitePlugin {
	enforce: string,
	name: string,
	transform(code: string, id: string): unknown,
}


export function importCIF(...modules: CIFModule[]): [string, ParsedMessages]

export function importJSON(...modules: JSONModule[]): [string, ParsedMessages]

export function I18nPlugin(options: I18nPluginOptions): Plugin<I18nVitePlugin>;