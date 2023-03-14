const Character = require( '../../models/Character.js')
const MysApi = require( '../../models/MysApi.js')
const Player = require( '../../models/Player.js')
const Common = require( '../../components/Common.js')
const Cfg = require( '../../components/Cfg.js')
const lodash = require( 'lodash')
const { segment} = require( 'oicq')
const moment = require( 'moment')

let Avatar = {
  render (e) {
    if (!e.char) {
      return false
    }
    return Avatar.renderAvatar(e, e.char?.name)
  },
  async renderAvatar (e, avatar, renderType = 'card') {
    // 如果传递的是名字，则获取
    if (typeof (avatar) === 'string') {
      // 检查角色
      let char = Character.get(avatar)
      if (!char) {
        return false
      }
      let mys = await MysApi.init(e)
      if (!mys) return true
      if (!char.isRelease) {
        avatar = { id: char.id, name: char.name, detail: false }
      } else {
        let player = Player.create(e)
        await player.refreshMysDetail(1)
        await player.refreshTalent(char.id, 1)
        avatar = player.getAvatar(char.id)
        if (!avatar) {
          avatar = { id: char.id, name: char.name, detail: false }
        }
      }
    }
    return await Avatar.renderCard(e, avatar, renderType)
  },

  async renderCard (e, avatar, renderType = 'card') {
    let char = Character.get(avatar.id)
    if (!char) {
      return false
    }
    let bg = char.getCardImg(Cfg.get('charPicSe', false))
    if (renderType === 'photo') {
      e.reply(segment.image(process.cwd() + '/plugins/miao-plugin/resources/' + bg.img))
      return true
    }
    let uid = e.uid || (e.targetUser && e.targetUser.uid)
    let data = {}
    let custom = char.isCustom
    let isRelease = char.isRelease
    if (isRelease && avatar.hasData) {
      data = avatar.getDetail()
      data.imgs = char.imgs
      data.source = avatar._source
      data.artis = avatar.getArtisDetail()
      data.updateTime = moment(new Date(avatar._time)).format('MM-DD HH:mm')
      if (data.hasTalent) {
        data.talent = avatar.talent
        data.talentMap = ['a', 'e', 'q']
        // 计算皇冠个数
        data.crownNum = lodash.filter(lodash.map(data.talent, (d) => d.original), (d) => d >= 10).length
      }
    } else {
      data = char.getData('id,name,sName')
    }

    let width = 600
    let imgCss = ''
    let scale = 1.2
    if (bg.mode === 'left') {
      const height = 480
      width = height * bg.width / bg.height
      imgCss = `img.bg{width:auto;height:${height}px;}`
      scale = 1.45
    }
    // 渲染图像
    let msgRes = await Common.render('character/character-card', {
      saveId: uid,
      uid,
      bg,
      widthStyle: `<style>html,body,#container{width:${width}px} ${imgCss}</style>`,
      mode: bg.mode,
      custom,
      isRelease,
      data
    }, { e, scale, retMsgId: true })
    if (msgRes && msgRes.message_id) {
      // 如果消息发送成功，就将message_id和图片路径存起来，3小时过期
      await redis.set(`miao:original-picture:${msgRes.message_id}`, JSON.stringify({ type: 'character', img: bg.img }), { EX: 3600 * 3 })
    }
    return true
  },
  check (e) {
    let msg = e.original_msg || e.msg
    if (!msg || !/^#/.exec(msg)) {
      return false
    }
    if (!Common.cfg('avatarCard')) {
      return false
    }
    let uidRet = /[0-9]{9}/.exec(msg)
    if (uidRet) {
      e.uid = uidRet[0]
      msg = msg.replace(uidRet[0], '')
    }
    let name = msg.replace(/#|老婆|老公|卡片/g, '').trim()

    // cache gsCfg
    Character.gsCfg = Character.gsCfg || e?.runtime?.gsCfg

    let char = Character.get(name.trim())

    if (!char) {
      return false
    }

    e.msg = '#喵喵角色卡片'
    e.char = char
    return true
  }
}
module.exports = Avatar

