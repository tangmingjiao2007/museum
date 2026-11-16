<script setup>
import { ref, onMounted } from 'vue'
import WarWeapons from './WarWeapons.vue'
import WarDailyItems from './WarDailyItems.vue'
import WarMemorialItems from './WarMemorialItems.vue'
import WarArchitecture from './WarArchitecture.vue'

// 当前激活的板块
const activeTab = ref('weapons')

// 板块配置
const tabs = ref([
  {
    id: 'weapons',
    name: '武器装备',
    description: '抗战时期的各类武器装备'
  },
  {
    id: 'daily',
    name: '生活用品',
    description: '军民日常生活用品'
  },
  {
    id: 'memorial',
    name: '纪念物品',
    description: '珍贵的抗战纪念品'
  },
  {
    id: 'architecture',
    name: '建筑场景',
    description: '军事建筑与工事'
  }
])

// 切换板块
const switchTab = (tabId) => {
  activeTab.value = tabId
}

// 动画相关引用
const titleArea = ref(null)
const tabsContainer = ref(null)
const contentArea = ref(null)

onMounted(() => {
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 }
  const observerCallback = (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target === titleArea.value ? 0 : index * 0.2
        entry.target.style.animationDelay = `${delay}s`
        entry.target.classList.add('animate-enter')
        observer.unobserve(entry.target)
      }
    })
  }
  const observer = new IntersectionObserver(observerCallback, observerOptions)

  if (titleArea.value) observer.observe(titleArea.value)
  if (tabsContainer.value) observer.observe(tabsContainer.value)
  if (contentArea.value) observer.observe(contentArea.value)
})
</script>

<template>
  <div class="exhibit-page">
    <!-- 页面标题区域 -->
    <div ref="titleArea" class="page-banner">
      <img src="/images/淞沪会战.jpg" alt="抗战时期" />
      <div class="banner-shade"></div>
      <div class="banner-body">
        <span class="banner-kicker">1937 — 1945 · 抗日战争时期</span>
        <h1>抗战文物展示</h1>
        <p>
          铭记历史，缅怀先烈。这些珍贵的抗战文物见证了中华民族不屈不挠的抗争精神，
          每一件都承载着英雄们的血泪与荣光。
        </p>
      </div>
    </div>

    <!-- 板块导航标签 -->
    <div ref="tabsContainer" class="tab-panel">
      <div class="tab-head">
        <div>
          <h2>抗战文物分类展示</h2>
          <p>四个板块，从兵器到生活，从纪念物到建筑遗迹</p>
        </div>
        <span class="tab-count">共 {{ tabs.length }} 个展厅</span>
      </div>

      <div class="tab-list">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-chip"
          :class="{ 'is-active': activeTab === tab.id }"
          @click="switchTab(tab.id)"
        >
          <strong>{{ tab.name }}</strong>
          <small>{{ tab.description }}</small>
        </button>
      </div>
    </div>

    <!-- 动态内容区域 -->
    <div ref="contentArea" class="tab-content">
      <Transition name="fade" mode="out-in">
        <WarWeapons v-if="activeTab === 'weapons'" key="weapons" />
        <WarDailyItems v-else-if="activeTab === 'daily'" key="daily" />
        <WarMemorialItems v-else-if="activeTab === 'memorial'" key="memorial" />
        <WarArchitecture v-else-if="activeTab === 'architecture'" key="architecture" />
      </Transition>
    </div>

    <!-- 历史意义说明 -->
    <div class="meaning-band">
      <div class="meaning-head">
        <h3>历史意义</h3>
        <span>文物不语，历史有声</span>
      </div>
      <div class="meaning-grid">
        <div class="meaning-item">
          <span class="meaning-index">01</span>
          <h4>民族精神</h4>
          <p>见证中华民族不屈不挠的抗争精神。</p>
        </div>
        <div class="meaning-item">
          <span class="meaning-index">02</span>
          <h4>历史教育</h4>
          <p>铭记历史，传承爱国主义精神。</p>
        </div>
        <div class="meaning-item">
          <span class="meaning-index">03</span>
          <h4>和平珍贵</h4>
          <p>珍惜来之不易的和平生活。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exhibit-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;
}

