const lodash = require( 'lodash')
const { Cfg } = require( '../../components/index.js')

class adminApp {
  constructor(app, ctx, config) {
    this.keys = lodash.map(Cfg.getCfgSchemaMap(), (i) => i.key)
    this.sysCfgReg = new RegExp(`^#喵喵设置\\s*(${this.keys.join('|')})?\\s*(.*)$`)
    ctx.command('genshin.miao.setting', { authority: 4 }).userFields(['id'])
      .alias('#喵喵设置')
      .shortcut(this.sysCfgReg)
      .action(async ({session}) => {
        let application = new app.admin(ctx, session, config)
        application.sysCfg()
      })

  }
}

module.exports = adminApp
