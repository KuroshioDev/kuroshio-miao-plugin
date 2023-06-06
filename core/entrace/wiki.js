class wikiApp {
  constructor(app, ctx, config) {
    ctx.guild().command('genshin.miao.profile', { authority: 1 })
      .shortcut(/^(#)?(?!\*)(.*)(天赋|技能|命座|命之座|资料|图鉴)$/).userFields(['id'])
      .usage('直接发送#胡桃天赋，#胡桃命座，#胡桃图鉴')
      .action(async ({session}) => {
        let application = new app.wiki(ctx, session, config)
        await application.wiki()
      })

    ctx.guild().command('genshin.miao.picture', { authority: 1 })
      .shortcut(/^(#)?(.*)(照片|写真|图片|图像)$/).userFields(['id'])
      .usage('直接发送#胡桃照片，#胡桃图片，#胡桃图像')
      .action(async ({session}) => {
        let application = new app.wiki(ctx, session, config)
        await application.wiki()
      })

    ctx.guild().command('genshin.miao.calendar', { authority: 1 }).userFields(['id'])
    .alias('#原神日历')
    .shortcut(/^(#)+(日历|日历列表)$/)
    .usage('#日历')
    .action(async ({session}) => {
      let application = new app.wiki(ctx, session, config)
      application.calendar()
    })
  }
}

module.exports = wikiApp
