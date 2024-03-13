import type { I18nLiteOptions, Locale } from '@eartharoid/i18n';
import type { CIFModule } from './types';
import { I18nLite } from '@eartharoid/i18n';
// @ts-ignore
import { ctom } from '@eartharoid/cif';

export default class I18n extends I18nLite {
	constructor(options?: Partial<I18nLiteOptions>) {
		super(options);
	}

	public load(module: CIFModule): Locale {
		const { cif, json, locale_id } = module;
		return this.loadParsed(locale_id, cif ? ctom(cif) : json);
	}
}