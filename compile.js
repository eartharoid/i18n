/* eslint-disable no-console */

import {
	Compiler,
	Parser
} from './dist/i18nb/index.js';


// const bytes = compile([[1, 2], [2, 3]]);

// for (const byte of bytes) {
//   console.log(byte);
// }

// const buffer = compile.toBuffer([[1, 2], [2, 3]]);
// console.log(buffer);




// const bytes = compile.compile([[1, 2], [2, 3]]);

// for (const byte of bytes) {
// 	console.log(byte);
// }

// const buffer = bytes.toBuffer();
// console.log(buffer);


const bytes = new Compiler([[1, 'A'], [2, 'B']]);

for (const byte of bytes) {
	console.log(byte);
}

const buffer = bytes.toBuffer();
console.log(buffer);

const parser = new Parser(await fetch('https://static.eartharoid.me/test.cif'));

for await (const item of parser) {
	console.log(item);
}