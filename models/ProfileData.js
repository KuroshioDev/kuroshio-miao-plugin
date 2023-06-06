const lodash = require( 'lodash')
const AvatarData = require( './AvatarData.js')
const Data = require( '../components/Data.js')
const ProfileArtis = require( './ProfileArtis.js')
const ProfileDmg = require( './ProfileDmg.js')
const AttrCalc = require( './profile/AttrCalc.js')
const Cfg =require('../components/Cfg')
const CharImg = require( './character/CharImg.js')

class ProfileData extends AvatarData {
  constructor (ds = {}, game = 'gs', calc = true) {
    super(ds, game)
    if (calc) {
      this.calcAttr()
    }
  }

  // 判断当前profileData是否具有有效数据
  get hasData () {
    return this.isProfile
  }

  get imgs () {
    return this.char.getImgs(this.costume) || {}
  }

  get costumeSplash () {
    let costume = this._costume
    costume = this.char.checkCostume(costume) ? '2' : ''
    if (!Cfg.get('costumeSplash', true)) {
      return this.char.getImgs(this._costume).splash
    }
    let nPath = `meta/character/${this.name}`
    let isSuper = false
    let talent = this.talent ? lodash.map(this.talent, (ds) => ds.original).join('') : ''
    if (this.cons === 6 || ['ACE', 'ACE²'].includes(this.artis?.markClass) || talent === '101010') {
      isSuper = true
    }
    if (isSuper) {
      let imgPath = [`profile/super-character/${this.name}`, `profile/normal-character/${this.name}`,`profile/normal-character/${this.elem}/${this.name}`]
      if (this.e && this.e.session && ['telegram','discord'].indexOf(this.e.session.platform)!= -1) {
        imgPath.push(`profile/super-character/se-${this.elem}/${this.name}`)
      }
      return CharImg.getRandomImg(imgPath,
        [`${nPath}/imgs/splash0.webp`, `${nPath}/imgs/splash${costume}.webp`, `/${nPath}/imgs/splash.webp`]
      )
    } else {
      let imgPath = [`profile/normal-character/${this.name}`,`profile/normal-character/${this.elem}/${this.name}`]
      return CharImg.getRandomImg(imgPath, [`${nPath}/imgs/splash${costume}.webp`, `/${nPath}/imgs/splash.webp`]
      )
    }
  }

  get hasDmg () {
    return this.hasData && !!ProfileDmg.dmgRulePath(this.name, this.game)
  }

  static create (ds, e, game = 'gs') {
    let profile = new ProfileData(ds, game)
    if (!profile) {
      return false
    }
    profile.e = e
    return profile
  }

  initArtis () {
    this.artis = new ProfileArtis(this.id, this.elem, this.game)
  }

  setAttr (ds) {
    this.attr = lodash.extend(Data.getData(ds, 'atk,atkBase,def,defBase,hp,hpBase,mastery,recharge'), {
      heal: ds.heal || ds.hInc || 0,
      cpct: ds.cpct || ds.cRate,
      cdmg: ds.cdmg || ds.cDmg,
      dmg: ds.dmg || ds.dmgBonus || 0,
      phy: ds.phy || ds.phyBonus || 0
    })
  }

  calcAttr () {
    this._attr = AttrCalc.create(this)
    this.attr = this._attr.calc()
    this.base = this._attr.getBase()
  }

  setArtis (ds = false) {
    this.artis?.setProfile(this, ds.artis?.artis || ds.artis || ds)
  }

  // 获取当前profileData的圣遗物评分，withDetail=false仅返回简略信息
  getArtisMark (withDetail = true) {
    if (this.hasData) {
      return this.artis.getMarkDetail(withDetail)
    }
    return {}
  }

  // 计算当前profileData的伤害信息
  async calcDmg ({ enemyLv = 91, mode = 'profile', dmgIdx = 0 }) {
    if (!this.dmg) {
      let ds = this.getData('id,level,attr,cons,artis:artis.sets,trees')
      ds.talent = lodash.mapValues(this.talent, 'level')
      ds.weapon = Data.getData(this.weapon, 'name,affix')
      this.dmg = new ProfileDmg(ds, this.game)
    }
    return await this.dmg.calcData({ enemyLv, mode, dmgIdx })
  }
}

module.exports = ProfileData
