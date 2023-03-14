exports.details = [{
  title: 'E短按伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['点按伤害'], 'e')
}, {
  title: '3层引雷长按E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['三层引雷长按伤害'], 'e')
}, {
  title: 'Q每段伤害',
  params: { q: true },
  dmg: ({ talent }, dmg) => dmg(talent.q['放电伤害'], 'q')
}]

exports.defDmgIdx = 1
exports.mainAttr = 'atk,cpct,cdmg'

exports.buffs = [{
  title: '丽莎被动：敌人受到蔷薇的雷光攻击后，降低15%防御力',
  data: {
    enemyDef: ({ params }) => params.q ? 15 : 0
  }
}]
