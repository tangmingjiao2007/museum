<template>
  <div class="about-page">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-emblem">
          <div class="emblem-outer">
            <div class="emblem-inner">
              <span class="emblem-text" style="font-size: 2.5rem;">数字</span>
              <span class="emblem-subtitle" style="font-size: 1.2rem; margin-top: 11px;">博物馆</span>
            </div>
          </div>
        </div>
        <h1 class="hero-title" style="white-space: nowrap;">中国人民抗日战争数字纪念馆</h1>
        <p class="hero-subtitle">用科技传承历史 · 以数字缅怀英烈 · 让文物活起来</p>
        <div class="hero-quote">
          <span class="quote-mark">"</span>
          让每个人都能随时随地感受历史，传承民族记忆
          <span class="quote-mark">"</span>
        </div>
      </div>
    </section>

    <!-- 项目介绍 -->
    <section class="intro-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">项目介绍</h2>
          <div class="title-decoration"></div>
        </div>
        <div class="intro-content">
          <div class="intro-text">
            <h3 class="intro-subtitle">致力于数字化保护和传承抗战历史</h3>
            <p class="intro-desc">
              本项目是一个基于现代Web技术开发的线上数字化博物馆，专门展示中国人民抗日战争的珍贵历史文物、
              重要历史事件和英雄人物事迹。通过数字化手段，让珍贵的历史文物突破时空限制，
              为全球用户提供沉浸式的历史学习体验。
            </p>
            <div class="project-highlights">
              <div class="highlight-item" v-for="(item, index) in projectHighlights" :key="index" style="margin-bottom: 28px;">
                <div class="highlight-icon">{{ item.icon }}</div>
                <div class="highlight-text">
                  <h4 style="font-size:1.25rem; margin:0 0 6px 0;">{{ item.title }}</h4>
                  <p style="font-size:1rem; line-height:1.7; margin:0;">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="intro-stats">
            <div class="stat-card" v-for="(stat, index) in projectStats" :key="index">
              <div class="stat-icon">{{ stat.icon }}</div>
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">核心功能特色</h2>
          <div class="title-decoration"></div>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in coreFeatures" :key="index">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
            <div class="feature-tech">
              <span v-for="tech in feature.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术架构 -->
    <section class="tech-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">技术架构</h2>
          <div class="title-decoration"></div>
        </div>
        <div class="tech-content">
          <div class="tech-stack">
            <h3 class="tech-subtitle">前端技术栈</h3>
            <div class="tech-grid">
              <div class="tech-item" v-for="(tech, index) in frontendTech" :key="index">
                <div class="tech-icon">{{ tech.icon }}</div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="tech-features">
            <h3 class="tech-subtitle">技术特色</h3>
            <div class="feature-list">
              <div class="feature-list-item" v-for="(item, index) in techFeatures" :key="index">
                <div class="feature-bullet">{{ item.icon }}</div>
                <div class="feature-content">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 教育价值 -->
    <section class="education-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">教育价值与意义</h2>
          <div class="title-decoration"></div>
        </div>
        <div class="education-content">
          <div class="value-cards">
            <div class="value-card" v-for="(value, index) in educationValues" :key="index">
              <div class="value-icon">{{ value.icon }}</div>
              <h3 class="value-title">{{ value.title }}</h3>
              <p class="value-desc">{{ value.description }}</p>
              <ul class="value-points">
                <li v-for="point in value.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用指南 -->
    <section class="guide-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">使用指南</h2>
          <div class="title-decoration"></div>
        </div>
        <div class="guide-content">
          <div class="guide-steps">
            <div class="step-item" v-for="(step, index) in userGuide" :key="index">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-desc">{{ step.description }}</p>
                <div class="step-tips" v-if="step.tips">
                  <strong>小贴士：</strong>{{ step.tips }}
                </div>
              </div>
            </div>
          </div>
          <div class="guide-sidebar">
            <div class="accessibility-info">
              <h3 class="sidebar-title">无障碍访问</h3>
              <ul class="accessibility-list">
                <li>支持键盘导航</li>
                <li>响应式设计适配移动设备</li>
                <li>高对比度色彩方案</li>
                <li>图片提供替代文本描述</li>
              </ul>
            </div>
            <div class="browser-support">
              <h3 class="sidebar-title">浏览器支持</h3>
              <div class="browser-list">
                <div class="browser-item">Chrome 90+</div>
                <div class="browser-item">Firefox 88+</div>
                <div class="browser-item">Safari 14+</div>
                <div class="browser-item">Edge 90+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 开发团队 -->
    <section class="team-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">项目信息</h2>
          <div class="title-decoration"></div>
        </div>
        <div class="team-content">
          <div class="project-info">
            <h3 class="info-subtitle">项目概况</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>项目性质：</strong>教育展示类数字化博物馆
              </div>
              <div class="info-item">
                <strong>开发目的：</strong>传承抗战历史，弘扬爱国精神
              </div>
              <div class="info-item">
                <strong>技术特色：</strong>3D文物展示、交互式地图、数据可视化
              </div>
              <div class="info-item">
                <strong>适用人群：</strong>学生、教师、历史爱好者、研究人员
              </div>
            </div>
          </div>
          <div class="contact-info">
            <h3 class="info-subtitle">交流与反馈</h3>
            <p class="contact-desc">
              我们欢迎您的宝贵意见和建议，帮助我们不断改进和完善这个数字化博物馆项目。
            </p>
            <div class="feedback-options">
              <div class="feedback-item">
                <div class="feedback-icon">💬</div>
                <div class="feedback-text">
                  <h4>功能建议</h4>
                  <p>对展示方式和交互功能的改进建议</p>
                </div>
              </div>
              <div class="feedback-item">
                <div class="feedback-icon">📚</div>
                <div class="feedback-text">
                  <h4>内容补充</h4>
                  <p>提供更多珍贵的历史资料和文物信息</p>
                </div>
              </div>
              <div class="feedback-item">
                <div class="feedback-icon">🐛</div>
                <div class="feedback-text">
                  <h4>问题反馈</h4>
                  <p>报告使用过程中遇到的技术问题</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚引言 -->
    <section class="footer-quote">
      <div class="container">
        <div class="quote-content">
          <h2 class="quote-title">用科技点亮历史，让记忆永不褪色</h2>
          <p class="quote-text">
            通过数字化技术，我们让珍贵的历史文物和英雄事迹触手可及，
            让每一位用户都能深入了解那段波澜壮阔的抗战历史，传承不朽的民族精神。
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 项目亮点
const projectHighlights = ref([
  {
    icon: '🏛️',
    title: '文物数字化展示',
    description: '运用3D建模技术，真实还原历史文物细节'
  },
  {
    icon: '🗺️',
    title: '交互式历史地图',
    description: '动态展示战争进程和历史事件地理分布'
  },
  {
    icon: '📊',
    title: '数据可视化分析',
    description: '用图表和统计数据深度解读历史'
  },
  {
    icon: '💻',
    title: '响应式Web设计',
    description: '适配各种设备，随时随地学习历史'
  }
])

