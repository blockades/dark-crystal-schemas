const definitions = require('ssb-schema-definitions')
const SCHEMA_VERSION = 1 // require(' can you fill me innn ')

module.exports = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'version', 'root', 'quorum', 'shards', 'tool'],
  properties: {
    type: {
      type: 'string',
      pattern: '^dark-crystal/ritual$'
    },
    version: {
      type: 'string',
      pattern: `^${SCHEMA_VERSION}$`
    },
    root: { $ref: '#/definitions/messageId' },
    quorum: { type: 'integer' },
    shards: { type: 'integer' },
    tool: { type: 'string' },
    recps: { $ref: '#/definitions/recps' }
  },
  definitions: definitions
}
