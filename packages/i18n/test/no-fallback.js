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

const i18n = new I18n({
	defer_extraction: false,
});
for (const [k, v] of Object.entries(locales)) i18n.load(k, v);


test('missing translation', t => {
	t.throws(
		() => i18n.t('no', 'english_only.nested.deeply'),
		{ message: /does not contain a message with the key/ }
	);
});