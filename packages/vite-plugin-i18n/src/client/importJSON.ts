import { ParsedMessages } from '@eartharoid/i18n/types/types';
import type { JSONModule } from '../types';

export default function importJSON(...modules: JSONModule[]): [string, ParsedMessages] {
	if (modules.length === 1) {
		return [modules[0].locale_id, modules[0].json];
	} else {
		return [modules[0].locale_id, [].concat(...modules.map(mod => mod.json))];
	}
}