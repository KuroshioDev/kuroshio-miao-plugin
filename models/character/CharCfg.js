const Data  = require( '../../components/Data.js')
const lodash = require( 'lodash')
const fs  = require( 'fs')
const common = require( '../../../lib/common/common.js')

const charPath = common.getPluginsPath() + '/miao-plugin/resources/meta/character'
let cfgMap = {
  char: {},
  async init () {
    let chars = fs.readdirSync(charPath)
    for (let char of chars) {
      cfgMap.char[char] = {}
      let curr = cfgMap.char[char]
      // 评分规则
      if (cfgMap.exists(char, 'artis_user')) {
        curr.artis = await cfgMap.getCfg(char, 'artis_user')
      } else if (cfgMap.exists(char, 'artis')) {
        curr.artis = await cfgMap.getCfg(char, 'artis')
      }
      // 伤害计算
      if (cfgMap.exists(char, 'calc_user')) {
        curr.calc = await cfgMap.getCfg(char, 'calc_user')
      } else if (cfgMap.exists(char, 'calc')) {
        curr.calc = await cfgMap.getCfg(char, 'calc')
      }
    }
  },
  exists (char, file) {
    return fs.existsSync(`${charPath}/${char}/${file}.js`)
  },
  async getCfg (char, file, module = '') {
    let cfg = require(`${common.getPluginsPath()}/miao-plugin/resources/meta/character/${char}/${file}.js`)
    if (module) {
      return cfg[module]
    }
    return cfg
  }
}
;(async () => {
  // 代码写这里
  await cfgMap.init()
})()
/**
 * 角色相关配置
 */
let CharCfg = {
  // 获取角色伤害计算相关配置
  getCalcRule (char) {
    let cfg = cfgMap.char[char.name]?.calc
    if (!cfg || lodash.isEmpty(cfg)) {
      return false
    }
    return {
      details: cfg.details || false, // 计算详情
      buffs: cfg.buffs || [], // 角色buff
      defParams: cfg.defParams || {}, // 默认参数，一般为空
      defDmgIdx: cfg.defDmgIdx || -1, // 默认详情index
      defDmgKey: cfg.defDmgKey || '',
      mainAttr: cfg.mainAttr || 'atk,cpct,cdmg', // 伤害属性
      enemyName: cfg.enemyName || '小宝' // 敌人名称
    }
  },
  getArtisCfg (char) {
    return cfgMap.char[char.name]?.artis || false
  }
}
module.exports = CharCfg
