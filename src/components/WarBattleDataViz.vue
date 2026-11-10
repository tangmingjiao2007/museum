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
                <p class="timeline-location">📍 {{ battle.location }}</p>
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
    color: '#D4AF37'
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
    color: '#D4AF37'
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
        color: battle.outcome === '胜利' ? '#D4AF37' : '#8C2F2F'
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
          color: battle.outcome === '胜利' ? '#D4AF37' : '#8C2F2F'
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
            color: '#fef2f2',
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
            color: '#fef2f2',
            fontSize: 10,
            rotate: 45
          },
          axisLine: {
            lineStyle: {
              color: '#555'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '人数(万)',
          nameTextStyle: {
            color: '#fef2f2'
          },
          axisLabel: {
            color: '#fef2f2'
          },
          axisLine: {
            lineStyle: {
              color: '#555'
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
              const colors = ['#8C2F2F', '#D4AF37', '#8C2F2F', '#D4AF37']
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
          color: selectedBattle.value.outcome === '胜利' ? '#D4AF37' : '#8C2F2F'
        }]
      : [
          { name: '辽宁', value: [123.4, 41.8, 100], battle: '九一八事变', color: '#8C2F2F', battleId: 'jiuyiba' },
          { name: '上海', value: [121.5, 31.2, 150], battle: '淞沪会战', color: '#D4AF37', battleId: 'songhu' },
          { name: '山西', value: [112.5, 37.9, 120], battle: '平型关大捷', color: '#D4AF37', battleId: 'pingxingguan' },
          { name: '江苏', value: [118.8, 32.0, 180], battle: '南京保卫战', color: '#8C2F2F', battleId: 'nanjing' },
          { name: '山东', value: [117.7, 34.6, 90], battle: '台儿庄大捷', color: '#D4AF37', battleId: 'taierzhuang' },
          { name: '湖北', value: [114.3, 30.6, 160], battle: '武汉会战', color: '#8C2F2F', battleId: 'wuhan' },
          { name: '河北', value: [114.5, 38.0, 140], battle: '卢沟桥事变', color: '#8C2F2F', battleId: 'lugouqiao' },
          { name: '湖南', value: [113.0, 28.2, 130], battle: '长沙会战', color: '#D4AF37', battleId: 'changsha' },
          { name: '河南', value: [113.6, 34.8, 120], battle: '兰封战役', color: '#D4AF37', battleId: 'lanfeng' },
          { name: '安徽', value: [117.3, 31.9, 110], battle: '皖南事变', color: '#8C2F2F', battleId: 'wannan' },
          { name: '浙江', value: [120.2, 30.3, 100], battle: '杭州战役', color: '#D4AF37', battleId: 'hangzhou' },
          { name: '江西', value: [115.9, 28.7, 105], battle: '南昌战役', color: '#D4AF37', battleId: 'nanchang' },
          { name: '广东', value: [113.3, 23.2, 95], battle: '广州战役', color: '#D4AF37', battleId: 'guangzhou' }
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
          color: '#fef2f2',
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
                <h4 style="margin: 0 0 5px 0; color: #D4AF37;">${data.battle}</h4>
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
          borderColor: '#D4AF37',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(251, 191, 36, 0.4)'
          }
        },
        label: {
          show: viewMode.value === 'province',
          color: '#fef2f2',
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
              borderColor: '#D4AF37',
              borderWidth: 2
            },
            label: {
              show: true,
              color: '#fef2f2',
              fontSize: 12,
              fontWeight: 'bold'
            }
          },
          label: {
            show: viewMode.value === 'overview',
            color: '#fef2f2',
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
            color: '#fef2f2',
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
          color: '#fff',
          fontSize: 16
        }
      },
      xAxis: {
        type: 'category',
        data: ['九一八事变', '淞沪会战', '太原会战', '南京保卫战', '台儿庄大捷', '武汉会战'],
        axisLabel: {
          color: '#fef2f2',
          fontSize: 10,
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '战役影响度',
        nameTextStyle: {
          color: '#fef2f2'
        },
        axisLabel: {
          color: '#fef2f2'
        }
      },
      series: [{
        type: 'bar',
        data: [100, 150, 120, 180, 90, 160],
        itemStyle: {
          color: function(params) {
            const colors = ['#8C2F2F', '#D4AF37', '#8C2F2F', '#D4AF37', '#8C2F2F', '#D4AF37']
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
        color: '#fef2f2',
        fontSize: 10,
        rotate: 45
      },
      axisLine: {
        lineStyle: {
          color: '#555'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '伤亡人数(万)',
      nameTextStyle: {
        color: '#fef2f2'
      },
      axisLabel: {
        color: '#fef2f2'
      },
      axisLine: {
        lineStyle: {
          color: '#555'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#333'
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
        itemStyle: { color: '#D4AF37' } 
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
      { value: 2, name: '胜利', itemStyle: { color: '#D4AF37' } },
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
        color: '#fef2f2',
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
          color: '#fef2f2',
          fontSize: 12,
          fontFamily: 'Noto Serif SC'
        },
        labelLine: {
          lineStyle: {
            color: '#fef2f2'
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
.war-battle-dataviz {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 25%, #8C2F2F 50%, #991b1b 75%, #7f1d1d 100%);
  color: #fef2f2;
  position: relative;
  padding-bottom: 40px;
}

/* 复古背景装饰 */
.particle-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, #D4AF37 0%, transparent 70%);
  border-radius: 50%;
  animation: gentleFloat linear infinite;
}

@keyframes gentleFloat {
  0% {
    transform: translateY(100vh) translateX(-20px);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-50px) translateX(20px);
    opacity: 0;
  }
}

/* 顶部区域 */
.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 20px;
  position: relative;
  z-index: 10;
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), rgba(220, 38, 38, 0.2), rgba(251, 191, 36, 0.1));
  border-bottom: 3px solid #D4AF37;
  margin-bottom: 20px;
}

.top-decoration {
  width: 250px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #D4AF37, #8C2F2F, transparent);
  position: relative;
  border-radius: 2px;
}

.top-decoration::before {
  content: '';
  position: absolute;
  left: 0;
  top: -3px;
  width: 100%;
  height: 9px;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.3), rgba(220, 38, 38, 0.3), transparent);
  filter: blur(3px);
}

.title-container {
  display: flex;
  align-items: center;
  gap: 30px;
}

.title-decoration-left,
.title-decoration-right {
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, #D4AF37, #8C2F2F);
  position: relative;
  border-radius: 2px;
}

.title-decoration-left::after,
.title-decoration-right::after {
  content: '◆';
  position: absolute;
  color: #D4AF37;
  font-size: 12px;
  top: -6px;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.8);
}

.title-decoration-left::after {
  right: -8px;
}

.title-decoration-right::after {
  left: -8px;
}

.main-title {
  font-size: 42px;
  font-weight: bold;
  text-align: center;
  margin: 0;
  position: relative;
}

.title-glow {
  background: linear-gradient(45deg, #D4AF37, #8C2F2F, #D4AF37);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: retrotitleGlow 4s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
  font-family: 'Noto Serif SC', serif;
  font-weight: bold;
}

@keyframes retrotitleGlow {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* 主要内容区域 */
.main-content {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
}

.left-section,
.right-section {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.center-section {
  flex: 2;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 数据面板通用样式 */
.data-panel {
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.15), rgba(220, 38, 38, 0.1));
  border: 2px solid #D4AF37;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 20px rgba(251, 191, 36, 0.1), 0 4px 15px rgba(0, 0, 0, 0.3);
}

.data-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.2), transparent);
  transition: left 0.8s ease;
}

