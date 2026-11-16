<template>
  <div class="war-battle-dataviz">
    <!-- 背景粒子效果 -->
    <div class="particle-bg">
      <div class="particle" v-for="i in 50" :key="i" :style="getParticleStyle(i)"></div>
    </div>

    <!-- 顶部标题区域 -->
    <div class="top-section">
      <div class="top-decoration"></div>
      <div class="title-container">
        <div class="title-decoration-left"></div>
        <h1 class="main-title">
          <span class="title-glow">
            {{ selectedBattle ? `${selectedBattle.name} 战役详情` : '抗日战争重大战役数据分析' }}
          </span>
        </h1>
        <div class="title-decoration-right"></div>
      </div>
      <div class="control-buttons" v-if="selectedBattle">
        <button @click="resetToOverview" class="reset-btn">返回总览</button>
      </div>
      <div class="top-decoration"></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧区域 -->
      <div class="left-section">
        <!-- 战役统计概览 -->
        <div class="data-panel battle-overview">
          <div class="panel-header">
            <div class="header-icon">📊</div>
            <span class="header-title">战役统计概览</span>
            <div class="header-line"></div>
          </div>
          <div class="overview-stats">
            <div class="stat-item" v-for="stat in battleStats" :key="stat.label">
              <div class="stat-number">
                <span class="number-display" :style="{ color: stat.color }">{{ stat.value }}</span>
                <span class="number-unit">{{ stat.unit }}</span>
              </div>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <!-- 重大战役时间线 -->
        <div class="data-panel battle-timeline">
          <div class="panel-header">
            <div class="header-icon">🕒</div>
            <span class="header-title">重大战役时间线</span>
            <div class="header-line"></div>
          </div>
          <div class="timeline-content">
            <div 
              class="timeline-item" 
              v-for="(battle, index) in majorBattles" 
              :key="index"
              :class="{ 
                active: activeBattle === index,
                selected: selectedBattle && selectedBattle.id === battle.id
              }"
              @click="selectBattle(battle)"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-content-item">
                <h4>{{ battle.name }}</h4>
                <p class="timeline-date">{{ battle.date }}</p>
                <p class="timeline-location">{{ battle.location }}</p>
                <p class="timeline-outcome" :class="battle.outcome === '胜利' ? 'victory' : 'defeat'">
                  {{ battle.outcome === '胜利' ? '✓' : '✗' }} {{ battle.outcome }}
                </p>
                <p class="timeline-desc">{{ selectedBattle && selectedBattle.id === battle.id ? battle.significance : battle.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中央区域 -->
      <div class="center-section">
        <!-- 战役地图分布 -->
        <div class="data-panel battle-map">
          <div class="panel-header">
            <div class="header-icon">🗺️</div>
            <span class="header-title">战役地理分布</span>
            <div class="header-line"></div>
          </div>
          <div class="map-container">
            <div ref="mapChart" class="chart-container"></div>
          </div>
        </div>

        <!-- 伤亡统计图表 -->
        <div class="data-panel casualty-chart">
          <div class="panel-header">
            <div class="header-icon">📈</div>
            <span class="header-title">战役伤亡统计</span>
            <div class="header-line"></div>
          </div>
          <div ref="casualtyChart" class="chart-container"></div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="right-section">
        <!-- 战役胜负比例 -->
        <div class="data-panel battle-ratio">
          <div class="panel-header">
            <div class="header-icon">🎯</div>
            <span class="header-title">战役胜负统计</span>
            <div class="header-line"></div>
          </div>
          <div ref="pieChart" class="chart-container"></div>
        </div>

        <!-- 参战兵力统计 -->
        <div class="data-panel force-stats">
          <div class="panel-header">
            <div class="header-icon">⚔️</div>
            <span class="header-title">参战兵力对比</span>
            <div class="header-line"></div>
          </div>
          <div class="force-comparison">
            <div class="force-item" v-for="force in forceData" :key="force.name">
              <h4>{{ force.name }}</h4>
              <div class="progress-container">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: force.percentage + '%', backgroundColor: force.color }"></div>
                </div>
                <span class="progress-text">{{ force.troops }}万人</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 战役详情面板 / 影响力排名 -->
        <div class="data-panel battle-ranking" v-if="!selectedBattle">
          <div class="panel-header">
            <div class="header-icon">🏆</div>
            <span class="header-title">战役影响力排名</span>
            <div class="header-line"></div>
          </div>
          <div class="ranking-list">
            <div class="ranking-item" v-for="(item, index) in rankingData" :key="index">
              <div class="rank-number">{{ index + 1 }}</div>
              <div class="rank-name">{{ item.name }}</div>
              <div class="rank-score">{{ item.score }}分</div>
            </div>
          </div>
        </div>
        
        <!-- 选中战役的详细信息 -->
        <div class="data-panel battle-detail" v-if="selectedBattle">
          <div class="panel-header">
            <div class="header-icon">📋</div>
            <span class="header-title">{{ selectedBattle.name }} 详情</span>
            <div class="header-line"></div>
          </div>
          <div class="battle-detail-content">
            <div class="detail-section">
              <h4>基本信息</h4>
              <p><strong>时间：</strong>{{ selectedBattle.date }}</p>
              <p><strong>地点：</strong>{{ selectedBattle.location }}</p>
              <p><strong>持续：</strong>{{ selectedBattle.duration }}</p>
              <p><strong>结果：</strong>
                <span :class="selectedBattle.outcome === '胜利' ? 'victory' : 'defeat'">
                  {{ selectedBattle.outcome }}
                </span>
              </p>
            </div>
            
            <div class="detail-section">
              <h4>参战规模</h4>
              <p><strong>中方：</strong>{{ Math.round(selectedBattle.participants.chinese / 10000) }}万人</p>
              <p><strong>日方：</strong>{{ Math.round(selectedBattle.participants.japanese / 10000) }}万人</p>
            </div>
            
            <div class="detail-section">
              <h4>战役时间线</h4>
              <div class="mini-timeline">
                <div v-for="(event, index) in selectedBattle.timeline" :key="index" class="mini-timeline-item">
                  <span class="mini-time">{{ event.time }}</span>
                  <span class="mini-event">{{ event.event }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>历史意义</h4>
              <p class="significance">{{ selectedBattle.significance }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-section">
      <div class="bottom-decoration"></div>
    </div>

    <!-- 省份详情模态框 -->
    <div v-if="viewMode === 'province' && selectedProvince" class="province-detail-modal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedProvince.name }}战役详情</h3>
          <button @click="closeProvinceView" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <!-- 省份统计信息 -->
          <div class="province-stats">
            <div class="stat-item">
              <span class="stat-value">{{ selectedProvince.totalBattles }}</span>
              <span class="stat-label">战役数量</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ selectedProvince.victories }}</span>
              <span class="stat-label">胜利次数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ Math.round(selectedProvince.casualties.chinese / 10000) }}</span>
              <span class="stat-label">中方伤亡(万)</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ Math.round(selectedProvince.casualties.japanese / 10000) }}</span>
              <span class="stat-label">日方伤亡(万)</span>
            </div>
          </div>
          
          <!-- 省份描述 -->
          <div class="province-description">
            <p>{{ selectedProvince.description }}</p>
          </div>
          
          <!-- 战役列表 -->
          <div class="province-battles">
            <h4>主要战役</h4>
            <div class="battle-list">
              <div 
                v-for="battleName in selectedProvince.battles" 
                :key="battleName"
                class="battle-item"
                @click="selectBattleByName(battleName)"
              >
                <span class="battle-icon">{{ getBattleOutcomeIcon(battleName) }}</span>
                <span class="battle-name">{{ battleName }}</span>
                <span class="battle-action">查看详情 →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { loadJsonResource } from '@/utils/resourcePath'

