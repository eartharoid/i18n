# I18n

Simple and extremely fast i18n tools.

## Packages

### [`@eartharoid/cif`](https://github.com/eartharoid/i18n/tree/main/packages/cif#readme)

Compact Interpolation Format - an efficient file format for storing translation messages.


### [`@eartharoid/i18n`](https://github.com/eartharoid/i18n/tree/main/packages/i18n#readme)

A small, simple, and extremely fast __*(17x faster than [i18next](https://github.com/i18next/i18next))*__ i18n library for the server and client.

### [`@eartharoid/i18n-formatters`](https://github.com/eartharoid/i18n/tree/main/packages/i18n-formatters#readme)

Helper functions for using [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) APIs in localisations.


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
2. Non-raw formats require a build step to pre-flatten messages and extract placeholders.
3. *I18n ESM* is omitted from the graph because it ruins the scale, but it is by far the fastest:
   - 16x than *Raw JSON*
   - 8x faster than *I18n CIF*, the next fastest.

> [!TIP]
> Although the speed advantage of CIF over I18n JSON is minor (because `JSON.parse()` has the huge advantage of being implemented in C++),
> CIF files are ideal for client-side use as [they are smaller](https://github.com/eartharoid/i18n/tree/main/packages/cif#readme).

```
   Raw JSON (#)                  0%      (4,002 ops/sec)   (avg: 249μs)
   Raw JSON, deferred       +15.05%      (4,604 ops/sec)   (avg: 217μs)
   Raw ESM                   +32.6%      (5,306 ops/sec)   (avg: 188μs)
   Raw ESM, deferred        +61.23%      (6,452 ops/sec)   (avg: 154μs)
   I18n ESM               +1,531.5%     (65,168 ops/sec)    (avg: 15μs)
   I18n JSON                +70.84%      (6,836 ops/sec)   (avg: 146μs)
   I18n CIF                 +94.33%      (7,776 ops/sec)   (avg: 128μs)
   i18next JSON               -8.5%      (3,661 ops/sec)   (avg: 273μs)

┌────────────────────┬────────────────────────────────────────────────────┐
│ Raw JSON           │ ██████████████████████████                         │
├────────────────────┼────────────────────────────────────────────────────┤
│ Raw JSON, deferred │ ██████████████████████████████                     │
├────────────────────┼────────────────────────────────────────────────────┤
│ Raw ESM            │ ██████████████████████████████████                 │
├────────────────────┼────────────────────────────────────────────────────┤
│ Raw ESM, deferred  │ █████████████████████████████████████████          │
├────────────────────┼────────────────────────────────────────────────────┤
│ I18n JSON          │ ████████████████████████████████████████████       │
├────────────────────┼────────────────────────────────────────────────────┤
│ I18n CIF           │ ██████████████████████████████████████████████████ │
├────────────────────┼────────────────────────────────────────────────────┤
│ i18next JSON       │ ████████████████████████                           │
└────────────────────┴────────────────────────────────────────────────────┘
```

### Translating

> Getting a message and filling its placeholders

```
   i18n (#)                  0%   (3,509,089 ops/sec)   (avg: 284ns)
   i18n, deferred        -6.35%   (3,286,120 ops/sec)   (avg: 304ns)
   i18n v1              -74.27%    (902,727 ops/sec)   (avg: 1μs)
   i18next              -94.32%    (199,344 ops/sec)   (avg: 5μs)

┌────────────────┬────────────────────────────────────────────────────┐
│ i18n           │ ██████████████████████████████████████████████████ │
├────────────────┼────────────────────────────────────────────────────┤
│ i18n, deferred │ ███████████████████████████████████████████████    │
├────────────────┼────────────────────────────────────────────────────┤
│ i18n v1        │ █████████████                                      │
├────────────────┼────────────────────────────────────────────────────┤
│ i18next        │ ███                                                │
└────────────────┴────────────────────────────────────────────────────┘
```


## Support

[![Discord support server](https://discordapp.com/api/guilds/451745464480432129/widget.png?style=banner4)](https://lnk.earth/discord)

## Donate

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/eartharoid)

## License

[MIT license](https://github.com/eartharoid/i18n/blob/master/LICENSE).

© 2024 Isaac Saunders