// 项目数据统计
const projectStats = ref([
  { icon: '⚔️', number: '30+', label: '武器装备展品' },
  { icon: '🏗️', number: '20+', label: '建筑场景模型' },
  { icon: '📅', number: '100+', label: '重要历史事件' },
  { icon: '🌍', number: '34', label: '省份战况数据' }
])

// 核心功能
const coreFeatures = ref([
  {
    icon: '🎯',
    title: '3D文物展示',
    description: '使用Model Viewer技术展示高精度3D文物模型，支持360度旋转查看，提供沉浸式观赏体验。',
    technologies: ['Model Viewer', 'GLB格式', '3D渲染']
  },
  {
    icon: '🗺️',
    title: '交互式地图',
    description: '基于ECharts和GeoJSON数据构建的中国地图，动态展示不同年份的战争态势和控制区域变化。',
    technologies: ['ECharts', 'GeoJSON', '地理数据']
  },
  {
    icon: '📊',
    title: '数据可视化',
    description: '运用多种图表形式展示战争数据、伤亡统计、战役分析等信息，让历史数据更加直观。',
    technologies: ['Chart.js', 'D3.js', '统计分析']
  },
  {
    icon: '📱',
    title: '响应式设计',
    description: '采用Tailwind CSS框架，确保在桌面、平板、手机等各种设备上都有优良的用户体验。',
    technologies: ['Tailwind CSS', '移动优先', '自适应布局']
  },
  {
    icon: '⚡',
    title: '现代化架构',
    description: '基于Vue 3和Vite构建，采用组合式API和模块化设计，保证应用性能和开发效率。',
    technologies: ['Vue 3', 'Vite', 'ES6+']
  },
  {
    icon: '🎨',
    title: '历史主题设计',
    description: '采用红金配色方案和传统文化元素，营造庄重的历史氛围，增强用户的情感体验。',
    technologies: ['CSS动画', '主题定制', 'UI设计']
  }
])

