const character = require( './character.js')
const profile = require( './profile.js')
const stat = require( './stat.js')
const wiki = require( './wiki.js')
const poke = require( './poke.js')
const help = require( './help.js')
const admin = require( './admin.js')
const gacha = require( './gacha.js')

let apps = { character, poke, profile, stat, wiki, gacha, admin, help }
let rule = {} // v2
let rules = {} // v3
for (let key in apps) {
  rules[`${key}`] = apps[key].v3App()
}

exports.rule = rule
exports.apps = rules
