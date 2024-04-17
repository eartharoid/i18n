# I18n

Simple and extremely fast i18n tools.

## Packages

### [`@eartharoid/cif`](https://github.com/eartharoid/i18n/tree/main/packages/cif#readme)

Compact Interpolation Format - an efficient file format for storing translation messages.


### [`@eartharoid/i18n`](https://github.com/eartharoid/i18n/tree/main/packages/i18n#readme)

A small, simple, and extremely fast __*(20x faster than [i18next](https://github.com/i18next/i18next))*__ i18n library for the server and client.

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

```diff
   Raw JSON (#)                               0%      (3,923 ops/sec)   (avg: 254μs)
   Raw JSON, deferred                    +14.27%      (4,483 ops/sec)   (avg: 223μs)
   Raw JSON, deferred, w/ fallback       -49.08%      (1,998 ops/sec)   (avg: 500μs)
   Raw JS                                +37.89%      (5,410 ops/sec)   (avg: 184μs)
   Raw JS, deferred                      +66.68%      (6,539 ops/sec)   (avg: 152μs)
   Raw JS, deferred, w/ fallback         -30.22%      (2,738 ops/sec)   (avg: 365μs)
+  I18n JS                            +1,891.75%     (77,569 ops/sec)    (avg: 12μs)
   I18n JSON                             +70.97%      (6,708 ops/sec)   (avg: 149μs)
   I18n CIF                              +94.55%      (7,633 ops/sec)   (avg: 131μs)
   i18next JSON                           -7.75%      (3,619 ops/sec)   (avg: 276μs)

┌─────────────────────────────────┬────────────────────────────────────────────────────┐
│ Raw JSON                        │ ██████████████████████████                         │
├─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Raw JSON, deferred              │ █████████████████████████████                      │
├─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Raw JSON, deferred, w/ fallback │ █████████████                                      │
├─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Raw JS                          │ ███████████████████████████████████                │
├─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Raw JS, deferred                │ ███████████████████████████████████████████        │
├─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Raw JS, deferred, w/ fallback   │ ██████████████████                                 │
├─────────────────────────────────┼────────────────────────────────────────────────────┤
│ I18n JSON                       │ ████████████████████████████████████████████       │
├─────────────────────────────────┼────────────────────────────────────────────────────┤
│ I18n CIF                        │ ██████████████████████████████████████████████████ │
├─────────────────────────────────┼────────────────────────────────────────────────────┤
│ i18next JSON                    │ ████████████████████████                           │
└─────────────────────────────────┴────────────────────────────────────────────────────┘
```

### Translating

> Getting a message and filling its placeholders

```
   i18n (#)                  0%   (3,819,363 ops/sec)   (avg: 261ns)
   i18n, deferred        -3.37%   (3,690,679 ops/sec)   (avg: 270ns)
   i18n v1              -78.27%     (830,053 ops/sec)     (avg: 1μs)
   i18next              -95.06%     (188,834 ops/sec)     (avg: 5μs)

┌────────────────┬────────────────────────────────────────────────────┐
│ i18n           │ ██████████████████████████████████████████████████ │
├────────────────┼────────────────────────────────────────────────────┤
│ i18n, deferred │ ████████████████████████████████████████████████   │
├────────────────┼────────────────────────────────────────────────────┤
│ i18n v1        │ ███████████                                        │
├────────────────┼────────────────────────────────────────────────────┤
│ i18next        │ ██                                                 │
└────────────────┴────────────────────────────────────────────────────┘
```


## Support

[![Discord support server](https://discordapp.com/api/guilds/451745464480432129/widget.png?style=banner4)](https://lnk.earth/discord)

## Donate

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/eartharoid)

## License

[MIT license](https://github.com/eartharoid/i18n/blob/master/LICENSE).

© 2024 Isaac Saunders
