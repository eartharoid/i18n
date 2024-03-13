import inspect from 'vite-plugin-inspect';
// @ts-ignore
import { I18nPlugin } from '@eartharoid/vite-plugin-i18n';

export default {
	build: {
		target: 'esnext'
	},
	plugins: [
		inspect(),
		I18nPlugin({
			compact: false,
			include: 'src/locales/*'
		})
	],
	// json: {
	// 	stringify: true,
	// }
};