<template>
  <div class="province-war-detail">
    <!-- 返回按钮 -->
    <div class="back-navigation">
      <button @click="goBack" class="back-btn">
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        返回地图
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载省份抗战历史...</p>
    </div>

    <!-- 省份不存在 -->
    <div v-else-if="!provinceData" class="error-container">
      <h2>省份信息未找到</h2>
      <p>抱歉，未能找到该省份的抗战历史信息。</p>
    </div>

    <!-- 省份详情 -->
    <div v-else class="province-content">
      <!-- 省份标题 -->
      <div class="province-header">
        <h1 class="province-title">{{ provinceData.name }}抗战历史</h1>
        <div class="province-meta">
          <span
            class="status-badge"
            :class="getStatusClass(provinceData.status)"
          >
            {{ provinceData.status }}
          </span>
          <span class="period-info">{{ provinceData.warPeriod }}</span>
        </div>
      </div>

      <!-- 省份概述 -->
      <div class="province-summary">
        <h2 class="section-title">概述</h2>
        <p class="summary-text">{{ provinceData.summary }}</p>

        <div class="key-info">
          <div
            class="info-item"
            v-if="provinceData.fallDate && provinceData.fallDate !== '未沦陷'"
          >
            <span class="info-label">沦陷时间:</span>
            <span class="info-value">{{ provinceData.fallDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">光复时间:</span>
            <span class="info-value">{{ provinceData.liberationDate }}</span>
          </div>
          <div class="info-item" v-if="provinceData.casualties">
            <span class="info-label">平民伤亡:</span>
            <span class="info-value">{{
              provinceData.casualties.civilian
            }}</span>
          </div>
          <div class="info-item" v-if="provinceData.casualties">
            <span class="info-label">军人伤亡:</span>
            <span class="info-value">{{
              provinceData.casualties.military
            }}</span>
          </div>
        </div>
      </div>

      <!-- 重大事件 -->
      <div class="major-events">
        <h2 class="section-title">重大事件</h2>
        <div class="events-timeline">
          <div
            v-for="(event, index) in provinceData.majorEvents"
            :key="index"
            class="event-item"
          >
            <div class="event-date">{{ event.date }}</div>
            <div class="event-content">
              <h3 class="event-title">{{ event.event }}</h3>
              <p class="event-location">地点: {{ event.location }}</p>
              <p class="event-description">{{ event.description }}</p>
              <p class="event-significance">
                <strong>历史意义:</strong> {{ event.significance }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 抗战力量 -->
      <div class="resistance-forces" v-if="provinceData.resistance">
        <h2 class="section-title">抗战力量</h2>
        <div class="resistance-content">
          <div class="resistance-section">
            <h3 class="subsection-title">抗战组织</h3>
            <div class="organization-list">
              <span
                v-for="org in provinceData.resistance.organizations"
                :key="org"
                class="organization-tag"
              >
                {{ org }}
              </span>
            </div>
          </div>

          <div class="resistance-section">
            <h3 class="subsection-title">主要领导人</h3>
            <div class="leader-list">
              <span
                v-for="leader in provinceData.resistance.leaders"
                :key="leader"
                class="leader-tag"
              >
                {{ leader }}
              </span>
            </div>
          </div>

          <div class="resistance-section">
            <h3 class="subsection-title">主要活动</h3>
            <p class="activities-text">
              {{ provinceData.resistance.activities }}
            </p>
          </div>
        </div>
      </div>

      <!-- 历史遗迹 -->
      <div
        class="heritage-sites"
        v-if="provinceData.heritage && provinceData.heritage.length > 0"
      >
        <h2 class="section-title">历史遗迹与纪念场所</h2>
        <div class="heritage-grid">
          <div
            v-for="(site, index) in provinceData.heritage"
            :key="index"
            class="heritage-item"
          >
            <div class="heritage-type">{{ site.type }}</div>
            <h3 class="heritage-name">{{ site.name }}</h3>
            <p class="heritage-description">{{ site.description }}</p>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="statistics-section">
        <h2 class="section-title">统计信息</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ provinceData.majorEvents.length }}</div>
            <div class="stat-label">重大事件</div>
          </div>
          <div class="stat-item" v-if="provinceData.resistance">
            <div class="stat-number">
              {{ provinceData.resistance.organizations.length }}
            </div>
            <div class="stat-label">抗战组织</div>
          </div>
          <div class="stat-item" v-if="provinceData.resistance">
            <div class="stat-number">
              {{ provinceData.resistance.leaders.length }}
            </div>
            <div class="stat-label">主要领导人</div>
          </div>
          <div class="stat-item" v-if="provinceData.heritage">
            <div class="stat-number">{{ provinceData.heritage.length }}</div>
            <div class="stat-label">历史遗迹</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getProvinceWarHistory,
  getProvinceWarHistoryByName
} from '../data/allProvinceWarHistory.js'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const provinceData = ref(null)

