const Data = require( '../../../components/Data')
const lodash = require( 'lodash')
const calc = require( './calc.js')
const meta = require('./meta')

let artiSetMap = {}
let artiMap = {}

let artis = Data.readJSON('resources/meta/artifact/data.json')

lodash.forEach(artis, (ds) => {
  let artiSet = {
    name: ds.name,
    effect: ds.effect,
    sets: {}
  }
  artiSetMap[ds.name] = artiSet
  lodash.forEach(ds.sets, (as, idx) => {
    if (as.name) {
      artiMap[as.name] = {
        set: ds.name,
        idx
      }
      artiSet.sets[idx] = as.name
    }
  })
})

exports.artiMap = artiMap
exports.artiSetMap = artiSetMap
exports.calc = calc
exports.meta = meta
