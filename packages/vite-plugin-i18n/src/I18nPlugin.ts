import type { Plugin } from 'vite';
import type { I18nPluginOptions, I18nVitePlugin } from './types';
import type { RawMessages } from '@eartharoid/i18n/types/types';
import { I18n } from '@eartharoid/i18n';
// @ts-ignore !?
import { mtoc } from '@eartharoid/cif';
import {
	createFilter,
	normalizePath,
} from 'vite';
import { readFile } from 'node:fs/promises';
import { dataToEsm } from '@rollup/pluginutils';

export default function I18nPlugin(options: I18nPluginOptions): Plugin<I18nVitePlugin> {
	const parse = (src: string): RawMessages => options.parser ? options.parser(src) || {} : JSON.parse(src);
	return {
		enforce: 'pre',
		name: 'i18n',
		async transform(src, id) {
			const filter = createFilter(options.include, options.exclude);
			const [normalised, qs] = normalizePath(id).split('?');
			if (filter(normalised)) {
				// TODO: preprocess for i18next/weblate
				const query = new URLSearchParams(qs ?? '');
				const id_regex = options.id_regex || /(?<id>[a-z0-9-_]+)\.[a-z]+/i;
				// eslint-disable-next-line prefer-const
				let { locale, namespace } = id_regex.exec(normalised)?.groups || {};
				namespace = query.get('namespace') || namespace;
				const i18n = new I18n({
					default_locale_id: options.default,
					defer_extraction: false
				});
				i18n.load(locale, parse(src), namespace);
				if (options.default) {
					const file_name = normalised.replaceAll(locale, options.default);
					const fallback_messages = await readFile(file_name, 'utf-8');
					i18n.load(options.default, parse(fallback_messages), namespace);
					i18n.fallback(options.fallback);
				}
				const json = [...i18n.locales.get(locale).entries()];
				const cif = mtoc(json);
				const data = {
					...options.compact ? { cif } : { json },
					locale_id: locale
				};
				return {
					code: options.parser ? dataToEsm(data) : JSON.stringify(data),
					map: { mappings: '' }, // TODO: generate a sourcemap
				};
			}
		},
	};
}
