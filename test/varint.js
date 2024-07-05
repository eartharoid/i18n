import test from 'ava';
import {
	VarIntDecoder,
	VarIntEncoder
} from '../dist/lib/varint/index.js';

test('encoder', t => {
	const expected = [192, 4];
	const encoder = new VarIntEncoder();
	const actual = encoder.encode(576);
	t.deepEqual(actual, expected);
});

test('encoder.bytes', t => {
	const expected = 2;
	const encoder = new VarIntEncoder();
	encoder.encode(576);
	const actual = encoder.bytes;
	t.is(actual, expected);
});

test('decoder', t => {
	const expected = 576;
	const decoder = new VarIntDecoder();
	const actual = decoder.decode(new Uint8Array([192, 4]));
	t.is(actual, expected);
});

test('decoder.bytes', t => {
	const expected = 2;
	const decoder = new VarIntDecoder();
	decoder.decode(new Uint8Array([192, 4]));
	const actual = decoder.bytes; 
	t.is(actual, expected);
});