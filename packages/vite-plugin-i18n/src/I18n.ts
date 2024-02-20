import type { I18nOptions, Locale } from '@eartharoid/i18n';
import type { CIFModule } from './types';
import { I18nLite } from '@eartharoid/i18n';
// @ts-ignore
import { ctom } from '@eartharoid/cif';

export default class I18n extends I18nLite {
	constructor(options?: Partial<I18nOptions>) {
		super(options);
	}

	public load(module: CIFModule): Locale {
		const { cif, locale_id } = module;
		return this.loadParsed(locale_id, ctom(cif));
	}
}