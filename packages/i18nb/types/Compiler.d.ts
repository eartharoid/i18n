import type { ParsedMessage } from '@eartharoid/i18n/types';
type ParsedMessages = Iterable<[string, ParsedMessage]>;
export default class Compiler {
    #private;
    version: number;
    constructor(messages: ParsedMessages);
    toBuffer(): Uint8Array;
    [Symbol.iterator](): Iterable<number>;
}
export {};
