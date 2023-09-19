const pool = require('./pool')

// 宝箱数统计
const chestInfo = {
  common: {
    title: '普通宝箱',
    max: 2767
  },
  exquisite: {
    title: '精致宝箱',
    max: 1839
  },
  precious: {
    title: '珍贵宝箱',
    max: 566
  },
  luxurious: {
    title: '豪华宝箱',
    max: 218
  },
  magic: {
    title: '奇馈宝箱',
    max: 186
  }
}

exports.poolName = pool.poolName
exports.poolDetail = pool.poolDetail
exports.chestInfo = chestInfo
