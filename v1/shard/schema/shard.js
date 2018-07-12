
const definitions = require('ssb-schema-definitions')
const SCHEMA_VERSION = 1 // require(' can you fill me innn ')

module.exports = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'version', 'root', 'shard'],
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
    shard: { type: 'string' },
    recps: {  
    // a shard should have exactly one recipient
    // how to verify this?
      type: 'array',
      items: {
        oneOf: [
          { type: 'null' },
          { $ref: '#/definitions/feedId' },
          { $ref: '#/definitions/feed' }
        ]
      }
    }
  },
  definitions: definitions
}