.data-panel:hover {
  border-color: #8C2F2F;
  box-shadow: inset 0 0 30px rgba(220, 38, 38, 0.2), 0 6px 20px rgba(0, 0, 0, 0.4);
  transform: translateY(-1px);
}

.data-panel:hover::before {
  left: 100%;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(251, 191, 36, 0.5);
}

.header-icon {
  font-size: 20px;
  filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.8));
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #fef2f2;
  flex: 1;
  font-family: 'Noto Serif SC', serif;
}

.header-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #D4AF37, transparent);
}

/* 战役概览 */
.battle-overview {
  min-height: 280px;
  flex: 0 0 auto;
}

.overview-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: calc(100% - 60px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: rgba(251, 191, 36, 0.1);
  border-radius: 6px;
  padding: 15px;
  border: 1px solid rgba(220, 38, 38, 0.3);
  transition: all 0.3s ease;
  box-shadow: inset 0 0 10px rgba(251, 191, 36, 0.05);
}

.stat-item:hover {
  background: rgba(220, 38, 38, 0.15);
  border-color: #D4AF37;
  transform: scale(1.02);
}

.stat-number {
  margin-bottom: 10px;
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.number-display {
  font-size: 32px;
  font-weight: bold;
  animation: numberGlow 2s ease-in-out infinite;
  font-family: 'Noto Serif SC', serif;
}

.number-unit {
  font-size: 16px;
  color: #cccccc;
}

.stat-label {
  font-size: 14px;
  color: #cccccc;
  margin-top: 5px;
}

@keyframes numberGlow {
  0%, 100% {
    text-shadow: 0 0 8px currentColor;
  }
  50% {
    text-shadow: 0 0 15px currentColor, 0 0 20px currentColor;
  }
}

/* 时间线 */
.battle-timeline {
  flex: 1;
}

.timeline-content {
  height: calc(100% - 60px);
  overflow-y: auto;
  padding-right: 5px;
}

.timeline-item {
  display: flex;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid transparent;
  background: rgba(251, 191, 36, 0.08);
}

.timeline-item:hover,
.timeline-item.active {
  background: rgba(220, 38, 38, 0.15);
  border-left-color: #D4AF37;
  transform: translateX(3px);
  box-shadow: 0 3px 12px rgba(220, 38, 38, 0.3);
}

.timeline-item.selected {
  background: rgba(251, 191, 36, 0.2);
  border-left-color: #D4AF37;
  border-left-width: 5px;
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(251, 191, 36, 0.4);
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 12px;
  margin-top: 4px;
  flex-shrink: 0;
  background: #8C2F2F;
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.6);
  position: relative;
  border: 1px solid #D4AF37;
}

