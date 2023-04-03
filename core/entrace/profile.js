class profileApp {
  constructor(app, ctx, config) {
    ctx.guild().command('genshin.panel.get', { authority: 1 })
    .alias('#更新面板')
    .shortcut(/^#(全部面板更新|更新全部面板|获取游戏角色详情|更新面板|面板更新)/).userFields(['id'])
    .action(async ({session}) => {
      let application = new app.profile(ctx, session, config)
      application.profileRefresh()
    })

    ctx.guild().command('genshin.panel.detail', { authority: 1 })
      .shortcut(/^#*([^#]+)\s*(详细|详情|面板|面版|圣遗物|伤害[1-7]?)\s*(\d{9})*(.*[换变改].*)?$/).userFields(['id'])
      .shortcut(/^#.+换.+$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.profileDetail()
      })
      ctx.guild().command('genshin.panel.list', { authority: 1 })
      .alias('#面板')
      .shortcut(/^#(面板角色|角色面板|面板)(列表)?\s*(\d{9})?$/).userFields(['id'])
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.profileList()
      })
      ctx.guild().command('genshin.panel.stat', { authority: 1 }).userFields(['id'])
        .alias("#面板练度统计")
        .shortcut(/^#*(我的)*(技能|天赋|武器|角色|练度|五|四|5|4|星)+(汇总|统计|列表)(force|五|四|5|4|星)*[ |0-9]*$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.profileStat()
      })
      ctx.guild().command('genshin.help.panel', { authority: 1 }).userFields(['id'])
        .alias('#角色面板帮助')
      .shortcut(/^#(角色|换|更换)?面[板版]帮助$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.profileHelp()
      })
      ctx.guild().command('genshin.panel.setlv', { authority: 1 }).userFields(['id'])
      .shortcut(/^#(敌人|怪物)等级\s*\d{1,3}\s*$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.enemyLv()
      })
      // TODO Test online
      ctx.command('genshin.panel.resetrank', { authority: 4 }).userFields(['id'])
        .alias('#重置排行')
      .shortcut(/^#(重置|重设)(.*)(排名|排行)$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.resetRank()
      })
      // TODO Test online
      ctx.command('genshin.panel.refreshrank', { authority: 4 }).userFields(['id'])
        .alias('#刷新全部排行')
      .shortcut(/^#(刷新|更新|重新加载)(群内|群|全部)(.*)(排名|排行)$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.refreshRank()
      })
      ctx.guild().command('genshin.panel.rank', { authority: 1 }).userFields(['id'])
      .shortcut(/^#(群|群内)?.+(排名|排行)(榜)?$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.rankList()
      })
      ctx.guild().command('genshin.panel.top', { authority: 1 }).userFields(['id'])
      .shortcut(/^#(群|群内)?(排名|排行)?(最强|最高|最高分|最牛|第一)+.+/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.groupProfile()
      })
      ctx.command('genshin.panel.upload', { authority: 4 }).userFields(['id'])
      .shortcut(/^#?\s*(?:上传|添加)(.+)(?:面板图)\s*$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.uploadImg()
      })

      ctx.guild().command('genshin.profile.role [uid:string]', {authority: 1}).userFields(['id'])
      .alias('#角色查询')
      .shortcut(/^(#(角色|查询|查询角色|角色查询|人物)[ |0-9]*$)|(^(#*uid|#*UID)\+*[1|2|5-9][0-9]{8}$)|(^#[\+|＋]*[1|2|5-9][0-9]{8})/)
      .shortcut( /^#喵喵(角色|查询)[ |0-9]*$/)
      .action(async ({session}, uid) => {
        let application = new app.profile(ctx, session, config)
        application.avatarList()
      })
  }

}

module.exports = profileApp
