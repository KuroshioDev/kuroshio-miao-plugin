const cfgSchema= require( '../../config/system/cfg_system.js')
const lodash = require( 'lodash')
const Data = require( '../Data.js')
const fs = require( 'node:fs')
const { common } = require('../../../lib/common/common.js')
const cfg = require( '../../config/cfg.js')
let cfgData = {
  saveCfg (cfg) {
    let ret = []
    lodash.forEach(cfgSchema, (cfgGroup) => {
      ret.push(`/** ************ 【${cfgGroup.title}】 ************* */`)
      lodash.forEach(cfgGroup.cfg, (cfgItem, cfgKey) => {
        ret.push(`// ${cfgItem.desc || cfgItem.title}`)
        let val = Data.def(cfg[cfgKey], cfgItem.def)
        if (cfgItem.input) {
          val = cfgItem.input(val)
        }
        ret.push(`exports.${cfgKey} = ${val.toString()}`, '')
      })
    })
    fs.writeFileSync(`${common.getPluginsPath()}/miao-plugin/config/cfg.js`, ret.join('\n'), 'utf8')
  },

  getCfg () {
    let ret = lodash.toPlainObject(cfg)
    lodash.forEach(cfgSchema, (cfgGroup) => {
      lodash.forEach(cfgGroup.cfg, (cfgItem, cfgKey) => {
        ret[cfgKey] = Data.def(ret[cfgKey], cfgItem.def)
      })
    })
    return ret
  },

  getCfgSchemaMap () {
    let ret = {}
    lodash.forEach(cfgSchema, (cfgGroup) => {
      lodash.forEach(cfgGroup.cfg, (cfgItem, cfgKey) => {
        ret[cfgItem.key] = cfgItem
        cfgItem.cfgKey = cfgKey
      })
    })
    return ret
  },
  getCfgSchema () {
    return cfgSchema
  }
}

module.exports = cfgData