.timeline-dot::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: #D4AF37;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  animation: gentlePulse 3s infinite;
}

.timeline-content-item h4 {
  margin: 0 0 6px 0;
  color: #D4AF37;
  font-size: 15px;
  font-weight: bold;
  font-family: 'Noto Serif SC', serif;
}

.timeline-date {
  margin: 0 0 6px 0;
  color: #8C2F2F;
  font-size: 12px;
  font-weight: 500;
}

.timeline-desc {
  margin: 0;
  color: #fef2f2;
  font-size: 12px;
  line-height: 1.4;
}

.timeline-location {
  margin: 0 0 4px 0;
  color: #D4AF37;
  font-size: 11px;
  font-weight: 500;
}

.timeline-outcome {
  margin: 0 0 6px 0;
  font-size: 11px;
  font-weight: bold;
}

.timeline-outcome.victory {
  color: #D4AF37;
}

.timeline-outcome.defeat {
  color: #8C2F2F;
}

/* 控制按钮样式 */
.control-buttons {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}

.reset-btn {
  background: linear-gradient(145deg, #D4AF37, #8C2F2F);
  color: #fef2f2;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Noto Serif SC', serif;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(251, 191, 36, 0.4);
  background: linear-gradient(145deg, #f59e0b, #b91c1c);
}

/* 战役详情面板样式 */
.battle-detail-content {
  max-height: 400px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(251, 191, 36, 0.2);
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h4 {
  color: #D4AF37;
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Noto Serif SC', serif;
}

.detail-section p {
  margin: 0 0 8px 0;
  color: #fef2f2;
  font-size: 12px;
  line-height: 1.4;
}

.detail-section strong {
  color: #D4AF37;
  font-weight: 600;
}

.mini-timeline {
  margin-top: 8px;
}

.mini-timeline-item {
  display: flex;
  margin-bottom: 6px;
  padding: 4px 0;
  border-left: 2px solid #8C2F2F;
  padding-left: 8px;
}

.mini-time {
  color: #D4AF37;
  font-size: 10px;
  font-weight: bold;
  min-width: 60px;
  margin-right: 8px;
}

.mini-event {
  color: #fef2f2;
  font-size: 10px;
  line-height: 1.3;
}

.significance {
  color: #D4AF37 !important;
  font-style: italic;
  line-height: 1.5 !important;
  font-size: 12px !important;
}

.victory {
  color: #D4AF37 !important;
}

.defeat {
  color: #8C2F2F !important;
}

@keyframes gentlePulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* 图表容器 */
.battle-map {
  flex: 3;
  min-height: 400px;
}

.casualty-chart {
  flex: 2;
  min-height: 300px;
}

.map-container,
.chart-container {
  height: calc(100% - 60px);
  min-height: 250px;
  background: rgba(127, 29, 29, 0.4);
  border-radius: 6px;
  border: 2px solid rgba(251, 191, 36, 0.4);
  position: relative;
  box-shadow: inset 0 0 15px rgba(220, 38, 38, 0.2);
}



/* 胜负比例 */
.battle-ratio {
  min-height: 300px;
  flex: 0 0 auto;
}

/* 兵力对比 */
.force-stats {
  min-height: 280px;
  flex: 0 0 auto;
}

.force-comparison {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100% - 60px);
}

.force-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
  border: 1px solid rgba(255, 107, 107, 0.2);
  transition: all 0.3s ease;
}

.force-item:hover {
  background: rgba(255, 107, 107, 0.1);
  transform: scale(1.02);
}

.force-item h4 {
  margin: 0 0 15px 0;
  color: #ffffff;
  font-size: 16px;
  text-align: center;
  font-weight: bold;
}

.progress-container {
  position: relative;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 2s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.progress-text {
  display: block;
  text-align: center;
  color: #ffd93d;
  font-size: 14px;
  font-weight: bold;
  margin-top: 8px;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 排名区域 */
.battle-ranking {
  flex: 1;
}

.ranking-list {
  height: calc(100% - 60px);
  overflow-y: auto;
  padding-right: 5px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.ranking-item:hover {
  background: rgba(255, 107, 107, 0.1);
  border-left-color: #ff6b6b;
  transform: translateX(5px);
}

.rank-number {
  width: 30px;
  height: 30px;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #000;
  margin-right: 15px;
}

.rank-name {
  flex: 1;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.rank-score {
  color: #ffd93d;
  font-size: 14px;
  font-weight: bold;
}

/* 底部装饰 */
.bottom-section {
  padding: 30px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), rgba(220, 38, 38, 0.15), rgba(251, 191, 36, 0.1));
  border-top: 2px solid #D4AF37;
  margin-top: 30px;
}

.bottom-decoration {
  width: 50%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #D4AF37, #8C2F2F, #D4AF37, transparent);
  position: relative;
  border-radius: 2px;
}

.bottom-decoration::before {
  content: '◇';
  position: absolute;
  left: 50%;
  top: -8px;
  transform: translateX(-50%);
  color: #D4AF37;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
}

/* 滚动条样式 */
.timeline-content::-webkit-scrollbar,
.ranking-list::-webkit-scrollbar {
  width: 6px;
}

.timeline-content::-webkit-scrollbar-track,
.ranking-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.timeline-content::-webkit-scrollbar-thumb,
.ranking-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ff6b6b, #ffd93d);
  border-radius: 3px;
}

.timeline-content::-webkit-scrollbar-thumb:hover,
.ranking-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff6b6b, #ff6b6b);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
    padding: 15px;
  }
  
  .left-section,
  .right-section,
  .center-section {
    flex: none;
    min-width: auto;
    width: 100%;
  }
  
  .battle-overview {
    min-height: 200px;
  }
  
  .battle-map {
    min-height: 350px;
  }
  
  .casualty-chart {
    min-height: 250px;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 28px;
  }
  
  .top-section {
    padding: 20px 15px;
    flex-direction: column;
    gap: 15px;
  }
  
  .title-container {
    gap: 15px;
  }
  
  .title-decoration-left,
  .title-decoration-right {
    width: 60px;
  }
  
  .overview-stats {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .data-panel {
    padding: 15px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .number-display {
    font-size: 24px;
  }
  
  .main-content {
    padding: 10px;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 24px;
  }
  
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .top-decoration {
    width: 150px;
  }
  
  .title-decoration-left,
  .title-decoration-right {
    width: 40px;
  }
  
  .reset-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .battle-detail-content {
    max-height: 300px;
  }
  
  .detail-section h4 {
    font-size: 12px;
  }
  
  .detail-section p {
    font-size: 11px;
  }
  
  .timeline-content-item h4 {
    font-size: 13px;
  }
  
  .timeline-location,
  .timeline-outcome {
    font-size: 10px;
  }
}

/* 省份详情模态框样式 */
.province-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(145deg, #7f1d1d, #991b1b);
  border: 3px solid #D4AF37;
  border-radius: 20px;
  width: 85%;
  max-width: 1000px;
  height: 85%;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  position: relative;
  overflow: hidden;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 30%, rgba(251, 191, 36, 0.1) 70%);
  pointer-events: none;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 2px solid rgba(251, 191, 36, 0.3);
  background: rgba(220, 38, 38, 0.2);
  border-radius: 20px 20px 0 0;
}

.modal-header h3 {
  margin: 0;
  color: #D4AF37;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Noto Serif SC', serif;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

.close-btn {
  background: #8C2F2F;
  color: #fef2f2;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #b91c1c;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
}

.modal-body {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.province-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 10px;
}

.province-stats .stat-item {
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.2), rgba(220, 38, 38, 0.1));
  border: 2px solid #D4AF37;
  border-radius: 15px;
  padding: 25px 20px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.province-stats .stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.3);
  border-color: #8C2F2F;
}

