exports.details = [{
  title: 'E每跳治疗',
  dmg: ({ talent, attr, calc }, { heal }) =>
    heal(talent.e['持续治疗量2'][0] * calc(attr.atk) / 100 + talent.e['持续治疗量2'][1] * 1)
}, {
  title: '度厄真符每次治疗',
  dmg: ({ talent, attr, calc }, { heal }) => heal(talent.q['治疗量2'][0] * calc(attr.atk) / 100 + talent.q['治疗量2'][1] * 1)
}, {
  title: '重击伤害',
  dmg: ({ talent, attr, calc }, dmg) => dmg(talent.a['重击伤害'], 'a2', 'phy')
}]

exports.mainAttr = 'atk,cpct,cdmg,heal'


exports.buffs = [{
  title: '七七二命：对受冰元素影响的敌人普攻及重击伤害提升15%',
  cons: 2,
  data: {
    a2: 15
  }
}]