// 前端技术栈
const frontendTech = ref([
  {
    icon: '⚡',
    name: 'Vue 3 + Vite',
    description: '现代化的前端框架和构建工具，提供快速开发和热更新'
  },
  {
    icon: '🎨',
    name: 'Tailwind CSS',
    description: '原子化CSS框架，实现快速样式开发和响应式设计'
  },
  {
    icon: '🔗',
    name: 'Vue Router 4',
    description: '官方路由管理器，实现单页应用的页面导航'
  },
  {
    icon: '📊',
    name: 'ECharts',
    description: '强大的数据可视化库，用于地图和图表展示'
  },
  {
    icon: '🎮',
    name: 'Model Viewer',
    description: 'Google开发的3D模型展示组件，支持GLB格式'
  }
])

// 技术特色
const techFeatures = ref([
  {
    icon: '🚀',
    title: '高性能渲染',
    description: '优化的组件加载和3D模型渲染，确保流畅的用户体验'
  },
  {
    icon: '📱',
    title: '跨平台兼容',
    description: '支持主流浏览器和移动设备，无需安装额外插件'
  },
  {
    icon: '🔧',
    title: '模块化开发',
    description: '组件化架构设计，便于维护和功能扩展'
  },
  {
    icon: '♿',
    title: '无障碍访问',
    description: '遵循Web无障碍标准，为更多用户提供平等的访问体验'
  }
])

// 教育价值
const educationValues = ref([
  {
    icon: '📚',
    title: '历史教育普及',
    description: '让更多人了解抗日战争历史，增强民族自豪感和历史责任感',
    points: [
      '突破地域限制，全球用户都能访问',
      '生动的3D展示增强学习兴趣',
      '详细的历史资料提供深度学习'
    ]
  },
  {
    icon: '🎓',
    title: '教学辅助工具',
    description: '为教师和学生提供丰富的数字化教学资源',
    points: [
      '可作为历史课程的补充材料',
      '交互式体验提升课堂参与度',
      '多媒体内容适合不同学习风格'
    ]
  },
  {
    icon: '🔬',
    title: '学术研究支持',
    description: '为历史研究者提供数字化的史料查阅平台',
    points: [
      '高精度文物模型支持细节研究',
      '地理数据帮助分析历史事件',
      '统计图表便于数据分析'
    ]
  },
  {
    icon: '🌍',
    title: '文化传承载体',
    description: '利用现代技术手段保护和传承珍贵的历史文化',
    points: [
      '数字化保存避免文物损坏',
      '多语言支持促进国际交流',
      '持续更新丰富展示内容'
    ]
  }
])

// 使用指南
const userGuide = ref([
  {
    title: '首页浏览',
    description: '从首页开始，了解博物馆概况和重要历史事件时间线',
    tips: '点击时间线上的图片可以查看大图'
  },
  {
    title: '文物展览',
    description: '进入"抗战展示"页面，浏览武器装备和建筑场景的3D模型',
    tips: '可以拖拽旋转3D模型，双击重置视角'
  },
  {
    title: '历史地图',
    description: '通过交互式中国地图，了解不同时期的战争态势',
    tips: '选择不同年份查看历史控制区域变化'
  },
  {
    title: '数据分析',
    description: '在战役数据页面查看详细的战争统计和分析图表',
    tips: '点击具体战役可以查看详细信息和地理位置'
  }
])

// 浮动元素样式和图标函数
const getFloatingStyle = (index) => {
  const positions = [
    { top: '10%', left: '10%', animationDelay: '0s' },
    { top: '20%', right: '15%', animationDelay: '2s' },
    { top: '30%', left: '20%', animationDelay: '4s' },
    { top: '40%', right: '10%', animationDelay: '1s' },
    { top: '50%', left: '15%', animationDelay: '3s' },
    { top: '60%', right: '20%', animationDelay: '5s' },
    { top: '70%', left: '10%', animationDelay: '2.5s' },
    { top: '80%', right: '15%', animationDelay: '4.5s' }
  ]
  return positions[index - 1] || positions[0]
}

const getFloatingIcon = (index) => {
  const icons = ['💻', '🗺️', '📊', '🎯', '📱', '⚡', '🎨', '🔧']
  return icons[index - 1] || icons[0]
}
</script>

<style scoped>
.about-page {
  min-height: auto;
  background: transparent;
  color: #2e231a;
  font-family: var(--font-serif);
}

/* 英雄区域 */
.hero-section {
  min-height: auto;
  padding: 64px 0 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(167, 56, 42, 0.06) 0%, transparent 70%);
}