// 图表引用
const mapChart = ref()
const casualtyChart = ref()
const pieChart = ref()
const provinceMapChart = ref()

// 选中的战役
const selectedBattle = ref(null)
const activeBattle = ref(0)

// 选中的省份
const selectedProvince = ref(null)
const viewMode = ref('overview') // 'overview' | 'province'

// 战役统计数据
const battleStats = reactive([
  {
    label: '重大战役',
    value: 22,
    unit: '场',
    color: '#8B1A1A'
  },
  {
    label: '持续时间',
    value: 2937,
    unit: '天',
    color: '#8C2F2F'
  },
  {
    label: '参战人数',
    value: 3500,
    unit: '万',
    color: '#8B1A1A'
  },
  {
    label: '解放区域',
    value: 956,
    unit: '万km²',
    color: '#8C2F2F'
  }
])

// 重大战役数据
const majorBattles = reactive([
  {
    id: 'jiuyiba',
    name: '九一八事变',
    date: '1931.09.18',
    duration: '1天',
    location: '辽宁',
    coordinates: [123.4, 41.8],
    description: '日本关东军炸毁南满铁路，随即炮轰北大营，挑起九一八事变',
    casualties: { chinese: 400, japanese: 30 },
    participants: { chinese: 8000, japanese: 10000 },
    outcome: '失败',
    impact: 100,
    significance: '标志着日本全面侵华的开始，中华民族14年抗战由此拉开序幕',
    timeline: [
      { time: '22:20', event: '柳条湖爆炸' },
      { time: '22:30', event: '日军炮击北大营' },
      { time: '次日6:00', event: '日军占领沈阳城' }
    ]
  },
  {
    id: 'songhu',
    name: '淞沪会战',
    date: '1937.08.13-11.12',
    duration: '92天',
    location: '上海',
    coordinates: [121.5, 31.2],
    description: '中日双方在上海及其周边地区进行的大规模战役',
    casualties: { chinese: 300000, japanese: 60000 },
    participants: { chinese: 800000, japanese: 300000 },
    outcome: '失败',
    impact: 150,
    significance: '粉碎了日军速战速决的企图，为国民政府迁都重庆争取了时间',
    timeline: [
      { time: '8月13日', event: '淞沪会战爆发' },
      { time: '8月23日', event: '日军在川沙登陆' },
      { time: '11月12日', event: '中国军队撤退' }
    ]
  },
  {
    id: 'taiyuan',
    name: '太原会战',
    date: '1937.09.13-11.08',
    duration: '56天',
    location: '山西',
    coordinates: [112.5, 37.9],
    description: '阎锡山指挥的保卫山西的大型防御战役',
    casualties: { chinese: 100000, japanese: 30000 },
    participants: { chinese: 280000, japanese: 140000 },
    outcome: '失败',
    impact: 120,
    significance: '平型关大捷是八路军抗战以来的首次大胜，极大鼓舞了全国军民',
    timeline: [
      { time: '9月13日', event: '会战开始' },
      { time: '9月25日', event: '平型关大捷' },
      { time: '11月8日', event: '太原失守' }
    ]
  },
  {
    id: 'nanjing',
    name: '南京保卫战',
    date: '1937.12.01-12.13',
    duration: '13天',
    location: '江苏',
    coordinates: [118.8, 32.0],
    description: '中国军队保卫首都南京的作战，日军制造南京大屠杀',
    casualties: { chinese: 50000, japanese: 8000 },
    participants: { chinese: 150000, japanese: 120000 },
    outcome: '失败',
    impact: 180,
    significance: '南京沦陷后日军制造了惨绝人寰的南京大屠杀，震惊世界',
    timeline: [
      { time: '12月1日', event: '日军逼近南京' },
      { time: '12月13日', event: '南京沦陷' },
      { time: '12月13日后', event: '南京大屠杀开始' }
    ]
  },
  {
    id: 'taierzhuang',
    name: '台儿庄大捷',
    date: '1938.03.16-04.15',
    duration: '31天',
    location: '山东',
    coordinates: [117.7, 34.6],
    description: '李宗仁指挥的徐州会战的组成部分，中国军队的重大胜利',
    casualties: { chinese: 30000, japanese: 20000 },
    participants: { chinese: 290000, japanese: 60000 },
    outcome: '胜利',
    impact: 90,
    significance: '抗战以来中国军队的第一次重大胜利，极大鼓舞了全民抗战士气',
    timeline: [
      { time: '3月16日', event: '战斗开始' },
      { time: '3月24日', event: '日军攻入台儿庄' },
      { time: '4月7日', event: '中国军队反攻成功' }
    ]
  },
  {
    id: 'wuhan',
    name: '武汉会战',
    date: '1938.06.11-10.27',
    duration: '138天',
    location: '湖北',
    coordinates: [114.3, 30.6],
    description: '抗日战争战略防御阶段规模最大的战役',
    casualties: { chinese: 400000, japanese: 100000 },
    participants: { chinese: 1100000, japanese: 350000 },
    outcome: '失败',
    impact: 160,
    significance: '消耗了日军大量有生力量，为持久抗战奠定了基础',
    timeline: [
      { time: '6月11日', event: '会战开始' },
      { time: '8月20日', event: '百团大战配合' },
      { time: '10月27日', event: '武汉失守' }
    ]
  },
  {
    id: 'lugouqiao',
    name: '卢沟桥事变',
    date: '1937.07.07',
    duration: '1天',
    location: '河北',
    coordinates: [114.5, 38.0],
    description: '日军在卢沟桥附近进行军事演习，随后炮轰宛平城，全面抗战爆发',
    casualties: { chinese: 800, japanese: 200 },
    participants: { chinese: 20000, japanese: 15000 },
    outcome: '失败',
    impact: 140,
    significance: '标志着全面抗战的开始，中华民族到了最危险的时候',
    timeline: [
      { time: '19:30', event: '日军演习' },
      { time: '22:40', event: '日军炮轰宛平城' },
      { time: '次日清晨', event: '中国军队奋起反击' }
    ]
  },
  {
    id: 'pingxingguan',
    name: '平型关大捷',
    date: '1937.09.25',
    duration: '1天',
    location: '山西',
    coordinates: [112.5, 37.9],
    description: '八路军115师在平型关伏击日军板垣师团，取得抗战以来首次大捷',
    casualties: { chinese: 600, japanese: 1000 },
    participants: { chinese: 15000, japanese: 5000 },
    outcome: '胜利',
    impact: 95,
    significance: '打破了日军不可战胜的神话，极大鼓舞了全国军民的抗战信心',
    timeline: [
      { time: '07:00', event: '战斗开始' },
      { time: '12:00', event: '全歼日军' },
      { time: '15:00', event: '战斗结束' }
    ]
  },
  {
    id: 'changsha',
    name: '长沙会战',
    date: '1939.09-10',
    duration: '33天',
    location: '湖南',
    coordinates: [113.0, 28.2],
    description: '薛岳指挥第九战区部队在长沙地区重创日军',
    casualties: { chinese: 40000, japanese: 30000 },
    participants: { chinese: 200000, japanese: 100000 },
    outcome: '胜利',
    impact: 130,
    significance: '抗战以来国民党正面战场取得的第一次重大胜利',
    timeline: [
      { time: '9月14日', event: '日军进攻' },
      { time: '9月23日', event: '中国军队反击' },
      { time: '10月8日', event: '日军撤退' }
    ]
  },
  {
    id: 'lanfeng',
    name: '兰封战役',
    date: '1938.05-06',
    duration: '45天',
    location: '河南',
    coordinates: [113.6, 34.8],
    description: '中国军队在兰封地区阻击日军进攻',
    casualties: { chinese: 25000, japanese: 18000 },
    participants: { chinese: 180000, japanese: 120000 },
    outcome: '胜利',
    impact: 85,
    significance: '成功阻止了日军沿陇海铁路西进的战略企图',
    timeline: [
      { time: '5月12日', event: '日军进攻开始' },
      { time: '5月20日', event: '兰封激战' },
      { time: '6月9日', event: '战役结束' }
    ]
  }
])

