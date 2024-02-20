import inspect from 'vite-plugin-inspect';
// @ts-ignore
import { I18nPlugin } from '@eartharoid/vite-plugin-i18n';

export default {
	plugins: [
		inspect(),
		I18nPlugin({
			include: 'src/locales/*'
		})
	],
	// json: {
	// 	stringify: true,
	// }
};