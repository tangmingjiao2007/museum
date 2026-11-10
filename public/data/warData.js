// 抗战14年重要历史事件数据
export const timelineEvents = [
  {
    id: 1,
    date: '1931-09-18',
    year: 1931,
    title: '九一八事变',
    description:
      '日本关东军炸毁南满铁路，随后炮轰北大营，震惊中外的九一八事变爆发，中国人民长达14年的抗日战争从此开始。',
    location: '沈阳',
    importance: 'critical',
    category: 'invasion',
    casualties: '东北军伤亡400余人',
    significance: '抗日战争的起点，中华民族14年抗战的开始',
    relatedArtifacts: ['rifle', 'pistol'],
    image: '/images/918.jpg'
  },
  {
    id: 2,
    date: '1932-01-28',
    year: 1932,
    title: '一二八事变',
    description:
      '日军进攻上海，十九路军奋起抵抗，淞沪抗战爆发，这是中国军队第一次大规模抗击日军的战斗。',
    location: '上海',
    importance: 'major',
    category: 'resistance',
    casualties: '中国军队伤亡1.6万余人',
    significance: '中国军队首次大规模抗日作战',
    relatedArtifacts: ['rifle'],
    image: '/images/128.jpg'
  },
  {
    id: 3,
    date: '1937-07-07',
    year: 1937,
    title: '七七事变',
    description:
      '日军在卢沟桥附近进行军事演习，随后炮轰宛平城，全面抗战爆发，中华民族到了最危险的时候。',
    location: '北京卢沟桥',
    importance: 'critical',
    category: 'resistance',
    casualties: '守军伤亡数百人',
    significance: '全面抗战的开始，中华民族全面觉醒',
    relatedArtifacts: ['rifle', 'pistol'],
    image: '/images/77.jpg'
  },
  {
    id: 4,
    date: '1937-08-13',
    year: 1937,
    title: '淞沪会战',
    description:
      '中国军队主动在上海开辟第二战场，这是抗战初期规模最大、战斗最激烈的战役，粉碎了日军三个月灭亡中国的狂妄计划。',
    location: '上海',
    importance: 'critical',
    category: 'battle',
    casualties: '中国军队伤亡30万人',
    significance: '粉碎日军速战速决计划，为迁都重庆争取时间',
    relatedArtifacts: ['rifle'],
    image: '/images/songhu.jpg'
  },
  {
    id: 5,
    date: '1937-12-13',
    year: 1937,
    title: '南京大屠杀',
    description:
      '日军攻占南京后，对中国平民和战俘进行了长达6周的大规模屠杀，这是人类历史上最黑暗的一页。',
    location: '南京',
    importance: 'critical',
    category: 'tragedy',
    casualties: '30万同胞遇难',
    significance: '日军暴行的铁证，激发全民族抗战决心',
    relatedArtifacts: [],
    image: '/images/nanjing.jpg'
  },
  {
    id: 6,
    date: '1938-03-24',
    year: 1938,
    title: '台儿庄大捷',
    description:
      '中国军队在台儿庄重创日军，歼敌1万余人，这是抗战以来中国军队取得的第一次重大胜利。',
    location: '山东台儿庄',
    importance: 'major',
    category: 'victory',
    casualties: '日军伤亡1万余人',
    significance: '抗战以来第一次重大胜利，极大鼓舞全国军民士气',
    relatedArtifacts: ['rifle', 'pistol'],
    image: '/images/taierzhuang.jpg'
  },
  {
    id: 7,
    date: '1940-08-20',
    year: 1940,
    title: '百团大战',
    description:
      '八路军在华北发动大规模攻势作战，参战部队达105个团，沉重打击了日军的囚笼政策。',
    location: '华北地区',
    importance: 'major',
    category: 'battle',
    casualties: '日伪军伤亡2万余人',
    significance: '抗战中八路军主动出击的最大规模战役',
    relatedArtifacts: ['rifle'],
    image: '/images/baituan.jpg'
  },
  {
    id: 8,
    date: '1941-12-07',
    year: 1941,
    title: '珍珠港事件',
    description:
      '日军偷袭珍珠港，太平洋战争爆发，中国抗战成为世界反法西斯战争的重要组成部分。',
    location: '美国珍珠港',
    importance: 'major',
    category: 'international',
    casualties: '美军伤亡3500余人',
    significance: '中国抗战融入世界反法西斯战争',
    relatedArtifacts: [],
    image: '/images/pearl.jpg'
  },
  {
    id: 9,
    date: '1945-08-15',
    year: 1945,
    title: '日本宣布投降',
    description:
      '日本天皇宣布无条件投降，中国人民经过14年艰苦卓绝的抗战终于取得伟大胜利。',
    location: '日本东京',
    importance: 'critical',
    category: 'victory',
    casualties: '',
    significance: '中华民族抗战的伟大胜利，世界反法西斯战争胜利',
    relatedArtifacts: [],
    image: '/images/victory.jpg'
  },
  {
    id: 10,
    date: '1945-09-02',
    year: 1945,
    title: '日本正式投降',
    description:
      '日本在东京湾美军密苏里号战列舰上正式签署投降书，中国人民抗日战争暨世界反法西斯战争胜利结束。',
    location: '东京湾',
    importance: 'critical',
    category: 'victory',
    casualties: '',
    significance: '抗日战争正式结束，中华民族获得完全胜利',
    relatedArtifacts: [],
    image: '/images/surrender.jpg'
  }
]

