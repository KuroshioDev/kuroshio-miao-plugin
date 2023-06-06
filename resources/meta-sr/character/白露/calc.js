exports.details = [{
  title: '普攻伤害',
  dmg: ({ talent }, dmg) => dmg(talent.a['技能伤害'], 'a')
}, {
  title: '战技主目标生命恢复',
  dmg: ({ calc, attr, talent }, { heal }) => heal(calc(attr.hp) * talent.e['百分比生命'] + talent.e['固定值'])
}, {
  title: '终结技生命恢复',
  dmg: ({ calc, attr, talent }, { heal }) => heal(calc(attr.hp) * talent.q['百分比生命'] + talent.q['固定值'])
}, {
  title: '天赋生息恢复',
  dmg: ({ calc, attr, talent }, { heal }) => heal(calc(attr.hp) * talent.t['生息·百分比生命'] + talent.t['生息·固定值'])
}]

exports.mainAttr = 'atk,cpct,cdmg,hp'

exports.buffs = [{
  title: '白露2命：释放终结技后治疗提高15%',
  cons: 2,
  data: {
    heal: 15
  }
}, {
  title: '希儿2命：释放战技后，2层Buff速度提高50%',
  cons: 2,
  data: {
    speedPct: 50
  }
}, {
  title: '行迹-夜行：抗性穿透提高20',
  tree: 2,
  data: {
    kx: 20
  }
}]
