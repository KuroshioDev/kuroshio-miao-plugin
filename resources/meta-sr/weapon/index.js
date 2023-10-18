const Data = require( '../../../components/Data')
const lodash = require( 'lodash')
const common = require('../../../../lib/common/common.js')
const { abbr, alias } = require('./meta.js')



const types = '存护,丰饶,毁灭,同谐,虚无,巡猎,智识'.split(',')


let data = Data.readJSON('/resources/meta-sr/weapon/data.json', 'miao')
let aliasMap = {}

lodash.forEach(data, (ds) => {
  aliasMap[ds.id] = ds.id
  aliasMap[ds.name] = ds.id
})
lodash.forEach(alias, (name, alias) => {
  if (aliasMap[name]) {
    aliasMap[alias] = aliasMap[name]
  }
})


const weaponBuffs = {}

let loadBuffs = async function () {
  for (let type of types) {
    let calc = require(`${common.getPluginsPath()}/miao-plugin/resources/meta-sr/weapon/${type}/calc.js`)
    if (lodash.isFunction(calc)) {
      calc = calc((idx, key) => {
        return {
          isStatic: true,
          idx,
          key
        }
      }, (title, key, idx) => {
        if (lodash.isPlainObject(key)) {
          return (tables) => {
            let data = {}
            lodash.forEach(key, (idx, k) => {
              data[k] = tables[idx]
            })
            return {
              title,
              data
            }
          }
        } else {
          return {
            title,
            idx,
            key
          }
        }
      })
    }
    lodash.forEach(calc, (ds, key) => {
      let id = aliasMap[key]
      weaponBuffs[id] = ds
    })
  }
}
loadBuffs()


exports.weaponBuffs = weaponBuffs
exports.weaponAlias = aliasMap
exports.weaponData = data
