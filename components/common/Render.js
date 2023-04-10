const Version = require( '../Version.js')
const Cfg = require( '../Cfg.js')
const common = require("../../../lib/common/common.js");

const render = {
  async render (path, params, cfg) {
    let { e } = cfg
    return e.runtime.render('miao-plugin', path, params, {
      retType: cfg.retMsgId ? 'msgId' : 'default',
      beforeRender ({ data }) {
        let pct = 1
        if (e.config.renderScale) {
          let scale = Math.min(2, Math.max(0.5, e.config.renderScale / 100))
          pct = pct * scale
        }
        let resPath = data.pluResPath
        const layoutPath = common.getPluginsPath() + '/miao-plugin/resources/common/layout/'
        return {
          ...data,
          _res_path: resPath,
          _miao_path: resPath,
          _layout_path: layoutPath,
          _tpl_path: common.getPluginsPath() + '/miao-plugin/resources/common/tpl/',
          defaultLayout: layoutPath + 'default.html',
          elemLayout: layoutPath + 'elem.html',
          sys: {
            scale: Cfg.scale(cfg.scale || 1),
          },
          copyright: `<span class="version">Created By Koishi & Miao-Plugin<span class="version">${Version.version}</span>`,
          pageGotoParams: {
            waitUntil: 'networkidle2'
          }
        }
      }
    })
  }
}

module.exports = render