.hero-content {
  text-align: center;
  z-index: 10;
  position: relative;
  max-width: 800px;
  padding: 0 20px;
}

.hero-emblem {
  margin-bottom: 30px;
}

.emblem-outer {
  width: 150px;
  height: 150px;
  border: 6px solid #b9945e;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  background: linear-gradient(145deg, #8B1A1A, #8a2c21);
  box-shadow: 0 10px 30px rgba(139, 26, 26, 0.4);
}

.emblem-inner {
  position: absolute;
  inset: 10px;
  border: 3px solid #b9945e;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, #8B1A1A, #8a2c21);
}

.emblem-text {
  font-size: 32px;
  font-weight: bold;
  color: #f6e2da;
  line-height: 1;
}

.emblem-subtitle {
  font-size: 14px;
  color: #faf4e9;
  margin-top: 4px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #a7382a;
  text-shadow: none;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #3A2A1A;
  opacity: 0.9;
}

.hero-quote {
  font-size: 1.2rem;
  font-style: italic;
  color: #8B1A1A;
  background: rgba(139, 26, 26, 0.06);
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #b9945e;
  margin-top: 30px;
}

.quote-mark {
  font-size: 1.5rem;
  color: #b9945e;
  font-weight: bold;
}

@keyframes titleGlow {
  0% { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15), 0 0 20px rgba(139, 26, 26, 0.2); }
  100% { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15), 0 0 30px rgba(139, 26, 26, 0.35); }
}

/* 浮动装饰元素 */
.hero-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.4));
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  25% { transform: translateY(-20px) rotate(5deg); opacity: 0.5; }
  50% { transform: translateY(-10px) rotate(-3deg); opacity: 0.4; }
  75% { transform: translateY(-15px) rotate(2deg); opacity: 0.6; }
}

/* 通用样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #a7382a;
  margin-bottom: 20px;
}

.title-decoration {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #a7382a, #a7382a, #a7382a);
  margin: 0 auto;
  border-radius: 2px;
}

/* 各个区域 */
.intro-section,
.features-section,
.tech-section,
.education-section,
.guide-section,
.team-section {
  padding: 80px 0;
  background: rgba(249, 238, 227, 0.55);
}

.features-section,
.education-section,
.team-section {
  background: rgba(253, 247, 236, 0.75);
}

/* 项目介绍 */
.intro-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  align-items: start;
}

.intro-subtitle {
  font-size: 1.8rem;
  color: #a7382a;
  margin-bottom: 20px;
  font-weight: bold;
}

.intro-desc {
  color: #4a392b;
  line-height: 1.8;
  margin-bottom: 40px;
  font-size: 1.1rem;
  opacity: 0.9;
}

.project-highlights {
  display: grid;
  gap: 20px;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #fffcf5;
  padding: 20px;
  border-radius: 10px;
  border-left: 2px solid #a7382a;
}

.highlight-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.highlight-text h4 {
  color: #a7382a;
  margin-bottom: 5px;
  font-weight: bold;
}

.highlight-text p {
  color: #4a392b;
  font-size: 0.9rem;
  opacity: 0.9;
}

.intro-stats {
  display: grid;
  gap: 25px;
}