// 兵力对比数据
const forceData = reactive([
  {
    name: '中国军队',
    troops: 400,
    percentage: 70,
    color: '#2ecc71'
  },
  {
    name: '日军',
    troops: 280,
    percentage: 50,
    color: '#e74c3c'
  }
])

// 省份战役数据
const provinceBattleData = reactive({
  '辽宁': {
    name: '辽宁省',
    battles: ['九一八事变', '锦州战役', '沈阳保卫战', '辽阳战役'],
    coordinates: [123.4, 41.8],
    totalBattles: 4,
    victories: 0,
    casualties: { chinese: 15000, japanese: 8000 },
    description: '辽宁省是抗日战争的起点，经历了多次重要战役'
  },
  '上海': {
    name: '上海市',
    battles: ['淞沪会战', '四行仓库保卫战', '虹桥机场之战'],
    coordinates: [121.5, 31.2],
    totalBattles: 3,
    victories: 1,
    casualties: { chinese: 330000, japanese: 70000 },
    description: '上海是抗战初期的重要战场，经历了多次惨烈战斗'
  },
  '山西': {
    name: '山西省',
    battles: ['太原会战', '平型关大捷', '忻口战役', '晋西北战役'],
    coordinates: [112.5, 37.9],
    totalBattles: 4,
    victories: 1,
    casualties: { chinese: 120000, japanese: 45000 },
    description: '山西省是华北抗战的重要战场，八路军在此取得多次胜利'
  },
  '江苏': {
    name: '江苏省',
    battles: ['南京保卫战', '徐州会战', '苏南战役', '江南战役'],
    coordinates: [118.8, 32.0],
    totalBattles: 4,
    victories: 1,
    casualties: { chinese: 80000, japanese: 15000 },
    description: '江苏省是华东战场的重要组成部分，经历了多场重要会战'
  },
  '山东': {
    name: '山东省',
    battles: ['台儿庄大捷', '临沂战役', '济南战役', '胶东战役'],
    coordinates: [117.7, 34.6],
    totalBattles: 4,
    victories: 1,
    casualties: { chinese: 50000, japanese: 35000 },
    description: '山东省是华北战场的重要区域，李宗仁指挥的台儿庄大捷在此发生'
  },
  '湖北': {
    name: '湖北省',
    battles: ['武汉会战', '随枣会战', '枣宜会战', '鄂西会战'],
    coordinates: [114.3, 30.6],
    totalBattles: 4,
    victories: 1,
    casualties: { chinese: 450000, japanese: 120000 },
    description: '湖北省是华中战场的重要区域，武汉会战是规模最大的战役之一'
  },
  '河北': {
    name: '河北省',
    battles: ['卢沟桥事变', '保定战役', '石家庄战役', '冀中战役'],
    coordinates: [114.5, 38.0],
    totalBattles: 4,
    victories: 1,
    casualties: { chinese: 200000, japanese: 80000 },
    description: '河北省是七七事变的发生地，全面抗战由此爆发'
  },
  '湖南': {
    name: '湖南省',
    battles: ['长沙会战', '常德会战', '衡阳保卫战', '湘西会战'],
    coordinates: [113.0, 28.2],
    totalBattles: 4,
    victories: 2,
    casualties: { chinese: 180000, japanese: 95000 },
    description: '湖南省是中南战场的重要区域，薛岳指挥的长沙会战在此取得胜利'
  },
  '河南': {
    name: '河南省',
    battles: ['兰封战役', '豫南会战', '豫北会战', '郑州战役'],
    coordinates: [113.6, 34.8],
    totalBattles: 4,
    victories: 1,
    casualties: { chinese: 150000, japanese: 70000 },
    description: '河南省是中原战场的重要组成部分，经历了多次重要战役'
  },
  '安徽': {
    name: '安徽省',
    battles: ['皖南事变', '巢湖战役', '蚌埠战役', '皖北战役'],
    coordinates: [117.3, 31.9],
    totalBattles: 4,
    victories: 0,
    casualties: { chinese: 90000, japanese: 60000 },
    description: '安徽省是华东战场的重要区域，新四军在此重建'
  },
  '浙江': {
    name: '浙江省',
    battles: ['杭州战役', '宁波战役', '浙东战役', '浙西战役'],
    coordinates: [120.2, 30.3],
    totalBattles: 4,
    victories: 1,
    casualties: { chinese: 70000, japanese: 45000 },
    description: '浙江省是东南沿海战场的重要区域，经历了多次海上和陆地战斗'
  },
  '江西': {
    name: '江西省',
    battles: ['南昌战役', '九江战役', '赣江战役', '赣南战役'],
    coordinates: [115.9, 28.7],
    totalBattles: 4,
    victories: 1,
    casualties: { chinese: 80000, japanese: 55000 },
    description: '江西省是中南战场的重要区域，是连接华东和华中的战略要地'
  },
  '广东': {
    name: '广东省',
    battles: ['广州战役', '粤北战役', '珠江战役', '潮汕战役'],
    coordinates: [113.3, 23.2],
    totalBattles: 4,
    victories: 1,
    casualties: { chinese: 60000, japanese: 40000 },
    description: '广东省是华南沿海战场的重要区域，是对外联络的重要通道'
  }
})

