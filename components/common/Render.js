const Version = require( '../Version.js')
const { common } = require("../../../lib/common/common.js");

async function render(path, params, cfg) {
  let { e } = cfg
  if (!e.runtime) {
    console.log('未找到e.runtime，请升级至最新版Yunzai')
  }
  let BotName = Version.isMiao ? 'Miao-Yunzai' : 'Yunzai-Bot'
  return e.runtime.render('miao-plugin', path, params, {
    retType: cfg.retMsgId ? 'msgId' : 'default',
    beforeRender ({ data }) {
      let pct = 1
      if (e.config.renderScale) {
        let scale = Math.min(2, Math.max(0.5, e.config.renderScale / 100))
        pct = pct * scale
      }
      let resPath = data.pluResPath

      const layoutPath = `${common.getPluginsPath()}/miao-plugin/resources/common/layout/`
      return {
        ...data,
        _res_path: resPath,
        _layout_path: layoutPath,
        _tpl_path: `${common.getPluginsPath()}/miao-plugin/resources/common/tpl/`,
        defaultLayout: layoutPath + 'default.html',
        elemLayout: layoutPath + 'elem.html',
        sys: {
          scale: `style=transform:scale(${pct})`,
          copyright: `<span class="version">Created By Koishi & Miao-Plugin<span class="version">${Version.version}</span>`
        },
        pageGotoParams: {
          waitUntil: 'networkidle2'
        }
      }
    }
  })
}

module.exports = render
