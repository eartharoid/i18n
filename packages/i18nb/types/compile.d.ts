import type { ParsedMessage } from '@eartharoid/i18n/types';
interface Compiler {
    messages: Iterable<[string, ParsedMessage]>;
    compile(messages: Iterable<[string, ParsedMessage]>): this;
    toBuffer(messages: Iterable<[string, ParsedMessage]>): Uint8Array;
    [Symbol.iterator](): Iterable<number>;
}
declare const compiler: Compiler;
export default compiler;