// 排名数据
const rankingData = reactive([
  {
    name: '台儿庄大捷',
    score: 95
  },
  {
    name: '长沙会战',
    score: 92
  },
  {
    name: '武汉会战',
    score: 90
  },
  {
    name: '淞沪会战',
    score: 85
  },
  {
    name: '平型关大捷',
    score: 82
  },
  {
    name: '卢沟桥事变',
    score: 80
  },
  {
    name: '兰封战役',
    score: 75
  },
  {
    name: '太原会战',
    score: 70
  },
  {
    name: '南京保卫战',
    score: 68
  },
  {
    name: '九一八事变',
    score: 65
  }
])



// 获取粒子样式
const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 1
  const left = Math.random() * 100
  const animationDelay = Math.random() * 20
  const animationDuration = Math.random() * 10 + 10
  
  return {
    width: size + 'px',
    height: size + 'px',
    left: left + '%',
    animationDelay: animationDelay + 's',
    animationDuration: animationDuration + 's'
  }
}

// 设置活跃战役
const setActiveBattle = (index) => {
  activeBattle.value = index
}

// 选择战役并更新所有视图
const selectBattle = (battle) => {
  selectedBattle.value = battle
  
  // 更新地图视图，定位到战役发生地
  if (mapChart.value) {
    const chartInstance = echarts.getInstanceByDom(mapChart.value)
    if (chartInstance) {
      // 重新设置地图中心点和缩放级别
      const option = chartInstance.getOption()
      option.geo[0].center = battle.coordinates
      option.geo[0].zoom = 2.5 // 放大显示
      
      // 高亮选中的战役点
      const battleData = [{
        name: battle.location,
        value: [...battle.coordinates, battle.impact],
        battle: battle.name,
        color: battle.outcome === '胜利' ? '#8B1A1A' : '#8C2F2F'
      }]
      
      option.series[0].data = battleData
      chartInstance.setOption(option, true)
    }
  }
  
  // 更新战役统计数据
  updateBattleStats(battle)
  
  // 更新其他图表
  updateCasualtyChart(battle)
  updateForceData(battle)
  updatePieChart()
}

// 重置到总览视图
const resetToOverview = () => {
  selectedBattle.value = null
  selectedProvince.value = null
  viewMode.value = 'overview'
  
  // 重新初始化所有图表为总览模式
  initMapChart()
  initCasualtyChart()
  resetBattleStats()
  resetForceData()
  updatePieChart()
}

// 处理省份点击
const handleProvinceClick = (provinceName) => {
  // 需要通过省份名称找到对应的省份数据
  let province = null
  
  // 首先尝试直接查找
  province = provinceBattleData[provinceName]
  
  // 如果没找到，尝试通过省份全名查找
  if (!province) {
    for (const [key, value] of Object.entries(provinceBattleData)) {
      if (value.name === provinceName) {
        province = value
        break
      }
    }
  }
  
  if (province && province.battles.length > 0) {
    selectedProvince.value = province
    viewMode.value = 'province'
    updateProvinceView(province)
  }
}

// 更新省份视图
const updateProvinceView = (province) => {
  // 更新标题
  document.querySelector('.main-title .title-glow').textContent = `${province.name} 战役详情`
  
  // 更新地图显示省份
  if (mapChart.value) {
    const chartInstance = echarts.getInstanceByDom(mapChart.value)
    if (chartInstance) {
      const option = chartInstance.getOption()
      // 放大到省份级别
      option.geo[0].center = province.coordinates
      option.geo[0].zoom = 3.5
      
      // 只显示该省份的战役点
      const provinceBattleData = province.battles.map(battleName => {
        const battle = majorBattles.find(b => b.name === battleName)
        return {
          name: battle.location,
          value: [...battle.coordinates, battle.impact],
          battle: battle.name,
          color: battle.outcome === '胜利' ? '#8B1A1A' : '#8C2F2F'
        }
      })
      
      option.series[0].data = provinceBattleData
      chartInstance.setOption(option, true)
    }
  }
  
  // 更新统计数据为省份统计
  updateProvinceStats(province)
}