// 战役统计数据
export const battleStatistics = [
  {
    name: '淞沪会战',
    duration: 92, // 天数
    chineseForces: 700000,
    japaneseForces: 300000,
    chineseCasualties: 300000,
    japaneseCasualties: 40000,
    result: 'strategic_success' // 战略成功
  },
  {
    name: '台儿庄战役',
    duration: 29,
    chineseForces: 290000,
    japaneseForces: 100000,
    chineseCasualties: 50000,
    japaneseCasualties: 20000,
    result: 'victory'
  },
  {
    name: '百团大战',
    duration: 105,
    chineseForces: 400000,
    japaneseForces: 200000,
    chineseCasualties: 17000,
    japaneseCasualties: 20000,
    result: 'victory'
  },
  {
    name: '长沙会战',
    duration: 180,
    chineseForces: 300000,
    japaneseForces: 120000,
    chineseCasualties: 40000,
    japaneseCasualties: 48000,
    result: 'victory'
  }
]

// 抗战英雄数据
export const warHeroes = [
  {
    name: '张学良',
    title: '东北军领袖',
    contribution: '九一八事变后主张抗日，西安事变促成国共合作',
    period: '1931-1945'
  },
  {
    name: '佟麟阁',
    title: '第29军副军长',
    contribution: '七七事变中英勇抗敌，壮烈殉国',
    period: '1937'
  },
  {
    name: '谢晋元',
    title: '第88师524团团长',
    contribution: '率领八百壮士坚守四行仓库',
    period: '1937'
  },
  {
    name: '彭德怀',
    title: '八路军副总指挥',
    contribution: '指挥百团大战，重创日伪军',
    period: '1937-1945'
  }
]

// 事件分类颜色配置
export const categoryColors = {
  invasion: '#dc2626', // 红色 - 侵略事件
  resistance: '#f59e0b', // 橙色 - 抵抗事件
  battle: '#3b82f6', // 蓝色 - 重要战役
  victory: '#10b981', // 绿色 - 胜利事件
  tragedy: '#6b7280', // 灰色 - 悲剧事件
  international: '#8b5cf6' // 紫色 - 国际事件
}

// 重要程度配置
export const importanceConfig = {
  critical: {
    size: 16,
    color: '#dc2626',
    label: '重大事件'
  },
  major: {
    size: 12,
    color: '#f59e0b',
    label: '重要事件'
  },
  normal: {
    size: 8,
    color: '#6b7280',
    label: '一般事件'
  }
}

