const Cfg = require( '../../components/Cfg.js')
const Common = require( '../../components/Common.js')
const Character = require( '../../models/Character.js')
const { segment } = require( 'oicq')
const CharTalent = require( './CharTalent.js')
const lodash = require( 'lodash')
const CharWikiData = require( './CharWikiData.js')
const CharMaterial = require( './CharMaterial.js')
const common = require("../../../lib/common/common");

const wikiReg = /^(?:#|喵喵)?(.*)(天赋|技能|命座|命之座|资料|图鉴|照片|写真|图片|图像)$/

const CharWiki = {
  check (e) {
    let msg = e.original_msg || e.msg
    if (!e.msg) {
      return false
    }
    let ret = wikiReg.exec(msg)
    if (!ret || !ret[1] || !ret[2]) {
      return false
    }
    let mode = 'talent'
    if (/命/.test(ret[2])) {
      mode = 'cons'
    } else if (/(图鉴|资料)/.test(ret[2])) {
      mode = 'wiki'
      if (!Common.cfg('charWiki')) {
        return false
      }
    } else if (/图|画|写真|照片/.test(ret[2])) {
      mode = 'pic'
      if (!Common.cfg('charPic')) {
        return false
      }
    } else if (/(材料|养成|成长)/.test(ret[2])) {
      mode = 'material'
    }
    if (['cons', 'talent'].includes(mode) && !Common.cfg('charWikiTalent')) {
      return false
    }
    let char = Character.get(ret[1])
    if (!char || (char.isCustom && mode !== 'pic')) {
      return false
    }
    e.wikiMode = mode
    e.msg = '#喵喵WIKI'
    e.char = char
    return true
  },

  async wiki (e) {
    const check = (e) => {
      let msg = e.original_msg || e.msg
      if (!e.msg) {
        return false
      }
      let ret = wikiReg.exec(msg)
      if (!ret || !ret[1] || !ret[2]) {
        return false
      }
      let mode = 'talent'
      if (/命/.test(ret[2])) {
        mode = 'cons'
      } else if (/(图鉴|资料)/.test(ret[2])) {
        mode = 'wiki'
        if (!Common.cfg('charWiki')) {
          return false
        }
      } else if (/图|画|写真|照片/.test(ret[2])) {
        mode = 'pic'
        if (!Common.cfg('charPic')) {
          return false
        }
      } else if (/(材料|养成|成长)/.test(ret[2])) {
        mode = 'material'
      }
      if (['cons', 'talent'].includes(mode) && !Common.cfg('charWikiTalent')) {
        return false
      }
      let char = Character.get(ret[1])
      if (!char) {
        return false
      }
      e.wikiMode = mode
      e.msg = '#喵喵WIKI'
      e.char = char
      return true
    }
    if (!check(e)) {
      return
    }
    let mode = e.wikiMode
    let char = e.char

    if (mode === 'pic') {
      let img = char.getCardImg(Cfg.get('charPicSe', false), false)
      if (img && img.img) {
        e.reply(`file:///${common.getPluginsPath()}/miao-plugin/resources/${img.img}`)
      } else {
        e.reply('暂无图片')
      }
      return true
    }
    if (char.isCustom) {
      if (mode === 'wiki') {
        return false
      }
      e.reply('暂不支持自定义角色')
      return true
    }
    if (!char.isRelease && Cfg.get('notReleasedData') === false) {
      e.reply('未实装角色资料已禁用...')
      return true
    }

    if (mode === 'wiki') {
      if (char.source === 'amber') {
        e.reply('暂不支持该角色图鉴展示')
        return true
      }
      return await CharWiki.render({ e, char })
    } else if (mode === 'material') {
      return CharMaterial.render({ e, char })
    }
    return await CharTalent.render(e, mode, char)
  },

  async render ({ e, char }) {
    let data = char.getData()
    lodash.extend(data, char.getData('weaponTypeName,elemName'))
    // 命座持有
    let holding = await CharWikiData.getHolding(char.id)
    let usage = await CharWikiData.getUsage(char.id)
    return await Common.render('wiki/character-wiki', {
      data,
      attr: char.getAttrList(),
      detail: char.getDetail(),
      imgs: char.getImgs(),
      holding,
      usage,
      materials: char.getMaterials(),
      elem: char.elem
    }, { e, scale: 1.4 })
  }
}

module.exports = CharWiki

