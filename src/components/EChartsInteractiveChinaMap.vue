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
        <span class="title-text">中国抗战历史地图</span>
      </h1>
      <p class="map-subtitle">
        点击各省份查看详细的抗战历史
        <span class="subtitle-divider">|</span>
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
        '#6f8f79',
        '#8a7a9b',
        '#c9a961',
        '#c9824a',
        '#bf5a4a',
        '#9c3327'
      ]
      const itemStyle = {
        areaColor: colors[value] || '#e8d8c4'
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
              <p style="margin: 0; color: #a7382a; font-size: 13px; font-weight: 500;">点击查看详细抗战历史</p>
            </div>
          `
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e8d8c4',
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
            '#6f8f79',
            '#8a7a9b',
            '#c9a961',
            '#c9824a',
            '#bf5a4a',
            '#9c3327'
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
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #bf5a4a; font-size: 18px;">
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
      return '#9c3327' // 深红色 - 日军直接占领
    case '伪政权':
      return '#bf5a4a' // 红色 - 傀儡政权
    case '争夺区':
      return '#c9824a' // 橙色 - 双方争夺
    case '游击区':
      return '#c9a961' // 黄色 - 游击根据地
    case '租界':
      return '#8a7a9b' // 紫色 - 外国租界
    case '中方控制':
      return '#6f8f79' // 绿色 - 中方控制
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
      '#6f8f79',
      '#8a7a9b',
      '#c9a961',
      '#c9824a',
      '#bf5a4a',
      '#9c3327'
    ]
    const itemStyle = {
      areaColor: colors[value] || '#e8d8c4'
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
      color: ['#6f8f79', '#8a7a9b', '#c9a961', '#c9824a', '#bf5a4a', '#9c3327']
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
/* ===== 中国抗战历史地图 ===== */
.echarts-china-map {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 0 24px;
  color: #2e231a;
}

/* 装饰层全部收起，保留干净纸面 */
.historical-background {
  display: none;
}

/* ---------- 页头 ---------- */
.map-header {
  position: relative;
  z-index: 2;
  padding: 26px 28px 24px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #e8d8c4;
  border-radius: 20px;
  background:
    radial-gradient(70% 120% at 100% 0%, rgba(249, 229, 221, 0.85) 0%, rgba(249, 229, 221, 0) 60%),
    #fffcf5;
}

.map-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 30px;
  letter-spacing: 0.12em;
  color: #8a2c21;
}

.title-decoration {
  display: none;
}

.title-text {
  background: none;
  -webkit-text-fill-color: currentColor;
  color: #8a2c21;
}

.map-subtitle {
  margin-top: 8px;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: #8b7768;
}

.subtitle-icon {
  color: #b9945e;
  margin: 0 6px;
}

.subtitle-divider {
  color: #d9c8b4;
  margin: 0 8px;
}

.historical-quote {
  display: inline-block;
  margin-top: 16px;
  padding: 9px 20px;
  border-left: 2px solid #a7382a;
  border-radius: 0 10px 10px 0;
  background: #fdf7ec;
  color: #5a4738;
  font-size: 13.5px;
  letter-spacing: 0.04em;
}

.quote-mark {
  color: #b9945e;
  font-family: var(--font-serif);
}

.year-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.year-label {
  font-size: 13.5px;
  color: #5a4738;
}

.year-select {
  padding: 8px 16px;
  border: 1px solid #e8d8c4;
  border-radius: 10px;
  background: #fffdf8;
  color: #2e231a;
  font-size: 14px;
  cursor: pointer;
}

.year-select:hover {
  border-color: rgba(167, 56, 42, 0.45);
}

.year-select:focus {
  outline: none;
  border-color: #a7382a;
  box-shadow: 0 0 0 3px rgba(167, 56, 42, 0.12);
}

.year-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-year {
  padding: 6px 14px;
  border-radius: 999px;
  background: #a7382a;
  color: #fff8ee;
  font-size: 13px;
  letter-spacing: 0.04em;
}

/* ---------- 地图 ---------- */
.map-container {
  position: relative;
  z-index: 1;
  overflow: hidden;
  margin-bottom: 18px;
  border: 1px solid #e8d8c4;
  border-radius: 18px;
  background: #fffdf8;
  box-shadow: 0 20px 44px -40px rgba(84, 48, 28, 0.65);
}

.china-map-echarts {
  width: 100%;
  height: 680px;
  min-height: 560px;
}

/* ---------- 图例 ---------- */
.map-legend {
  position: relative;
  z-index: 1;
  padding: 18px 22px;
  margin-bottom: 18px;
  border: 1px solid #e8d8c4;
  border-radius: 16px;
  background: #fffcf5;
}

.legend-title {
  margin-bottom: 12px;
  font-size: 15px;
  letter-spacing: 0.1em;
  color: #8a2c21;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5a4738;
  font-size: 13px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px rgba(46, 35, 26, 0.08);
}

.legend-color.japanese-occupied {
  background: #9c3327;
}
.legend-color.puppet-regime {
  background: #bf5a4a;
}
.legend-color.contested {
  background: #c9824a;
}
.legend-color.guerrilla {
  background: #c9a961;
}
.legend-color.rental-area {
  background: #8a7a9b;
}
.legend-color.chinese-control {
  background: #6f8f79;
}

/* ---------- 省份面板 ---------- */
.province-info-panel {
  position: fixed;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  z-index: 60;
  width: 320px;
  overflow: hidden;
  border: 1px solid #e8d8c4;
  border-radius: 16px;
  background: #fffcf5;
  box-shadow: 0 26px 60px -40px rgba(38, 24, 16, 0.85);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e8d8c4;
  background: #fdf7ec;
}

.panel-title {
  font-size: 18px;
  color: #8a2c21;
}

.close-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #e8d8c4;
  border-radius: 50%;
  background: #fffdf8;
  color: #5a4738;
  font-size: 18px;
  line-height: 1;
}

.close-btn:hover {
  background: #f6e2da;
  color: #8a2c21;
}

.panel-content {
  padding: 18px 20px 20px;
}

.province-status {
  margin-bottom: 12px;
}

.status-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: #fff8ee;
}

.status-occupied {
  background: #a7382a;
}
.status-battlefield {
  background: #b9945e;
}
.status-base {
  background: #7c8b5a;
}
.status-rear {
  background: #5f7f9e;
}
.status-default {
  background: #8b7768;
}

.province-summary {
  margin-bottom: 16px;
  font-size: 13.5px;
  line-height: 1.8;
  color: #4a392b;
}

.panel-actions {
  display: flex;
}

.detail-btn {
  width: 100%;
  padding: 9px 0;
  border: 1px solid #a7382a;
  border-radius: 999px;
  background: #a7382a;
  color: #fff8ee;
  font-size: 13.5px;
  letter-spacing: 0.06em;
}

.detail-btn:hover {
  background: #8a2c21;
  border-color: #8a2c21;
}

/* ---------- 统计 ---------- */
.statistics-panel {
  position: relative;
  z-index: 1;
  padding: 20px 22px;
  border: 1px solid #e8d8c4;
  border-radius: 16px;
  background: #fffcf5;
}

.stats-title {
  margin-bottom: 14px;
  font-size: 15px;
  letter-spacing: 0.1em;
  color: #8a2c21;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.stat-item {
  padding: 14px 12px;
  text-align: center;
  border: 1px solid #efe2d1;
  border-radius: 12px;
  background: #fdf7ec;
}

.stat-number {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  color: #a7382a;
  line-height: 1.3;
}

.stat-label {
  margin-top: 2px;
  font-size: 12px;
  color: #8b7768;
}

/* ---------- 响应式 ---------- */
@media (max-width: 1100px) {
  .china-map-echarts {
    height: 580px;
  }
}

@media (max-width: 768px) {
  .map-header {
    padding: 20px 16px;
  }
  .map-title {
    font-size: 22px;
  }
  .china-map-echarts {
    height: 480px;
    min-height: 400px;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .province-info-panel {
    top: auto;
    bottom: 16px;
    right: 16px;
    left: 16px;
    width: auto;
    transform: none;
  }
}
</style>