// 更新省份统计数据
const updateProvinceStats = (province) => {
  battleStats[0].value = province.totalBattles
  battleStats[0].label = '战役数量'
  battleStats[0].unit = '场'
  
  battleStats[1].value = province.victories
  battleStats[1].label = '胜利次数'
  battleStats[1].unit = '次'
  
  battleStats[2].value = Math.round(province.casualties.chinese / 10000)
  battleStats[2].label = '中方伤亡'
  battleStats[2].unit = '万人'
  
  battleStats[3].value = Math.round(province.casualties.japanese / 10000)
  battleStats[3].label = '日方伤亡'
  battleStats[3].unit = '万人'
}

// 关闭省份视图
const closeProvinceView = () => {
  selectedProvince.value = null
  viewMode.value = 'overview'
  resetToOverview()
}

// 根据战役名称选择战役
const selectBattleByName = (battleName) => {
  const battle = majorBattles.find(b => b.name === battleName)
  if (battle) {
    selectBattle(battle)
  }
}

// 获取战役结果图标
const getBattleOutcomeIcon = (battleName) => {
  const battle = majorBattles.find(b => b.name === battleName)
  return battle ? (battle.outcome === '胜利' ? '✓' : '✗') : ''
}

// 更新战役统计数据
const updateBattleStats = (battle) => {
  battleStats[0].value = 1
  battleStats[0].label = '当前战役'
  
  battleStats[1].value = parseInt(battle.duration)
  battleStats[1].label = '持续时间'
  battleStats[1].unit = '天'
  
  battleStats[2].value = Math.round(battle.participants.chinese / 10000)
  battleStats[2].label = '中方参战'
  battleStats[2].unit = '万人'
  
  battleStats[3].value = Math.round(battle.casualties.chinese / 10000)
  battleStats[3].label = '中方伤亡'
  battleStats[3].unit = '万人'
}

// 重置战役统计数据
const resetBattleStats = () => {
  battleStats[0].value = 22
  battleStats[0].label = '重大战役'
  battleStats[0].unit = '场'
  
  battleStats[1].value = 2937
  battleStats[1].label = '持续时间'
  battleStats[1].unit = '天'
  
  battleStats[2].value = 3500
  battleStats[2].label = '参战人数'
  battleStats[2].unit = '万'
  
  battleStats[3].value = 956
  battleStats[3].label = '解放区域'
  battleStats[3].unit = '万km²'
}

// 更新兵力对比数据
const updateForceData = (battle) => {
  const chineseTroops = Math.round(battle.participants.chinese / 10000)
  const japaneseTroops = Math.round(battle.participants.japanese / 10000)
  const total = chineseTroops + japaneseTroops
  
  forceData[0].troops = chineseTroops
  forceData[0].percentage = Math.round((chineseTroops / total) * 100)
  forceData[0].name = '中国军队'
  
  forceData[1].troops = japaneseTroops
  forceData[1].percentage = Math.round((japaneseTroops / total) * 100)  
  forceData[1].name = '日军'
}

// 重置兵力对比数据
const resetForceData = () => {
  forceData[0].troops = 400
  forceData[0].percentage = 70
  forceData[0].name = '中国军队'
  
  forceData[1].troops = 280
  forceData[1].percentage = 50
  forceData[1].name = '日军'
}

