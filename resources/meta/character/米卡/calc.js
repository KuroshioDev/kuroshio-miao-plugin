exports.details = [{
  title: '霜流矢伤害伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['霜流矢伤害'], 'e')
},{
  title: '冰星信标伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['冰星信标伤害'], 'e')
},{
  title: '冰星信标融化',
  dmg: ({ talent }, dmg) => dmg(talent.e['冰星信标伤害'], 'e', 'vaporize')
},{
  title: '单个冰星破片伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['冰星破片伤害'], 'e')
},{
  title: '苍翎的颂愿释放治疗',
  dmg: ({ talent, attr, calc }, { heal }) =>
    heal(talent.q['施放治疗量2'][0] * calc(attr.hp) / 100 + talent.q['施放治疗量2'][1] * 1)
}, {
  title: '鹰翎回复量',
  dmgKey: 'qHeal',
  dmg: ({ talent, attr, calc }, { heal }) =>
    heal(talent.q['鹰翎治疗量2'][0] * calc(attr.hp) / 100  + talent.q['鹰翎治疗量2'][1] * 1)
}]

exports.defDmgIdx = 5
exports.defDmgKey = 'qHeal'
exports.mainAttr = 'atk,hp,cpct,cdmg,mastery'

exports.buffs = ['vaporize']
