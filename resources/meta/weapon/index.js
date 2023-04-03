const Data  = require( '../../../components/Data.js')
const lodash = require( 'lodash')
const { weaponType, abbr, alias, weaponSet } = require( './meta.js')
const common = require('../../../../lib/common/common.js')

let calc = {}
let data = {}

const step = function (start, step = 0) {
  if (!step) {
    step = start / 4
  }
  let ret = []
  for (let idx = 0; idx <= 5; idx++) {
    ret.push(start + step * idx)
  }
  return ret
}

const attr = function (key, start, _step) {
  let refine = {}
  refine[key] = step(start, _step)
  return {
    title: `${key}提高[key]`,
    isStatic: true,
    refine
  }
}

for (let type in weaponType) {
  // calc
  let typeCalc = require(`${common.getPluginsPath()}/miao-plugin/resources/meta/weapon/${type}/calc.js`)
  let typeRet = typeCalc(step, attr)
  calc = lodash.extend(calc, typeRet)

  // data
  let typeData = require(`${common.getPluginsPath()}/miao-plugin/resources/meta/weapon/${type}/data.json`)
  lodash.forEach(typeData, (ds) => {
    data[ds.name] = {
      id: ds.id,
      name: ds.name,
      type,
      star: ds.star
    }
  })
}
let aliasMap = {}
lodash.forEach(alias, (txt, name) => {
  Data.eachStr(txt, (t) => {
    aliasMap[t] = name
    aliasMap[name] = name
  })
})
lodash.forEach(abbr, (a, name) => {
  aliasMap[a] = name
})
lodash.forEach(data, (ds, name) => {
  aliasMap[name] = name
  aliasMap[ds.id] = name
})

exports.weaponBuffs = calc
exports.weaponData = data
exports.weaponAbbr = abbr
exports.weaponAlias = aliasMap
exports.weaponType = weaponType
exports.weaponSet = weaponSet
