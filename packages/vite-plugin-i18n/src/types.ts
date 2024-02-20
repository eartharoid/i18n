export interface CIFModule {
	cif: string,
	locale_id: string,
}

export interface I18nPluginOptions {
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
