/**
 * 旧面板数据迁移
 * 去除旧格式，控制逻辑复杂度
 */
const fs = require( 'node:fs')
const lodash = require( 'lodash')
const Data = require( '../../components/Data')

const DataTrans = {
  trans () {
    const srcPath = './data/UserData'
    let uids = fs.readdirSync(srcPath)
    uids = uids.filter((uid) => /\.json/i.test(uid))
    lodash.forEach(uids, (uid) => {
      let data = Data.readJSON(`/data/UserData/${uid}`)
      DataTrans.doTrans(data)
    })
  },
  doTrans (data) {
    lodash.forEach(data.avatars, (ds, id) => {
      data.avatars[id] = DataTrans.getAvatar(ds)
    })
  },
  getAvatar (data) {
    let artisSet = {}
    lodash.forEach(data.artis, (ds, idx) => {

    })

  }
}
module.exports=DataTrans
