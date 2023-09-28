
/**
 * 面板数据替换相关逻辑
 */
const lodash = require( 'lodash')
const Data = require( '../../components/Data.js')
const Character = require('../../models/Character.js')
const ProfileData = require('../../models/ProfileData.js')
const Weapon = require('../../models/Weapon.js')
const Player = require('../../models/Player.js')

const keyMap = {
  artis: '圣遗物',
  arti1: '花',
  arti2: '毛,羽,羽毛',
  arti3: '沙,沙漏,表',
  arti4: '杯,杯子',
  arti5: '头,冠',
  weapon: '武器'
}
let keyTitleMap = {}
lodash.forEach(keyMap, (val, key) => {
  lodash.forEach(val.split(','), (v) => {
    keyTitleMap[v] = key
  })
})
const keyReg = new RegExp(`^(\\d{9})?\\s*(.+?)\\s*(\\d{9})?\\s*((?:${lodash.keys(keyTitleMap).join('|')}|\\+)+)$`)
// 默认武器
let defWeapon = {
  bow: '西风猎弓',
  catalyst: '西风秘典',
  claymore: '西风大剑',
  polearm: '西风长枪',
  sword: '西风剑'
}

const ProfileChange = {
  /**
   * 匹配消息
   * @param msg
   * @returns {{}}
   */
  matchMsg (msg) {
    if (!/(变|改|换)/.test(msg)) {
      return false
    }
    msg = msg.toLowerCase().replace(/uid ?:? ?/, '')
    let regRet = /^#*(\d{9})?(.+?)(详细|详情|面板|面版|圣遗物|伤害[1-7]?)?\s*(\d{9})?[变换改](.+)/.exec(msg)
    if (!regRet || !regRet[2]) {
      return false
    }

    let ret = {}
    let change = {}
    let char = Character.get(lodash.trim(regRet[2]))
    if (!char) {
      return false
    }
    ret.char = char.id
    ret.mode = regRet[3] === '换' ? '面板' : regRet[3]
    ret.uid = regRet[1] || regRet[4] || ''
    ret.game = char.game
    msg = regRet[5]

    // 更换匹配
    msg = msg.replace(/[变改]/g, '换')
    lodash.forEach(msg.split('换'), (txt) => {
      txt = lodash.trim(txt)
      if (!txt) {
        return true
      }
      // 匹配圣遗物
      let keyRet = keyReg.exec(txt)
      if (keyRet && keyRet[4]) {
        let char = Character.get(lodash.trim(keyRet[2]))
        if (char) {
          lodash.forEach(keyRet[4].split('+'), (key) => {
            key = lodash.trim(key)
            let type = keyTitleMap[key]
            change[type] = {
              char: char.id || '',
              uid: keyRet[1] || keyRet[3] || '',
              type
            }
          })
        } else if (keyRet[4] !== '武器' && keyRet[4] !== '花') {
          return true
        }
      }
      // 匹配武器
      let wRet = /^(?:等?级?([1-9][0-9])?级?)?\s*(?:([1-5一二三四五满])?精炼?([1-5一二三四五])?)?\s*(?:等?级?([1-9][0-9])?级?)?\s*(.*)$/.exec(txt)
      if (wRet && wRet[5]) {
        let weaponName = lodash.trim(wRet[5])
        let weapon = Weapon.get(weaponName, ret.char.game)
        if (weapon || weaponName === '武器' || Weapon.isWeaponSet(weaponName)) {
          let affix = wRet[2] || wRet[3]
          affix = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 满: 5 }[affix] || affix * 1
          let tmp = {
            weapon: (Weapon.isWeaponSet(weaponName) ? weaponName : weapon?.name) || '',
            affix: affix || '',
            level: wRet[1] * 1 || wRet[4] * 1 || ''
          }
          if (lodash.values(tmp).join('')) {
            change.weapon = tmp
          }
          return true
        }
      }
      let char = change.char || {}
      // 命座匹配
      let consRet = /([0-6零一二三四五六满])命/.exec(txt)
      if (consRet && consRet[1]) {
        let cons = consRet[1]
        char.cons = Math.max(0, Math.min(6, lodash.isNaN(cons * 1) ? '零一二三四五六满'.split('').indexOf(cons) : cons * 1))
        txt = txt.replace(consRet[0], '')
      }

      // 天赋匹配
      let talentRet = /(?:天赋|技能)((?:[1][0-5]|[1-9])[ ,]?)((?:[1][0-5]|[1-9])[ ,]?)([1][0-5]|[1-9])/.exec(txt)
      if (talentRet) {
        let [match, a, e, q] = talentRet
        char.talent = {
          a: a * 1 || 1,
          e: e * 1 || 1,
          q: q * 1 || 1
        }
        txt = txt.replace(match, '')
      }

      let lvRet = /等级([1-9][0-9]?)|([1-9][0-9]?)级/.exec(txt)
      if (lvRet && (lvRet[1] || lvRet[2])) {
        char.level = (lvRet[1] || lvRet[2]) * 1
        txt = txt.replace(lvRet[0], '')
      }
      txt = lodash.trim(txt)
      if (txt) {
        let chars = Character.get(txt)
        if (chars) {
          char.char = chars.id
        }
      }
      if (!lodash.isEmpty(char)) {
        change.char = char
      }
    })
    ret.change = lodash.isEmpty(change) ? false : change
    return ret
  },

  /**
   * 获取面板数据
   * @param uid
   * @param charid
   * @param ds
   * @param game
   * @returns {ProfileData|boolean}
   */ async getProfile(uid, charid, ds, game = 'gs') {
    if (!charid) {
      return false
    }

    let player = await Player.create(uid, game)

    let source = player.getProfile(charid)

    let dc = ds.char || {}
    if (!source || !source.hasData) {
      source = {}
    }
    let char = Character.get(dc?.char || source.id || charid)
    if (!char) {
      return false
    }
    let level = dc.level || source.level || 90
    let promote = level === source.level ? source.promote : undefined

    let profiles = {}
    if (source && source.id) {
      profiles[`${player.uid}:${source.id}`] = source
    }
    // 获取source
    let getSource = async function (cfg) {
      if (!cfg || !cfg.char) {
        return source
      }
      let cuid = cfg.uid || uid
      let id = cfg.char || source.id
      let key = cuid + ':' + id
      if (!profiles[key]) {
          let cPlayer = await Player.create(cuid, game)
        profiles[key] = cPlayer.getProfile(id) || {}
      }
      return profiles[key]?.id ? profiles[key] : source
    }
    // 初始化profile
    let ret = new ProfileData({
      uid,
      id: char.id,
      level,
      cons: Data.def(dc.cons, source.cons, 0),
      fetter: source.fetter || 10,
      elem: char.elem,
      dataSource: 'change',
      _source: 'change',
      promote
    }, char.game, false)

    // 设置武器
    let wCfg = ds.weapon || {}
    let sourceWeapon=await getSource(wCfg)
    let wSource = sourceWeapon.weapon || {}
    let weapon = Weapon.get(wCfg?.weapon || wSource?.name || defWeapon[char.weaponType], char.game, char.weaponType)
    if (char.isGs) {
      if (!weapon || weapon.type !== char.weaponType) {
        weapon = Weapon.get(defWeapon[char.weaponType], char.game)
      }
    }

      let wDs = {
        name: weapon.name,
        star: weapon.star,
        level: Math.min(weapon.maxLv || 90, wCfg.level || wSource.level || 90)
      }
      if (wSource.level === wDs.level) {
        wDs.promote = wSource.promote
      }
      wDs.affix = Math.min(weapon.maxAffix || 5, wCfg.affix || ((wDs.star === 5 && wSource.star !== 5) ? 1 : (wSource.affix || 5)))
      ret.setWeapon(wDs)

      // 设置天赋
      if (ds?.char?.talent) {
        ret.setTalent(ds?.char?.talent, 'level')
      } else {
        ret.setTalent(source?.originalTalent || {a: 9, e: 9, q: 9}, 'original')
      }

      // 设置圣遗物
      let artis = await getSource(ds.artis)
      artis = artis?.artis?.artis || {}
      for (let idx = 1; idx <= 5; idx++) {
        if (ds['arti' + idx]) {
          let source = await getSource(ds['arti' + idx])
          if (source && source.artis && source.artis[idx]) {
            artis[idx] = source.artis[idx]
          }
        }
      }
      ret.setArtis(artis)
      ret.calcAttr()
      return ret
    }
  }
module.exports = ProfileChange
