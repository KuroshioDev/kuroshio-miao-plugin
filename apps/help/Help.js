const common = require("../../../lib/common/common")
const Common = require( '../../components/Common.js')
const Cfg = require( '../../components/Cfg.js')
const Version = require( '../../components/Version.js')
const Data = require( '../../components/Data.js')
const fs = require( 'fs')
const lodash = require( 'lodash')
const HelpTheme = require( './HelpTheme.js')

const _path = common.getPluginsPath()
const helpPath = `${_path}/plugins/miao-plugin/resources/help`

const Help = {
  async render (e) {
    let isOffice  = this.e.session.guildId == '9627516829995618702'
    let custom = {}
    let help = {}
    if (fs.existsSync(`${helpPath}/help-cfg.js`)) {
      console.log('miao-plugin: 检测到存在help-cfg.js配置\n建议将help-cfg.js移为config/help.js或重新复制config/help_default.js进行配置~')
      help = await import(`file://${helpPath}/help-cfg.js?version=${new Date().getTime()}`)
    } else if (fs.existsSync(`${helpPath}/help-list.js`)) {
      console.log('miao-plugin: 检测到存在help-list.js配置，建议将help-list.js移为config/help.js或重新复制config/help_default.js进行配置~')
      help = await import(`file://${helpPath}/help-list.js?version=${new Date().getTime()}`)
    }

    let { diyCfg, sysCfg } = await Data.importCfg('help')

    // 兼容一下旧字段
    if (lodash.isArray(help.helpCfg)) {
      custom = {
        helpList: help.helpCfg,
        helpCfg: {}
      }
    } else {
      custom = help
    }

    let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg)
    let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList
    let permisson = diyCfg.permisson || custom.permisson || sysCfg.permisson || []

    let helpGroup = []

    lodash.forEach(helpList, (group) => {
      if (group.auth && group.auth === 'master' && !e.isMaster) {
        return true
      }

      lodash.forEach(group.list, (help) => {
        let icon = help.icon * 1
        if(help.office && !isOffice) {
          help.isblock = true
          help.desc = help.officeDesc
        }
        if (!icon) {
          help.css = 'display:none'
        } else {
          let x = (icon - 1) % 10
          let y = (icon - x - 1) / 10
          help.css = `background-position:-${x * 50}px -${y * 50}px`
        }
      })

      helpGroup.push(group)
    })
    let channelId = this.e.session.channelId
    if (permisson[channelId]) {
      helpGroup = helpGroup.filter(gp => {
        return permisson[channelId].includes(gp.group)
      } )
    }else {
      helpGroup = helpGroup.filter(gp => {
        return permisson['default'].includes(gp.group)
      } )
    }
    let themeData = await HelpTheme.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {})
    return await Common.render('help/index', {
      helpCfg: helpConfig,
      helpGroup,
      ...themeData,
      element: 'default'
    }, { e, scale: 1.2 })
  },

  async version (e) {
    return await Common.render('help/version-info', {
      currentVersion: Version.version,
      changelogs: Version.changelogs,
      elem: 'cryo'
    }, { e, scale: 1.2 })
  }
}
module.exports = Help
