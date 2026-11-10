<template>
  <div class="echarts-china-map">
    <!-- 历史背景装饰 -->
    <div class="historical-background">
      <div class="background-pattern"></div>
      <div class="floating-elements">
        <div
          class="floating-element"
          v-for="n in 12"
          :key="n"
          :style="getFloatingStyle(n)"
        >
          {{ getFloatingIcon(n) }}
        </div>
      </div>
      <div class="war-clouds">
        <div
          class="cloud"
          v-for="n in 6"
          :key="n"
          :style="getCloudStyle(n)"
        ></div>
      </div>
    </div>

    <!-- 地图标题 -->
    <div class="map-header">
      <h1 class="map-title">
        <span class="title-decoration">⚔️</span>
        <span class="title-text">中国抗战历史地图</span>
        <span class="title-decoration">🇨🇳</span>
      </h1>
      <p class="map-subtitle">
        <span class="subtitle-icon">🏛️</span>
        点击各省份查看详细的抗战历史
        <span class="subtitle-divider">|</span>
        <span class="subtitle-icon">🔍</span>
        支持缩放和拖拽操作
      </p>
      <div class="historical-quote">
        <span class="quote-mark">"</span>
        中华民族到了最危险的时候，每个人被迫着发出最后的吼声！
        <span class="quote-mark">"</span>
      </div>

      <!-- 年份选择器 -->
      <div class="year-selector">
        <label for="year-select" class="year-label">选择年份：</label>
        <select
          id="year-select"
          v-model="selectedYear"
          @change="updateMapByYear"
          class="year-select"
        >
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}年
          </option>
        </select>
        <div class="year-info">
          <span class="current-year">{{ selectedYear }}年控制态势</span>
        </div>
      </div>
    </div>

    <!-- 地图容器 -->
    <div class="map-container">
      <div id="china-map" class="china-map-echarts"></div>
    </div>

    <!-- 图例 -->
    <div class="map-legend">
      <h3 class="legend-title">控制态势图例</h3>
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-color japanese-occupied"></div>
          <span>日占区</span>
        </div>
        <div class="legend-item">
          <div class="legend-color puppet-regime"></div>
          <span>伪政权</span>
        </div>
        <div class="legend-item">
          <div class="legend-color contested"></div>
          <span>争夺区</span>
        </div>
        <div class="legend-item">
          <div class="legend-color guerrilla"></div>
          <span>游击区</span>
        </div>
        <div class="legend-item">
          <div class="legend-color rental-area"></div>
          <span>租界</span>
        </div>
        <div class="legend-item">
          <div class="legend-color chinese-control"></div>
          <span>中方控制</span>
        </div>
      </div>
    </div>

    <!-- 省份信息面板 -->
    <div class="province-info-panel" v-if="selectedProvince">
      <div class="panel-header">
        <h3 class="panel-title">{{ selectedProvince.name }}</h3>
        <button @click="closePanel" class="close-btn">×</button>
      </div>
      <div class="panel-content">
        <div class="province-status">
          <span
            class="status-badge"
            :class="getStatusClass(selectedProvince.status)"
          >
            {{ selectedProvince.status }}
          </span>
        </div>
        <p class="province-summary">{{ selectedProvince.summary }}</p>
        <div class="panel-actions">
          <button @click="viewDetails" class="detail-btn">查看详细历史</button>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="statistics-panel">
      <h3 class="stats-title">抗战统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ statistics.totalProvinces }}</div>
          <div class="stat-label">省份/直辖市</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ statistics.totalEvents }}</div>
          <div class="stat-label">重大事件</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">
            3120万+
          </div>
          <div class="stat-label">平民伤亡</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">
            1380万+
          </div>
          <div class="stat-label">军人伤亡</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { loadJsonResource } from '@/utils/resourcePath'
import {
  getAllProvinces,
  getBattleStatistics,
  getProvinceWarHistoryByName,
  provinceNameMap
} from '../data/allProvinceWarHistory.js'
import controlData from '../data/control_data.json'

const router = useRouter()

// 响应式数据
const selectedProvince = ref(null)
const statistics = ref({
  totalProvinces: 0,
  totalEvents: 0,
  totalCasualties: { civilian: 0, military: 0 }
})

// ECharts实例
let chart = null

// 年份选择相关
const selectedYear = ref('1937') // 默认选择1937年（全面抗战开始）
const availableYears = ref(Object.keys(controlData).sort())

// 组件挂载
onMounted(async () => {
  initializeData()
  await createMap()
})

