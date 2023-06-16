const Cfg = require( './Cfg.js')
const Render = require( './common/Render.js')
const Version = require( './Version.js')
const lodash  = require( 'lodash')


const Common = {
  render: Render.render,
  cfg: Cfg.get,
  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },

  async downFile () {
    console.log('down file')
  }
}

module.exports = Common
