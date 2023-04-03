/*
* 面板公共方法及处理
* */
const { segment } = require( 'oicq')
const Version = require( '../../components/Version.js')
const Character = require( '../../models/Character.js')
const MysApi = require( '../../models/MysApi.js')
const Player = require( '../../models/Player.js')
const common = require('../../../lib/common/common.js')
const { Logger } = require( 'koishi')
const logger = new Logger('ProfileCommon')
/*
* 获取面板查询的 目标uid
* */
const _getTargetUid = async function (e) {
  let uidReg = /[1-9][0-9]{8}/

  if (e.uid && uidReg.test(e.uid)) {
    return e.uid
  }

  let uidRet = uidReg.exec(e.msg)
  if (uidRet) {
    return uidRet[0]
  }
  let uid = false
  let getUid = async function (qq) {
    let nCookie = global.NoteCookie || false
    if (nCookie && nCookie[qq]) {
      let nc = nCookie[qq]
      if (nc.uid && uidReg.test(nc.uid)) {
        return nc.uid
      }
    }
    uid = await redis.get(`genshin:id-uid:${qq}`) || await redis.get(`Yz:genshin:mys:qq-uid:${qq}`)
    if (uid && uidReg.test(uid)) {
      return uid
    }
  }
  if (!Version.isV3) {
    let botQQ = global?.Bot?.uin || global?.BotConfig?.account?.qq
    if (e.at && e.at !== botQQ) {
      uid = await getUid(e.at)
      if (uid) {
        return uid
      }
    }

    uid = await getUid(e.user_id)
    if (uid) {
      return uid
    }
  }

  try {
    let user = await MysApi.initUser(e)

    if (!user || !user.uid) {
      return false
    }
    uid = user.uid
    if ((!uid || !uidReg.test(uid)) && !e._replyNeedUid) {
      e.reply('请先发送【#绑定+你的UID】来绑定查询目标')
      return false
    }
  } catch (err) {
    console.log(err)
  }
  return uid || false
}

async function getTargetUid (e) {
  let uid = await _getTargetUid(e)
  if (uid) {
    e.uid = uid
  }
  return uid
}

async function getProfileRefresh (e, avatar) {
  let char = Character.get(avatar)
  if (!char) {
    return false
  }
  let player = Player.create(e)
  let profile = player.getProfile(char.id)
  if (!profile || !profile.hasData) {
    logger.info(`本地无UID:${player.uid}的${char.name}面板数据，尝试自动请求...`)
    await player.refresh({ profile: true })
    profile = player.getProfile(char.id)
  }
  if (!profile || !profile.hasData) {
    if (!e._isReplyed) {
      e.reply(`请确认${char.name}已展示在【游戏内】的角色展柜中，并打开了“显示角色详情”。然后请使用 #更新面板\n命令来获取${char.name}的面板详情`)
    }
    return false
  }
  return profile
}

/*
* 面板帮助
* */
async function profileHelp (e) {
  e.reply(segment.image(`file://${common.getPluginsPath()}/miao-plugin/resources/character/imgs/help.jpg`))
  return true
}

exports.getTargetUid = getTargetUid
exports.profileHelp = profileHelp
exports.getProfileRefresh = getProfileRefresh
