const {fs } = require( 'fs')
const { promisify } = require( 'util')
const { pipeline } = require( 'stream')
const { segment  } = require( 'oicq')
const MD5 = require( 'md5')
const fetch = require( 'node-fetch')
const lodash = require( 'lodash')
const { Data } = require( '../../components/index.js')
const { Character } = require( '../../models/index.js')
const { Logger } = require('koishi')
const logger = new Logger('ImgUpload')

const resPath = process.cwd() + '/plugins/miao-plugin/resources/'
let regex = /^#?\s*(?:喵喵)?(?:上传|添加)(.+)(?:照片|写真|图片|图像)\s*$/
let profileRegex = /^#?\s*(?:喵喵)?(?:上传|添加)(.+)(?:面板图)\s*$/
let isProfile = false

async function uploadCharacterImg (e) {
  let promise = await isAllowedToUploadCharacterImage(e)
  if (!promise) {
    return false
  }

  let imageMessages = []
  let msg = e.msg
  let regRet = regex.exec(msg)
  if (msg.includes('面板')) {
    isProfile = true
    regRet = profileRegex.exec(msg)
  }

  // 通过解析正则获取消息中的角色名
  if (!regRet || !regRet[1]) {
    return false
  }
  let char = Character.get(regRet[1])
  if (!char || !char.name) {
    return false
  }
  let name = char.name
  for (let val of e.message) {
    if (val.type === 'image') {
      imageMessages.push(val)
    }
  }
  if (imageMessages.length === 0 && e.source) {
    let source
    if (e.isGroup) {
      // 支持at图片添加，以及支持后发送
      source = (await e.group.getChatHistory(e.source?.seq, 1)).pop()
    } else {
      source = (await e.friend.getChatHistory((e.source?.time + 1), 1)).pop()
    }
    if (source) {
      for (let val of source.message) {
        if (val.type === 'image') {
          imageMessages.push(val)
        } else if (val.type === 'xml') { // 支持合并转发消息内置的图片批量上传，喵喵 喵喵喵？ 喵喵喵喵
          let resid = val.data.match(/m_resid="(\d|\w|\/|\+)*"/)[0].replace(/m_resid=|"/g, '')
          if (!resid) break
          let message = await Bot.getForwardMsg(resid)
          for (const item of message) {
            for (const i of item.message) {
              if (i.type === 'image') {
                imageMessages.push(i)
              }
            }
          }
        }
      }
    }
  }
  if (imageMessages.length <= 0) {
    e.reply('消息中未找到图片，请将要发送的图片与消息一同发送或引用要添加的图像..')
    return true
  }
  await saveImages(e, name, imageMessages)
  return true
}

async function saveImages (e, name, imageMessages) {
  let imgMaxSize = e?.groupConfig?.imgMaxSize || 5
  let pathSuffix = `character-img/${name}/upload`
  if (isProfile) pathSuffix = `profile/normal-character/${name}`
  let path = resPath + pathSuffix

  if (!fs.existsSync(path)) {
    Data.createDir(pathSuffix, resPath)
  }
  let senderName = lodash.truncate(e.sender.card, { length: 8 })
  let imgCount = 0
  let urlMap = {}
  for (let val of imageMessages) {
    if (!val.url || urlMap[val.url]) {
      continue
    }
    urlMap[val.url] = true
    const response = await fetch(val.url)
    if (!response.ok) {
      e.reply('图片下载失败。')
      return true
    }
    if (response.headers.get('size') > 1024 * 1024 * imgMaxSize) {
      e.reply([segment.at(e.user_id, senderName), '添加失败：图片太大了。'])
      return true
    }
    let fileName = val.file.substring(0, val.file.lastIndexOf('.'))
    let fileType = val.file.substring(val.file.lastIndexOf('.') + 1)
    if (response.headers.get('content-type') === 'image/gif') {
      fileType = 'gif'
    }
    if (isProfile) fileType = 'webp'
    let imgPath = `${path}/${fileName}.${fileType}`
    const streamPipeline = promisify(pipeline)
    await streamPipeline(response.body, fs.createWriteStream(imgPath))

    // 使用md5作为文件名
    let buffers = fs.readFileSync(imgPath)
    let base64 = Buffer.from(buffers, 'base64').toString()
    let md5 = MD5(base64)
    let newImgPath = `${path}/${md5}.${fileType}`
    if (fs.existsSync(newImgPath)) {
      fs.unlink(newImgPath, (err) => {
        console.log('unlink', err)
      })
    }
    fs.rename(imgPath, newImgPath, () => {
    })
    imgCount++
    logger.info(`添加成功: ${path}/${fileName}`)
  }
  e.reply([segment.at(e.user_id, senderName), `\n成功添加${imgCount}张${name}图片。`])
  return true
}

async function isAllowedToUploadCharacterImage (e) {
  let sendMsg = /上传|添加/.test(e.msg) ? '添加' : '删除'
  if (!e.message) {
    return false
  }
  if (!e.msg) {
    return false
  }
  // master直接返回true
  if (e.isMaster) {
    return true
  }
  if (e.isPrivate) {
    e.reply(`只有主人才能${sendMsg}...`)
    return false
  }
  let groupId = e.group_id
  if (!groupId) {
    return false
  }
  const addLimit = e.groupConfig?.imgAddLimit || 2
  const isAdmin = ['owner', 'admin'].includes(e.sender.role)
  if (addLimit === 2) {
    e.reply(`只有主人才能${sendMsg}...`)
    return false
  }
  if (addLimit === 1 && !isAdmin) {
    e.reply(`只有管理员才能${sendMsg}...`)
    return false
  }
  return true
}

// 仅支持面板图删除
async function delProfileImg (e) {
  let promise = await isAllowedToUploadCharacterImage(e)
  if (!promise) {
    return false
  }
  let char = Character.get(e.msg.replace(/#|面板图|列表|上传|删除|\d+/g, '').trim())
  if (!char || !char.name) {
    return false
  }
  let name = char.name
  let pathSuffix = `profile/normal-character/${name}`
  let path = resPath + pathSuffix
  let num = e.msg.match(/\d+/)
  if (!num) {
    e.reply(`删除哪张捏？请输入数字序列号,可输入【#${name}面板图列表】查看序列号`)
    return
  }
  try {
    let imgs = fs.readdirSync(`${path}`).filter((file) => {
      return /\.(png|webp)$/.test(file)
    })
    fs.unlinkSync(`${path}/${imgs[num - 1]}`)
    e.reply('删除成功')
  } catch (err) {
    e.reply('删除失败，请检查序列号是否正确')
  }
  return true
}

async function profileImgList (e) {
  let msglist = []
  let char = Character.get(e.msg.replace(/#|面板图列表/g, ''))
  if (!char || !char.name) {
    return false
  }
  if ([1, 0].includes(Cfg.get('originalPic') * 1)) {
    e.reply('已禁止获取面板图列表')
  }
  let nickname = Bot.nickname
  if (e.isGroup) {
    let info = await Bot.getGroupMemberInfo(e.group_id, Bot.uin)
    nickname = info.card || info.nickname
  }
  let name = char.name
  let pathSuffix = `profile/normal-character/${name}`
  let path = resPath + pathSuffix
  if (!fs.existsSync(path)) {
    e.reply(`暂无${char.name}的角色面板图`)
    return true
  }
  try {
    let imgs = fs.readdirSync(`${path}`).filter((file) => {
      return /\.(png|webp)$/.test(file)
    })
    msglist.push({
      message: [`当前查看的是${name}面板图,共${imgs.length}张，可输入【#删除${name}面板图(序列号)】进行删除`],
      nickname: nickname,
      user_id: Bot.uin
    })
    for (let i = 0; i < imgs.length; i++) {
      // 合并转发最多99？ 但是我感觉不会有这么多先不做处理
      console.log(`${path}${imgs[i]}`)
      msglist.push({
        message: [`${i + 1}.`, segment.image(`${path}/${imgs[i]}`)],
        nickname: nickname,
        user_id: Bot.uin
      })
    }
    let msgRsg = await e.reply(await Bot.makeForwardMsg(msglist))
    if (!msgRsg) e.reply('风控了，可私聊查看', true)
  } catch (err) {
    logger.error(err)
    e.reply(`暂无${char.name}的角色面板图~`)
  }
  return true
}
exports.uploadCharacterImg = uploadCharacterImg
exports.delProfileImg = delProfileImg
exports.profileImgList = profileImgList
