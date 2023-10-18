const pool = require('./pool')

// 宝箱数统计
const chestInfo = {
  common: {
    title: '普通宝箱',
    max: 2819
  },
  exquisite: {
    title: '精致宝箱',
    max: 1967
  },
  precious: {
    title: '珍贵宝箱',
    max: 598
  },
  luxurious: {
    title: '华丽宝箱',
    max: 232
  },
  magic: {
    title: '奇馈宝箱',
    max: 206
  }
}

exports.poolName = pool.poolName
exports.poolDetail = pool.poolDetail
exports.chestInfo = chestInfo
