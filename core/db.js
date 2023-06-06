module.exports =  function initDB(ctx){
  ctx.model.extend('genshin_panel', {
    // 各字段类型
    uid: 'string',
    data: 'json',
    update_time: "timestamp"
  }, {
    // 使用自增的主键值
    autoInc: false,
    primary: "uid"
  })

  ctx.model.extend('starrail_panel', {
    // 各字段类型
    uid: 'string',
    data: 'json',
    update_time: "timestamp"
  }, {
    // 使用自增的主键值
    autoInc: false,
    primary: "uid"
  })
}
