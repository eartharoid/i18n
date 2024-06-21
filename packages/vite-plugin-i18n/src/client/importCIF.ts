import type { ParsedMessages } from '@eartharoid/i18n/types/types';
import type { CIFModule } from '../types';
import { ctom } from '@eartharoid/cif';

export default function importCIF(...modules: CIFModule[]): [string, ParsedMessages] {
	if (modules.length === 1) {
		return [modules[0].locale_id, ctom(modules[0].cif)];
	} else {
		return [modules[0].locale_id, [].concat(...modules.map(mod => mod.cif))];
	}
}