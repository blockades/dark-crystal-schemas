const fs = require('fs')
const { describe } = require('tape-plus')
const validator = require('is-my-json-valid')
const schema = require('../v1/shard/schema/shard')
const validate = validator(schema, { verbose: true })

const { isShard } = require('../v1/')

describe('dark-crystal/shard schema', context => {
  let shard

  context.beforeEach(c => {
    shard = JSON.parse(fs.readFileSync('./test/fixtures/shard.json', 'utf8'))
  })

  context('shard is valid', assert => {
    assert.ok(validate(shard))
    assert.ok(isShard(shard))
    
    shard.recps.map(recp => { return { link: recp, name: 'Bobo the Clown' } })
    assert.ok(validate(shard))
    assert.ok(isShard(shard))
  })

  context('invalid type', assert => {
    shard.type = 'dark-smchystal/shard'
    assert.notOk(validate(shard))
    assert.notOk(isShard(shard))

    var errors = shard.errors.map(e => `${e.field}: ${e.message}`)
    assert.deepEqual(errors, ['data.type: pattern mismatch'])
  })

  context('invalid version', assert => {
    shard.version = 1
    assert.notOk(validate(shard))
    assert.notOk(isShard(shard))

    var errors = shard.errors.map(e => `${e.field}: ${e.message}`)
    assert.deepEqual(errors, ['data.version: is the wrong type'])
  })

  context('invalid shard', assert => {
    shard.shard = 'foo' 
    assert.notOk(validate(shard))
    assert.notOk(isShard(shard))

    var errors = shard.errors.map(e => `${e.field}: ${e.message}`)
    assert.deepEqual(errors, ['data.shard: referenced schema does not match'])
  })

  context('invalid recps', assert => {
    shard.recps = ['thisisnotafeedId','nor is this']
    assert.notOk(validate(shard))
    assert.notOk(isShard(shard))

    var errors = shard.errors.map(e => `${e.field}: ${e.message}`)
    assert.deepEqual(errors, ['data.recps.0: no (or more than one) schemas match', 'data.recps.1: no (or more than one) schemas match'])
  })
})
