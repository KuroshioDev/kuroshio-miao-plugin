class helpApp {
  constructor(app, ctx, config) {
    ctx.command('genshin.miao.help', { authority: 1 }).userFields(['id'])
      .alias('#原神帮助')
      .alias('#帮助')
      .alias('#菜单')
      .action(async ({session}) => {
        let application = new app.help(ctx, session, config)
        application.help()
      })

  }
}

module.exports = helpApp