// 组件卸载
onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
})

// 初始化数据
const initializeData = () => {
  statistics.value = getBattleStatistics()
}

// 创建地图
const createMap = async () => {
  try {
    // 加载中国地图GeoJSON数据
    const geoJson = await loadJsonResource('/data/china.json')

    // 注册地图
    echarts.registerMap('China', geoJson)

    // 初始化ECharts实例
    const container = document.getElementById('china-map')
    chart = echarts.init(container)

    // 准备省份数据（基于选择的年份）
    const provinces = getAllProvinces()
    const yearData = controlData[selectedYear.value]
    console.log('当前年份数据:', selectedYear.value, yearData)

    // 获取地图中的实际省份名称
    const mapProvinces = echarts
      .getMap('China')
      .geoJson.features.map(feature => feature.properties.name)
    console.log('地图中的省份名称列表:', mapProvinces)

    const mapData = mapProvinces.map(mapProvinceName => {
      // 找到对应的省份数据
      const normalizedMapName = normalizeProvinceName(mapProvinceName)
      const controlStatus = yearData[normalizedMapName] || '中方控制'
      const value = getControlValue(controlStatus)

      // 根据控制状态设置颜色
      const colors = [
        '#22c55e',
        '#8b5cf6',
        '#eab308',
        '#f97316',
        '#ef4444',
        '#dc2626'
      ]
      const itemStyle = {
        areaColor: colors[value] || '#e5e7eb'
      }

      // 找到对应的省份详细信息
      const provinceInfo = provinces.find(
        p => normalizeProvinceName(p.name) === normalizedMapName
      )

      console.log(
        `地图省份: ${mapProvinceName} -> 标准化: ${normalizedMapName} -> 控制状态: ${controlStatus} -> 数值: ${value} -> 颜色: ${itemStyle.areaColor}`
      )

      return {
        name: mapProvinceName, // 使用地图中的实际名称
        value: value,
        controlStatus: controlStatus,
        summary: provinceInfo?.summary || '暂无详细信息',
        itemStyle: itemStyle,
        originalData: {
          name: mapProvinceName,
          controlStatus: controlStatus,
          ...(provinceInfo || {})
        }
      }
    })

    console.log('地图数据:', mapData)

    // 配置选项
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          // 获取省份名称和控制状态
          const provinceName = params.data?.name || params.name
          const controlStatus = params.data?.controlStatus || '未知'

          // 获取控制状态对应的颜色
          const statusColor = getControlColor(controlStatus)

          return `
            <div style="padding: 12px; max-width: 250px;">
              <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; font-weight: bold;">${provinceName}</h4>
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">
                ${selectedYear.value}年控制状态:
                <span style="color: ${statusColor}; font-weight: 500;">${controlStatus}</span>
              </p>
              <p style="margin: 0; color: #10b981; font-size: 13px; font-weight: 500;">🖱️ 点击查看详细抗战历史</p>
            </div>
          `
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#374151'
        }
      },
      visualMap: {
        min: 0,
        max: 5,
        left: 'left',
        top: 'bottom',
        text: ['日占区', '中方控制'],
        calculable: false,
        inRange: {
          color: [
            '#22c55e',
            '#8b5cf6',
            '#eab308',
            '#f97316',
            '#ef4444',
            '#dc2626'
          ]
        },
        textStyle: {
          color: '#374151'
        }
      },
      series: [
        {
          name: '中国抗战历史',
          type: 'map',
          map: 'China',
          roam: true,
          zoom: 2.2,
          center: [104, 35],
          scaleLimit: {
            min: 1.2,
            max: 5
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            },
            itemStyle: {
              areaColor: '#fbbf24',
              borderColor: '#f59e0b',
              borderWidth: 2
            }
          },
          select: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            },
            itemStyle: {
              areaColor: '#3b82f6',
              borderColor: '#1d4ed8',
              borderWidth: 2
            }
          },
          itemStyle: {
            borderColor: '#ffffff',
            borderWidth: 1
          },
          label: {
            show: true,
            fontSize: 14,
            color: '#1e293b',
            fontWeight: '500'
          },
          data: mapData
        }
      ]
    }

    // 设置配置
    chart.setOption(option)

    // 添加点击事件
    chart.on('click', function (params) {
      console.log('点击的省份完整信息:', params) // 调试信息
      console.log('params.name:', params.name)
      console.log('params.data:', params.data)

      let provinceName = null

      if (params.data && params.data.originalData) {
        selectProvince(params.data.originalData)
        provinceName = params.data.originalData.name
        console.log('使用 originalData 中的名称:', provinceName)
      } else if (params.name) {
        // 标准化省份名称
        console.log('开始标准化省份名称，原始名称:', params.name)
        provinceName = normalizeProvinceName(params.name)
        console.log('标准化后的名称:', provinceName)

        // 验证省份数据是否存在
        const provinceData = getProvinceWarHistoryByName(provinceName)
        console.log('查找到的省份数据:', provinceData)

        if (provinceData) {
          selectProvince(provinceData)
          console.log('成功设置省份数据')
        } else {
          console.warn('未找到省份数据，查找的名称:', provinceName)
          console.log('可用的省份名称:', Object.values(provinceNameMap))
        }
      }

      if (provinceName) {
        console.log('准备跳转到省份:', provinceName)
        router.push(`/province/name/${provinceName}`)
      } else {
        console.error('无法确定省份名称')
      }
    })

    // 响应式调整
    window.addEventListener('resize', () => {
      if (chart) {
        chart.resize()
      }
    })
  } catch (error) {
    console.error('地图加载失败:', error)

    // 显示错误信息
    const container = document.getElementById('china-map')
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ef4444; font-size: 18px;">
        地图加载失败，请刷新页面重试
      </div>
    `
  }
}

// 省份名称标准化映射
const provinceNameMapping = {
  北京市: '北京',
  天津市: '天津',
  上海市: '上海',
  重庆市: '重庆',
  河北省: '河北',
  山西省: '山西',
  内蒙古自治区: '内蒙古',
  辽宁省: '辽宁',
  吉林省: '吉林',
  黑龙江省: '黑龙江',
  江苏省: '江苏',
  浙江省: '浙江',
  安徽省: '安徽',
  福建省: '福建',
  江西省: '江西',
  山东省: '山东',
  河南省: '河南',
  湖北省: '湖北',
  湖南省: '湖南',
  广东省: '广东',
  广西壮族自治区: '广西',
  海南省: '海南',
  四川省: '四川',
  贵州省: '贵州',
  云南省: '云南',
  西藏自治区: '西藏',
  陕西省: '陕西',
  甘肃省: '甘肃',
  青海省: '青海',
  宁夏回族自治区: '宁夏',
  新疆维吾尔自治区: '新疆'
}

// 标准化省份名称
const normalizeProvinceName = name => {
  // 直接匹配
  if (provinceNameMapping[name]) {
    return provinceNameMapping[name]
  }

  // 移除常见后缀
  const cleanName = name.replace(
    /(省|市|自治区|特别行政区|壮族|回族|维吾尔|藏族).*$/g,
    ''
  )

  // 特殊处理
  if (cleanName === '内蒙古') return '内蒙古'
  if (cleanName === '广西') return '广西'
  if (cleanName === '西藏') return '西藏'
  if (cleanName === '宁夏') return '宁夏'
  if (cleanName === '新疆') return '新疆'

  return cleanName
}

// 根据控制状态获取数值（用于颜色映射）
const getControlValue = status => {
  switch (status) {
    case '日占区':
      return 5
    case '伪政权':
      return 4
    case '争夺区':
      return 3
    case '游击区':
      return 2
    case '租界':
      return 1
    case '中方控制':
      return 0
    default:
      return 0
  }
}

// 根据控制状态获取颜色
const getControlColor = status => {
  switch (status) {
    case '日占区':
      return '#dc2626' // 深红色 - 日军直接占领
    case '伪政权':
      return '#ef4444' // 红色 - 傀儡政权
    case '争夺区':
      return '#f97316' // 橙色 - 双方争夺
    case '游击区':
      return '#eab308' // 黄色 - 游击根据地
    case '租界':
      return '#8b5cf6' // 紫色 - 外国租界
    case '中方控制':
      return '#22c55e' // 绿色 - 中方控制
    default:
      return '#94a3b8' // 灰色 - 未知状态
  }
}

// 获取状态样式类
const getStatusClass = status => {
  if (status.includes('沦陷')) return 'status-occupied'
  if (status.includes('战场')) return 'status-battlefield'
  if (status.includes('根据地')) return 'status-base'
  if (status.includes('后方') || status.includes('首都')) return 'status-rear'
  return 'status-default'
}

// 选择省份
const selectProvince = province => {
  selectedProvince.value = province
}

// 关闭面板
const closePanel = () => {
  selectedProvince.value = null
}

// 查看详情
const viewDetails = () => {
  if (selectedProvince.value) {
    router.push(`/province/name/${selectedProvince.value.name}`)
  }
}

// 获取浮动元素样式
const getFloatingStyle = index => {
  const positions = [
    { top: '10%', left: '5%', animationDelay: '0s' },
    { top: '15%', right: '8%', animationDelay: '2s' },
    { top: '25%', left: '12%', animationDelay: '4s' },
    { top: '35%', right: '15%', animationDelay: '1s' },
    { top: '45%', left: '8%', animationDelay: '3s' },
    { top: '55%', right: '12%', animationDelay: '5s' },
    { top: '65%', left: '18%', animationDelay: '2.5s' },
    { top: '75%', right: '20%', animationDelay: '4.5s' },
    { top: '20%', left: '85%', animationDelay: '1.5s' },
    { top: '40%', left: '90%', animationDelay: '3.5s' },
    { top: '60%', left: '88%', animationDelay: '0.5s' },
    { top: '80%', left: '92%', animationDelay: '2.8s' }
  ]
  return positions[index - 1] || positions[0]
}

// 获取浮动图标
const getFloatingIcon = index => {
  const icons = [
    '🏛️',
    '⚔️',
    '🛡️',
    '🎖️',
    '📜',
    '🕊️',
    '🔥',
    '💪',
    '🌟',
    '🏺',
    '📯',
    '⛩️'
  ]
  return icons[index - 1] || icons[0]
}

// 获取云朵样式
const getCloudStyle = index => {
  const positions = [
    { top: '5%', left: '20%', animationDelay: '0s', animationDuration: '20s' },
    { top: '8%', left: '60%', animationDelay: '5s', animationDuration: '25s' },
    {
      top: '12%',
      left: '80%',
      animationDelay: '10s',
      animationDuration: '30s'
    },
    {
      top: '15%',
      left: '40%',
      animationDelay: '15s',
      animationDuration: '22s'
    },
    { top: '18%', left: '10%', animationDelay: '8s', animationDuration: '28s' },
    { top: '22%', left: '70%', animationDelay: '12s', animationDuration: '26s' }
  ]
  return positions[index - 1] || positions[0]
}

// 根据年份更新地图
const updateMapByYear = () => {
  console.log('更新地图年份:', selectedYear.value)
  if (!chart) {
    console.error('图表实例不存在')
    return
  }

  const yearData = controlData[selectedYear.value]
  if (!yearData) {
    console.error('年份数据不存在:', selectedYear.value)
    return
  }

  console.log('年份数据:', yearData)

  // 获取省份数据并添加控制状态信息
  const provinces = getAllProvinces()

  // 获取地图中的实际省份名称
  const mapProvinces = echarts
    .getMap('China')
    .geoJson.features.map(feature => feature.properties.name)

  const mapData = mapProvinces.map(mapProvinceName => {
    // 找到对应的省份数据
    const normalizedMapName = normalizeProvinceName(mapProvinceName)
    const controlStatus = yearData[normalizedMapName] || '中方控制'
    const value = getControlValue(controlStatus)

    // 根据控制状态设置颜色
    const colors = [
      '#22c55e',
      '#8b5cf6',
      '#eab308',
      '#f97316',
      '#ef4444',
      '#dc2626'
    ]
    const itemStyle = {
      areaColor: colors[value] || '#e5e7eb'
    }

    // 找到对应的省份详细信息
    const provinceInfo = provinces.find(
      p => normalizeProvinceName(p.name) === normalizedMapName
    )

    return {
      name: mapProvinceName, // 使用地图中的实际名称
      value: value,
      controlStatus: controlStatus,
      itemStyle: itemStyle,
      originalData: {
        name: mapProvinceName,
        controlStatus: controlStatus,
        ...(provinceInfo || {})
      }
    }
  })

  console.log('更新后的地图数据:', mapData)

  // 更新地图数据
  const option = chart.getOption()
  option.series[0].data = mapData

  // 更新visualMap配置
  option.visualMap = {
    min: 0,
    max: 5,
    left: 'left',
    top: 'bottom',
    text: ['日占区', '中方控制'],
    inRange: {
      color: ['#22c55e', '#8b5cf6', '#eab308', '#f97316', '#ef4444', '#dc2626']
    },
    textStyle: {
      color: '#374151'
    }
  }

  chart.setOption(option, true)
  console.log('地图更新完成')
}
</script>

<style scoped>
.echarts-china-map {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(
    135deg,
    #7f1d1d 0%,
    #991b1b 25%,
    #dc2626 50%,
    #991b1b 75%,
    #7f1d1d 100%
  );
  border-radius: 12px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 历史背景装饰 */
.historical-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 20% 50%,
      rgba(251, 191, 36, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(220, 38, 38, 0.2) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 80%,
      rgba(185, 28, 28, 0.15) 0%,
      transparent 50%
    ),
    linear-gradient(
      45deg,
      transparent 40%,
      rgba(251, 191, 36, 0.03) 50%,
      transparent 60%
    );
  background-size: 800px 800px, 600px 600px, 700px 700px, 200px 200px;
  animation: backgroundShift 30s ease-in-out infinite;
}

@keyframes backgroundShift {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-20px, -10px) rotate(1deg);
  }
  50% {
    transform: translate(10px, -20px) rotate(-1deg);
  }
  75% {
    transform: translate(-10px, 10px) rotate(0.5deg);
  }
}

/* 浮动历史元素 */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.floating-element {
  position: absolute;
  font-size: 24px;
  opacity: 0.4;
  animation: float 8s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.4));
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) rotate(-3deg);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-15px) rotate(2deg);
    opacity: 0.6;
  }
}

/* 战争云朵效果 */
.war-clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
}

.cloud {
  position: absolute;
  width: 100px;
  height: 40px;
  background: rgba(127, 29, 29, 0.15);
  border-radius: 40px;
  animation: cloudMove 20s linear infinite;
}

.cloud::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 20px;
  width: 60px;
  height: 60px;
  background: rgba(127, 29, 29, 0.12);
  border-radius: 50%;
}

.cloud::after {
  content: '';
  position: absolute;
  top: -10px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(127, 29, 29, 0.08);
  border-radius: 50%;
}

@keyframes cloudMove {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
}

.map-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 10;
  background: linear-gradient(145deg, rgba(127, 29, 29, 0.8), rgba(153, 27, 27, 0.6));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  border: 3px solid #fbbf24;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(251, 191, 36, 0.1);
}

.map-title {
  font-size: 36px;
  font-weight: bold;
  color: #fef2f2;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  animation: titleGlow 3s ease-in-out infinite alternate;
  font-family: 'Noto Serif SC', serif;
}

.title-decoration {
  display: inline-block;
  animation: decorationPulse 2s ease-in-out infinite;
  margin: 0 15px;
}

.title-text {
  background: linear-gradient(45deg, #fbbf24, #dc2626, #fbbf24);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}

@keyframes titleGlow {
  0% {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7), 0 0 20px rgba(251, 191, 36, 0.4);
  }
  100% {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7), 0 0 30px rgba(251, 191, 36, 0.7);
  }
}

@keyframes decorationPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.map-subtitle {
  font-size: 16px;
  color: #fef2f2;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  font-family: 'Noto Serif SC', serif;
}

.subtitle-icon {
  color: #fbbf24;
  margin: 0 8px;
  animation: iconBounce 2s ease-in-out infinite;
}

.subtitle-divider {
  color: #94a3b8;
  margin: 0 10px;
}

@keyframes iconBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.historical-quote {
  font-size: 18px;
  color: #fbbf24;
  font-style: italic;
  margin-top: 20px;
  padding: 15px;
  background: rgba(127, 29, 29, 0.3);
  border-radius: 8px;
  border-left: 4px solid #fbbf24;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  animation: quoteGlow 4s ease-in-out infinite alternate;
  font-family: 'Noto Serif SC', serif;
}

.quote-mark {
  font-size: 24px;
  font-weight: bold;
  color: #dc2626;
}

@keyframes quoteGlow {
  0% {
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
  }
  100% {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
  }
}

.year-selector {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.year-label {
  font-size: 16px;
  font-weight: 500;
  color: #fbbf24;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  font-family: 'Noto Serif SC', serif;
}

.year-select {
  padding: 10px 20px;
  border: 2px solid #fbbf24;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #7f1d1d;
  background: rgba(254, 242, 242, 0.95);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
  font-family: 'Noto Serif SC', serif;
}

.year-select:hover {
  border-color: #ff6b6b;
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
}

.year-select:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3);
}

.year-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-year {
  padding: 8px 16px;
  background: linear-gradient(135deg, #ff6b6b, #ffd700);
  color: #1a1a2e;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-shadow: none;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  animation: yearPulse 2s ease-in-out infinite;
}

@keyframes yearPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.map-title {
  font-size: 32px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 10px;
}

.map-subtitle {
  font-size: 16px;
  color: #64748b;
}

.map-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
  overflow: hidden;
  position: relative;
  z-index: 5;
  border: 2px solid rgba(255, 215, 0, 0.3);
  animation: containerGlow 4s ease-in-out infinite alternate;
}

@keyframes containerGlow {
  0% {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.3);
  }
  100% {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.4);
    border-color: rgba(255, 215, 0, 0.5);
  }
}

.china-map-echarts {
  width: 100%;
  height: 800px;
  min-height: 700px;
}

.map-legend {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 5;
}

.legend-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #ffffff;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.legend-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: colorPulse 3s ease-in-out infinite;
}

@keyframes colorPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.legend-color.japanese-occupied {
  background: #ef4444;
}
.legend-color.puppet-regime {
  background: #f97316;
}
.legend-color.contested {
  background: #eab308;
}
.legend-color.guerrilla {
  background: #22c55e;
}
.legend-color.rental-area {
  background: #8b5cf6;
}
.legend-color.chinese-control {
  background: #3b82f6;
}

.province-info-panel {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-title {
  font-size: 20px;
  font-weight: bold;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.panel-content {
  padding: 20px;
}

.province-status {
  margin-bottom: 15px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.status-occupied {
  background: #ef4444;
}
.status-battlefield {
  background: #f59e0b;
}
.status-base {
  background: #10b981;
}
.status-rear {
  background: #3b82f6;
}
.status-default {
  background: #6b7280;
}

.province-summary {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 14px;
}

.panel-actions {
  text-align: center;
}

.detail-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.detail-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.statistics-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 5;
}

.stats-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 215, 0, 0.3);
  animation: statGlow 3s ease-in-out infinite alternate;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2);
}

@keyframes statGlow {
  0% {
    border-color: rgba(255, 215, 0, 0.3);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.1);
  }
  100% {
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.2);
  }
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 8px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  animation: numberPulse 2s ease-in-out infinite;
}

@keyframes numberPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.stat-label {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .echarts-china-map {
    padding: 15px;
  }

  .map-title {
    font-size: 24px;
  }

  .china-map-echarts {
    height: 600px;
    min-height: 500px;
  }

  .province-info-panel {
    position: fixed;
    top: auto;
    bottom: 20px;
    right: 20px;
    left: 20px;
    width: auto;
    transform: none;
  }

  .legend-items {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.china-map-page, .map-container, .map-header {
  background: transparent !important;
}
.map-header h1, .map-title {
  color: #D4AF37 !important;
  letter-spacing: 0.1em;
}
[class*="bg-red-"] { background-color: #3A1620 !important; }
[class*="from-red-"] {
  --tw-gradient-from: #241016 !important;
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}
[class*="to-red-"] {
  --tw-gradient-to: #2A1218 !important;
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}
[class*="text-red-"] { color: #E8E3DA !important; }
[class*="text-yellow-"] { color: #D4AF37 !important; }
[class*="border-yellow-"] { border-color: rgba(212,175,55,.4) !important; border-width: 1px !important; }
[class*="border-4"] { border-width: 1px !important; }
button {
  background: #451A24 !important;
  color: #E8E3DA !important;
  border: 1px solid rgba(212,175,55,.3) !important;
}
.echarts-china-map {
  background: transparent !important;
  color: #E8E3DA !important;
}

/* 顶部标题 */
.map-title, .china-map-title {
  color: #D4AF37 !important;
  letter-spacing: 0.12em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.7);
}
.map-subtitle {
  color: #9AA5AC !important;
}
.historical-quote, .quote-text {
  color: #E8E3DA !important;
  background: rgba(212, 175, 55, 0.06) !important;
  border-left: 2px solid #D4AF37 !important;
}

/* 年份选择器 */
.year-select, select {
  background: #3A1620 !important;
  color: #E8E3DA !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  border-radius: 8px;
}
.control-btn, .year-btn {
  background: linear-gradient(135deg, #5A212C, #451A24) !important;
  color: #E8E3DA !important;
  border: 1px solid rgba(212, 175, 55, 0.35) !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.control-btn:hover {
  background: rgba(212, 175, 55, 0.12) !important;
  color: #D4AF37 !important;
  border-color: #D4AF37 !important;
}

/* 地图容器 */
.china-map-echarts, .map-container {
  background: #241016 !important;
  border: 1px solid rgba(212, 175, 55, 0.22) !important;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.6) !important;
}

/* 图例（保留颜色语义，只加细边框让它精致） */
.legend-item {
  border-radius: 6px;
  transition: all 0.25s ease;
}
.legend-color {
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 3px;
}
.legend-label, .legend-title {
  color: #9AA5AC !important;
}
.legend-panel {
  background: rgba(26, 34, 40, 0.7) !important;
  border: 1px solid rgba(212, 175, 55, 0.18) !important;
  border-radius: 12px;
}

/* 省份信息面板 */
.province-info-panel {
  background: linear-gradient(160deg, #451A24 0%, #2A1218 100%) !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  box-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.9) !important;
  color: #E8E3DA !important;
}
.province-name {
  color: #D4AF37 !important;
}
.province-summary {
  color: #C3CAD0 !important;
}
.detail-btn {
  background: linear-gradient(135deg, #5A212C, #451A24) !important;
  color: #E8E3DA !important;
  border: 1px solid rgba(212, 175, 55, 0.35) !important;
  border-radius: 8px;
}
.detail-btn:hover {
  background: rgba(212, 175, 55, 0.12) !important;
  color: #D4AF37 !important;
  border-color: #D4AF37 !important;
}

/* 统计面板 */
.statistics-panel {
  background: rgba(26, 34, 40, 0.5) !important;
  border: 1px solid rgba(212, 175, 55, 0.18) !important;
  border-radius: 14px;
}
.stats-title {
  color: #D4AF37 !important;
  letter-spacing: 0.1em;
}
.stat-item {
  background: linear-gradient(160deg, #451A24 0%, #3A1620 100%) !important;
  border: 1px solid rgba(212, 175, 55, 0.2) !important;
  border-radius: 12px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.5) !important;
}
.stat-number {
  color: #D4AF37 !important;
}
.stat-label {
  color: #9AA5AC !important;
}

/* 兜底：扫掉这页残留的红 */
.echarts-china-map [class*="bg-red-"] {
  background-color: #3A1620 !important;
}
.echarts-china-map [class*="from-red-"] {
  --tw-gradient-from: #241016 !important;
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}
.echarts-china-map [class*="to-red-"] {
  --tw-gradient-to: #2A1218 !important;
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}
.echarts-china-map [class*="border-red-"] {
  border-color: rgba(212, 175, 55, 0.22) !important;
}
.echarts-china-map [class*="text-red-"] {
  color: #E8E3DA !important;
}
.echarts-china-map [class*="text-yellow-"] {
  color: #D4AF37 !important;
}
.echarts-china-map [class*="border-yellow-"] {
  border-color: rgba(212, 175, 55, 0.4) !important;
  border-width: 1px !important;
}
.echarts-china-map [class*="border-4"] {
  border-width: 1px !important;
}
/* ===== 历史地图 · 深色主题 ===== */
.echarts-china-map {
  background: transparent !important;
  color: #E8E3DA !important;
}

/* 背景装饰：金色调淡 */
.background-pattern { opacity: 0.35 !important; }
.floating-element { opacity: 0.18 !important; filter: sepia(0.6); }
.cloud { opacity: 0.1 !important; }

/* 标题 */
.map-title {
  color: #D4AF37 !important;
  letter-spacing: 0.14em;
  text-shadow: 0 2px 24px rgba(0,0,0,.7), 0 0 40px rgba(212,175,55,.2) !important;
}
.title-decoration { opacity: 0.8; }
.map-subtitle { color: #9AA5AC !important; letter-spacing: 0.06em; }
.subtitle-icon { opacity: 0.7; }
.subtitle-divider { color: rgba(212,175,55,.4) !important; }

/* 引言 */
.historical-quote {
  background: rgba(212, 175, 55, 0.06) !important;
  border: 1px solid rgba(212, 175, 55, 0.22) !important;
  border-radius: 12px;
  color: #E8E3DA !important;
  padding: 14px 26px;
  display: inline-block;
  font-style: normal;
}
.quote-mark { color: #D4AF37 !important; opacity: 0.7; }

/* 年份选择器 */
.year-label { color: #9AA5AC !important; }
.year-select {
  background: #3A1620 !important;
  background-image: none !important;
  color: #E8E3DA !important;
  border: 1px solid rgba(212,175,55,.35) !important;
  border-radius: 8px;
  padding: 8px 14px;
}
.year-select:focus { border-color: #D4AF37 !important; outline: none; }
.year-info {
  background: linear-gradient(135deg, #5A212C, #451A24) !important;
  border: 1px solid rgba(212,175,55,.35) !important;
  border-radius: 8px;
  padding: 8px 16px;
}
.current-year { color: #D4AF37 !important; letter-spacing: .08em; }

/* 地图容器 */
.map-container {
  background: rgba(14,20,24,.55) !important;
  border: 1px solid rgba(212,175,55,.22) !important;
  border-radius: 14px;
  box-shadow: 0 4px 30px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.03) !important;
  overflow: hidden;
}
.china-map-echarts { background: transparent !important; }

/* 图例 */
.map-legend {
  background: rgba(26,34,40,.7) !important;
  border: 1px solid rgba(212,175,55,.18) !important;
  border-radius: 12px;
  padding: 14px 18px !important;
}
.legend-title {
  color: #D4AF37 !important;
  letter-spacing: .1em;
  font-size: 14px !important;
}
.legend-item span { color: #C3CAD0 !important; }
.legend-color {
  border: 1px solid rgba(255,255,255,.2) !important;
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(0,0,0,.4);
}

/* 省份信息面板 */
.province-info-panel {
  background: linear-gradient(160deg, #451A24 0%, #2A1218 100%) !important;
  border: 1px solid rgba(212,175,55,.3) !important;
  border-radius: 14px !important;
  box-shadow: 0 24px 70px -20px rgba(0,0,0,.9) !important;
}
.panel-header { border-bottom: 1px solid rgba(212,175,55,.2) !important; }
.panel-title { color: #D4AF37 !important; letter-spacing: .1em; }
.close-btn { color: #9AA5AC !important; }
.close-btn:hover { color: #D4AF37 !important; }
.province-summary { color: #C3CAD0 !important; }
.status-badge {
  border: 1px solid rgba(212,175,55,.4) !important;
  background: rgba(212,175,55,.1) !important;
  color: #D4AF37 !important;
  border-radius: 6px;
}
.detail-btn {
  background: linear-gradient(135deg, #5A212C, #451A24) !important;
  color: #E8E3DA !important;
  border: 1px solid rgba(212,175,55,.35) !important;
  border-radius: 8px;
  transition: all .3s ease;
}
.detail-btn:hover {
  background: rgba(212,175,55,.12) !important;
  color: #D4AF37 !important;
  border-color: #D4AF37 !important;
}

/* 统计面板 */
.statistics-panel {
  background: rgba(26,34,40,.5) !important;
  border: 1px solid rgba(212,175,55,.18) !important;
  border-radius: 14px;
  padding: 20px !important;
}
.stats-title { color: #D4AF37 !important; letter-spacing: .1em; }
.stat-item {
  background: linear-gradient(160deg, #451A24 0%, #3A1620 100%) !important;
  border: 1px solid rgba(212,175,55,.2) !important;
  border-radius: 12px;
  box-shadow: 0 2px 14px rgba(0,0,0,.5) !important;
}
.stat-number { color: #D4AF37 !important; }
.stat-label { color: #9AA5AC !important; }
.echarts-china-map .map-title,
.echarts-china-map h1 {
  color: #EBC97A !important;
  font-weight: 700 !important;
  text-shadow: none !important;
  -webkit-text-stroke: 0 !important;
  letter-spacing: 0.1em !important;
  opacity: 1 !important;
}

.echarts-china-map .map-subtitle,
.echarts-china-map .map-subtitle * {
  color: #C3CAD0 !important;
  opacity: 1 !important;
  text-shadow: none !important;
}

.echarts-china-map .historical-quote {
  color: #E8E3DA !important;
  opacity: 1 !important;
  text-shadow: none !important;
  font-size: 15px !important;
  line-height: 1.7 !important;
}

.echarts-china-map .year-label { color: #C3CAD0 !important; opacity: 1 !important; }

.echarts-china-map .year-select {
  background: #451A24 !important;
  background-image: none !important;
  color: #E8E3DA !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  border: 1px solid rgba(212,175,55,.5) !important;
}

.echarts-china-map .year-info {
  background: #451A24 !important;
  background-image: none !important;
  border: 1px solid rgba(212,175,55,.5) !important;
}
.echarts-china-map .current-year {
  color: #EBC97A !important;
  font-weight: 600 !important;
  opacity: 1 !important;
  text-shadow: none !important;
}


.echarts-china-map .floating-element { opacity: 0.25 !important; }
.echarts-china-map .background-pattern { opacity: 0.5 !important; }


.echarts-china-map * {
  text-shadow: none !important;
}
.echarts-china-map p,
.echarts-china-map span,
.echarts-china-map div {
  opacity: 1 !important;
}
</style>