/* ---------- 顶部图片 ---------- */
.page-banner {
  position: relative;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  align-items: flex-end;
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: 0 26px 54px -46px rgba(84, 48, 28, 0.8);
}

.page-banner img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
}

.banner-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(95deg, rgba(38, 22, 15, 0.85) 0%, rgba(48, 27, 18, 0.5) 55%, rgba(48, 27, 18, 0.1) 100%),
    linear-gradient(0deg, rgba(38, 22, 15, 0.5) 0%, rgba(38, 22, 15, 0) 60%);
}

.banner-body {
  position: relative;
  z-index: 1;
  padding: 32px 40px;
  max-width: 640px;
  color: #fdf4e6;
}

.banner-kicker {
  display: inline-block;
  padding: 3px 12px;
  border: 1px solid rgba(253, 244, 230, 0.4);
  border-radius: 999px;
  font-size: 11.5px;
  letter-spacing: 0.18em;
  color: #f3e3c9;
}

.banner-body h1 {
  margin-top: 14px;
  font-size: 38px;
  letter-spacing: 0.08em;
  color: #fff8ec;
}

.banner-body p {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 246, 233, 0.82);
}

/* ---------- 分类标签 ---------- */
.tab-panel {
  padding: 22px 24px 24px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--card);
}

.tab-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.tab-head h2 {
  font-size: 22px;
  color: var(--ink);
}

.tab-head p {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
}

.tab-count {
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--gold);
  white-space: nowrap;
}

.tab-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.tab-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 14px 16px;
  text-align: left;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--card-soft);
  color: var(--ink-2);
}

.tab-chip strong {
  font-family: var(--font-serif);
  font-size: 16px;
  letter-spacing: 0.04em;
}

.tab-chip small {
  font-size: 12px;
  color: var(--muted);
}

.tab-chip:hover {
  border-color: rgba(167, 56, 42, 0.4);
  background: #fffdf8;
}

.tab-chip.is-active {
  border-color: var(--red);
  background: var(--red);
  color: #fff8ee;
  box-shadow: 0 16px 28px -24px rgba(138, 44, 33, 0.95);
}

.tab-chip.is-active small {
  color: rgba(255, 248, 238, 0.78);
}

/* ---------- 内容区 ---------- */
.tab-content {
  padding: 4px 0;
}

/* ---------- 历史意义 ---------- */
.meaning-band {
  padding: 26px 28px;
  border: 1px solid rgba(167, 56, 42, 0.22);
  border-radius: 18px;
  background: linear-gradient(120deg, #fbeee5 0%, #fdf7ec 60%, #f7ecdc 100%);
}

.meaning-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.meaning-head h3 {
  font-size: 20px;
  color: var(--red-deep);
}

.meaning-head span {
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--muted);
}

.meaning-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.meaning-item {
  padding-left: 16px;
  border-left: 1px solid rgba(167, 56, 42, 0.22);
}

.meaning-index {
  font-family: var(--font-serif);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--gold);
}

.meaning-item h4 {
  margin-top: 4px;
  font-size: 16px;
  color: var(--ink);
}

.meaning-item p {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--ink-2);
}

/* ---------- 动画 ---------- */
@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-enter {
  animation: fadeInSlideUp 0.5s ease-out forwards;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---------- 响应式 ---------- */
@media (max-width: 900px) {
  .tab-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .banner-body {
    padding: 26px 24px;
  }
  .banner-body h1 {
    font-size: 30px;
  }
}

@media (max-width: 768px) {
  .exhibit-page {
    gap: 18px;
  }
  .page-banner {
    min-height: 260px;
  }
  .tab-panel {
    padding: 18px 16px;
  }
  .tab-head {
    flex-direction: column;
    align-items: flex-start;
  }
  .meaning-band {
    padding: 20px 18px;
  }
  .meaning-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}
</style>
