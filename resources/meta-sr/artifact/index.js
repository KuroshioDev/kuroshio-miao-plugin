const Data = require( '../../../components/Data')
const lodash = require( 'lodash')
const artisBuffs = require( './calc.js')
const meta = require('./meta')

let data = Data.readJSON('/resources/meta-sr/artifact/data.json', 'miao')
let metaData = Data.readJSON('/resources/meta-sr/artifact/meta.json', 'miao')

let artiMap = {}
let idMap = {}
let artiSetMap = {}
lodash.forEach(data, (setData) => {
  let artiSet = {
    name: setData.name,
    effect: setData.skill,
    sets: {}
  }
  artiSetMap[setData.name] = artiSet

  lodash.forEach(setData.idxs, (ds, idx) => {
    artiMap[ds.name] = {
      ...ds,
      set: setData.name,
      setId: setData.id,
      idx
    }
    idMap[ds.name] = artiMap[ds.name]
    lodash.forEach(ds.ids, (star, id) => {
      idMap[id] = artiMap[ds.name]
    })
    artiSet.sets[idx] = ds.name
  })
})

exports.metaData = metaData
exports.meta = meta
exports.artiMap = artiMap
exports.idMap = idMap
exports.artisBuffs = artisBuffs
exports.artiSetMap = artiSetMap
