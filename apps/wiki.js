const App = require( '../components/App.js')
const Calendar = require( './wiki/Calendar.js')
const CharWiki = require( './wiki/CharWiki.js')

let app = App.init({
  id: 'wiki',
  name: '角色资料'
})
app.reg({
  wiki: {
    rule: '^#喵喵WIKI$',
    check: CharWiki.check,
    fn: CharWiki.wiki,
    desc: '【#资料】 #神里天赋 #夜兰命座'
  },
  calendar: {
    rule: /^(#|喵喵)+(日历|日历列表)$/,
    fn: Calendar.render,
    desc: '【#日历】 活动日历'
  }
})

module.exports = app
