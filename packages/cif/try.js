/* eslint-disable no-console */

import { parse, parseStreamV2 } from './dist/parse.js';

const measure = async func => {
	const results = await Promise.all(Array(10).fill().map(func));
	const avg = results.reduce((a, b) => a + b, 0) / results.length;
	return +avg.toFixed(2);
};

const sync1 = async () => {
	const t1 = performance.now();
	const res = await fetch('https://static.eartharoid.me/test.cif');
	await parse(await res.text());
	const t2 = performance.now();
	return t2 - t1;
};

const streamed1 = async () => {
	const t1 = performance.now();
	const res = await fetch('https://static.eartharoid.me/test.cif');
	await parse(res.body);
	const t2 = performance.now();
	return t2 - t1;
};

const streamed2 = async () => {
	const t1 = performance.now();
	const res = await fetch('https://static.eartharoid.me/test.cif');
	await parseStreamV2(res.body);
	const t2 = performance.now();
	return t2 - t1;
};

// console.log('\nParser v1...');
const m1 = await measure(sync1);
const m2 = await measure(streamed1);
const m3 = await measure(streamed2);
console.log('Sync:        %d ms', m1);
console.log('Streamed v1: %d ms', m2);
console.log('Streamed v2: %d ms', m3);
const factor = +(Math.max(m1, m2, m3) / Math.min(m1, m2, m3)).toFixed(2);
console.log('%dx faster than slowest', factor);