// 更新伤亡图表
const updateCasualtyChart = (battle) => {
  if (casualtyChart.value) {
    const chartInstance = echarts.getInstanceByDom(casualtyChart.value)
    if (chartInstance) {
      const option = {
        backgroundColor: 'transparent',
        title: {
          text: `${battle.name} - 战役详情`,
          left: 'center',
          textStyle: {
            color: '#2e231a',
            fontSize: 14
          }
        },
        grid: {
          left: '15%',
          right: '15%',
          top: '20%',
          bottom: '25%'
        },
        xAxis: {
          type: 'category',
          data: ['中方伤亡', '日方伤亡', '中方参战', '日方参战'],
          axisLabel: {
            color: '#2e231a',
            fontSize: 10,
            rotate: 45
          },
          axisLine: {
            lineStyle: {
              color: '#8b7768'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '人数(万)',
          nameTextStyle: {
            color: '#2e231a'
          },
          axisLabel: {
            color: '#2e231a'
          },
          axisLine: {
            lineStyle: {
              color: '#8b7768'
            }
          }
        },
        series: [{
          type: 'bar',
          data: [
            Math.round(battle.casualties.chinese / 10000),
            Math.round(battle.casualties.japanese / 10000),
            Math.round(battle.participants.chinese / 10000),
            Math.round(battle.participants.japanese / 10000)
          ],
          itemStyle: {
            color: function(params) {
              const colors = ['#8C2F2F', '#8B1A1A', '#8C2F2F', '#8B1A1A']
              return colors[params.dataIndex]
            }
          }
        }]
      }
      chartInstance.setOption(option, true)
    }
  }
}

// 初始化地图图表
const initMapChart = async () => {
  try {
    const chart = echarts.init(mapChart.value)
    
    // 加载中国地图GeoJSON数据
    const geoJson = await loadJsonResource('/data/china.json')
    
    // 注册地图
    echarts.registerMap('China', geoJson)
    
    // 根据当前状态生成战役数据
    const battleData = selectedBattle.value 
      ? [{
          name: selectedBattle.value.location,
          value: [...selectedBattle.value.coordinates, selectedBattle.value.impact],
          battle: selectedBattle.value.name,
          color: selectedBattle.value.outcome === '胜利' ? '#8B1A1A' : '#8C2F2F'
        }]
      : [
          { name: '辽宁', value: [123.4, 41.8, 100], battle: '九一八事变', color: '#8C2F2F', battleId: 'jiuyiba' },
          { name: '上海', value: [121.5, 31.2, 150], battle: '淞沪会战', color: '#8B1A1A', battleId: 'songhu' },
          { name: '山西', value: [112.5, 37.9, 120], battle: '平型关大捷', color: '#8B1A1A', battleId: 'pingxingguan' },
          { name: '江苏', value: [118.8, 32.0, 180], battle: '南京保卫战', color: '#8C2F2F', battleId: 'nanjing' },
          { name: '山东', value: [117.7, 34.6, 90], battle: '台儿庄大捷', color: '#8B1A1A', battleId: 'taierzhuang' },
          { name: '湖北', value: [114.3, 30.6, 160], battle: '武汉会战', color: '#8C2F2F', battleId: 'wuhan' },
          { name: '河北', value: [114.5, 38.0, 140], battle: '卢沟桥事变', color: '#8C2F2F', battleId: 'lugouqiao' },
          { name: '湖南', value: [113.0, 28.2, 130], battle: '长沙会战', color: '#8B1A1A', battleId: 'changsha' },
          { name: '河南', value: [113.6, 34.8, 120], battle: '兰封战役', color: '#8B1A1A', battleId: 'lanfeng' },
          { name: '安徽', value: [117.3, 31.9, 110], battle: '皖南事变', color: '#8C2F2F', battleId: 'wannan' },
          { name: '浙江', value: [120.2, 30.3, 100], battle: '杭州战役', color: '#8B1A1A', battleId: 'hangzhou' },
          { name: '江西', value: [115.9, 28.7, 105], battle: '南昌战役', color: '#8B1A1A', battleId: 'nanchang' },
          { name: '广东', value: [113.3, 23.2, 95], battle: '广州战役', color: '#8B1A1A', battleId: 'guangzhou' }
        ]
    
    // 生成省份地图数据
    const provinceData = Object.entries(provinceBattleData).map(([key, value]) => ({
      name: value.name,
      value: value.totalBattles,
      battles: value.battles,
      battleIds: value.battles.map(battleName => {
        const battle = majorBattles.find(b => b.name === battleName)
        return battle ? battle.id : null
      }).filter(id => id !== null),
      itemStyle: {
        areaColor: value.totalBattles > 0 ? 'rgba(251, 191, 36, 0.3)' : 'rgba(127, 29, 29, 0.2)'
      }
    }))
    
    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '抗日战争主要战役分布',
        left: 'center',
        top: 10,
        textStyle: {
          color: '#2e231a',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          if (params.seriesType === 'effectScatter') {
            const data = battleData.find(item => item.name === params.name)
            return `
              <div style="padding: 8px;">
                <h4 style="margin: 0 0 5px 0; color: #8B1A1A;">${data.battle}</h4>
                <p style="margin: 0; color: #666;">地点: ${params.name}</p>
              </div>
            `
          }
          return params.name
        }
      },
              geo: {
        map: 'China',
        roam: false,
        zoom: selectedBattle.value ? 2.5 : 1.2,
        center: selectedBattle.value ? selectedBattle.value.coordinates : [104, 35],
        itemStyle: {
          areaColor: 'rgba(127, 29, 29, 0.3)',
          borderColor: '#8B1A1A',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(251, 191, 36, 0.4)'
          }
        },
        label: {
          show: viewMode.value === 'province',
          color: '#2e231a',
          fontSize: 10
        },
        select: {
          disabled: false
        }
      },
      series: [
        // 省份地图系列
        {
          type: 'map',
          map: 'China',
          geoIndex: 0,
          data: provinceData,
          selectedMode: 'single',
          select: {
            disabled: false,
            itemStyle: {
              areaColor: 'rgba(251, 191, 36, 0.5)',
              borderColor: '#8C2F2F',
              borderWidth: 2
            }
          },
          emphasis: {
            itemStyle: {
              areaColor: 'rgba(251, 191, 36, 0.6)',
              borderColor: '#8B1A1A',
              borderWidth: 2
            },
            label: {
              show: true,
              color: '#2e231a',
              fontSize: 12,
              fontWeight: 'bold'
            }
          },
          label: {
            show: viewMode.value === 'overview',
            color: '#2e231a',
            fontSize: 10,
            formatter: function(params) {
              const province = provinceBattleData[params.name]
              return province && province.totalBattles > 0 ? params.name : ''
            }
          }
        },
        // 战役点系列
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: battleData.map(item => ({
            name: item.name,
            value: item.value,
            battle: item.battle,
            battleId: item.battleId,
            itemStyle: {
              color: item.color
            }
          })),
          symbolSize: function(val) {
            return Math.max(val[2] / 10, 12)
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 3,
            period: 2
          },
          label: {
            show: true,
            position: 'top',
            color: '#2e231a',
            fontSize: 10,
            formatter: function(params) {
              const data = battleData.find(item => item.name === params.name)
              return data ? data.battle : params.name
            }
          },
          emphasis: {
            scale: true
          },
          zlevel: 2
        }
      ]
    }
    
    chart.setOption(option)
    
    // 添加点击事件
    chart.on('click', (params) => {
      if (params.seriesType === 'effectScatter' && params.data.battleId) {
        const battle = majorBattles.find(b => b.id === params.data.battleId)
        if (battle) {
          selectBattle(battle)
        }
      } else if (params.seriesType === 'map') {
        // 处理省份点击
        handleProvinceClick(params.name)
      }
    })
    
    return chart
  } catch (error) {
    console.error('地图初始化失败:', error)
    // 如果地图加载失败，显示简化版本
    const chart = echarts.init(mapChart.value)
    const fallbackOption = {
      backgroundColor: 'transparent',
      title: {
        text: '战役分布图 (简化版)',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#2e231a',
          fontSize: 16
        }
      },
      xAxis: {
        type: 'category',
        data: ['九一八事变', '淞沪会战', '太原会战', '南京保卫战', '台儿庄大捷', '武汉会战'],
        axisLabel: {
          color: '#2e231a',
          fontSize: 10,
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '战役影响度',
        nameTextStyle: {
          color: '#2e231a'
        },
        axisLabel: {
          color: '#2e231a'
        }
      },
      series: [{
        type: 'bar',
        data: [100, 150, 120, 180, 90, 160],
        itemStyle: {
          color: function(params) {
            const colors = ['#8C2F2F', '#8B1A1A', '#8C2F2F', '#8B1A1A', '#8C2F2F', '#8B1A1A']
            return colors[params.dataIndex]
          }
        }
      }]
    }
    chart.setOption(fallbackOption)
    return chart
  }
}

