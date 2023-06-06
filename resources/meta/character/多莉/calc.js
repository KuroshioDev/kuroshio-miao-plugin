exports.details = [{
  title: '断除烦恼炮总伤害',
  dmg: ({ talent, cons }, dmg) => dmg(talent.e['断除烦恼炮伤害'] + talent.e['售后服务弹伤害'] * (cons >= 1 ? 3 : 2), 'e')
}, {
  title: 'Q每跳恢复生命',
  dmg: ({ talent, calc, attr }, {
    heal
  }) => heal(talent.q['持续治疗量2'][0] * calc(attr.hp) / 100 + talent.q['持续治疗量2'][1] * 1)
}]

exports.defDmgIdx = 1
exports.mainAttr = 'atk,hp,cpct,cdmg'

exports.buffs = [{
  title: '多莉1命：断除烦恼炮命中后增加一枚炮弹',
  cons: 1
}, {
  title: '多莉4命：角色生命值低于50%时，获得50%治疗加成',
  cons: 4,
  data: {
    healInc: 50
  }
}]
