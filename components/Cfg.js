const fs = require( 'fs')
const lodash = require( 'lodash')
const cfgData = require( './cfg/CfgData.js')
const common = require('../../lib/common/common.js')
const Version = require('../components/Version')

const _cfgPath = `${common.getPluginsPath()}/miao-plugin/components/`
let cfg = {}
let miaoCfg = {}


// 会触发HMR无限重载文件,所以注释
try {
  cfg = cfgData.getCfg()
  //cfgData.saveCfg(cfg)
} catch (e) {
  // do nth
}

let Cfg = {
  get (rote) {
    if (Version.isMiao && miaoCfg[rote]) {
      return true
    }
    return lodash.get(cfg, rote)
  },
  set (rote, val) {
    cfg[rote] = val
    cfgData.saveCfg(cfg)
  },
  del (rote) {
    lodash.set(cfg, rote, undefined)
    fs.writeFileSync(_cfgPath + 'cfg.json', JSON.stringify(cfg, null, '\t'))
  },
  getCfg () {
    return cfg
  },
  getCfgSchema () {
    return cfgData.getCfgSchema()
  },
  getCfgSchemaMap () {
    return cfgData.getCfgSchemaMap()
  },
  scale (pct = 1) {
    let scale = Cfg.get('renderScale', 100)
    scale = Math.min(2, Math.max(0.5, scale / 100))
    pct = pct * scale
    return `style=transform:scale(${pct})`
  }
}

module.exports = Cfg
