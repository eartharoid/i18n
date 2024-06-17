import type { ParsedMessages } from '@eartharoid/i18n/types/types';
import type { JSONModule } from '@eartharoid/vite-plugin-i18n'
// import { importJSON } from "@eartharoid/vite-plugin-i18n";

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

export async function load() {
	const locale = 'fr-FR';
	
	const importJSON = (...modules: JSONModule[]): [string, ParsedMessages] => ([modules[0].locale_id, [].concat(...<never[]>modules.map(mod => mod.json))]);
	return {
		translations: importJSON(
			await import(`$lib/locales/${locale}/_footer.yml`),
			await import(`$lib/locales/${locale}/common.yml?namespace=common`),
			await import(`$lib/locales/${locale}/home.yml`)
		)
	};
}