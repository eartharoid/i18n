# Specification

CIF is a specialised format for storing parsed (placeholder-extracted) messages more efficiently than JSON.
It is designed to minimise file size whilst requiring a simple decoding algorithm
to allow JavaScript implementations to outperform native JSON parsing.

## Version 1 (2024-02-20)

A CIF file or string consists of two or more records separated by an [`RS`](https://en.wikipedia.org/wiki/Record_Separator) character.

### Header

The first record is a header and can contain any URI-encoded metadata.
The header should specify the `version`, but the version should be assumed to be `1` if missing.

Subsequent records can be one of two types, groups or messages.

### Groups

If the record begins with a [`GS`](https://en.wikipedia.org/wiki/Group_Separator) character,
the record marks the start of a group (and the end of the previous group, if applicable).
The remainder of the record's value will be used as the prefix for all message keys in the group, joined with a `.`.

### Messages

All other records are messages and contain two fields, separated by a [`US`](https://en.wikipedia.org/wiki/Unit_Separator) character.

The first field begins with the last chunk (split at `.`) of the message key.
If the message contains placeholders, the key is followed by a `HT` (tab) character and then key-value pairs,
where the key is the placeholder's starting position and the value is either the placeholder's name or minified JSON.
Keys, values, and each pair should be separated by `HT`.

The second field is the message value and may contain any character, including unescaped new lines, besides `RS`.