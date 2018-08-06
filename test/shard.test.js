const fs = require('fs')
const { describe } = require('tape-plus')
const { isShard } = require('../v1/')
const errorParser = require('../v1/lib/errorParser')

describe('dark-crystal/shard schema', context => {
  let shard

  context.beforeEach(c => {
    shard = JSON.parse(fs.readFileSync('./test/fixtures/shard.json', 'utf8'))
  })

  context('shard is valid', assert => {
    assert.ok(isShard(shard))
    
    shard.recps.map(recp => { return { link: recp, name: 'Bobo the Clown' } })
    assert.ok(isShard(shard))
  })

  context('invalid type', assert => {
    shard.type = 'dark-smchystal/shard'
    assert.notOk(isShard(shard))

    assert.deepEqual(errorParser(isShard), ['data.type: pattern mismatch'])
  })

  context('invalid version', assert => {
    shard.version = 1
    assert.notOk(isShard(shard))

    assert.deepEqual(errorParser(isShard), ['data.version: is the wrong type'])
  })

  context('invalid shard', assert => {
    shard.shard = 'foo' 
    assert.notOk(isShard(shard))

    assert.deepEqual(errorParser(isShard), ['data.shard: referenced schema does not match'])
  })

  context('invalid recps', assert => {
    shard.recps = ['thisisnotafeedId','nor is this']
    assert.notOk(isShard(shard))

    assert.deepEqual(errorParser(isShard), ['data.recps.0: no (or more than one) schemas match', 'data.recps.1: no (or more than one) schemas match'])
  })
})
