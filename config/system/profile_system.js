/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
* 如需自定义配置请复制修改上一级profile_default.js
* */

const miaoApi = {
  listApi: ({ url, uid, diyCfg }) => {
    let qq = /\d{5,12}/.test(diyCfg.qq) ? diyCfg.qq : 'none'
    let token = diyCfg.token
    url = url || 'http://miaoapi.cn/'
    return `${url}profile/data?uid=${uid}&qq=${qq}&token=${token}&version=2`
  }
}

exports.enkaApi = {
  url: 'https://enka.network/',
  userAgent: 'Miao-Plugin/3.1',
  listApi: ({ url, uid, diyCfg }) => {
    return `${url}api/u/${uid}/`
  }
}

exports.mggApi = {
  url: 'http://profile.microgg.cn/',
  userAgent: 'Miao-Plugin/3.1',
  listApi: ({ url, uid, diyCfg }) => {
    return `${url}api/uid/${uid}/`
  }
}

const requestInterval = 5

const isSys = true

exports.miaoApi = miaoApi
exports.requestInterval = requestInterval
exports.isSys = isSys