// 初始化伤亡统计图表
const initCasualtyChart = () => {
  const chart = echarts.init(casualtyChart.value)
  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '10%',
      right: '10%',
      top: '10%',
      bottom: '20%'
    },
    xAxis: {
      type: 'category',
      data: ['九一八事变', '淞沪会战', '太原会战', '南京保卫战', '台儿庄大捷', '武汉会战', '卢沟桥事变', '平型关大捷', '长沙会战', '兰封战役'],
      axisLabel: {
        color: '#2e231a',
        fontSize: 10,
        rotate: 45
      },
      axisLine: {
        lineStyle: {
          color: '#8b7768'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '伤亡人数(万)',
      nameTextStyle: {
        color: '#2e231a'
      },
      axisLabel: {
        color: '#2e231a'
      },
      axisLine: {
        lineStyle: {
          color: '#8b7768'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#efe2d1'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: [0.5, 30, 10, 30, 2, 25, 0.8, 0.6, 4, 2.5],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ff6b6b' },
            { offset: 1, color: '#c0392b' }
          ])
        },
        animationDelay: (idx) => idx * 100
      }
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: (idx) => idx * 5
  }
  
  chart.setOption(option)
  return chart
}

// 初始化饼图
const initPieChart = () => {
  const chart = echarts.init(pieChart.value)
  updatePieChart(chart)
  return chart
}

// 更新饼图数据
const updatePieChart = (chart = null) => {
  const chartInstance = chart || echarts.getInstanceByDom(pieChart.value)
  if (!chartInstance) return
  
  let pieData, title
  
  if (selectedBattle.value) {
    // 显示选中战役的参战比例
    const chinese = selectedBattle.value.participants.chinese
    const japanese = selectedBattle.value.participants.japanese
    const total = chinese + japanese
    
    pieData = [
      { 
        value: Math.round((chinese / total) * 100), 
        name: '中国军队', 
        itemStyle: { color: '#8B1A1A' } 
      },
      { 
        value: Math.round((japanese / total) * 100), 
        name: '日军', 
        itemStyle: { color: '#8C2F2F' } 
      }
    ]
    title = `${selectedBattle.value.name} 参战比例`
  } else {
    // 显示总体战役结果比例
    pieData = [
      { value: 2, name: '胜利', itemStyle: { color: '#8B1A1A' } },
      { value: 4, name: '失败', itemStyle: { color: '#8C2F2F' } }
    ]
    title = '战役结果分布'
  }
  
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      left: 'center',
      top: '10%',
      textStyle: {
        color: '#2e231a',
        fontSize: 14,
        fontFamily: 'Noto Serif SC'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['50%', '60%'],
        data: pieData,
        label: {
          color: '#2e231a',
          fontSize: 12,
          fontFamily: 'Noto Serif SC'
        },
        labelLine: {
          lineStyle: {
            color: '#2e231a'
          }
        },
        animationType: 'scale',
        animationEasing: 'elasticOut'
      }
    ]
  }
  
  chartInstance.setOption(option, true)
}

// 窗口大小改变时重新调整图表
const handleResize = () => {
  const charts = [mapChart.value, casualtyChart.value, pieChart.value]
  charts.forEach(chartRef => {
    if (chartRef && chartRef.resize) {
      chartRef.resize()
    }
  })
}

onMounted(async () => {
  await nextTick()
  
  // 等待一下确保DOM渲染完成
  setTimeout(async () => {
    console.log('初始化图表...')
    
    // 初始化地图图表
    if (mapChart.value) {
      console.log('初始化地图图表')
      try {
        const map = await initMapChart()
        mapChart.value = map
      } catch (error) {
        console.error('地图图表初始化失败:', error)
      }
    } else {
      console.error('地图容器未找到')
    }
    
    // 初始化伤亡图表
    if (casualtyChart.value) {
      console.log('初始化伤亡图表')
      try {
        const casualty = initCasualtyChart()
        casualtyChart.value = casualty
      } catch (error) {
        console.error('伤亡图表初始化失败:', error)
      }
    } else {
      console.error('伤亡图表容器未找到')
    }
    
    // 初始化饼图
    if (pieChart.value) {
      console.log('初始化饼图')
      try {
        const pie = initPieChart()
        pieChart.value = pie
      } catch (error) {
        console.error('饼图初始化失败:', error)
      }
    } else {
      console.error('饼图容器未找到')
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  }, 1000)
})
</script>

<style scoped>
/* ===== 抗日战争重大战役数据分析 ===== */
.war-battle-dataviz {
  position: relative;
  padding-bottom: 24px;
  color: #2e231a;
}

/* 去掉粒子与装饰 */
.particle-bg,
.top-decoration,
.bottom-section,
.title-decoration-left,
.title-decoration-right {
  display: none;
}

/* ---------- 顶部 ---------- */
.top-section {
  margin-bottom: 18px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 26px;
  border: 1px solid #e8d8c4;
  border-radius: 18px;
  background:
    radial-gradient(70% 140% at 100% 0%, rgba(249, 229, 221, 0.85) 0%, rgba(249, 229, 221, 0) 60%),
    #fffcf5;
}

.main-title {
  font-size: 26px;
  letter-spacing: 0.08em;
  color: #8a2c21;
}

.title-glow {
  text-shadow: none;
}

.control-buttons {
  flex-shrink: 0;
}

.reset-btn {
  padding: 8px 18px;
  border: 1px solid #a7382a;
  border-radius: 999px;
  background: #a7382a;
  color: #fff8ee;
  font-size: 13px;
  letter-spacing: 0.04em;
}

.reset-btn:hover {
  background: #8a2c21;
}

/* ---------- 布局 ---------- */
.main-content {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) 300px;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

.left-section,
.center-section,
.right-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* ---------- 数据面板 ---------- */
.data-panel {
  padding: 16px;
  border: 1px solid #e8d8c4;
  border-radius: 16px;
  background: #fffcf5;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.header-icon {
  display: none;
}

.header-title {
  font-family: var(--font-serif);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #8a2c21;
}

.header-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, #e8d8c4, transparent);
}

