import type { I18nPlugin, I18nPluginOptions } from './types';
import type { ParsedMessages, RawMessages } from '@eartharoid/i18n';
import { I18n } from '@eartharoid/i18n';
// @ts-ignore !?
import { mtoc } from '@eartharoid/cif';
import {
	createFilter,
	normalizePath
} from 'vite';

function parse(messages: RawMessages): ParsedMessages {
	const i18n = new I18n({ defer_extraction: false });
	return i18n.parse(messages);
}

function encode(parsed: ParsedMessages): string {
	return mtoc(parsed);
}

export default function I18nPlugin(options: I18nPluginOptions): I18nPlugin {
	return {
		enforce: 'pre', // must run before vite:json
		name: 'i18n',
		transform(src, id) {
			const filter = createFilter(options.include, options.exclude);
			if (filter(id)) {
				const id_regex = options.id_regex || /(?<id>[a-z0-9-_]+)\.[a-z]+/i;
				const locale_id = id_regex.exec(normalizePath(id))?.groups?.id;
				const messages = options.parser ? options.parser(src) : JSON.parse(src);
				const parsed = parse(messages);
				const cif = encode(parsed);
				return {
					code: JSON.stringify({
						...options.compact ? { cif } : { json: parsed },
						locale_id
					}),
					map: { mappings: '' }, // TODO: generate a sourcemap
				};
			}
		},
	};
}
