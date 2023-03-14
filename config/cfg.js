/** ************ 【Yunzai功能（开启使用喵喵版功能）】 ************* */
// #角色 #UID
exports.avatarList = false

// #刻晴 #老婆
exports.avatarCard = true

// #深渊
exports.uploadAbyssData = false

// #练度统计
exports.profileStat = false

// #帮助 #菜单
exports.help = false

// 戳一戳展示角色卡片
exports.avatarPoke = true

/** ************ 【角色面板相关设置】 ************* */
// 面板查询
exports.avatarProfile = true

// 面板替换
exports.profileChange = true

// 群内的面板伤害及圣遗物排名与查看功能，默认关闭。请根据群友心理素质自行决定是否开启
exports.groupRank = false

// 参与排名的限制条件：1:无限制 2:有CK 3:有16个角色或有CK 4:有御三家(安柏&凯亚&丽莎)或有CK 5:有16个角色+御三家或有CK。 若改变设置请根据情况决定是否需要【#重置排名】
exports.groupRankLimit = 1

// 可选值5~30，建议15。设置高排名人数会提高图片的长度，图片较大可能会影响渲染与发送速度
exports.rankNumber = 15

// 面板服务优先选择：1：自动（具备有效Token时优先喵喵Api，否则Enka），2：Enka服务优先
exports.profileServ = 1

// 伤害计算包含组队Buff。目前为测试阶段，数据可能不准确，请慎重开启。数据为固定Buff而非真实面板数据，最终计算数值可能有偏差。开启后请重启喵喵
exports.teamCalc = false

// 可选值4~100，建议28，最终圣遗物数量取决于面板内圣遗物数量。设置高圣遗物数量会提高图片的长度，图片较大可能会影响渲染与发送速度
exports.artisNumber = 28

/** ************ 【角色资料与信息查询】 ************* */
// #刻晴图鉴 的图鉴信息
exports.charWiki = true

// #刻晴天赋/#刻晴命座 的天赋信息
exports.charWikiTalent = true

// 未实装角色数据
exports.notReleasedData = true

// 角色图片
exports.charPic = true

// Q版角色头像
exports.qFace = true

// 启用后会启用角色图及增量包中的小清新图像，勇士啊，你准备好了吗
exports.charPicSe = false

/** ************ 【系统设置】 ************* */
// 可选值50~200，建议100。设置高精度会提高图片的精细度，但因图片较大可能会影响渲染与发送速度
exports.renderScale = 100

// 允许获取原图，0:不允许, 1:仅允许角色图, 2:仅允许面板图, 3:开启
exports.originalPic = 3

// 根据语言习惯设置数字分组，如千位组设为3，万位组设为4
exports.commaGroup = 3