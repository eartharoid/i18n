import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import { sveltekit } from '@sveltejs/kit/vite';
import { I18nPlugin } from '@eartharoid/vite-plugin-i18n';

export default defineConfig({
	plugins: [
		inspect(),
		sveltekit(),
		I18nPlugin({
			compact: false,
			fallback: 'en-GB',
			id_regex: /((?<locale>[a-z0-9-_]+)\/)((_(?<namespace>[a-z0-9-_]+))|[a-z0-9-_]+)\.[a-z]+/i,
			include: 'src/lib/locales/*/*.json'
		}),
	]
});
