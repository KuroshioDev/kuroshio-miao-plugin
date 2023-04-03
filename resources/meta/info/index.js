const pool = require('./pool')

// 宝箱数统计
const chestInfo = {
  common: {
    title: '普通宝箱',
    max: 2547
  },
  exquisite: {
    title: '精致宝箱',
    max: 1596
  },
  precious: {
    title: '珍贵宝箱',
    max: 489
  },
  luxurious: {
    title: '豪华宝箱',
    max: 185
  },
  magic: {
    title: '奇馈宝箱',
    max: 146
  }
}

exports.poolName = pool.poolName
exports.poolDetail = pool.poolDetail
exports.chestInfo = chestInfo
