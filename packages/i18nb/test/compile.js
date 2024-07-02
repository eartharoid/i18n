/* eslint-disable no-console */

import { Compiler } from '../dist/index.js';


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