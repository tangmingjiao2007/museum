// 导入所有省份的抗战历史数据
import provinceData1 from './provinceWarHistory.json'
import provinceData2 from './provinceWarHistory2.json'
import provinceData3 from './provinceWarHistory3.json'
import provinceData4 from './provinceWarHistory4.json'

// 合并所有省份数据
export const allProvinceWarHistory = {
  ...provinceData1.provinces,
  ...provinceData2.provinces,
  ...provinceData3.provinces,
  ...provinceData4.provinces
}

// 省份代码映射
export const provinceCodeMap = {
  '110000': 'beijing',
  '120000': 'tianjin',
  '130000': 'hebei',
  '140000': 'shanxi',
  '150000': 'neimenggu',
  '210000': 'liaoning',
  '220000': 'jilin',
  '230000': 'heilongjiang',
  '310000': 'shanghai',
  '320000': 'jiangsu',
  '330000': 'zhejiang',
  '340000': 'anhui',
  '350000': 'fujian',
  '360000': 'jiangxi',
  '370000': 'shandong',
  '410000': 'henan',
  '420000': 'hubei',
  '430000': 'hunan',
  '440000': 'guangdong',
  '450000': 'guangxi',
  '460000': 'hainan',
  '500000': 'chongqing',
  '510000': 'sichuan',
  '520000': 'guizhou',
  '530000': 'yunnan',
  '540000': 'xizang',
  '610000': 'shaanxi',
  '620000': 'gansu',
  '630000': 'qinghai',
  '640000': 'ningxia',
  '650000': 'xinjiang'
}

// 省份名称映射
export const provinceNameMap = {
  'beijing': '北京',
  'tianjin': '天津',
  'hebei': '河北',
  'shanxi': '山西',
  'neimenggu': '内蒙古',
  'liaoning': '辽宁',
  'jilin': '吉林',
  'heilongjiang': '黑龙江',
  'shanghai': '上海',
  'jiangsu': '江苏',
  'zhejiang': '浙江',
  'anhui': '安徽',
  'fujian': '福建',
  'jiangxi': '江西',
  'shandong': '山东',
  'henan': '河南',
  'hubei': '湖北',
  'hunan': '湖南',
  'guangdong': '广东',
  'guangxi': '广西',
  'hainan': '海南',
  'chongqing': '重庆',
  'sichuan': '四川',
  'guizhou': '贵州',
  'yunnan': '云南',
  'xizang': '西藏',
  'shaanxi': '陕西',
  'gansu': '甘肃',
  'qinghai': '青海',
  'ningxia': '宁夏',
  'xinjiang': '新疆'
}

// 根据省份代码获取抗战历史数据
export const getProvinceWarHistory = (provinceCode) => {
  const provinceKey = provinceCodeMap[provinceCode]
  return provinceKey ? allProvinceWarHistory[provinceKey] : null
}

// 根据省份名称获取抗战历史数据
export const getProvinceWarHistoryByName = (provinceName) => {
  const provinceKey = Object.keys(provinceNameMap).find(
    key => provinceNameMap[key] === provinceName
  )
  return provinceKey ? allProvinceWarHistory[provinceKey] : null
}

// 获取所有省份列表
export const getAllProvinces = () => {
  return Object.keys(allProvinceWarHistory).map(key => ({
    key,
    name: allProvinceWarHistory[key].name,
    code: allProvinceWarHistory[key].code,
    status: allProvinceWarHistory[key].status,
    summary: allProvinceWarHistory[key].summary
  }))
}

// 按状态分类省份
export const getProvincesByStatus = () => {
  const categories = {
    occupied: [], // 沦陷区
    battlefield: [], // 战场
    base: [], // 抗日根据地
    rear: [] // 大后方
  }

  Object.keys(allProvinceWarHistory).forEach(key => {
    const province = allProvinceWarHistory[key]
    const status = province.status.toLowerCase()
    
    if (status.includes('沦陷')) {
      categories.occupied.push(province)
    } else if (status.includes('战场') || status.includes('主战场')) {
      categories.battlefield.push(province)
    } else if (status.includes('根据地')) {
      categories.base.push(province)
    } else if (status.includes('后方') || status.includes('首都')) {
      categories.rear.push(province)
    } else {
      // 默认归类到战场
      categories.battlefield.push(province)
    }
  })

  return categories
}

