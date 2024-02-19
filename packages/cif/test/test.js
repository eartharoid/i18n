import fs from 'fs';
import { I18n } from '@eartharoid/i18n';
import { ctom, mtoc } from '../dist/index.js';
import test from 'ava';

let json = JSON.parse(
	fs.readFileSync('test/test.json', {
		encoding: 'utf8'
	})
);

const i18n = new I18n({
	defer_parsing: false,
});
const parsed = i18n.parse(json);
fs.writeFileSync('test/test.i18n.json', JSON.stringify(parsed, null, 2));
let cif;

test('mtoc', t => {
	cif = mtoc(parsed);
	fs.writeFileSync('test/test.cif', cif);
	t.pass();
});


test('ctom', t => {
	t.deepEqual(ctom(cif), parsed);
});