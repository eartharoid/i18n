import type { ParsedMessages } from '@eartharoid/i18n/types';
export default class Compiler {
    #private;
    version: number;
    constructor(messages: ParsedMessages);
    toBuffer(): Uint8Array;
    [Symbol.iterator](): Iterator<number>;
}
