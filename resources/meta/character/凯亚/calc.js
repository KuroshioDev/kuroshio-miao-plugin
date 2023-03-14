exports.details = [{
  title: '霜袭E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'Q单段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}]

exports.mainAttr = 'atk,cpct,cdmg'

exports.buffs = []
