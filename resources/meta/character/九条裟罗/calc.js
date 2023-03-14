exports.details = [{
  title: 'E提升攻击力',
  dmg: ({ talent, attr }) => {
    return {
      avg: talent.e['攻击力加成比例'] * attr.atk.base / 100
    }
  }
}, {
  title: 'E后Q首段伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['天狗咒雷·金刚坏 伤害'], 'q')
}, {
  title: 'E后Q每段',
  dmg: ({ talent }, dmg) => dmg(talent.q['天狗咒雷·雷砾 伤害'], 'q')
}]

exports.defDmgIdx = 1
exports.mainAttr = 'atk,cpct,cdmg'

exports.buffs = [{
  title: '九条E技能：提升攻击力[atkPlus]',
  data: {
    atkPlus: ({ attr, talent }) => talent.e['攻击力加成比例'] * attr.atk.base / 100
  }
}, {
  title: '九条6命：提升60%雷元素爆伤',
  cons: 6,
  data: {
    cdmg: 60
  }
}]
