class statApp {
  constructor(app, ctx, config) {
    ctx.guild().command('genshin.wiki.stat', { authority: 1 })
      .shortcut(/^#(喵喵)?角色(持有|持有率|命座|命之座|.命)(分布|统计|持有|持有率)?$/).userFields(['id'])
      .action(async ({session}) => {
        let application = new app.stat(ctx, session, config)
        application.consStat()
      })

    ctx.guild().command('genshin.wiki.abysspct', { authority: 1 })
    .alias('#深渊12层使用率')
    .shortcut(/^#(喵喵)?深渊(第?.{1,2}层)?(角色)?(出场|使用)(率|统计)*$/).userFields(['id'])
    .action(async ({session}) => {
      let application = new app.stat(ctx, session, config)
      application.abyssPct()
    })

    ctx.guild().command('genshin.profile.abyssteam', { authority: 1 }).userFields(['id'])
    .shortcut(/#深渊(组队|配队)/)
    .action(async ({session}) => {
      let application = new app.stat(ctx, session, config)
      application.abyssTeam()
    })

    ctx.guild().command('genshin.profile.uploaddata', { authority: 1 }).userFields(['id'])
    .shortcut(/^#(喵喵|上传|本期)(深渊|深境|深境螺旋)[ |0-9]*(数据)?$/)
    .action(async ({session}) => {
      let application = new app.stat(ctx, session, config)
      await application.abyssSummary()
    })

  }
}

module.exports = statApp
