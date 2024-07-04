import type { ParsedMessage } from '@eartharoid/i18n/types';
export default class Parser {
    #private;
    constructor(response: Response, namespace?: string);
    toArray(): Promise<Array<[string, ParsedMessage]>>;
    [Symbol.asyncIterator]: () => AsyncIterator<[string, ParsedMessage]>;
}