/* ---------- 概览 ---------- */
.overview-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.overview-stats .stat-item {
  padding: 12px;
  border: 1px solid #efe2d1;
  border-radius: 12px;
  background: #fdf7ec;
}

.stat-number {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.number-display {
  font-family: var(--font-num);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
}

.number-unit {
  font-size: 11px;
  color: #8b7768;
}

.stat-label {
  display: block;
  margin-top: 2px;
  font-size: 11.5px;
  color: #8b7768;
}

/* ---------- 战役时间线 ---------- */
.timeline-content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  padding-left: 14px;
}

.timeline-content::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 4px;
  bottom: 4px;
  width: 1px;
  background: #e8d8c4;
}

.timeline-item {
  position: relative;
  padding: 9px 10px;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timeline-item:hover {
  background: #fdf7ec;
  border-color: #efe2d1;
}

.timeline-item.active,
.timeline-item.selected {
  background: #f6e2da;
  border-color: rgba(167, 56, 42, 0.28);
}

.timeline-dot {
  position: absolute;
  left: -13px;
  top: 16px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c9b8a6;
}

.timeline-item.active .timeline-dot,
.timeline-item.selected .timeline-dot {
  background: #a7382a;
  box-shadow: 0 0 0 3px rgba(167, 56, 42, 0.14);
}

.timeline-content-item h4 {
  font-size: 13.5px;
  color: #2e231a;
}

.timeline-date {
  margin-top: 2px;
  font-size: 11.5px;
  color: #a7382a;
  letter-spacing: 0.04em;
}

.timeline-location {
  margin-top: 2px;
  font-size: 11.5px;
  color: #8b7768;
}

.timeline-outcome {
  margin-top: 3px;
  font-size: 11.5px;
}

.timeline-outcome.victory {
  color: #8a2c21;
}

.timeline-outcome.defeat {
  color: #8b7768;
}

.timeline-desc {
  margin-top: 5px;
  font-size: 11.5px;
  line-height: 1.65;
  color: #5a4738;
}

/* ---------- 图表 ---------- */
.map-container,
.casualty-chart,
.battle-ratio,
.force-stats {
  min-height: 0;
}

.chart-container {
  width: 100%;
  height: 260px;
  min-height: 220px;
}

.battle-map .chart-container {
  height: 340px;
}

.battle-ratio .chart-container {
  height: 230px;
}

/* ---------- 兵力对比 ---------- */
.force-comparison {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.force-item h4 {
  font-size: 13px;
  color: #2e231a;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #f1e8dc;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
}

.progress-text {
  flex-shrink: 0;
  font-size: 11.5px;
  color: #8b7768;
}

/* ---------- 排名 ---------- */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: 8px;
}

.ranking-item:nth-child(odd) {
  background: #fdf7ec;
}

.rank-number {
  flex: 0 0 20px;
  font-family: var(--font-num);
  font-size: 12px;
  color: #b9945e;
}

.rank-name {
  flex: 1;
  font-size: 12.5px;
  color: #2e231a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-score {
  font-size: 12px;
  color: #a7382a;
}

/* ---------- 战役详情 ---------- */
.battle-detail-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 360px;
  overflow-y: auto;
}

.detail-section h4 {
  margin-bottom: 6px;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: #8a2c21;
}

.detail-section p {
  font-size: 12px;
  line-height: 1.75;
  color: #5a4738;
}

.detail-section strong {
  color: #2e231a;
  font-weight: 600;
}

.victory {
  color: #8a2c21;
}

.defeat {
  color: #8b7768;
}

.mini-timeline {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mini-timeline-item {
  display: flex;
  gap: 8px;
  font-size: 11.5px;
}

.mini-time {
  flex: 0 0 58px;
  color: #a7382a;
}

.mini-event {
  color: #5a4738;
}

.significance {
  padding: 9px 11px;
  border-left: 2px solid #b9945e;
  border-radius: 0 8px 8px 0;
  background: #fdf7ec;
  font-size: 12px !important;
  color: #5a4738;
}

/* ---------- 省份模态框 ---------- */
.province-detail-modal {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(38, 24, 16, 0.55);
  backdrop-filter: blur(4px);
}

.modal-content {
  width: min(720px, 100%);
  max-height: 88vh;
  overflow-y: auto;
  border: 1px solid #e8d8c4;
  border-radius: 18px;
  background: #fffcf5;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #e8d8c4;
  background: #fdf7ec;
}

.modal-header h3 {
  font-size: 20px;
  color: #8a2c21;
}

.close-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid #e8d8c4;
  border-radius: 50%;
  background: #fffdf8;
  color: #5a4738;
  font-size: 14px;
}

.close-btn:hover {
  background: #f6e2da;
  color: #8a2c21;
}

.modal-body {
  padding: 20px 22px 24px;
}

.province-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.province-stats .stat-item {
  padding: 12px;
  text-align: center;
  border: 1px solid #efe2d1;
  border-radius: 12px;
  background: #fdf7ec;
}

.province-stats .stat-value {
  display: block;
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  color: #a7382a;
}

.province-stats .stat-label {
  margin-top: 2px;
  font-size: 11.5px;
}

.province-description p {
  font-size: 13px;
  line-height: 1.85;
  color: #5a4738;
}

.province-battles h4 {
  margin: 18px 0 10px;
  font-size: 13px;
  color: #8a2c21;
}

.battle-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.battle-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #efe2d1;
  border-radius: 10px;
  background: #fdf7ec;
  cursor: pointer;
  transition: all 0.2s ease;
}

.battle-item:hover {
  border-color: rgba(167, 56, 42, 0.4);
  background: #fffdf8;
}

.battle-icon {
  font-size: 12px;
}

.battle-name {
  flex: 1;
  font-size: 13px;
  color: #2e231a;
}

.battle-action {
  font-size: 12px;
  color: #a7382a;
}

/* ---------- 响应式 ---------- */
@media (max-width: 1280px) {
  .main-content {
    grid-template-columns: 280px minmax(0, 1fr);
  }
  .right-section {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  .right-section {
    grid-template-columns: 1fr;
  }
  .title-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .battle-map .chart-container {
    height: 300px;
  }
}

@media (max-width: 640px) {
  .province-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .main-title {
    font-size: 21px;
  }
}
</style>
