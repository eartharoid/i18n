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

> [!TIP]
> Although the speed advantage of CIF over I18n JSON is minor (because `JSON.parse()` has the huge advantage of being implemented in C++),
> CIF files are ideal for client-side use as [they are smaller](https://github.com/eartharoid/i18n/tree/main/packages/cif#readme).

```
   JSON (#)                  0%      (4,896 ops/sec)   (avg: 204μs)
   JSON, deferred       +22.71%      (6,008 ops/sec)   (avg: 166μs)
   I18n JSON            +50.94%      (7,390 ops/sec)   (avg: 135μs)
   I18n CIF             +54.97%      (7,587 ops/sec)   (avg: 131μs)
   i18next               -29.3%      (3,461 ops/sec)   (avg: 288μs)

┌────────────────┬────────────────────────────────────────────────────┐
│ JSON           │ ████████████████████████████████                   │
├────────────────┼────────────────────────────────────────────────────┤
│ JSON, deferred │ ████████████████████████████████████████           │
├────────────────┼────────────────────────────────────────────────────┤
│ I18n JSON      │ █████████████████████████████████████████████████  │
├────────────────┼────────────────────────────────────────────────────┤
│ I18n CIF       │ ██████████████████████████████████████████████████ │
├────────────────┼────────────────────────────────────────────────────┤
│ i18next        │ ███████████████████████                            │
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