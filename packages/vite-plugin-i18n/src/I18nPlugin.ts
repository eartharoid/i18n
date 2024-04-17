import type { Plugin } from 'vite';
import type { I18nPluginOptions, I18nVitePlugin } from './types';
import type { ParsedMessages, RawMessages } from '@eartharoid/i18n/types/types';
import { I18n } from '@eartharoid/i18n';
// @ts-ignore !?
import { mtoc } from '@eartharoid/cif';
import {
	createFilter,
	normalizePath,
} from 'vite';

function parse(messages: RawMessages, namespace?: string): ParsedMessages {
	const i18n = new I18n({ defer_extraction: false });
	return i18n.parse(messages, namespace);
}

export default function I18nPlugin(options: I18nPluginOptions): Plugin<I18nVitePlugin> {
	return {
		enforce: 'pre', // must run before vite:json
		name: 'i18n',
		transform(src, id) {
			const filter = createFilter(options.include, options.exclude);
			const [normalised, qs] = normalizePath(id).split('?');
			if (filter(normalised)) {
				// TODO: preprocess for i18next/weblate
				const query = new URLSearchParams(qs ?? '');
				const id_regex = options.id_regex || /(?<id>[a-z0-9-_]+)\.[a-z]+/i;
				// eslint-disable-next-line prefer-const
				let { locale, namespace } = id_regex.exec(normalised)?.groups || {};
				namespace = query.get('namespace') || namespace;
				const messages = options.parser ? options.parser(src) : JSON.parse(src);
				const parsed = parse(messages, namespace);
				const cif = mtoc(parsed);
				return {
					code: JSON.stringify({
						...options.compact ? { cif } : { json: parsed },
						locale_id: locale
					}),
					map: { mappings: '' }, // TODO: generate a sourcemap
				};
			}
		},
	};
}
