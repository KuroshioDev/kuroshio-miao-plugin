exports.details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: '反击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['反击伤害'], 'e')
}, {
  title: '反击伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['伤害倍率提高'] + talent.t['反击伤害'], 't')
}]

exports.mainAttr = 'atk,cpct,cdmg,speed'

exports.buffs = [{
  title: '克拉拉2命：施放终结技后攻击力提高30%',
  cons: 2,
  data: {
    atkPct: 30
  }
}, {
  title: '行迹-复仇：史瓦罗的反击造成的伤害提高30%',
  tree: 3,
  data: {
    tDmg: 30
  }
}]
