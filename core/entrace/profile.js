class profileApp {
  constructor(app, ctx, config) {
    ctx.guild().command('genshin.miao.panel.get', { authority: 1 })
    .alias('#更新面板')
    .shortcut(/^(#|\*)(星铁|原神)?(全部面板更新|更新全部面板|获取游戏角色详情|更新面板|面板更新)/).userFields(['id'])
    .action(async ({session}) => {
      let application = new app.profile(ctx, session, config)
      application.profileRefresh()
    })

    ctx.guild().command('genshin.miao.panel.detail', { authority: 1 })
      .shortcut(/^(#|\*)(?!\*)*(?!队伍)(?!删除)([^#]+)\s*(详细|详情|面板|面版|圣遗物|伤害[1-7]?)\s*(\d{9})*(.*[换变改].*)?$/).userFields(['id'])
      .shortcut(/^(#|\*).+换.+$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.profileDetail()
      })
      ctx.guild().command('genshin.miao.panel.list', { authority: 1 })
      .alias('#面板')
      .shortcut(/^(#|\*)(星铁|原神)?(面板角色|角色面板|面板)(列表)?\s*(\d{9})?$/).userFields(['id'])
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.profileList()
      })
      ctx.guild().command('genshin.miao.panel.stat', { authority: 1 }).userFields(['id'])
        .alias("#面板练度统计")
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.profileStat()
      })
      ctx.guild().command('genshin.miao.panelHelp', { authority: 1 }).userFields(['id'])
        .alias('#角色面板帮助')
      .shortcut(/^#(角色|换|更换)?面[板版]帮助$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.profileHelp()
      })
      ctx.guild().command('genshin.miao.panel.setlv', { authority: 1 }).userFields(['id'])
      .shortcut(/^#(敌人|怪物)等级\s*\d{1,3}\s*$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.enemyLv()
      })
      // TODO Test online
      ctx.command('genshin.miao.panel.resetrank', { authority: 4 }).userFields(['id'])
        .alias('#重置排行')
      .shortcut(/^#(重置|重设)(.*)(排名|排行)$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.resetRank()
      })
      // TODO Test online
      ctx.command('genshin.miao.panel.refreshrank', { authority: 4 }).userFields(['id'])
        .alias('#刷新全部排行')
      .shortcut(/^#(刷新|更新|重新加载)(群内|群|全部)(.*)(排名|排行)$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.refreshRank()
      })
      ctx.guild().command('genshin.miao.panel.rank', { authority: 1 }).userFields(['id'])
      .shortcut(/^#(群|群内)?.+(排名|排行)(榜)?$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.rankList()
      })
      ctx.guild().command('genshin.miao.panel.top', { authority: 1 }).userFields(['id'])
      .shortcut(/^#(群|群内)?(排名|排行)?(最强|最高|最高分|最牛|第一|极限)+.+/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.groupProfile()
      })
      ctx.command('genshin.miao.panel.upload', { authority: 4 }).userFields(['id'])
      .shortcut(/^#?\s*(?:上传|添加)(.+)(?:面板图)\s*$/)
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.uploadImg()
      })

      ctx.guild().command('genshin.miao.roleList [uid:string]', {authority: 1}).userFields(['id'])
      .alias('#角色查询')
      .shortcut(/^(#(角色|查询|查询角色|角色查询|人物)[ |0-9]*$)|(^(#*uid|#*UID)\+*[1|2|5-9][0-9]{8}$)|(^#[\+|＋]*[1|2|5-9][0-9]{8})/)
      .shortcut( /^#喵喵(角色|查询)[ |0-9]*$/)
      .action(async ({session}, uid) => {
        let application = new app.profile(ctx, session, config)
        application.avatarList()
      })
    ctx.guild().command('genshin.miao.panel.artisList', { authority: 1 }).userFields(['id'])
      .alias("#圣遗物列表")
      .action(async ({session}) => {
        let application = new app.profile(ctx, session, config)
        application.artisList()
      })
    ctx.guild().command('genshin.miao.panel.profileDel', { authority: 1 }).userFields(['id'])
      .alias("#删除面板")
      .shortcut(/^#(删除面板|删除面板数据)\s*(\d{9})?$/)
      .action(async ({session}) => {
        console.log("--------------")
        let application = new app.profile(ctx, session, config)
        application.profileDel()
      })
  }

}

module.exports = profileApp
