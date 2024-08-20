import Benchmarkify from 'benchmarkify';
import varint from 'varint';
import { uint32 } from 'protobuf-varint';
import VarIntDecoder from '../dist/lib/varint/decode.js';

const benchmark = new Benchmarkify(
	'varint benchmarks',
	{
		chartImage: true,
	}
).printHeader();

const INPUT = 576;

benchmark.createSuite('encode', { time: 5e3 })
	.ref('varint', () => {
		const buffer = new Uint8Array(varint.encodingLength(INPUT));
		varint.encode(INPUT, buffer, 0);
	})
	.add('protobuf-varint', () => {
		const encoder = uint32.fixedEncoder(INPUT);
		const buffer = new Uint8Array(encoder.bytes);
		encoder.encode(INPUT, buffer, 0);
	});


const buffer = new Uint8Array(varint.encodingLength(INPUT));
varint.encode(INPUT, buffer, 0);

benchmark.createSuite('decode', { time: 5e3 })
	.ref('varint', () => {
		varint.decode(buffer);
		varint.decode.bytes;
	})
	.add('protobuf-varint', () => {
		uint32.decode(buffer);
		uint32.decode.bytes;
	})
	.add('custom', () => {
		const decoder = new VarIntDecoder();
		decoder.decode(buffer);
		decoder.bytes;
	});


benchmark.run();