// 战役地理位置数据
export const battleLocations = [
  {
    id: 1,
    name: '九一八事变',
    date: '1931-09-18',
    coordinates: [123.4, 41.8], // 沈阳
    type: 'invasion',
    scale: 'large',
    description: '日军炸毁南满铁路，攻占沈阳，东北沦陷开始',
    participants: {
      chinese: '东北军',
      japanese: '关东军'
    },
    result: 'defeat',
    casualties: {
      chinese: 400,
      japanese: 2
    },
    duration: 1,
    significance: '抗日战争的起点',
    relatedEvents: []
  },
  {
    id: 2,
    name: '一二八事变',
    date: '1932-01-28',
    coordinates: [121.5, 31.2], // 上海
    type: 'resistance',
    scale: 'large',
    description: '十九路军在上海奋起抵抗日军进攻',
    participants: {
      chinese: '十九路军',
      japanese: '日本海军陆战队'
    },
    result: 'strategic_success',
    casualties: {
      chinese: 16000,
      japanese: 3000
    },
    duration: 33,
    significance: '中国军队首次大规模抗日作战',
    relatedEvents: [1]
  },
  {
    id: 3,
    name: '七七事变',
    date: '1937-07-07',
    coordinates: [116.2, 39.8], // 北京卢沟桥
    type: 'resistance',
    scale: 'critical',
    description: '日军在卢沟桥挑起事端，全面抗战爆发',
    participants: {
      chinese: '第29军',
      japanese: '中国驻屯军'
    },
    result: 'strategic_success',
    casualties: {
      chinese: 500,
      japanese: 100
    },
    duration: 1,
    significance: '全面抗战的开始',
    relatedEvents: [1, 2]
  },
  {
    id: 4,
    name: '淞沪会战',
    date: '1937-08-13',
    coordinates: [121.5, 31.2], // 上海
    type: 'battle',
    scale: 'critical',
    description: '中国军队主动在上海开辟第二战场',
    participants: {
      chinese: '国民革命军',
      japanese: '日本华中方面军'
    },
    result: 'strategic_success',
    casualties: {
      chinese: 300000,
      japanese: 40000
    },
    duration: 92,
    significance: '粉碎日军速战速决计划',
    relatedEvents: [3]
  },
  {
    id: 5,
    name: '南京保卫战',
    date: '1937-12-01',
    coordinates: [118.8, 32.1], // 南京
    type: 'battle',
    scale: 'critical',
    description: '中国军队保卫首都南京的战斗',
    participants: {
      chinese: '国民革命军',
      japanese: '日本华中方面军'
    },
    result: 'defeat',
    casualties: {
      chinese: 50000,
      japanese: 8000
    },
    duration: 12,
    significance: '首都沦陷，南京大屠杀发生',
    relatedEvents: [4]
  },
  {
    id: 6,
    name: '台儿庄大捷',
    date: '1938-03-24',
    coordinates: [117.7, 34.6], // 台儿庄
    type: 'victory',
    scale: 'major',
    description: '中国军队在台儿庄重创日军',
    participants: {
      chinese: '第五战区',
      japanese: '日军第10师团'
    },
    result: 'victory',
    casualties: {
      chinese: 30000,
      japanese: 20000
    },
    duration: 29,
    significance: '抗战以来第一次重大胜利',
    relatedEvents: [5]
  },
  {
    id: 7,
    name: '武汉会战',
    date: '1938-06-11',
    coordinates: [114.3, 30.6], // 武汉
    type: 'battle',
    scale: 'critical',
    description: '保卫武汉的大规模会战',
    participants: {
      chinese: '国民革命军',
      japanese: '日军华中方面军'
    },
    result: 'strategic_success',
    casualties: {
      chinese: 400000,
      japanese: 200000
    },
    duration: 127,
    significance: '进一步消耗日军实力',
    relatedEvents: [6]
  },
  {
    id: 8,
    name: '百团大战',
    date: '1940-08-20',
    coordinates: [113.0, 37.5], // 山西
    type: 'battle',
    scale: 'major',
    description: '八路军在华北发动大规模攻势作战',
    participants: {
      chinese: '八路军',
      japanese: '华北方面军'
    },
    result: 'victory',
    casualties: {
      chinese: 17000,
      japanese: 20000
    },
    duration: 105,
    significance: '抗战中八路军主动出击的最大规模战役',
    relatedEvents: [7]
  },
  {
    id: 9,
    name: '长沙会战',
    date: '1939-09-17',
    coordinates: [113.0, 28.2], // 长沙
    type: 'victory',
    scale: 'major',
    description: '中国军队三次保卫长沙的胜利',
    participants: {
      chinese: '第九战区',
      japanese: '日军第11军'
    },
    result: 'victory',
    casualties: {
      chinese: 40000,
      japanese: 48000
    },
    duration: 180,
    significance: '连续三次击败日军进攻',
    relatedEvents: [8]
  },
  {
    id: 10,
    name: '滇缅公路',
    date: '1942-05-01',
    coordinates: [102.7, 25.0], // 昆明
    type: 'logistics',
    scale: 'major',
    description: '中国远征军入缅作战，保卫滇缅公路',
    participants: {
      chinese: '中国远征军',
      japanese: '缅甸方面军'
    },
    result: 'mixed',
    casualties: {
      chinese: 60000,
      japanese: 15000
    },
    duration: 365,
    significance: '国际援华物资运输线',
    relatedEvents: [9]
  }
]

