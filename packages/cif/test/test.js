import fs from 'fs';
import { I18n } from '@eartharoid/i18n';
import { ctom, mtoc } from '../dist/index.js';
import { parse } from '../dist/parse.js';
import test from 'ava';

const dir = 'test';
// const dir = '../../benchmark/samples';

let json = JSON.parse(
	fs.readFileSync(`${dir}/test.json`, {
		// fs.readFileSync('test/single.json', {
		encoding: 'utf8'
	})
);

const i18n = new I18n({
	defer_extraction: false,
});
const parsed = i18n.parse(json);
fs.writeFileSync(`${dir}/test.i18n.json`, JSON.stringify(parsed, null, 2));
let cif;

test('mtoc', t => {
	cif = mtoc(parsed);
	fs.writeFileSync(`${dir}/test.cif`, cif);
	t.pass();
});


// test('ctom', async t => {
// 	// t.deepEqual(ctom(cif), parsed);
// 	const res = await fetch('http://static.eartharoid.me/test.cif');
// 	t.deepEqual(await parse(res.body), parsed);
// });