// 获取重要战役统计
export const getBattleStatistics = () => {
  let totalEvents = 0
  let totalCasualties = { civilian: 0, military: 0 }
  const eventTypes = {}

  Object.keys(allProvinceWarHistory).forEach(key => {
    const province = allProvinceWarHistory[key]
    
    // 统计事件数量
    totalEvents += province.majorEvents.length
    
    // 统计伤亡人数（简化处理，提取数字）
    if (province.casualties) {
      const civilianMatch = province.casualties.civilian.match(/(\d+)/g)
      const militaryMatch = province.casualties.military.match(/(\d+)/g)
      
      if (civilianMatch) {
        totalCasualties.civilian += parseInt(civilianMatch[0]) || 0
      }
      if (militaryMatch) {
        totalCasualties.military += parseInt(militaryMatch[0]) || 0
      }
    }
    
    // 统计事件类型
    province.majorEvents.forEach(event => {
      const eventType = event.event.includes('沦陷') ? '沦陷' :
                       event.event.includes('会战') || event.event.includes('战役') ? '战役' :
                       event.event.includes('事变') ? '事变' : '其他'
      
      eventTypes[eventType] = (eventTypes[eventType] || 0) + 1
    })
  })

  return {
    totalEvents,
    totalCasualties,
    eventTypes,
    totalProvinces: Object.keys(allProvinceWarHistory).length
  }
}

// 获取时间线数据
export const getWarTimeline = () => {
  const timeline = []
  
  Object.keys(allProvinceWarHistory).forEach(key => {
    const province = allProvinceWarHistory[key]
    
    province.majorEvents.forEach(event => {
      timeline.push({
        date: event.date,
        event: event.event,
        location: event.location,
        province: province.name,
        description: event.description,
        significance: event.significance
      })
    })
  })
  
  // 按日期排序
  timeline.sort((a, b) => new Date(a.date) - new Date(b.date))
  
  return timeline
}

// 搜索功能
export const searchWarHistory = (keyword) => {
  const results = []
  
  Object.keys(allProvinceWarHistory).forEach(key => {
    const province = allProvinceWarHistory[key]
    
    // 搜索省份名称和摘要
    if (province.name.includes(keyword) || province.summary.includes(keyword)) {
      results.push({
        type: 'province',
        province: province.name,
        title: province.name,
        content: province.summary,
        data: province
      })
    }
    
    // 搜索重大事件
    province.majorEvents.forEach(event => {
      if (event.event.includes(keyword) || 
          event.description.includes(keyword) ||
          event.location.includes(keyword)) {
        results.push({
          type: 'event',
          province: province.name,
          title: event.event,
          content: event.description,
          date: event.date,
          location: event.location,
          data: event
        })
      }
    })
    
    // 搜索抗战组织和领导人
    if (province.resistance) {
      province.resistance.organizations.forEach(org => {
        if (org.includes(keyword)) {
          results.push({
            type: 'organization',
            province: province.name,
            title: org,
            content: `${province.name}的抗战组织`,
            data: province.resistance
          })
        }
      })
      
      province.resistance.leaders.forEach(leader => {
        if (leader.includes(keyword)) {
          results.push({
            type: 'leader',
            province: province.name,
            title: leader,
            content: `${province.name}的抗战领导人`,
            data: province.resistance
          })
        }
      })
    }
  })
  
  return results
}

// 导出默认对象
export default {
  allProvinceWarHistory,
  provinceCodeMap,
  provinceNameMap,
  getProvinceWarHistory,
  getProvinceWarHistoryByName,
  getAllProvinces,
  getProvincesByStatus,
  getBattleStatistics,
  getWarTimeline,
  searchWarHistory
}