// 战线变化数据（按时间顺序）
export const frontLineChanges = [
  {
    date: '1931-09-18',
    title: '九一八事变后',
    description: '东北全境沦陷',
    controlledArea: {
      japanese: ['东北三省'],
      chinese: ['关内各省']
    },
    frontLine: [
      [124.0, 42.0],
      [126.0, 45.0],
      [130.0, 47.0],
      [134.0, 48.0]
    ]
  },
  {
    date: '1937-07-07',
    title: '全面抗战爆发',
    description: '华北战事扩大',
    controlledArea: {
      japanese: ['东北三省', '华北部分地区'],
      chinese: ['华中华南各省']
    },
    frontLine: [
      [116.0, 40.0],
      [118.0, 39.0],
      [120.0, 38.0],
      [122.0, 37.0]
    ]
  },
  {
    date: '1937-12-13',
    title: '南京沦陷后',
    description: '华东大部沦陷',
    controlledArea: {
      japanese: ['东北', '华北', '华东沿海'],
      chinese: ['西南', '西北', '华中内陆']
    },
    frontLine: [
      [114.0, 32.0],
      [116.0, 30.0],
      [118.0, 28.0],
      [120.0, 26.0]
    ]
  },
  {
    date: '1938-10-25',
    title: '武汉沦陷后',
    description: '日军占领区达到最大',
    controlledArea: {
      japanese: ['东北', '华北', '华东', '华中部分'],
      chinese: ['西南', '西北', '华南部分']
    },
    frontLine: [
      [108.0, 34.0],
      [112.0, 30.0],
      [116.0, 26.0],
      [120.0, 24.0]
    ]
  },
  {
    date: '1945-08-15',
    title: '抗战胜利',
    description: '全面收复失地',
    controlledArea: {
      japanese: [],
      chinese: ['全中国']
    },
    frontLine: []
  }
]

// 重要城市数据
export const importantCities = [
  {
    name: '北京',
    coordinates: [116.4, 39.9],
    status: 'occupied',
    date: '1937-07-29'
  },
  {
    name: '天津',
    coordinates: [117.2, 39.1],
    status: 'occupied',
    date: '1937-07-30'
  },
  {
    name: '上海',
    coordinates: [121.5, 31.2],
    status: 'occupied',
    date: '1937-11-12'
  },
  {
    name: '南京',
    coordinates: [118.8, 32.1],
    status: 'occupied',
    date: '1937-12-13'
  },
  {
    name: '武汉',
    coordinates: [114.3, 30.6],
    status: 'occupied',
    date: '1938-10-25'
  },
  {
    name: '广州',
    coordinates: [113.3, 23.1],
    status: 'occupied',
    date: '1938-10-21'
  },
  {
    name: '重庆',
    coordinates: [106.5, 29.6],
    status: 'capital',
    date: '1937-11-20'
  },
  {
    name: '延安',
    coordinates: [109.5, 36.6],
    status: 'base',
    date: '1936-12-01'
  },
  {
    name: '昆明',
    coordinates: [102.7, 25.0],
    status: 'logistics',
    date: '1938-01-01'
  },
  {
    name: '西安',
    coordinates: [108.9, 34.3],
    status: 'strategic',
    date: '1936-12-12'
  }
]

// 动画配置
export const animationConfig = {
  battleDuration: 2000, // 战役动画持续时间(ms)
  frontLineDuration: 3000, // 战线变化动画时间
  markerPulseDuration: 1500, // 标记脉冲动画时间
  flyLineDuration: 1000, // 飞线动画时间
  colors: {
    chinese: '#dc2626', // 中国军队 - 红色
    japanese: '#374151', // 日军 - 深灰
    victory: '#10b981', // 胜利 - 绿色
    defeat: '#ef4444', // 失败 - 红色
    occupied: '#6b7280', // 沦陷 - 灰色
    liberated: '#f59e0b' // 解放 - 橙色
  }
}
