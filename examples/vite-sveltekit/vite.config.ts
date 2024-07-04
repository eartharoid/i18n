import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import { sveltekit } from '@sveltejs/kit/vite';
import I18nPlugin from '@eartharoid/vite-plugin-i18n';
// import ViteYaml from '@modyfi/vite-plugin-yaml';
import YAML from 'yaml';

export default defineConfig({
	plugins: [
		inspect(),
		// ViteYaml(),
		I18nPlugin({
			compact: false,
			default: 'en-GB',
			// fallback: {
			// 	'en-GB': 'en'
			// },
			parser: YAML.parse,
			id_regex: /((?<locale>[a-z0-9-_]+)\/)((_(?<namespace>[a-z0-9-_]+))|[a-z0-9-_]+)\.[a-z]+/i,
			include: 'src/lib/locales/*/*.yml'
		}),
		sveltekit(),
	]
});
