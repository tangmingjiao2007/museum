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
    icon: '⚔️',
    color: 'red',
    description: '抗战时期的各类武器装备'
  },
  {
    id: 'daily',
    name: '生活用品',
    icon: '🎒',
    color: 'blue',
    description: '军民日常生活用品'
  },
  {
    id: 'memorial',
    name: '纪念物品',
    icon: '🏆',
    color: 'yellow',
    description: '珍贵的抗战纪念品'
  },
  {
    id: 'architecture',
    name: '建筑场景',
    icon: '🏗️',
    color: 'green',
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
  <div class="space-y-10 md:space-y-16">
    <!-- 页面标题区域 -->
    <div
      ref="titleArea"
      class="relative overflow-hidden rounded-2xl h-[300px] md:h-[400px] opacity-0 transform translate-y-5"
    >
      <!-- 背景图片 -->
      <div class="absolute inset-0">
        <img
          src="/images/胜利.jpg"
          alt="抗战胜利"
          class="w-full h-full object-cover object-center"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"
        ></div>
      </div>

      <!-- 标题内容 -->
      <div
        class="absolute inset-0 flex flex-col justify-center items-center z-20 p-6 md:p-16"
      >
        <h1
          class="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
        >
          抗战文物展示
        </h1>
        <p class="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto text-center">
          铭记历史，缅怀先烈。这些珍贵的抗战文物见证了中华民族不屈不挠的抗争精神，
          每一件都承载着英雄们的血泪与荣光。
        </p>
        <div class="flex items-center text-white/80 text-sm md:text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          1937-1945 抗日战争时期
        </div>
      </div>
    </div>

    <!-- 板块导航标签 -->
    <div
      ref="tabsContainer"
      class="bg-white/70 backdrop-blur-md rounded-xl p-6 md:p-8 border border-gray-200/30 shadow-lg mx-2 md:mx-0 opacity-0 transform translate-y-5"
    >
      <div class="text-center mb-6">
        <h2 class="text-2xl md:text-3xl font-bold text-museum-dark mb-4">
          抗战文物分类展示
        </h2>
        <p class="text-museum-dark/70 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
          通过四个不同的板块，全面展示抗战时期的珍贵文物，每个板块都承载着深厚的历史意义
        </p>
      </div>
      
      <!-- 标签导航 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="switchTab(tab.id)"
          :class="[
            'group relative p-4 md:p-6 rounded-xl border-2 transition-all duration-300 text-center',
            activeTab === tab.id
              ? `border-${tab.color}-500 bg-${tab.color}-50/50 shadow-lg`
              : 'border-gray-200/50 bg-white/50 hover:border-gray-300/70 hover:bg-white/70'
          ]"
        >
          <div class="text-3xl md:text-4xl mb-2">{{ tab.icon }}</div>
          <h3 
            :class="[
              'font-bold text-sm md:text-base mb-1 transition-colors duration-300',
              activeTab === tab.id ? `text-${tab.color}-700` : 'text-museum-dark group-hover:text-museum-dark/80'
            ]"
          >
            {{ tab.name }}
          </h3>
          <p 
            :class="[
              'text-xs md:text-sm transition-colors duration-300',
              activeTab === tab.id ? `text-${tab.color}-600/80` : 'text-museum-dark/60'
            ]"
          >
            {{ tab.description }}
          </p>
          
          <!-- 激活指示器 -->
          <div 
            v-if="activeTab === tab.id"
            :class="`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-${tab.color}-500 rounded-full`"
          ></div>
        </button>
      </div>
    </div>

    <!-- 动态内容区域 -->
    <div
      ref="contentArea"
      class="opacity-0 transform translate-y-5"
    >
      <Transition name="fade" mode="out-in">
        <WarWeapons v-if="activeTab === 'weapons'" key="weapons" />
        <WarDailyItems v-else-if="activeTab === 'daily'" key="daily" />
        <WarMemorialItems v-else-if="activeTab === 'memorial'" key="memorial" />
        <WarArchitecture v-else-if="activeTab === 'architecture'" key="architecture" />
      </Transition>
    </div>

    <!-- 历史意义说明 -->
    <div
      class="bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-md rounded-xl p-6 md:p-8 border border-red-200/30 shadow-lg mx-2 md:mx-0"
    >
      <div class="text-center mb-6">
        <h3 class="text-2xl md:text-3xl font-bold text-white mb-3">
          历史意义
        </h3>
        <div class="w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div class="space-y-3">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h4 class="font-semibold text-white/90">民族精神</h4>
          <p class="text-sm text-white/70">
            见证中华民族不屈不挠的抗争精神
          </p>
        </div>
        <div class="space-y-3">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h4 class="font-semibold text-white/90">历史教育</h4>
          <p class="text-sm text-white/80">铭记历史，传承爱国主义精神</p>
        </div>
        <div class="space-y-3">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h4 class="font-semibold text-white/90">和平珍贵</h4>
          <p class="text-sm text-white/80">珍惜来之不易的和平生活</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 入场动画 */
@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-enter {
  animation: fadeInSlideUp 0.6s ease-out forwards;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 动态颜色类 */
.border-red-500 { border-color: #ef4444; }
.bg-red-50\/50 { background-color: rgba(254, 242, 242, 0.5); }
.text-red-700 { color: #b91c1c; }
.text-red-600\/80 { color: rgba(220, 38, 38, 0.8); }
.bg-red-500 { background-color: #ef4444; }

.border-blue-500 { border-color: #3b82f6; }
.bg-blue-50\/50 { background-color: rgba(239, 246, 255, 0.5); }
.text-blue-700 { color: #1d4ed8; }
.text-blue-600\/80 { color: rgba(37, 99, 235, 0.8); }
.bg-blue-500 { background-color: #3b82f6; }

.border-yellow-500 { border-color: #eab308; }
.bg-yellow-50\/50 { background-color: rgba(254, 252, 232, 0.5); }
.text-yellow-700 { color: #a16207; }
.text-yellow-600\/80 { color: rgba(202, 138, 4, 0.8); }
.bg-yellow-500 { background-color: #eab308; }

.border-green-500 { border-color: #22c55e; }
.bg-green-50\/50 { background-color: rgba(240, 253, 244, 0.5); }
.text-green-700 { color: #15803d; }
.text-green-600\/80 { color: rgba(34, 197, 94, 0.8); }
.bg-green-500 { background-color: #22c55e; }
</style>
