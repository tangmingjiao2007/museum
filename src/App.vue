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

// 导航配置
const navItems = [
  { to: '/', label: '首页' },
  { to: '/war-exhibit', label: '抗战展示' },
  { to: '/war-data', label: '英雄人物' },
  { to: '/interactive-china-map', label: '历史地图' },
  { to: '/war-battle-dataviz', label: '战役数据' },
  { to: '/about', label: '关于我们' }
]

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
    <div class="app-content">
      <header class="site-header">
        <div class="header-inner">
          <router-link to="/" class="brand" @click="handleNavClick">
            <span class="ui-seal">抗</span>
            <span class="brand-text">
              <strong>抗战数字博物馆</strong>
              <small>文物展示 · 战役数据可视化</small>
            </span>
          </router-link>

          <!-- 桌面导航 -->
          <nav class="desktop-nav">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="nav-link"
              @click="handleNavClick"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMobileMenu"
            class="menu-btn"
            aria-label="切换菜单"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.6"
            >
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- 移动端菜单 -->
        <div v-if="isMobileMenuOpen" class="mobile-nav">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="mobile-link"
            @click="handleNavClick"
          >
            {{ item.label }}
          </router-link>
        </div>
      </header>

      <!-- 主要内容区域 - 可滚动 -->
      <main
        ref="mainContentRef"
        class="main-scroll"
      >
        <router-view />
      </main>

      <footer class="site-footer">
        <p>© 2025 抗战文物数字展示与战役数据可视化系统 V1.0</p>
        <p class="footer-sub">铭记历史 · 珍爱和平</p>
      </footer>
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.app-content {
  width: 100%;
  height: calc(97 * var(--vh, 1vh));
  max-height: calc(97 * var(--vh, 1vh));
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgba(255, 252, 245, 0.55);
  border: 1px solid rgba(232, 216, 196, 0.9);
  border-radius: 22px;
  box-shadow: 0 40px 90px -70px rgba(84, 48, 28, 0.75);
}

/* ---------- 顶部导航 ---------- */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(253, 248, 239, 0.94);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(10px);
}

.header-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 12px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--ink);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.brand-text strong {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--red-deep);
}

.brand-text small {
  margin-top: 2px;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--muted);
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  position: relative;
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--ink-2);
  font-size: 14px;
  letter-spacing: 0.04em;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.nav-link:hover {
  color: var(--red-deep);
  background: var(--red-soft);
}

.nav-link.router-link-active {
  color: var(--red-deep);
  background: var(--red-soft);
  font-weight: 600;
}

.menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--card);
  color: var(--ink);
}

.mobile-nav {
  display: none;
  flex-direction: column;
  padding: 6px 18px 14px;
  border-top: 1px solid var(--line);
  background: var(--card);
}

.mobile-link {
  padding: 11px 4px;
  border-bottom: 1px solid rgba(232, 216, 196, 0.7);
  color: var(--ink-2);
  font-size: 14px;
}

.mobile-link:last-child {
  border-bottom: 0;
}

.mobile-link.router-link-active {
  color: var(--red-deep);
  font-weight: 600;
}

/* ---------- 主内容 ---------- */
.main-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 22px 24px 8px;
}

.main-scroll > * {
  max-width: 1240px;
  margin: 0 auto;
}

/* ---------- 页脚 ---------- */
.site-footer {
  flex-shrink: 0;
  padding: 12px 24px;
  border-top: 1px solid var(--line);
  background: rgba(253, 248, 239, 0.9);
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.site-footer .footer-sub {
  margin-top: 2px;
  font-family: var(--font-serif);
  font-size: 11px;
  color: var(--gold);
  letter-spacing: 0.28em;
}

/* ---------- 响应式 ---------- */
@media (max-width: 1024px) {
  .brand-text strong {
    font-size: 16px;
  }
  .nav-link {
    padding: 7px 10px;
    font-size: 13px;
  }
}

@media (max-width: 900px) {
  .desktop-nav {
    display: none;
  }
  .menu-btn {
    display: inline-flex;
  }
  .mobile-nav {
    display: flex;
  }
}

@media (max-width: 768px) {
  .app-container {
    padding: 0;
  }
  .app-content {
    height: calc(100 * var(--vh, 1vh));
    max-height: calc(100 * var(--vh, 1vh));
    border-radius: 0;
    border: 0;
  }
  .main-scroll {
    padding: 16px 14px 8px;
  }
  .header-inner {
    padding: 10px 16px;
  }
  .brand-text small {
    display: none;
  }
  .site-footer {
    padding: 8px 16px;
  }
}

/* iOS 输入框防缩放 */
@media screen and (max-width: 768px) {
  input,
  select,
  textarea {
    font-size: 16px !important;
  }
}
</style>
