// eslint-disable-next-line no-unused-vars
const Data = require( '../components/Data.js')
const { ProfileDmg } = require( '../models/index.js')

async function calcDmg (inputData, enemyLv = 86) {
  let dmg = new ProfileDmg(inputData)
  let ret = await dmg.calcData({ enemyLv })
  if (ret === false) {
    return {}
  } else {
    ret = Data.getData(ret, 'ret,msg,enemyName')
    ret.enemyLevel = enemyLv
  }
  return ret
}

module.exports = calcDmg
