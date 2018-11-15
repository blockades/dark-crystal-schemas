const definitions = require('ssb-schema-definitions')
const SCHEMA_VERSION = require('./version')

module.exports = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'version', 'root', 'shard', 'recps'],
  properties: {
    type: {
      type: 'string',
      pattern: '^dark-crystal/shard$'
    },
    version: {
      type: 'string',
      pattern: `^${SCHEMA_VERSION}$`
    },
    root: { $ref: '#/definitions/messageId' },
    shard: { $ref: '#/definitions/encrypt/box' },
    recps: {
      type: 'array',
      maxItems: 2,
      minItems: 2,
      items: {
        oneOf: [
          { $ref: '#/definitions/feedId' },
          { $ref: '#/definitions/mentions/feed' }
        ]
      }
    }
  },
  definitions: definitions
}
