import {
	beforeAll,
	expect,
	test,
} from 'bun:test';
import { I18n } from '../src';
import { readFile } from 'fs/promises';

const FIXTURES = './packages/i18n/tests/fixtures';

let i18n: I18n;

beforeAll(async () => {
	i18n = new I18n();
	for (const l of ['en', 'no']) {
		i18n.load(l, JSON.parse(await readFile(`${FIXTURES}/${l}.json`, { encoding: 'utf8' })));
	}
});

test('missing translation', () => {
	expect(() => i18n.t('no', 'english_only.nested.deeply')).toThrow(/does not exist/);
});