exports.details = [{
  title: '锅巴单口伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['喷火伤害'], 'e')
}, {
  title: '锅巴单口蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.e['喷火伤害'], 'e', 'vaporize')
}, {
  title: '旋火轮单次伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['旋火轮伤害'], 'q')
}, {
  title: '旋火轮单次蒸发',
  dmg: ({ talent }, dmg) => dmg(talent.q['旋火轮伤害'], 'q', 'vaporize')
}]

exports.defDmgIdx = 3
exports.mainAttr = 'atk,cpct,cdmg'

exports.buffs = [{
  cons: 1,
  title: '香菱1命：锅巴降低敌人火抗15',
  data: {
    kx: 15
  }
}, 'vaporize']
