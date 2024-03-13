import type { Locale, I18nLiteOptions } from '@eartharoid/i18n/types.d.ts';
declare module '@eartharoid/vite-plugin-i18n' {

	interface CIFModule {
		cif?: string,
		json?: ParsedMessages,
		locale_id: string,
	}

	interface I18nPluginOptions {
		compact?: boolean,
		exclude?: string | RegExp | Array<string | RegExp>,
		id_regex?: RegExp,
		include: string | RegExp | Array<string | RegExp>,
		parser?(src: string): string,
	}

	interface I18nPlugin {
		enforce: string,
		name: string,
		transform(code: string, id: string): unknown,
	}

	export class I18n {
		constructor(options: Partial<I18nLiteOptions>);
		public load(module: CIFModule): Locale
	}

	export function I18nPlugin(options: I18nPluginOptions): I18nPlugin;

}