const { Schema } = require( 'koishi')
const {init} = require( '../index.js')
const { Logger } = require( 'koishi')
const wikiApp = require( './entrace/wiki')
const profileApp = require( './entrace/profile')
const adminApp = require( './entrace/admin')
const statApp = require( './entrace/stat')
const fs = require( "fs")
const {common} = require( "../../lib/common/common")
const YAML = require('yaml')

const logger = new Logger("Kuroshio-Genshin-Plugin")


class MiaoPlugin {
  constructor(ctx, config) {
    // ready
    ctx.on("ready", async ()=>{
      let locale = YAML.parse(
        fs.readFileSync(`${common.getPluginsPath()}/miao-plugin/core/locales/zh.yml`, 'utf8')
      )
      ctx.i18n.define('zh', locale)
      this.apps = await init()
      new wikiApp(this.apps, ctx, config)
      new profileApp(this.apps, ctx, config)
      new adminApp(this.apps, ctx, config)
      new statApp(this.apps, ctx, config)
    })
  }
}

exports.default = MiaoPlugin
exports.name = 'miao-plugin'