// 获取省份数据
const loadProvinceData = () => {
  loading.value = true

  try {
    const provinceId = route.params.id
    const provinceName = route.params.name

    let data = null

    if (provinceId) {
      // 通过省份代码获取数据
      data = getProvinceWarHistory(provinceId)
    } else if (provinceName) {
      // 通过省份名称获取数据
      data = getProvinceWarHistoryByName(provinceName)
    }

    provinceData.value = data
  } catch (error) {
    console.error('加载省份数据失败:', error)
    provinceData.value = null
  } finally {
    loading.value = false
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

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 组件挂载时加载数据
onMounted(() => {
  loadProvinceData()
})
</script>

<style scoped>
.province-war-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

.back-navigation {
  margin-bottom: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.loading-container,
.error-container {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.province-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.province-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 40px;
  text-align: center;
}

.province-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 15px;
}

.province-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-occupied {
  background: #ef4444;
  color: white;
}
.status-battlefield {
  background: #f59e0b;
  color: white;
}
.status-base {
  background: #10b981;
  color: white;
}
.status-rear {
  background: #3b82f6;
  color: white;
}
.status-default {
  background: #6b7280;
  color: white;
}

.period-info {
  color: #cbd5e1;
  font-size: 16px;
}

.province-summary,
.major-events,
.resistance-forces,
.heritage-sites,
.statistics-section {
  padding: 30px 40px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 20px;
  border-left: 4px solid #3b82f6;
  padding-left: 15px;
}

.summary-text {
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 20px;
}

.key-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #f8fafc;
  border-radius: 8px;
}

.info-label {
  font-weight: 600;
  color: #64748b;
}

.info-value {
  color: #1e293b;
  font-weight: 500;
}

.events-timeline {
  position: relative;
}

.event-item {
  display: flex;
  margin-bottom: 30px;
  position: relative;
}

.event-date {
  flex-shrink: 0;
  width: 120px;
  font-weight: 600;
  color: #3b82f6;
  font-size: 14px;
}

.event-content {
  flex: 1;
  padding-left: 20px;
  border-left: 2px solid #e5e7eb;
  position: relative;
}

.event-content::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 0;
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
}

.event-title {
  font-size: 18px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 8px;
}

.event-location {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 8px;
}

.event-description {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 8px;
}

.event-significance {
  color: #059669;
  font-size: 14px;
  font-style: italic;
}

.resistance-content {
  display: grid;
  gap: 25px;
}

.subsection-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
}

.organization-list,
.leader-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.organization-tag,
.leader-tag {
  padding: 6px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.leader-tag {
  background: #dcfce7;
  color: #166534;
}

.activities-text {
  color: #374151;
  line-height: 1.6;
}

.heritage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.heritage-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.heritage-type {
  color: #059669;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.heritage-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.heritage-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 5px;
}

.stat-label {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .province-war-detail {
    padding: 15px;
  }

  .province-header {
    padding: 30px 20px;
  }

  .province-title {
    font-size: 24px;
  }

  .province-meta {
    flex-direction: column;
    gap: 10px;
  }

  .province-summary,
  .major-events,
  .resistance-forces,
  .heritage-sites,
  .statistics-section {
    padding: 20px;
  }

  .event-item {
    flex-direction: column;
  }

  .event-date {
    width: auto;
    margin-bottom: 10px;
  }

  .event-content {
    padding-left: 0;
    border-left: none;
    border-top: 2px solid #e5e7eb;
    padding-top: 15px;
  }

  .event-content::before {
    display: none;
  }

  .key-info {
    grid-template-columns: 1fr;
  }

  .heritage-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
