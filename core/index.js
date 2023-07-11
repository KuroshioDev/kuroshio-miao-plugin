const { Schema } = require( 'koishi')
const {init} = require( '../index.js')
const { Logger } = require( 'koishi')
const wikiApp = require( './entrace/wiki')
const profileApp = require( './entrace/profile')
const adminApp = require( './entrace/admin')
const statApp = require( './entrace/stat')
const fs = require( "fs")
const common = require( "../../lib/common/common")
const YAML = require('yaml')
const gachaApp = require('./entrace/gacha.js')
const helpApp = require('./entrace/help.js')
const initDB = require("./db.js");

const logger = new Logger("Kuroshio-Genshin-Plugin")

let schema = Schema.object({
  avatarCard: Schema.boolean().description('使用喵喵版角色卡片作为默认角色卡片功能'),
  avatarProfile: Schema.boolean().description('面板查询'),
  groupRank: Schema.boolean().default(true).description('群面板排名'),
  commaGroup: Schema.number().description('数字分组'),
  charWiki: Schema.boolean().default(true).description('角色图鉴信息'),
  charWikiTalent: Schema.boolean().default(true).description('角色天赋信息'),
  charPic: Schema.boolean().default(true).description('角色图片'),
  renderScale: Schema.number().role('slider')
  .min(50).max(200).step(1).default(100).description('图片精细度'),
  help: Schema.boolean().description('喵喵帮助')
}).description('miao-plugin 配置')
if(fs.existsSync("../config/config.json")) {
  fs.writeFileSync("../config/config.json", "")
}

fs.writeFileSync(`${common.getPluginsPath()}/miao-plugin/config/config.json`, JSON.stringify(schema), 'utf8')
class MiaoPlugin {
  constructor(ctx, config) {
    // ready
    ctx.on("ready", async ()=>{
      let locale = YAML.parse(
        fs.readFileSync(`${common.getPluginsPath()}/miao-plugin/core/locales/zh.yml`, 'utf8')
      )
      ctx.i18n.define('zh', locale)
      initDB(ctx)
      this.apps = await init()
      new wikiApp(this.apps, ctx, config)
      new profileApp(this.apps, ctx, config)
      new adminApp(this.apps, ctx, config)
      new statApp(this.apps, ctx, config)
      new gachaApp(this.apps, ctx, config)
      new helpApp(this.apps,ctx, config)
    })
  }
}

exports.default = MiaoPlugin
exports.name = 'miao-plugin'
