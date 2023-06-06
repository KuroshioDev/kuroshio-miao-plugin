const {Weapon} = require('../../models/Weapon')
const {ProfileData} = require('../../models/ProfileData')

const ProfileWeapon = {
  async calc (profile, game = 'gs') {
    let ret = []
    await Weapon.forEach(async (w) => {
      let weaponRet = w.getData('name,star,abbr,icon')
      weaponRet.dmgs = []
      for (let affix of [1, 5]) {
        if (affix === 5 && w.maxAffix !== 5) {
          continue
        }
        let tempProfile = new ProfileData({
          ...profile.getData('uid,id,level,cons,fetter,elem,promote,talent,artis'),
          dataSource: 'change'
        }, game, false)

        tempProfile.setWeapon({
          name: w.name,
          star: w.star,
          level: w.maxLv,
          promote: w.maxPromote,
          affix
        })
        tempProfile.calcAttr()
        weaponRet.dmgs.push({
          affix,
          ...await tempProfile.calcDmg({ mode: 'single' })
        })
      }
      ret.push(weaponRet)
    }, profile?.weapon?.type)
    return ret
  }

}

module.ProfileWeapon = ProfileWeapon
