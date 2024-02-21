# I18n

## Packages

### [`@eartharoid/cif`](https://github.com/eartharoid/i18n/tree/main/packages/cif#readme)

Compact Interpolation Format - an efficient file format for storing translation messages.


### [`@eartharoid/i18n`](https://github.com/eartharoid/i18n/tree/main/packages/i18n#readme)

A small, simple, and extremely fast *(10x faster than i18next)* i18n library for the server and client.


### [`@eartharoid/vite-plugin-i18n`](https://github.com/eartharoid/i18n/tree/main/packages/vite-plugin-i18n#readme)

A Vite plugin to optimise translation files using CIF.

## Benchmarks

The results displayed below are from tests on Node.js with an AMD Ryzen 7 5700G CPU.
You can run the tests yourself in the `benchmark` directory.


### Parsing & loading

> How long does it take to parse the file and load the messages?

The ops/s and time figures are irrelevant in this test because they depend on the input file,
but the percentage difference is still useful.

#### Notes

1. Deferred placeholder extraction is enabled by default.
2. I18n JSON and CIF require a build step to pre-flatten messages and extract placeholders.
3. Converting to ESM requires a build step.
4. Although ESM appears the fastest when deferred extraction is enabled,
it is only faster if you do not use most of the messages immediately.
If a lot of your messages are used very soon, deferred extraction makes little difference and pre-parsing is faster.

> [!TIP]
> Although the speed advantage of CIF over I18n JSON is minor (because `JSON.parse()` has the huge advantage of being implemented in C++),
> CIF files are ideal for client-side use as [they are smaller](https://github.com/eartharoid/i18n/tree/main/packages/cif#readme).

```
   JSON (#)                  0%      (4,798 ops/sec)   (avg: 208μs)
   JSON, deferred       +24.49%      (5,973 ops/sec)   (avg: 167μs)
   ESM                  +52.67%      (7,326 ops/sec)   (avg: 136μs)
   ESM, deferred       +103.73%      (9,776 ops/sec)   (avg: 102μs)
   I18n JSON            +56.36%      (7,502 ops/sec)   (avg: 133μs)
   I18n CIF             +64.99%      (7,917 ops/sec)   (avg: 126μs)
   i18next              -22.65%      (3,712 ops/sec)   (avg: 269μs)

┌────────────────┬────────────────────────────────────────────────────┐
│ JSON           │ █████████████████████████                          │
├────────────────┼────────────────────────────────────────────────────┤
│ JSON, deferred │ ███████████████████████████████                    │
├────────────────┼────────────────────────────────────────────────────┤
│ ESM            │ █████████████████████████████████████              │
├────────────────┼────────────────────────────────────────────────────┤
│ ESM, deferred  │ ██████████████████████████████████████████████████ │
├────────────────┼────────────────────────────────────────────────────┤
│ I18n JSON      │ ██████████████████████████████████████             │
├────────────────┼────────────────────────────────────────────────────┤
│ I18n CIF       │ ████████████████████████████████████████           │
├────────────────┼────────────────────────────────────────────────────┤
│ i18next        │ ███████████████████                                │
└────────────────┴────────────────────────────────────────────────────┘
```

### Translating

> Getting a message and filling its placeholders

```
   i18n (#)                  0%   (2,947,381 ops/sec)   (avg: 339ns)
   i18n, deferred        -1.65%   (2,898,755 ops/sec)   (avg: 344ns)
   i18n v1              -70.29%     (875,661 ops/sec)     (avg: 1μs)
   i18next              -93.75%     (184,310 ops/sec)     (avg: 5μs)

┌────────────────┬────────────────────────────────────────────────────┐
│ i18n           │ ██████████████████████████████████████████████████ │
├────────────────┼────────────────────────────────────────────────────┤
│ i18n, deferred │ █████████████████████████████████████████████████  │
├────────────────┼────────────────────────────────────────────────────┤
│ i18n v1        │ ███████████████                                    │
├────────────────┼────────────────────────────────────────────────────┤
│ i18next        │ ███                                                │
└────────────────┴────────────────────────────────────────────────────┘
```