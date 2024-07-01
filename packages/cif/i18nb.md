# I18n Binary

https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamBYOBReader

## Benefits

- Slightly smaller
  - Multi-digit numbers (such as placeholder positions) will use fewer bytes when stored as numbers instead of text
  - Knowing the length of each field should be faster for streamed parsing than checking for control characters mid-string constantly

## Problems

1. binary won't be compressed by CDNs
   - could be solved by integrating compression in the format (with a flag)
     - UTF-8 encoded sections will be passed through a GZIP (de)compression stream before/after the text en/decoder
     - this requires decompression support in the client runtime (JS instead of being handled by the browser)
   - compression is more effective on large chunks of data. compressing each message separately may be ineffective.
   - JS supports GZIP but not the better (10%-20% smaller) Brotli algorithm
   - **could serve as utf-8 text** (most will be valid) but read a binary? would allow brotli compression by CDNs


Speed is the main goal. It will already be smaller than minifed input without compression.

## UBJSON

<https://ubjson.org/>


## Structure

- 8-bit,
- fixed format (all fields must be present in every record)
- `<position><data>...`
- position points to the next pointer, at the end of the upcoming block of data
- position can be 0 for unused fields
- some fields store numbers in binary, others will be UTF-8 decoded 
- for positions (length of next chunk) and flags, 8th bit (128) used for overflow indicator (for dynamic sizes)
	- `127` can be stored in one byte: `01111111`
	- `127`-`254` require a second byte: `01111111` + `00000001` = `128`
	- `255` etc require more bytes
- KV_DESCRIPTOR bytes:
  1. descriptor byte length (including this - if 1 then field is empty)
  2. [KEY, VALUE][] RELATIVE positions, single byte (keys and values can be no longer than 255 each)
- LIST_DESCRIPTOR is same but
- GROUP_DEPTH cannot be skipped (should be 0 with empty GROUP_PREFIX if not necessary)
  - must be signed to allow negatives (±127)
  - messages cannot be nested more than 127 levels as GROUP_DEPTH must be a single byte
- LENGTH is in BYTES (may be more than character length)

```md
 <!-- start of file -->
<FLAGS>
 <!-- records -->
<INT GROUP_DEPTH><LENGTH>[STR GROUP_PREFIX]<DESCRIPTOR>[STR[] GROUP_OPTS]<LENGTH>[STR MSG_KEY]<LENGTH>[STR MSG_TEXT]<DESCRIPTOR>[STR[] MSG_PLACEHOLDERS]
...
```

As this would use 3 bytes (GROUP_DEPTH=0, LENGTH=0, DESCRIPTOR=1) bytes on every record even when no group change occurs,
perhaps there should be 2 record types with a single byte at the start to say which it is?

```md
 <!-- start of file -->
<TYPE 0><FLAGS>
 <!-- records -->
<TYPE 1><INT GROUP_DEPTH><LENGTH>[STR GROUP_PREFIX]<DESCRIPTOR>[STR[] GROUP_OPTS]
<!-- or -->
<TYPE 2><LENGTH>[STR MSG_KEY]<LENGTH>[STR MSG_TEXT]<DESCRIPTOR>[STR[] MSG_PLACEHOLDERS]
...
```

or even better, start group types with 0:


```md
 <!-- start of file -->
<VERSION>
 <!-- records -->
<00000000><GROUP_DEPTH><LIST_DESCRIPTOR>[GROUP_PREFIX]<KV_DESCRIPTOR>[GROUP_OPTS]
<!-- or -->
<LENGTH>[MSG_KEY]<LENGTH>[MSG_TEXT]<KV_DESCRIPTOR>[MSG_PLACEHOLDERS]
...
```

because MSG_KEY is required so the first byte on a message record can never be 0.

This is most similar to CIF 2.0.

### GROUP_OPTS **keys**

- keys and values are UTF-8 strings
- If the first and only byte of a **key** is <= 31, it is a built-in property
  - 0 = cardinal
  - 1 = ordinal

### MSG_PLACEHOLDERS **values**

- UTF-8 string.
- If first byte<=31 (`NUL`-`US`, 32 being the first printable character), it is an internal getter with special format.
  - 0 = $t:
    ```md
    <TYPE><GETTER_KEY>
    ```
    e.g.
    ```js
    00 0A 63 69 72 63 75 6C 61 72 5F 31 // (12 B)
    ->
    {"g":"$t","d":{"k":"circular_1"}} // (33 B)
    ```
      - TYPE is 1 byte so no LENGTH necessary for GETTER_KEY
- If first byte is 123 (`{`), it is a non-standard getter represented as stringified JSON (big and slow, but flexible).

## Types

Integers are 8-bit unless FlexiByte.
Strings are UTF-8 encoded.

```js
VERSION: FlexiByte Int (varint)
GROUP_DEPTH: Int
LIST_DESCRIPTOR: [Int, ...Int]
  // length, Str relative positions/lengths
GROUP_PREFIX: [...Str]
KV_DESCRIPTOR: [Int, ...Flexibyte Int]
  // GROUP_OPTS: length, Str lengths
  // MSG_PLACEHOLDERS: length, Int length, Str length
LENGTH: FlexiByte Int
MSG_KEY: Str
MSG_TEXT: Str
GETTER_KEY: Str
```


## varints

https://protobuf.dev/programming-guides/encoding/#varints