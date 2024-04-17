import { I18n } from '../dist/index.js';
import fs from 'fs';
import test from 'ava';

let locales = {};
fs.readdirSync('test/locales')
	.filter(file => file.endsWith('.json'))
	.forEach(file => {
		let data = fs.readFileSync(`test/locales/${file}`, {
			encoding: 'utf8'
		});
		let name = file.slice(0, file.length - 5);
		locales[name] = JSON.parse(data);
	});

const i18n = new I18n();
for (const [k, v] of Object.entries(locales)) i18n.load(k, v, 'common');

test('prefixed', t => {
	const translate = i18n.createTranslator('en');
	const expected = 'This is as simple as it gets';
	const actual = translate('common:simple');
	t.is(actual, expected);
});

test('non-prefixed', t => {
	t.throws(
		() => i18n.t('en', 'simple'),
		{ message: /does not contain a message with the key/ }
	);
});