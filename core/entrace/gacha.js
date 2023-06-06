class gachaApp {
  constructor(app, ctx, config) {
    ctx.command('genshin.miao.gachaRecord', { authority: 1 }).userFields(['id'])
      .alias('#抽卡记录')
      .shortcut(/^#*(抽卡|抽奖|角色|武器|常驻|up)+池?(记录|祈愿|分析)$/)
      .action(async ({session}) => {
        let application = new app.gacha(ctx, session, config)
        await application.detail()
      })

      ctx.command('genshin.miao.gachaStat', { authority: 1 }).userFields(['id'])
		  .alias('#抽卡统计')
      .shortcut(/^#*(全部|抽卡|抽奖|角色|武器|常驻|up|版本)+池?统计$/)
      .action(async ({session}) => {
        let application = new app.gacha(ctx, session, config)
        await application.stat()
      })
  }
}

module.exports = gachaApp
