import type { I18nPlugin, I18nPluginOptions } from './types';
import type { JSONMessages } from '@eartharoid/i18n';
import { I18n } from '@eartharoid/i18n';
// @ts-ignore !?
import { mtoc } from '@eartharoid/cif';
import {
	createFilter,
	normalizePath
} from 'vite';


function encode(messages: JSONMessages): string {
	const i18n = new I18n({ defer_extraction: false });
	const parsed = i18n.parse(messages);
	return mtoc(parsed);
}

export default function I18nPlugin(options: I18nPluginOptions): I18nPlugin {
	return {
		enforce: 'pre',
		name: 'i18n',
		transform(src, id) {
			const filter = createFilter(options.include, options.exclude);
			if (filter(id)) {
				const id_regex = options.id_regex || /(?<id>[a-z-_]+)\.[a-z]+/i;
				const locale_id = id_regex.exec(normalizePath(id))?.groups?.id;
				const cif = encode(options.parser ? options.parser(src) : JSON.parse(src));
				return {
					// code: `{cif:"${cif}",locale_id:"${locale_id}"}`,
					code: JSON.stringify({ cif, locale_id }), // control characters must be escaped...
					map: null, // { mappings: '' }
				};
			}
		},
	};
}
