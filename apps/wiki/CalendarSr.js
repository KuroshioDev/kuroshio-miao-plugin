const fetch = require( 'node-fetch')
const moment = require( 'moment')
const lodash = require( 'lodash')
const Common = require( '../../components/Common.js')
const Data = require( '../../components/Data.js')
const Character = require( '../../models/Character.js')
const Calendar = require('./Calendar.js')

const ignoreIds = [
  257, // 保密测试参与意愿调研
  194, // 有奖问卷
  203, // 《崩坏：星穹铁道》社媒聚合页上线
  183, // 官方社群一览
  187, // 《崩坏：星穹铁道》防沉迷系统公告
  185, // 《崩坏：星穹铁道》公平运营声明
  171 // 《崩坏：星穹铁道》社区专属工具一览
]

const ignoreReg = /(更新概览|游戏优化|内容专题页|版本更新说明|循星归程|调研|防沉迷|米游社|专项意见|更新修复与优化|问卷调查|版本更新通知|更新时间说明|预下载功能|周边限时|周边上新|角色演示|角色PV|bilibili)/

let CalSr = {
  async reqCalData () {
    let listApi = 'https://hkrpg-api.mihoyo.com/common/hkrpg_cn/announcement/api/getAnnList?game=hkrpg&game_biz=hkrpg_cn&lang=zh-cn&auth_appid=announcement&authkey_ver=1&bundle_id=hkrpg_cn&channel_id=1&level=65&platform=pc&region=prod_gf_cn&sdk_presentation_style=fullscreen&sdk_screen_transparent=true&sign_type=2&uid=100000000'

    let request = await fetch(listApi)
    let listData = await request.json()

    let timeMap
    let timeMapCache = await redis.get('miao:calendarSr:detail')
    if (timeMapCache) {
      timeMap = JSON.parse(timeMapCache) || {}
    } else {
      let detailApi = 'https://hkrpg-api-static.mihoyo.com/common/hkrpg_cn/announcement/api/getAnnContent?game=hkrpg&game_biz=hkrpg_cn&lang=zh-cn&bundle_id=hkrpg_cn&platform=pc&region=prod_gf_cn&level=65&channel_id=1'
      let request2 = await fetch(detailApi)
      let detailData = await request2.json()
      timeMap = {}
      if (detailData && detailData.data && detailData.data.list) {
        let versionTime = {
          1.1: '2022-06-07 11:00:00'
        }
        lodash.forEach(detailData.data.list, (ds) => {
          let vRet = /(\d\.\d)版本\S*更新概览/.exec(ds.title)
          if (vRet && vRet[1]) {
            let content = /■(?:更新时间)\s*([^■]+)(?:■|$)/.exec(ds.content)
            if (content && content[1]) {
              let tRet = /([0-9\\/\\: ]){9,}/.exec(content[1])
              if (tRet && tRet[0]) {
                versionTime[vRet[1]] = versionTime[vRet[1]] || tRet[0].replace('06:00', '11:00')
              }
            }
          }
        })
        let ret = function (ds) {
          let { ann_id: annId, content, title } = ds
          if (ignoreReg.test(title)) {
            return true
          }
          content = content.replaceAll('\u003ch1 style=\"\"\u003e', '※')
          content = content.replaceAll('\u003c/h1\u003e', '※')
          content = content.replace(/(<|&lt;)[\w "%:;=\-\\/\\(\\),\\.]+(>|&gt;)/g, '')
          content = /(?:活动时间|活动跃迁|开放时间|开启时间|折扣时间|上架时间)\s*※([^※]+)(※|$)/.exec(content)
          if (!content || !content[1]) {
            return true
          }
          content = content[1]
          let annTime = []

          // 第一种简单格式
          let timeRet = /(?:活动时间)?(?:※|\s)*([0-9\\/\\: -]{6,})/.exec(content)
          if (/\d\.\d版本更新后/.test(content)) {
            let vRet = /(\d\.\d)版本更新后/.exec(content)
            let vTime = ''
            if (vRet && vRet[1] && versionTime[vRet[1]]) {
              vTime = versionTime[vRet[1]]
            }
            if (!vTime) {
              return true
            }
            if (/永久开放/.test(content)) {
              annTime = [vTime, '2099/01/01 00:00:00']
            } else {
              timeRet = /([0-9\\/\\: ]){9,}/.exec(content)
              if (timeRet && timeRet[0]) {
                annTime = [vTime, timeRet[0]]
              }
            }
          } else if (timeRet && timeRet[1]) {
            annTime = timeRet[1].split('-')
          }

          if (annTime.length === 2) {
            timeMap[annId] = {
              start: annTime[0].trim().replace(/\//g, '-'),
              end: annTime[1].trim().replace(/\//g, '-')
            }
          }
        }
        lodash.forEach(detailData.data.list, (ds) => ret(ds))
        lodash.forEach(detailData.data.pic_list, (ds) => ret(ds))
      }
      await Data.setCacheJSON('miao:calendarSr:detail', timeMap, 60 * 10)
    }
    return { listData, timeMap }
  },

  // 深渊日历信息
  getAbyssCal (s1, e1, versionStartTime) {
    let check = []
    let f = 'YYYY-MM-DD HH:mm:ss'

    let abyss1Start = moment(versionStartTime, 'YYYY-MM-DD HH:mm:ss').add(5, 'days').subtract(3, 'hours').format(f)
    let abyss1End = moment(abyss1Start).add(14, 'days').format(f)
    let abyss2Start = abyss1End
    let abyss2End = moment(abyss2Start).add(14, 'days').format(f)
    let abyss3Start = abyss2End
    let abyss3End = moment(abyss3Start).add(14, 'days').format(f)
    let abyss4Start = abyss3End
    let abyss4End = moment(abyss4Start).add(14, 'days').format(f)
    let abyss0End = abyss1Start
    let abyss0Start = moment(abyss0End).subtract(14, 'days').format(f)

    check.push([moment(abyss0Start), moment(abyss0End)])
    check.push([moment(abyss1Start), moment(abyss1End)])
    check.push([moment(abyss2Start), moment(abyss2End)])
    check.push([moment(abyss3Start), moment(abyss3End)])
    check.push([moment(abyss4Start), moment(abyss4End)])

    let ret = []
    lodash.forEach(check, (ds) => {
      let [s2, e2] = ds
      if ((s2 <= s1 && s1 <= e2) || (s2 <= e1 && e1 <= e2)) {
        ret.push(ds)
      }
    })
    return ret
  },

  getList (ds, target, { startTime, endTime, totalRange, now, timeMap = {} }) {
    let type = 'activity'
    let id = ds.ann_id
    let title = ds.title
    let subTitle = ds.subtitle
    let banner = ds.banner
    let extra = { sort: 5 }
    let detail = timeMap[id] || {}

    if (ignoreIds.includes(id) || ignoreReg.test(title)) {
      return true
    }

    if (/流光定影/.test(title)) {
      type = 'weapon'
      title = title.replace(/(限定5星光锥)/g, '')
      extra.sort = 2
    } else if (/跃迁/.test(subTitle)) {
      type = 'character'
      let regRet = /角色「(.*)(（|\()/.exec(title)
      if (regRet[1]) {
        let char = Character.get(regRet[1])
        extra.banner2 = char.getImgs()?.card
        extra.face = char.face
        extra.character = regRet[1]
        extra.elem = char.elem
        extra.sort = 1
      }
    } else if (/无名勋礼/.test(title)) {
      type = 'pass'
    }

    let getDate = (d1, d2) => moment(d1 && d1.length > 6 ? d1 : d2)
    let sDate = getDate(detail.start, ds.start_time)
    let eDate = getDate(detail.end, ds.end_time)
    let sTime = moment.max(sDate, startTime)
    let eTime = moment.min(eDate, endTime)

    let sRange = sTime - startTime
    let eRange = eTime - startTime

    let left = sRange / totalRange * 100
    let width = eRange / totalRange * 100 - left

    let label = ''
    if (eDate - sDate > 365 * 24 * 3600 * 1000) {
      if (sDate < now) {
        label = sDate.format('MM-DD HH:mm') + ' 后永久有效'
      } else {
        label = '永久有效'
      }
    } else if (now > sDate && eDate > now) {
      label = eDate.format('MM-DD HH:mm') + ' (' + moment.duration(eDate - now).humanize() + '后结束)'
      if (width > 38) {
        label = sDate.format('MM-DD HH:mm') + ' ~ ' + label
      }
    } else if (sDate > now) {
      label = sDate.format('MM-DD HH:mm') + ' (' + moment.duration(sDate - now).humanize() + '后开始)'
    } else {
      label = sDate.format('MM-DD HH:mm') + ' ~ ' + eDate.format('MM-DD HH:mm')
    }
    if (sDate <= endTime && eDate >= startTime) {
      target.push({
        ...extra,
        id,
        title,
        type,
        mergeStatus: ['activity'].includes(type) ? 1 : 0,
        banner,
        icon: ds.tag_icon,
        left,
        width,
        label,
        duration: eTime - sTime,
        start: sDate.format('MM-DD HH:mm'),
        end: eDate.format('MM-DD HH:mm')
      })
    }
  },

  async get () {
    moment.locale('zh-cn')
    let now = moment()

    let { listData, timeMap } = await CalSr.reqCalData()
    let dateList = Calendar.getDateList()

    let resultList = []
    let abyss = []

    lodash.forEach(listData.data.list[0].list, (ds) => CalSr.getList(ds, resultList, { ...dateList, now, timeMap }))
    lodash.forEach(listData.data.pic_list[0].type_list[0].list, (ds) => CalSr.getList(ds, resultList, { ...dateList, now, timeMap }))

    let versionStartTime
    lodash.forEach(listData.data.list[0].list, (ds) => {
      if (/版本更新概览/.test(ds.title)) {
        versionStartTime = ds.start_time
      }
    })

    let abyssCal = CalSr.getAbyssCal(dateList.startTime, dateList.endTime, versionStartTime)
    lodash.forEach(abyssCal, (t) => {
      CalSr.getList({
        title: '「混沌回忆」',
        start_time: t[0].format('YYYY-MM-DD HH:mm'),
        end_time: t[1].format('YYYY-MM-DD HH:mm')
      }, abyss, { ...dateList, now })
    })

    resultList = lodash.sortBy(resultList, ['sort', 'start', 'duration'])

    let charCount = 0
    let charOld = 0
    let weaponCount = 0
    let ret = []
    lodash.forEach(resultList, (li) => {
      if (li.type === 'character') {
        charCount++
        li.left === 0 && charOld++
        li.idx = charCount
      }
      if (li.type === 'weapon') {
        weaponCount++
        li.idx = weaponCount
      }
      if (li.mergeStatus === 1) {
        lodash.forEach(resultList, (li2) => {
          if (li2.mergeStatus === 1 && li.left + li.width <= li2.left) {
            li.mergeStatus = 2
            li2.mergeStatus = 2
            ret.push([li, li2])
            return false
          }
        })
      }
      if (li.mergeStatus !== 2) {
        li.mergeStatus = 2
        ret.push([li])
      }
    })

    return {
      game: 'sr',
      ...dateList,
      list: ret,
      abyss,
      charMode: `char-${charCount}-${charOld}`,
      nowTime: now.format('YYYY-MM-DD HH:mm'),
      nowDate: now.date()
    }
  },

  async render (e) {
    let calData = await CalSr.get()
    let mode = 'calendar'
    if (/(日历列表|活动)$/.test(e.msg)) {
      mode = 'list'
    }

    return await Common.render('wiki/calendar', {
      ...calData,
      displayMode: mode
    }, { e, scale: 1.1 })
  }
}

exports = CalSr
