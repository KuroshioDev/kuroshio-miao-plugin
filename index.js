const fs = require( 'node:fs')
const {common} = require( '../lib/common/common')
const files = fs.readdirSync(`${common.getPluginsPath()}/miao-plugin/apps`).filter(file => file.endsWith('index.js'))
async function init() {
  let ret = []
  files.forEach((file) => {
    ret.push(require(`./apps/${file}`))
  })
  ret = await Promise.allSettled(ret)
  let apps = {}
  for (let i in files) {
    let name = files[i].replace('.js', '')
    if (ret[i].status != 'fulfilled') {
      continue
    }
    apps = ret[i].value["apps"]
  }
  return apps
}
exports.init = init