.stat-card {
  text-align: center;
  background: linear-gradient(145deg, #fffcf5, #fdf7ec);
  padding: 30px 20px;
  border-radius: 15px;
  border: 1px solid #e8d8c4;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(167, 56, 42, 0.12);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #a7382a;
  margin-bottom: 8px;
}

.stat-label {
  color: #4a392b;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 功能特色 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

.feature-card {
  background: linear-gradient(145deg, #fffcf5, #fdf7ec);
  padding: 40px 30px;
  border-radius: 15px;
  border: 1px solid #e8d8c4;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(167, 56, 42, 0.12);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 1.5rem;
  color: #a7382a;
  margin-bottom: 15px;
  font-weight: bold;
}

.feature-desc {
  color: #4a392b;
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.9;
}

.feature-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background: rgba(167, 56, 42, 0.12);
  color: #a7382a;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

/* 技术架构 */
.tech-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.tech-subtitle {
  font-size: 1.8rem;
  color: #a7382a;
  margin-bottom: 30px;
  font-weight: bold;
}

.tech-grid {
  display: grid;
  gap: 20px;
}

.tech-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #fffcf5;
  padding: 20px;
  border-radius: 10px;
  border-left: 2px solid #a7382a;
}

.tech-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.tech-info h4 {
  color: #a7382a;
  margin-bottom: 5px;
  font-weight: bold;
}

.tech-info p {
  color: #4a392b;
  font-size: 0.9rem;
  opacity: 0.9;
}

.feature-list {
  display: grid;
  gap: 20px;
}

.feature-list-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #fffcf5;
  padding: 20px;
  border-radius: 10px;
  border-left: 2px solid #a7382a;
}

.feature-bullet {
  font-size: 1.2rem;
  flex-shrink: 0;
  color: #a7382a;
}

.feature-content h4 {
  color: #a7382a;
  margin-bottom: 5px;
  font-weight: bold;
}

.feature-content p {
  color: #4a392b;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 教育价值 */
.value-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.value-card {
  background: linear-gradient(145deg, #fffcf5, #fdf7ec);
  padding: 40px 30px;
  border-radius: 15px;
  border: 1px solid #e8d8c4;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.value-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(167, 56, 42, 0.12);
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.value-title {
  font-size: 1.5rem;
  color: #a7382a;
  margin-bottom: 15px;
  font-weight: bold;
}

.value-desc {
  color: #4a392b;
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.9;
}

.value-points {
  list-style: none;
  padding: 0;
}

.value-points li {
  color: #4a392b;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  opacity: 0.8;
}

.value-points li::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: #a7382a;
  font-size: 0.8rem;
}

/* 使用指南 */
.guide-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
}

.guide-steps {
  display: grid;
  gap: 30px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: #fffcf5;
  padding: 30px;
  border-radius: 15px;
  border-left: 2px solid #a7382a;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #a7382a;
  color: #7f1d1d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.step-title {
  color: #a7382a;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1.2rem;
}

.step-desc {
  color: #4a392b;
  line-height: 1.6;
  margin-bottom: 10px;
  opacity: 0.9;
}

.step-tips {
  color: #a7382a;
  font-style: italic;
  font-size: 0.9rem;
}

.guide-sidebar {
  display: grid;
  gap: 30px;
  align-content: start;
}

.accessibility-info,
.browser-support {
  background: linear-gradient(145deg, #fffcf5, #fdf7ec);
  padding: 30px;
  border-radius: 15px;
  border: 1px solid #e8d8c4;
}

.sidebar-title {
  color: #a7382a;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 1.2rem;
}

.accessibility-list {
  list-style: none;
  padding: 0;
}

.accessibility-list li {
  color: #4a392b;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  opacity: 0.9;
}

.accessibility-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #a7382a;
  font-weight: bold;
}

.browser-list {
  display: grid;
  gap: 10px;
}

.browser-item {
  background: rgba(251, 191, 36, 0.1);
  color: #a7382a;
  padding: 10px 15px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

/* 项目信息 */
.team-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.info-subtitle {
  font-size: 1.8rem;
  color: #a7382a;
  margin-bottom: 30px;
  font-weight: bold;
}

.info-grid {
  display: grid;
  gap: 20px;
}

.info-item {
  background: #fffcf5;
  padding: 20px;
  border-radius: 10px;
  border-left: 2px solid #a7382a;
  color: #4a392b;
  line-height: 1.6;
}

.info-item strong {
  color: #a7382a;
}

.contact-desc {
  color: #4a392b;
  line-height: 1.8;
  margin-bottom: 30px;
  opacity: 0.9;
}

.feedback-options {
  display: grid;
  gap: 20px;
}

.feedback-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #fffcf5;
  padding: 20px;
  border-radius: 10px;
  border-left: 2px solid #a7382a;
}

.feedback-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feedback-text h4 {
  color: #a7382a;
  margin-bottom: 5px;
  font-weight: bold;
}

.feedback-text p {
  color: #4a392b;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 页脚引言 */
.footer-quote {
  background: linear-gradient(135deg, #7f1d1d, #991b1b);
  padding: 80px 0;
  text-align: center;
  border-top: 4px solid #a7382a;
}

.quote-content {
  max-width: 800px;
  margin: 0 auto;
}

.quote-title {
  font-size: 2.5rem;
  color: #a7382a;
  margin-bottom: 30px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.quote-text {
  font-size: 1.3rem;
  color: #4a392b;
  line-height: 1.8;
  opacity: 0.9;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .intro-content,
  .tech-content,
  .guide-content,
  .team-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .quote-title {
    font-size: 1.8rem;
  }
  
  .quote-text {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .value-cards {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 0 15px;
  }
}
/* 装饰性 emoji 图标统一收起，保持纸面排版 */
.highlight-icon,
.stat-icon,
.feature-icon,
.tech-icon,
.value-icon,
.feedback-icon {
  display: none;
}

</style>
