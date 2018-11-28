# ssb-dark-crystal-schema

JSON schemas and validation for secure scuttlebutt message types for Dark Crystal.

All message will contain a version number of the schema.

## API

```js
const { isRoot, isRitual, isShard, isForward } = require('ssb-dark-ritual-schema')

isRitual(ritualMessage)
// => true

isRitual(someMessage)
// => false

console.log(isRitual.errors)
// => validation error messages

```

All validators can accept either msg or msgContent.

If you'd like validators to attach errors to the original message you can run them like this:

```js
isRitual(someMessage, {attachErrors: true})
```

## Schemas

### `root`

This message will be published exactly once for each shared secret, and will contain a name for the secret.  It will be a private message with exactly one recipient which will be the author of the message.

Example:

```js
{
  "type": "dark-crystal/root",
  "version": "2.0.0",
  "name": "directions to treasure",
  "recps": ["@95WQAJ1XZju4YFpLib3JYdbx//BCtr5dq3bR9jPxYWs=.ed25519"]
}
```
with message ID `%viiJnnnXjNkfCALivEZbrDe8UndkCCCNQ/CgBOWgJLw=.sha256`.

### `ritual`

This message will also be published exactly once for each shared secret.  It will contain:
* a reference to the `root` message
* the total number of shards
* the required number of shards to reconstruct the secret (quorum), which must be at least 2 and be less that the total number of shards
* a description of the software tool used to create the shards.

It will be a private message with exactly one recipient which will be the author of the message.

Example:


```js
{
  "type": "dark-crystal/ritual",
  "version": "2.0.0",
  "root": "%viiJnnnXjNkfCALivEZbrDe8UndkCCCNQ/CgBOWgJLw=.sha256",
  "quorum":2,
  "shards":5,
  "tool": "secrets.js@1.4.5",
  "recps": ["@95WQAJ1XZju4YFpLib3JYdbx//BCtr5dq3bR9jPxYWs=.ed25519"]
}
```

### `shard`

This message will be published once for each shard of the secret.  It will contain a reference to the `root` message for that secret, as well as the shard itself.  The shard will be encrypted with the public key of the recipient of the shard.  This will be a private message with exactly two recipients, one of which will be the author of the message.  Note that there are two levels of encryption here, which means that the shard itself is not exposed to the author but the rest of the message is.  This allows the author to keep track of who shards have been sent to as well as to verify shard integrity when receiving the decrypted shard later.

Example:

```js
{
  "type": "dark-crystal/shard",
  "version": "2.0.0",
  "root": "%viiJnnnXjNkfCALivEZbrDe8UndkCCCNQ/CgBOWgJLw=.sha256",
  "shard": "Yn3foQzIrckEh139UbZ2JYuQI9FSJ3lBEV7wcePeFc/Eeo0t9kfrNp+9+bZio76RTJOM7pVEo1AUJFFupGStwNHtXmcQ9msnvnvR1RW5qLxX3luNMe+m45jcDLDCwPU237TJFIqYbUbd/DeI3YFiFH+AMU8XAPTV9scukFMVSTDrr/Li6fI=.box",
  "recps": ["@LA9HYf5rnUJFHHTklKXLLRyrEytayjbFZRo76Aj/qKs=.ed25519", "@95WQAJ1XZju4YFpLib3JYdbx//BCtr5dq3bR9jPxYWs=.ed25519"]
}
```

### `Forward`

This message will be published in order to send a shard to a feedId other than that which authored the shard message. It will be a private message which exactly two recipients, one of whom will be the author of the message.  It will also contain:
- a reference to the associated `root` message
- the version number of the shard it contains
- an unencrypted shard

Example:

```js
{
  "type": "dark-crystal/forward",
  "version": "2.0.0",
  "root": "%viiJnnnXjNkfCALivEZbrDe8UndkCCCNQ/CgBOWgJLw=.sha256",
  "shard": "802Eh139UbZ2JYuQI9FSJ3lBEV7wcePeFc/Eeo0t9kfrNp+fg9bZio76RTJOM7pVEo1AUJFFupGStwNHtXmcQ9msnvnvR1RW5qLxX3luNMem45jcDLDCwPU237TJFIqYbUbd/DeI3YFiFH+AMU8XAPTV9scukFMV",
  "shardVersion": '1.0.0,
  "recps": ["@LA9HYf5rnUJFHHTklKXLLRyrEytayjbFZRo76Aj/qKs=.ed25519", "@95WQAJ1XZju4YFpLib3JYdbx//BCtr5dq3bR9jPxYWs=.ed25519"]
}
```