.province-stats .stat-value {
  display: block;
  font-size: 32px;
  font-weight: bold;
  color: #D4AF37;
  margin-bottom: 8px;
  font-family: 'Noto Serif SC', serif;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
}

.province-stats .stat-label {
  color: #cccccc;
  font-size: 14px;
  font-weight: 500;
}

.province-description {
  background: rgba(127, 29, 29, 0.3);
  border-left: 4px solid #D4AF37;
  padding: 20px 25px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.province-description p {
  margin: 0;
  color: #fef2f2;
  line-height: 1.6;
  font-size: 16px;
  opacity: 0.9;
  font-style: italic;
}

.province-battles h4 {
  color: #D4AF37;
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: bold;
  font-family: 'Noto Serif SC', serif;
  display: flex;
  align-items: center;
  gap: 10px;
}

.province-battles h4::before {
  content: '⚔️';
  font-size: 20px;
}

.battle-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.battle-item {
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.15), rgba(220, 38, 38, 0.1));
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
}

.battle-item:hover {
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.25), rgba(220, 38, 38, 0.15));
  border-color: #D4AF37;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.3);
}

.battle-icon {
  font-size: 18px;
  font-weight: bold;
  margin-right: 15px;
}

.battle-name {
  color: #fef2f2;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}

.battle-action {
  color: #D4AF37;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.battle-item:hover .battle-action {
  opacity: 1;
}

/* 省份模态框响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    height: 90%;
  }
  
  .modal-header {
    padding: 20px 25px;
  }
  
  .modal-header h3 {
    font-size: 20px;
  }
  
  .modal-body {
    padding: 20px;
    gap: 20px;
  }
  
  .province-stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .province-stats .stat-value {
    font-size: 24px;
  }
  
  .province-stats .stat-label {
    font-size: 12px;
  }
  
  .battle-list {
    grid-template-columns: 1fr;
  }
  
  .province-description p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 98%;
    height: 95%;
    border-radius: 15px;
  }
  
  .modal-header {
    padding: 15px 20px;
  }
  
  .modal-header h3 {
    font-size: 18px;
  }
  
  .close-btn {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
  
  .modal-body {
    padding: 15px;
    gap: 15px;
  }
  
  .province-stats {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  
  .province-stats .stat-value {
    font-size: 20px;
  }
  
  .province-stats .stat-item {
    padding: 20px 15px;
  }
  
  .province-battles h4 {
    font-size: 16px;
  }
  
  .province-description p {
    font-size: 12px;
  }
  
  .battle-item {
    padding: 15px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .battle-name {
    font-size: 14px;
  }
  
  .battle-action {
    font-size: 12px;
    align-self: flex-end;
  }
}
[class*="bg-red-"] { background-color: #3A1620 !important; }
.bg-red-950, .bg-red-900 { background-color: #241016 !important; }
[class*="from-red-"] {
  --tw-gradient-from: #241016 !important;
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}
[class*="via-red-"] { --tw-gradient-stops: #241016, #3A1620, #2A1218 !important; }
[class*="to-red-"] {
  --tw-gradient-to: #2A1218 !important;
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}
[class*="border-red-"] { border-color: rgba(212,175,55,.22) !important; }
[class*="text-red-"] { color: #E8E3DA !important; }
.text-red-200, .text-red-300 { color: #9AA5AC !important; }
[class*="text-yellow-"] { color: #D4AF37 !important; }
.text-yellow-100, .text-yellow-200 { color: #E8E3DA !important; }
[class*="bg-yellow-"] { background-color: #D4AF37 !important; color: #241016 !important; }
[class*="bg-yellow-"] * { color: #241016 !important; }
[class*="border-yellow-"] { border-color: rgba(212,175,55,.4) !important; border-width: 1px !important; }
[class*="border-4"] { border-width: 1px !important; }
[class*="border-8"] { border-width: 2px !important; }
[class*="rounded-lg"], [class*="rounded-xl"] {
  box-shadow: 0 2px 14px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.03) !important;
}
h1, h2, h3 { letter-spacing: .08em; }
h2, h3 { color: #D4AF37 !important; }
</style> 
<style scoped>
div, section, header, main {
  background-color: #241016 !important;
  background-image: none !important;
}
[class*="text-yellow-"] { color: #D4AF37 !important; }
[class*="border-yellow-"], [class*="border-red-"] {
  border-color: rgba(212,175,55,.3) !important;
  border-width: 1px !important;
}
h1, h2, h3 { color: #D4AF37 !important; }
/* ===== 战役数据 · 高级深色主题 ===== */
.war-battle-dataviz {
  background: transparent !important;
  color: #E8E3DA !important;
}

/* 粒子：改成金色微尘，别太抢戏 */
.particle {
  background: rgba(212, 175, 55, 0.35) !important;
  box-shadow: 0 0 6px rgba(212, 175, 55, 0.5) !important;
}

/* 顶部装饰线 → 渐变金 */
.top-decoration {
  background: linear-gradient(90deg, transparent, rgba(212,175,55,.35), transparent) !important;
  background-image: linear-gradient(90deg, transparent, rgba(212,175,55,.35), transparent) !important;
  height: 1px !important;
}
.title-decoration-left,
.title-decoration-right {
  background: linear-gradient(90deg, transparent, #D4AF37) !important;
  background-image: linear-gradient(90deg, transparent, #D4AF37) !important;
  height: 1px !important;
}
.title-decoration-right {
  background: linear-gradient(90deg, #D4AF37, transparent) !important;
  background-image: linear-gradient(90deg, #D4AF37, transparent) !important;
}

/* 主标题 */
.main-title {
  letter-spacing: 0.14em;
}
.title-glow {
  color: #E8E3DA !important;
  text-shadow: 0 2px 26px rgba(0,0,0,.8), 0 0 42px rgba(212,175,55,.25) !important;
}

/* 返回按钮 */
.reset-btn {
  background: linear-gradient(135deg, #5A212C, #451A24) !important;
  color: #E8E3DA !important;
  border: 1px solid rgba(212,175,55,.35) !important;
  border-radius: 8px;
  transition: all .3s ease;
}
.reset-btn:hover {
  background: rgba(212,175,55,.12) !important;
  color: #D4AF37 !important;
  border-color: #D4AF37 !important;
}

/* ===== 面板统一：深灰底 + 金细边 ===== */
.data-panel {
  background: linear-gradient(160deg, #451A24 0%, #3A1620 100%) !important;
  border: 1px solid rgba(212,175,55,.2) !important;
  border-radius: 14px !important;
  box-shadow: 0 2px 16px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.03) !important;
  transition: border-color .35s ease, box-shadow .35s ease;
}
.data-panel:hover {
  border-color: rgba(212,175,55,.4) !important;
  box-shadow: 0 8px 30px -12px rgba(0,0,0,.85) !important;
}

/* 面板头：图标 + 标题 + 延伸金线 */
.panel-header {
  border-bottom: 1px solid rgba(212,175,55,.18) !important;
  padding-bottom: 10px;
  margin-bottom: 14px;
}
.header-icon {
  filter: saturate(.8);
}
.header-title {
  color: #D4AF37 !important;
  letter-spacing: 0.1em;
  font-weight: 500;
}
.header-line {
  background: linear-gradient(90deg, rgba(212,175,55,.5), transparent) !important;
  background-image: linear-gradient(90deg, rgba(212,175,55,.5), transparent) !important;
  height: 1px !important;
}

/* ===== 统计概览数字 ===== */
.number-display {
  color: #D4AF37 !important;
  text-shadow: 0 0 22px rgba(212,175,55,.3);
  letter-spacing: .02em;
}
.number-unit {
  color: #9AA5AC !important;
}
.overview-stats .stat-label {
  color: #9AA5AC !important;
}
.stat-item {
  background: rgba(26,34,40,.5) !important;
  border: 1px solid rgba(212,175,55,.12) !important;
  border-radius: 10px;
  padding: 10px !important;
}

/* ===== 时间线 ===== */
.timeline-item {
  background: rgba(26,34,40,.4) !important;
  border-left: 1px solid rgba(212,175,55,.25) !important;
  border-radius: 0 10px 10px 0;
  padding-left: 14px !important;
  transition: all .3s ease;
}
.timeline-item:hover {
  background: rgba(212,175,55,.07) !important;
  border-left-color: #D4AF37 !important;
}
.timeline-item.active {
  background: rgba(212,175,55,.1) !important;
  border-left-color: #D4AF37 !important;
}
.timeline-item.selected {
  border-left: 2px solid #D4AF37 !important;
  box-shadow: -4px 0 18px -6px rgba(212,175,55,.5);
}
.timeline-dot {
  background: #D4AF37 !important;
  border: 2px solid #241016 !important;
  box-shadow: 0 0 0 3px rgba(212,175,55,.12), 0 0 12px rgba(212,175,55,.5) !important;
}
.timeline-content-item h4 {
  color: #E8E3DA !important;
  letter-spacing: .05em;
}
.timeline-date {
  color: #D4AF37 !important;
  opacity: .85;
}
.timeline-location { color: #9AA5AC !important; }
.timeline-desc { color: #8B959C !important; }
.timeline-outcome.victory { color: #D4AF37 !important; }
.timeline-outcome.defeat { color: #B8606B !important; }

/* ===== 图表容器：给画布一个深色底座 ===== */
.chart-container, .map-container {
  background: rgba(14,20,24,.5) !important;
  border-radius: 10px;
}

/* ===== 兵力对比进度条 ===== */
.force-item h4 {
  color: #E8E3DA !important;
}
.progress-container {
  background: #241016 !important;
  border: 1px solid rgba(212,175,55,.18) !important;
  border-radius: 999px;
  overflow: hidden;
}
.progress-bar {
  background: transparent !important;
}
.progress-fill {
  background-image: linear-gradient(90deg, #8C6B2F, #D4AF37) !important;
  box-shadow: 0 0 14px rgba(212,175,55,.4) !important;
  border-radius: 999px;
}
.progress-text {
  color: #C3CAD0 !important;
}

/* ===== 影响力排名 ===== */
.ranking-item {
  background: rgba(26,34,40,.5) !important;
  border: 1px solid rgba(212,175,55,.12) !important;
  border-radius: 10px;
  transition: all .3s ease;
}
.ranking-item:hover {
  background: rgba(212,175,55,.08) !important;
  border-color: rgba(212,175,55,.35) !important;
}
.rank-number {
  background: linear-gradient(135deg, #5A212C, #451A24) !important;
  color: #D4AF37 !important;
  border: 1px solid rgba(212,175,55,.35) !important;
  border-radius: 8px;
}
.rank-name { color: #E8E3DA !important; }
.rank-score { color: #9AA5AC !important; }

/* ===== 战役详情面板 ===== */
.detail-section h4 {
  color: #D4AF37 !important;
  letter-spacing: .08em;
  border-left: 2px solid rgba(212,175,55,.5);
  padding-left: 8px;
}
.detail-section p {
  color: #C3CAD0 !important;
}
.detail-section strong { color: #9AA5AC !important; }
.significance {
  background: rgba(212,175,55,.06) !important;
  border-left: 2px solid #D4AF37 !important;
  border-radius: 0 8px 8px 0;
  padding: 10px 14px !important;
}
.mini-timeline {
  border-left: 1px solid rgba(212,175,55,.3) !important;
}
.mini-time { color: #D4AF37 !important; }
.mini-event { color: #C3CAD0 !important; }

/* ===== 省份详情弹窗 ===== */
.province-detail-modal {
  background: rgba(8,12,15,.85) !important;
  backdrop-filter: blur(6px);
}
.modal-content {
  background: linear-gradient(160deg, #451A24 0%, #2A1218 100%) !important;
  border: 1px solid rgba(212,175,55,.3) !important;
  box-shadow: 0 30px 80px -20px rgba(0,0,0,.9) !important;
  border-radius: 14px !important;
}
.modal-header {
  border-bottom: 1px solid rgba(212,175,55,.2) !important;
}
.modal-header h3 { color: #D4AF37 !important; letter-spacing: .1em; }
.close-btn { color: #9AA5AC !important; }
.close-btn:hover { color: #D4AF37 !important; }
.province-stats .stat-value { color: #D4AF37 !important; }
.province-stats .stat-label { color: #9AA5AC !important; }
.province-description p { color: #C3CAD0 !important; }
.province-battles h4 { color: #D4AF37 !important; }
.battle-item {
  background: rgba(26,34,40,.6) !important;
  border: 1px solid rgba(212,175,55,.15) !important;
  border-radius: 10px;
  transition: all .3s ease;
}
.battle-item:hover {
  background: rgba(212,175,55,.08) !important;
  border-color: rgba(212,175,55,.4) !important;
}
.battle-name { color: #E8E3DA !important; }
.battle-action { color: #D4AF37 !important; }

/* 底部装饰 */
.bottom-decoration {
  background: linear-gradient(90deg, transparent, rgba(212,175,55,.3), transparent) !important;
  background-image: linear-gradient(90deg, transparent, rgba(212,175,55,.3), transparent) !important;
  height: 1px !important;
}
[class*="border-pink-"],[class*="border-fuchsia-"],[class*="border-purple-"],[class*="border-rose-"],[class*="border-indigo-"]{
  border-color:rgba(212,175,55,.35)!important;border-width:1px!important}
[class*="shadow-pink-"],[class*="shadow-fuchsia-"],[class*="shadow-purple-"],[class*="shadow-rose-"],[class*="shadow-indigo-"]{
  box-shadow:0 2px 14px rgba(0,0,0,.5)!important}
[class*="text-pink-"],[class*="text-fuchsia-"],[class*="text-purple-"],[class*="text-indigo-"]{
  color:#C3CAD0!important}
.data-panel{
  box-shadow:0 2px 16px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.03)!important;border:1px solid rgba(212,175,55,.22)!important}
.stat-item,.ranking-item,.timeline-item{
  background:rgba(58,22,32,.6)!important;border:1px solid rgba(212,175,55,.18)!important}
</style>