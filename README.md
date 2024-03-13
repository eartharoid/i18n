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

A Vite plugin to optimise translation files.

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
3. *I18n JS* (data in ESM/CJS) is omitted from the graph because it ruins the scale, but it is by far the fastest:
   - 19x than *Raw JSON*
   - 10x faster than *I18n CIF*, the next fastest.

> [!TIP]
> CIF files are ideal for client-side when CDN compression is not an option
> as [they are much smaller](https://github.com/eartharoid/i18n/tree/main/packages/cif#readme) than JSON.

```
   Raw JSON (#)                  0%      (3,893 ops/sec)   (avg: 256μs)
   Raw JSON, deferred       +15.03%      (4,479 ops/sec)   (avg: 223μs)
   Raw JS                   +42.81%      (5,560 ops/sec)   (avg: 179μs)
   Raw JS, deferred         +69.64%      (6,605 ops/sec)   (avg: 151μs)
   I18n JS               +1,892.56%     (77,569 ops/sec)    (avg: 12μs)
   I18n JSON                +73.48%      (6,754 ops/sec)   (avg: 148μs)
   I18n CIF                  +94.2%      (7,561 ops/sec)   (avg: 132μs)
   i18next JSON              -6.43%      (3,643 ops/sec)   (avg: 274μs)

┌────────────────────┬────────────────────────────────────────────────────┐
│ Raw JSON           │ ██████████████████████████                         │
├────────────────────┼────────────────────────────────────────────────────┤
│ Raw JSON, deferred │ ██████████████████████████████                     │
├────────────────────┼────────────────────────────────────────────────────┤
│ Raw JS             │ █████████████████████████████████████              │
├────────────────────┼────────────────────────────────────────────────────┤
│ Raw JS, deferred   │ ████████████████████████████████████████████       │
├────────────────────┼────────────────────────────────────────────────────┤
│ I18n JSON          │ █████████████████████████████████████████████      │
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
