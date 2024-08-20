## Changed from original

1. List and KV descriptor lengths do not include self
2. Group depth is not signed. Instead of -1, 0 depth with 0 prefix length 

## UInt8 (<=255)

- version
- each key/group prefix segment
- group depth

## VarInt

## Potential optimisations

1. make placeholder positions relative to the previous