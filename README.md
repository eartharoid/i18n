# I18n

## Packages

### [`@eartharoid/cif`](https://github.com/eartharoid/i18n/tree/main/packages/cif#readme)

Compact Interpolation Format - an efficient (in size and decode speed) file format for storing translation messages.


### [`@eartharoid/i18n`](https://github.com/eartharoid/i18n/tree/main/packages/i18n#readme)

A small, simple, and extremely fast *(10x faster than i18next)* i18n library for the server and client.


### [`@eartharoid/vite-plugin-i18n`](https://github.com/eartharoid/i18n/tree/main/packages/vite-plugin-i18n#readme)

A Vite plugin to optimise translation files using CIF.

## Benchmarks

You can run the tests yourself in the `benchmark` directory. 


### Parsing & loading

> How long does it take to parse the file and load the messages?

The ops/s and time figures are irrelevant in this test because they depend on the input file,
but the percentage difference is still useful.

```
   JSON (#)                  0%      (2,433 ops/sec)   (avg: 411μs)
   JSON, deferred       +13.05%      (2,750 ops/sec)   (avg: 363μs)
   I18n JSON           +200.62%      (7,313 ops/sec)   (avg: 136μs)
   I18n CIF            +212.87%      (7,611 ops/sec)   (avg: 131μs)
   i18next              +49.09%      (3,627 ops/sec)   (avg: 275μs)

┌────────────────┬────────────────────────────────────────────────────┐
│ JSON           │ ████████████████                                   │
├────────────────┼────────────────────────────────────────────────────┤
│ JSON, deferred │ ██████████████████                                 │
├────────────────┼────────────────────────────────────────────────────┤
│ I18n JSON      │ ████████████████████████████████████████████████   │
├────────────────┼────────────────────────────────────────────────────┤
│ I18n CIF       │ ██████████████████████████████████████████████████ │
├────────────────┼────────────────────────────────────────────────────┤
│ i18next        │ ████████████████████████                           │
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