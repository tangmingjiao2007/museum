<script setup>
// 不需要直接导入组件，因为现在使用路由
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

// 控制移动端菜单的显示
const isMobileMenuOpen = ref(false)

// 获取当前路由
const route = useRoute()

// 主内容滚动容器的引用
const mainContentRef = ref(null)

// 切换移动端菜单的显示状态
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 处理导航点击，确保滚动重置
const handleNavClick = () => {
  closeMobileMenu()
  nextTick(() => {
    // 立即重置滚动位置
    if (mainContentRef.value) {
      mainContentRef.value.scrollTop = 0
    }
    window.scrollTo(0, 0)
  })
}

// 监听路由变化，重置滚动位置
watch(() => route.path, () => {
  nextTick(() => {
    // 重置主内容区域的滚动位置
    if (mainContentRef.value) {
      mainContentRef.value.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      })
    }
    // 同时重置window滚动位置（双保险）
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  })
})

// 处理iOS Safari动态工具栏问题
onMounted(() => {
  // 设置视口高度CSS变量
  setViewportHeight()
  // 监听窗口大小变化，更新视口高度
  window.addEventListener('resize', setViewportHeight)
  // iOS上滚动事件会影响视口高度
  window.addEventListener('scroll', setViewportHeight)
  // 处理iOS Safari工具栏显示/隐藏时的视口变化
  window.visualViewport?.addEventListener('resize', setViewportHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', setViewportHeight)
  window.removeEventListener('scroll', setViewportHeight)
  window.visualViewport?.removeEventListener('resize', setViewportHeight)
})

// 设置真实的视口高度
const setViewportHeight = () => {
  // 获取视口真实高度
  const vh = window.innerHeight * 0.01
  // 设置CSS变量供CSS使用
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}
</script>

<template>
  <div class="app-container">
    <div
      class="app-content bg-gradient-to-br from-ink to-ink-2 text-cream rounded-xl overflow-hidden flex flex-col"
    >
      <!-- 背景装饰元素 -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          class="absolute -top-24 -left-24 w-96 h-96 bg-antique opacity-[0.07] rounded-full filter blur-3xl"
        ></div>
        <div
          class="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-bronze opacity-[0.07] rounded-full filter blur-3xl"
        ></div>
        <div
          class="absolute top-1/3 right-1/4 w-72 h-72 bg-ember opacity-[0.05] rounded-full filter blur-3xl"
        ></div>
        <div class="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_40%,rgba(0,0,0,0.55)_100%)]"></div>
      </div>

      <div class="relative z-10 flex flex-col h-full">
        <!-- 历史风格导航栏 -->
        <header
          class="sticky top-0 z-50 bg-gradient-to-b from-[#1A232B] via-[#151C22] to-[#10161B] border-b border-antique/30 shadow-[0_6px_30px_-10px_rgba(0,0,0,0.85)] backdrop-blur-md"
        >
          <div
            class="container mx-auto px-4 py-3 flex justify-between items-center relative"
          >
            <!-- 传统装饰纹样 -->
            <div class="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-antique/[0.06] to-transparent pointer-events-none"></div>
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-antique/30 text-base">🏛️</div>
            <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-antique/30 text-base">🇨🇳</div>

            <router-link
              to="/"
              class="flex items-center relative z-10 group"
              @click="handleNavClick"
            >
              <div class="flex items-center space-x-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B87333] flex items-center justify-center ring-1 ring-antique/50 shadow-[0_0_12px_rgba(212,175,55,0.25)] group-hover:shadow-[0_0_18px_rgba(212,175,55,0.45)] transition-all">
                  <span class="text-[#0E1418] font-bold text-sm font-serif">战</span>
                </div>
                <h1 class="text-base md:text-xl font-bold text-antique font-serif tracking-wide">
                  抗战文物数字展示与战役数据可视化系统 V1.0
                </h1>
              </div>
            </router-link>

            <!-- 桌面导航 -->
            <nav class="hidden lg:block relative z-10">
              <ul class="flex items-center space-x-7">
                <li>
                  <router-link
                    to="/"
                    class="nav-link text-[#AEB6BD] hover:text-antique transition-all duration-300 font-serif tracking-wider text-sm border-b-2 border-transparent hover:border-antique pb-1"
                    @click="handleNavClick"
                    >首页</router-link
                  >
                </li>
                <li>
                  <router-link
                    to="/war-exhibit"
                    class="nav-link text-[#AEB6BD] hover:text-antique transition-all duration-300 font-serif tracking-wider text-sm border-b-2 border-transparent hover:border-antique pb-1"
                    @click="handleNavClick"
                    >抗战展示</router-link
                  >
                </li>
                <li>
                  <router-link
                    to="/war-data"
                    class="nav-link text-[#AEB6BD] hover:text-antique transition-all duration-300 font-serif tracking-wider text-sm border-b-2 border-transparent hover:border-antique pb-1"
                    @click="handleNavClick"
                    >英雄人物</router-link
                  >
                </li>
                <li>
                  <router-link
                    to="/interactive-china-map"
                    class="nav-link text-[#AEB6BD] hover:text-antique transition-all duration-300 font-serif tracking-wider text-sm border-b-2 border-transparent hover:border-antique pb-1"
                    @click="handleNavClick"
                    >历史地图</router-link
                  >
                </li>
                <li>
                  <router-link
                    to="/war-battle-dataviz"
                    class="nav-link text-[#AEB6BD] hover:text-antique transition-all duration-300 font-serif tracking-wider text-sm border-b-2 border-transparent hover:border-antique pb-1"
                    @click="handleNavClick"
                    >战役数据</router-link
                  >
                </li>
                <li>
                  <router-link
                    to="/about"
                    class="nav-link text-[#AEB6BD] hover:text-antique transition-all duration-300 font-serif tracking-wider text-sm border-b-2 border-transparent hover:border-antique pb-1"
                    @click="handleNavClick"
                    >关于我们</router-link
                  >
                </li>
              </ul>
            </nav>

            <!-- 移动端菜单按钮 -->
            <button
              @click="toggleMobileMenu"
              class="block lg:hidden text-antique relative z-10 p-2 rounded-lg border border-antique/25 bg-ink-3/60 hover:bg-ink-4 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="!isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- 移动端菜单 -->
          <div
            v-if="isMobileMenuOpen"
            class="lg:hidden bg-gradient-to-b from-[#1A232B] to-[#0E1418] py-4 px-6 border-b border-antique/25"
          >
            <nav>
              <ul class="space-y-1">
                <li>
                  <router-link
                    @click="handleNavClick"
                    to="/"
                    class="block text-[#AEB6BD] hover:text-antique transition-colors py-2.5 font-serif tracking-wider text-sm border-l-2 border-transparent hover:border-antique hover:bg-antique/[0.06] pl-3"
                    >首页</router-link
                  >
                </li>
                <li>
                  <router-link
                    @click="handleNavClick"
                    to="/war-exhibit"
                    class="block text-[#AEB6BD] hover:text-antique transition-colors py-2.5 font-serif tracking-wider text-sm border-l-2 border-transparent hover:border-antique hover:bg-antique/[0.06] pl-3"
                    >抗战展示</router-link
                  >
                </li>
                <li>
                  <router-link
                    @click="handleNavClick"
                    to="/war-data"
                    class="block text-[#AEB6BD] hover:text-antique transition-colors py-2.5 font-serif tracking-wider text-sm border-l-2 border-transparent hover:border-antique hover:bg-antique/[0.06] pl-3"
                    >英雄人物</router-link
                  >
                </li>
                <li>
                  <router-link
                    @click="handleNavClick"
                    to="/interactive-china-map"
                    class="block text-[#AEB6BD] hover:text-antique transition-colors py-2.5 font-serif tracking-wider text-sm border-l-2 border-transparent hover:border-antique hover:bg-antique/[0.06] pl-3"
                    >历史地图</router-link
                  >
                </li>
                <li>
                  <router-link
                    @click="handleNavClick"
                    to="/war-battle-dataviz"
                    class="block text-[#AEB6BD] hover:text-antique transition-colors py-2.5 font-serif tracking-wider text-sm border-l-2 border-transparent hover:border-antique hover:bg-antique/[0.06] pl-3"
                    >战役数据</router-link
                  >
                </li>
                <li>
                  <router-link
                    @click="handleNavClick"
                    to="/about"
                    class="block text-[#AEB6BD] hover:text-antique transition-colors py-2.5 font-serif tracking-wider text-sm border-l-2 border-transparent hover:border-antique hover:bg-antique/[0.06] pl-3"
                    >关于我们</router-link
                  >
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <!-- 主要内容区域 - 可滚动 -->
        <main
          ref="mainContentRef"
          class="flex-grow container mx-auto px-4 py-4 pb-0 overflow-y-auto"
        >
          <router-view />
        </main>

        <!-- 玻璃拟态页脚 -->
        <footer
          class="backdrop-filter backdrop-blur-lg bg-[#0E1418]/90 border-t border-antique/25 py-3 md:py-5 rounded-b-xl"
        >
          <div
            class="container mx-auto px-4 text-center text-[#7E878E] text-xs md:text-sm tracking-wide"
          >
            <p>© 2025 抗战文物数字展示与战役数据可视化系统 V1.0</p>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style>
/* 基础样式设置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #E8E3DA;
  background: radial-gradient(120% 100% at 50% 0%, #131B21 0%, #0B1014 60%, #080C0F 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 使用CSS变量适应动态视口高度 */
:root {
  --vh: 1vh;
}

.app-container {
  width: 95%;
  height: calc(95 * var(--vh, 1vh));
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: calc(95 * var(--vh, 1vh));
}

.app-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.museum-header h1 {
  font-size: 1.8rem;
  font-weight: 500;
  color: #E8E3DA;
}

.museum-content {
  flex: 1;
  background-color: transparent;
}

.museum-footer {
  background-color: #0E1418;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #7E878E;
}

/* 移动端优化 */
@media (max-width: 768px) {
  body {
    padding: 5px;
  }

  .app-container {
    width: 95%;
    height: calc(98 * var(--vh, 1vh));
    max-height: calc(98 * var(--vh, 1vh));
  }

  main.container {
    padding-left: 10px;
    padding-right: 10px;
    overflow-y: auto;
    flex: 1;
  }

  .app-content {
    overflow: hidden;
    max-height: calc(98 * var(--vh, 1vh));
  }

  header.sticky {
    position: sticky;
    top: 0;
    z-index: 50;
  }

  footer {
    padding-top: 8px;
    padding-bottom: 8px;
  }
}

/* 针对超小屏幕的优化 */
@media (max-height: 600px) {
  .app-container {
    height: calc(99 * var(--vh, 1vh));
    max-height: calc(99 * var(--vh, 1vh));
  }

  header.sticky {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  footer {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  header .container {
    padding-top: 6px;
    padding-bottom: 6px;
  }
}

/* 针对iOS的输入优化 */
@media screen and (max-width: 768px) {
  input,
  select,
  textarea {
    font-size: 16px !important;
  }
}

/* 针对底部工具栏的滑动交互 */
@supports (-webkit-touch-callout: none) {
  .app-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

/* 历史风格导航栏样式 */
.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(201,162,39,0), #D4AF37, rgba(201,162,39,0));
  transition: all 0.35s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

/* 传统装饰动效 */
@keyframes traditional-glow {
  0%, 100% {
    text-shadow: 0 1px 10px rgba(212, 175, 55, 0.18);
  }
  50% {
    text-shadow: 0 1px 14px rgba(212, 175, 55, 0.32);
  }
}

header h1 {
  animation: traditional-glow 4s ease-in-out infinite;
}

/* 移动端菜单项悬停效果 */
.lg\:hidden .nav-link:hover {
  background: rgba(212, 175, 55, 0.08);
  border-radius: 4px;
}

/* 响应式标题 */
@media (max-width: 1024px) {
  header h1 {
    font-size: 1.05rem;
  }
}

@media (max-width: 768px) {
  header h1 {
    font-size: 0.95rem;
  }

  .absolute.left-4,
  .absolute.right-4 {
    display: none;
  }
}

@media (max-width: 480px) {
  header h1 {
    font-size: 0.85rem;
  }
}
</style>
