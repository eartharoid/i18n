import type { Getter } from '../../types.js';
export declare type Parsed = {
    k: string;
    o?: {
        [key: string]: string;
    };
};
declare const _default: Omit<Getter, "parse">;
export default _default;
