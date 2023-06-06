/*
* 圣遗物套装
* */
const Base = require( './Base.js')
const { meta, artiMap, artiSetMap } = require( '../resources/meta/artifact/index.js')
const artisBuffs = require( '../resources/meta/artifact/index.js').calc
const Artifact = require( './Artifact.js')
const srMeta = require('../resources/meta-sr/artifact/index.js')
const artiMapSR = srMeta.artiMap
const artisBuffsSR = srMeta.artisBuffs
const artiSetMapSR = srMeta.artiSetMap
const lodash = require( 'lodash')

class ArtifactSet extends Base {
  constructor (name, game = 'gs') {
    super()
    let cache = this._getCache(`arti-set:${game}:${name}`)
    if (cache) {
      return cache
    }
    let data = (game === 'gs' ? artiSetMap : artiSetMapSR)[name]
    if (!data) {
      if (artiSetMapSR[name]) {
        data = artiSetMapSR[name]
        game = 'sr'
      } else {
        return false
      }
    }
    this.game = game
    this.meta = data
    return this._cache()
  }

  get img () {
    let arti = Artifact.get(this.sets[1])
    return arti ? arti.img : ''
  }

  get abbr () {
    return meta.abbr[this.name] || this.name
  }

  static getByArti (name) {
    if (artiMap[name]) {
      return ArtifactSet.get(artiMap[name].set)
    }
    if (artiMapSR[name]) {
      return ArtifactSet.get(artiMap[name].set, 'sr')
    }
    return false
  }

  static get (name) {
    if (artiSetMap[name]) {
      return new ArtifactSet(name, 'gs')
    }
    if (artiSetMapSR[name]) {
      return new ArtifactSet(name, 'sr')
    }
    return false
  }

  static getArtiNameBySet (set, idx = 1) {
    let artiSet = ArtifactSet.get(set)
    if (artiSet) {
      return artiSet.getArtiName(idx)
    }
    return ''
  }

  static getArtisSetBuff (name, num, game = 'gs') {
    let artiBuffsMap = game === 'sr' ? artisBuffsSR : artisBuffs
    let ret = (artiBuffsMap[name] && artiBuffsMap[name][num]) || artiBuffsMap[name + num]
    if (!ret) return false
    if (lodash.isPlainObject(ret)) return [ret]
    return ret
  }

  getArtiName (idx = 1) {
    return this.sets[idx]
  }

  getArti (idx = 1) {
    return Artifact.get(this.getArtiName(idx))
  }
}

module.exports = ArtifactSet
