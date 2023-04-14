/*
* 角色圣遗物评分详情
*
* */
const lodash = require( 'lodash')
const Cfg = require( '../../components/Cfg.js')
const Common = require( '../../components/Common.js')
const { getTargetUid, profileHelp, getProfileRefresh } = require( './ProfileCommon.js')
const Artifact = require( '../../models/Artifact.js')
const Character = require( '../../models/Character.js')
const ProfileArtis = require( '../../models/ProfileArtis.js')
const ProfileData = require('../../models/ProfileData.js')
const Player = require( '../../models/Player.js')

/*
* 角色圣遗物面板
* */
async function profileArtis (e) {
  let { uid, avatar } = e
  let profile = e._profile || await getProfileRefresh(e, avatar)
  if (!profile) {
    return true
  }
  if (!profile.hasArtis()) {
    e.reply('未能获得圣遗物详情，请重新获取面板信息后查看')
    return true
  }
  let char = profile.char
  let charCfg = profile.artis.getCharCfg()

  let { attrMap } = Artifact.getMeta()

  let artisDetail = profile.getArtisMark()
  let artisKeyTitle = ProfileArtis.getArtisKeyTitle()

  // 渲染图像
  return await Common.render('character/artis-mark', {
    uid,
    elem: char.elem,
    splash: profile.costumeSplash,
    data: profile,
    costume: profile.costume ? '2' : '',
    artisDetail,
    artisKeyTitle,
    attrMap,
    charCfg,
    changeProfile: e._profileMsg
  }, { e, scale: 1.3 })
}

/*
* 圣遗物列表
* */
async function profileArtisList (e) {
  let uid = await getTargetUid(e)
  if (!uid) {
    return true
  }

  let artis = []
  let player = await Player.create(uid)
  player.forEachAvatar(async (avatar) => {
    let profile = new ProfileData(avatar.toJSON())
    profile.initArtis()
    profile.setArtis(avatar.artis)
    if (!profile) {
      return true
    }
    let name = profile.name
    let char = Character.get(name)
    if (!profile.hasData || !profile.hasArtis()) {
      return true
    }
    let profileArtis = profile.getArtisMark()
    lodash.forEach(profileArtis.artis, (arti, idx) => {
      arti.charWeight = profileArtis.charWeight
      arti.avatar = name
      arti.side = char.side
      artis.push(arti)
    })
  })

  if (artis.length === 0) {
    e.reply('请先获取角色面板数据后再查看圣遗物列表...')
    await profileHelp(e)
    return true
  }
  artis = lodash.sortBy(artis, '_mark')
  artis = artis.reverse()
  let number = Cfg.get('artisNumber', 28)
  artis = artis.slice(0, `${number}`)
  let artisKeyTitle = ProfileArtis.getArtisKeyTitle()

  // 渲染图像
  return await Common.render('character/artis-list', {
    save_id: uid,
    uid,
    artis,
    artisKeyTitle
  }, { e, scale: 1.4 })
}

exports.profileArtis = profileArtis
exports.profileArtisList = profileArtisList
