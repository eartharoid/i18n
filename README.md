# i18n

A WIP super small and incredibly fast localisation library *with no documentation*.

## Goals

1. Speed
2. Small size
3. Simplicity, durability, and maintainability
4. Optional type-safety https://github.com/ivanhofer/typesafe-i18n
5. Optional build step

## Features

- Simple JSON object input
- Simple string/interpolation format
- Pluralisation
- In-code formatters

## To-do

- i18nb encoder & decoder
- I18nClient
- `{< slot text >}` https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-svelte#how-do-i-render-a-component-inside-a-translation
- Types generator
- CLI
- Vite plugin
- Svelte addon
- https://github.com/ivanhofer/typesafe-i18n?tab=readme-ov-file#why-does-the-translation-function-return-a-type-of-localizedstring-and-not-the-type-string-itself

### Notes

- https://jsoneditoronline.org/indepth/parse/streaming-parser/
- https://en.wikipedia.org/wiki/JSON_streaming#Approaches

## Crowdin

- https://crowdin.github.io/crowdin-cli/
- https://support.crowdin.com/bundles/
- https://store.crowdin.com/custom-bundle-generator
- https://store.crowdin.com/cff
- https://store.crowdin.com/configurable-json-yaml
- https://store.crowdin.com/yaml **supports comments for context**


## v3

current:
```jsonc
[
	"ns:circular_2",
    {
      "t": "This is two, ",
      "p": [
        [
          13,
          {
            "g": "$t", // v or g
            "d": {
              "k": "circular_1"
            }
          }
        ]
      ]
    }
]
```

proposed:

```jsonc
[
    "ns:circular_2",
	[
		{
			"t": "This is two, " // t, s, v, or g
		},
		{
        	"g": "$t",
        	"d": {
        	  "k": "circular_1"
        	}
        }
	]
]
```

Placeholder positions aren't needed.

```js
// raw=true - return segments instead of string
[
	{ text: 'Hello' },
	{ slot: ['name', 'world'] }, // slots are omitted in non-raw (cooked..?) mode
	{ text: '!' }
]
```

```jsonc
// "Click {< here >} to {action} this {item}." // only works with 1 slot per string
// "Click {$slot(link, here)} to {action} this {item}." // not good, it's a valid getter
// "Click <{link} here> to {action} this {item}." // difficult
"Click {<link>here} to {action} this {item}." // conflicts with "don't translate inside placeholders"
```


https://svelte.dev/docs/special-elements#slot

```svelte
<I18n key="example" variables={{ action: 'restart', item: 'server' }} let:link>
	<a slot="link" class="font-bold" on:click={restart()}>{link}</a>
</I18n>
```



```yaml
variable: Hello {name}
getter: I said "{$t(slot)}" # flatMap
slot: Please click {<slot1>here} or {<slot2>here}
```