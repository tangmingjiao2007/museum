<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 统计数据
const stats = ref([
  { label: '珍贵文物', value: '1280', suffix: '件' },
  { label: '历史照片', value: '860', suffix: '张' },
  { label: '3D展品', value: '68', suffix: '件' },
  { label: '英雄人物', value: '32', suffix: '位' }
])

// 核心展览区域
const exhibitions = ref([
  {
    id: 'weapons',
    title: '铁血兵器',
    subtitle: '抗战武器装备展',
    description: '枪林弹雨中的钢铁意志，每一件武器都镌刻着血与火的传奇。',
    route: '/war-weapons',
    year: '1931-1945',
    image: '/images/步枪.jpg'
  },
  {
    id: 'daily',
    title: '烽火岁月',
    subtitle: '战时生活用品展',
    description: '硝烟中的温情，见证着中华儿女在困境中的坚韧与希望。',
    route: '/war-daily-items',
    year: '1937-1945',
    image: '/images/生活用品/抗战时期新四军军装.jpg'
  },
  {
    id: 'architecture',
    title: '历史遗迹',
    subtitle: '抗战建筑场景展',
    description: '砖瓦间的记忆，每一座建筑都是历史的见证者和守护者。',
    route: '/war-architecture',
    year: '1638-1945',
    image: '/images/建筑物/四行仓库.png'
  },
  {
    id: 'map',
    title: '抗战地图',
    subtitle: '十四年抗战全景',
    description: '全景展示中华民族十四年抗战的历史进程与地理变迁。',
    route: '/war-map',
    year: '1931-1945',
    image: '/中华人民共和国.svg'
  }
])

// 重要历史节点
const historicalNodes = ref([
  { date: '1931.9.18', event: '九一八事变', desc: '日军悍然发动侵华战争，十四年抗战开始', image: '/images/九一八事变.jpg' },
  { date: '1932.1.28', event: '一二八事变', desc: '十九路军英勇抗击日军进攻上海', image: '/images/一二八事变.jpg' },
  { date: '1933.1-5', event: '长城抗战', desc: '喜峰口、罗文峪大刀队夜袭日军', image: '/images/长城抗战.jpg' },
  { date: '1935.12.9', event: '一二九运动', desc: '北平学生掀起抗日救国运动高潮', image: '/images/一二九运动.jpg' },
  { date: '1936.12.12', event: '西安事变', desc: '张学良、杨虎城逼蒋抗日', image: '/images/西安事变.jpg' },
  { date: '1937.7.7', event: '卢沟桥事变', desc: '全面抗战爆发，民族存亡关头', image: '/images/卢沟桥事变.png' },
  { date: '1937.8.13', event: '淞沪会战', desc: '八百壮士四行仓库血战', image: '/images/淞沪会战.jpg' },
  { date: '1937.9.25', event: '平型关大捷', desc: '八路军首战告捷，振奋民心', image: '/images/平型关大捷.jpg' },
  { date: '1937.12.13', event: '南京沦陷', desc: '日军制造惨绝人寰大屠杀', image: '/images/南京沦陷.jpg' },
  { date: '1938.3.24', event: '台儿庄大捷', desc: '李宗仁指挥取得首次重大胜利', image: '/images/台儿庄大捷.jpg' },
  { date: '1938.10.25', event: '武汉会战', desc: '历时四个半月的大规模会战', image: '/images/武汉会战.jpg' },
  { date: '1939.9.14', event: '第一次长沙会战', desc: '薛岳指挥成功保卫长沙', image: '/images/第一次长沙会战.jpg' },
  { date: '1940.8.20', event: '百团大战', desc: '八路军发动最大规模主动出击', image: '/images/百团大战.jpg' },
  { date: '1940.5.5', event: '枣宜会战', desc: '张自忠将军壮烈殉国', image: '/images/枣庄会战.jpg' },
  { date: '1941.12.7', event: '珍珠港事件', desc: '太平洋战争爆发，抗战转入新阶段', image: '/images/珍珠港事件.jpg' },
  { date: '1942.1.3', event: '远征军入缅', desc: '中国军队首次出国作战', image: '/images/远征军入缅.png' },
  { date: '1943.11.5', event: '常德会战', desc: '中美英三国开罗会议召开', image: '/images/常德会战.jpg' },
  { date: '1944.4.18', event: '豫湘桂战役', desc: '日军发动最后大规模攻势', image: '/images/豫湘桂战役.jpg' },
  { date: '1945.4.20', event: '湘西会战', desc: '中国军队最后一次会战胜利', image: '/images/湘西会战.jpg' },
  { date: '1945.8.6', event: '广岛原爆', desc: '美军投下第一颗原子弹', image: '/images/广岛原爆.jpg' },
  { date: '1945.8.9', event: '苏联出兵', desc: '苏军进攻关东军，日本败局已定', image: '/images/苏联出兵.jpg' },
  { date: '1945.8.15', event: '日本投降', desc: '十四年浴血奋战终获全面胜利', image: '/images/日本投降.jpg' },
  { date: '1945.9.2', event: '受降仪式', desc: '密苏里号战舰举行日本投降仪式', image: '/images/受降仪式.jpg' }
])

// 英雄人物
const heroes = ref([
  {
    name: '左权',
    title: '太行山战神',
    party: '共产党',
    description: '八路军副参谋长，牺牲时年仅37岁',
    avatar: '/images/抗战英雄图片/左权.jpg',
    details: '左权（1905-1942），湖南醴陵人，中国共产党军事家。1942年5月任八路军副参谋长，同年5月25日在山西辽县指挥部队突围时壮烈牺牲，是抗战时期中共牺牲的最高级别将领。'
  },
  {
    name: '杨靖宇',
    title: '白山黑水',
    party: '共产党',
    description: '东北抗联总司令，宁死不屈',
    avatar: '/images/抗战英雄图片/杨靖宇.jpg',
    details: '杨靖宇（1905-1940），河南确山人，中国共产党军事家。东北抗日联军创建人和领导人之一，率部在东北坚持游击战争。1940年2月在濛江与日军战斗中壮烈牺牲，日军解剖其胃时发现只有枯草、树皮和棉絮。'
  },
  {
    name: '张自忠',
    title: '民族忠魂',
    party: '国民党',
    description: '抗战殉国最高级别将领，周恩来称"民族忠魂"',
    avatar: '/images/抗战英雄图片/张自忠.jpg',
    details: '张自忠（1891-1940），山东临清人，国民党将领。1940年5月16日在枣宜会战中亲率部队与日军决战，身中7弹仍坚持指挥，壮烈殉国。是抗战中殉国的最高级别将领，周恩来称其为"民族忠魂"。'
  },
  {
    name: '谢晋元',
    title: '八百壮士团长',
    party: '国民党',
    description: '率部死守上海四行仓库，掩护主力撤退',
    avatar: '/images/抗战英雄图片/谢晋元.jpg',
    details: '谢晋元（1905-1941），广东蕉岭人，国民党将领。1937年淞沪会战期间，率部死守上海四行仓库，掩护主力撤退，率"八百壮士"与日军血战四昼夜，威震中外。1941年4月24日被叛兵刺杀殉国。'
  }
])

const navigateTo = (route) => {
  router.push(route)
}

// 图片预览功能
const showImagePreview = ref(false)
const previewImage = ref('')

// 英雄详情功能
const selectedHero = ref(null)
const showHeroDetail = ref(false)

const openHeroDetail = (hero) => {
  selectedHero.value = hero
  showHeroDetail.value = true
}

const closeHeroDetail = () => {
  selectedHero.value = null
  showHeroDetail.value = false
}

// 头像加载错误处理
const handleAvatarError = (event) => {
  event.target.style.display = 'none'
  // 显示首字母作为后备
  const parentDiv = event.target.parentElement
  const fallbackLetter = document.createElement('span')
  fallbackLetter.className = 'avatar-fallback'
  fallbackLetter.textContent = selectedHero.value.name.charAt(0)
  parentDiv.appendChild(fallbackLetter)
}

// 卡片头像加载错误处理
const handleCardAvatarError = (event) => {
  event.target.style.display = 'none'
  // 显示首字母作为后备
  const parentDiv = event.target.parentElement
  const fallbackLetter = document.createElement('span')
  fallbackLetter.className = 'avatar-fallback'
  fallbackLetter.textContent = event.target.alt.charAt(0)
  parentDiv.appendChild(fallbackLetter)
}

const openImagePreview = (imageSrc) => {
  previewImage.value = imageSrc
  showImagePreview.value = true
}

const closeImagePreview = () => {
  showImagePreview.value = false
  previewImage.value = ''
}
</script>

<template>
  <div class="home-page">
    <!-- 主视觉 -->
    <section class="home-hero">
      <img class="hero-bg" src="/images/卢沟桥事变.png" alt="卢沟桥事变" />
      <div class="hero-shade"></div>

      <div class="hero-body">
        <span class="hero-kicker">1931 — 1945 · 十四年抗战</span>
        <h1>中国人民抗日战争<br />纪念博物馆</h1>
        <p class="hero-desc">
          以文物为证，以数据为尺，回望那段山河不屈的岁月。
        </p>

        <div class="hero-actions">
          <button class="ui-btn" @click="navigateTo('/war-exhibit')">踏入历史殿堂</button>
          <button class="ui-btn ui-btn--ghost" @click="navigateTo('/war-map')">浏览抗战地图</button>
        </div>

        <div class="hero-dates">
          <div class="hero-date">
            <span>1931.9.18</span>
            <small>九一八事变 · 抗战起点</small>
          </div>
          <div class="hero-date">
            <span>1945.8.15</span>
            <small>日本投降 · 民族胜利</small>
          </div>
        </div>
      </div>
    </section>

    <!-- 馆藏统计 -->
    <section class="stat-strip">
      <div v-for="(stat, index) in stats" :key="index" class="stat-cell">
        <div class="stat-value">
          {{ stat.value }}<span>{{ stat.suffix }}</span>
        </div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </section>

    <!-- 抗战编年 -->
    <section class="home-section">
      <div class="ui-section-head">
        <h2 class="ui-section-title">抗战编年</h2>
        <span class="ui-section-note">血火十四载 · 二十三个历史节点</span>
      </div>

      <div class="chronicle-grid">
        <article
          v-for="(node, index) in historicalNodes"
          :key="index"
          class="chronicle-card"
          @click="openImagePreview(node.image)"
        >
          <div class="chronicle-media">
            <img
              :src="node.image"
              :alt="node.event"
              loading="lazy"
              @error="$event.target.style.display = 'none'"
            />
          </div>
          <div class="chronicle-body">
            <span class="chronicle-date">{{ node.date }}</span>
            <h3>{{ node.event }}</h3>
            <p>{{ node.desc }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- 展览殿堂 -->
    <section class="home-section">
      <div class="ui-section-head">
        <h2 class="ui-section-title">展览殿堂</h2>
        <span class="ui-section-note">四大展厅 · 分类陈列</span>
      </div>

      <div class="exhibit-grid">
        <article
          v-for="exhibition in exhibitions"
          :key="exhibition.id"
          class="exhibit-card"
          @click="navigateTo(exhibition.route)"
        >
          <div class="exhibit-media">
            <img :src="exhibition.image" :alt="exhibition.title" loading="lazy" />
            <span class="exhibit-year">{{ exhibition.year }}</span>
          </div>
          <div class="exhibit-body">
            <span class="exhibit-subtitle">{{ exhibition.subtitle }}</span>
            <h3>{{ exhibition.title }}</h3>
            <p>{{ exhibition.description }}</p>
            <span class="exhibit-more">深入参观 →</span>
          </div>
        </article>
      </div>
    </section>

    <!-- 英烈千秋 -->
    <section class="home-section">
      <div class="ui-section-head">
        <h2 class="ui-section-title">英烈千秋</h2>
        <span class="ui-section-note">点击卡片查看生平</span>
      </div>

      <div class="hero-grid">
        <article
          v-for="(hero, index) in heroes"
          :key="index"
          class="hero-card"
          @click="openHeroDetail(hero)"
        >
          <div class="hero-avatar">
            <img
              :src="hero.avatar"
              :alt="hero.name + '头像'"
              loading="lazy"
              @error="handleCardAvatarError"
            />
          </div>
          <h3>{{ hero.name }}</h3>
          <p class="hero-title">{{ hero.title }}</p>
          <span
            class="hero-party"
            :class="hero.party === '共产党' ? 'is-cpc' : 'is-kmt'"
          >{{ hero.party }}</span>
        </article>
      </div>
    </section>

    <!-- 结语 -->
    <section class="home-cta">
      <div class="cta-inner">
        <span class="cta-kicker">铭记历史 · 珍爱和平</span>
        <h2>一个有希望的民族不能没有英雄<br />一个有前途的国家不能没有先锋</h2>
        <p>历史是最好的教科书，也是最好的清醒剂。</p>
        <button class="ui-btn ui-btn--ghost" @click="navigateTo('/war-exhibit')">
          开启历史征程
        </button>
      </div>
    </section>

    <!-- 图片预览模态框 -->
    <div
      v-if="showImagePreview"
      class="modal-mask"
      @click="closeImagePreview"
    >
      <div class="preview-box" @click.stop>
        <button class="modal-close" @click="closeImagePreview">✕</button>
        <img :src="previewImage" alt="历史图片预览" />
      </div>
    </div>

    <!-- 英雄详情模态框 -->
    <div
      v-if="showHeroDetail && selectedHero"
      class="modal-mask"
      @click="closeHeroDetail"
    >
      <div class="hero-modal" @click.stop>
        <div class="hero-modal-head">
          <div>
            <span class="hero-party" :class="selectedHero.party === '共产党' ? 'is-cpc' : 'is-kmt'">
              {{ selectedHero.party }}
            </span>
            <h3>{{ selectedHero.name }}</h3>
            <p>{{ selectedHero.title }}</p>
          </div>
          <button class="modal-close" @click="closeHeroDetail">✕</button>
        </div>

        <div class="hero-modal-body">
          <div class="hero-modal-avatar">
            <img
              :src="selectedHero.avatar"
              :alt="selectedHero.name + '头像'"
              @error="handleAvatarError"
            />
          </div>
          <div class="hero-modal-text">
            <h4>英雄简介</h4>
            <p>{{ selectedHero.description }}</p>
            <h4>详细事迹</h4>
            <p>{{ selectedHero.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 34px;
  padding-bottom: 24px;
}

/* ---------- 主视觉 ---------- */
.home-hero {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid var(--line);
  min-height: 420px;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 26px 60px -48px rgba(84, 48, 28, 0.8);
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
}

.hero-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(100deg, rgba(38, 22, 15, 0.88) 0%, rgba(48, 27, 18, 0.62) 45%, rgba(48, 27, 18, 0.12) 100%),
    linear-gradient(0deg, rgba(38, 22, 15, 0.55) 0%, rgba(38, 22, 15, 0) 55%);
}

.hero-body {
  position: relative;
  z-index: 1;
  padding: 44px 48px 36px;
  max-width: 640px;
  color: #fdf4e6;
}

.hero-kicker {
  display: inline-block;
  padding: 4px 14px;
  border: 1px solid rgba(253, 244, 230, 0.4);
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: #f3e3c9;
}

.hero-body h1 {
  margin-top: 18px;
  font-size: 44px;
  line-height: 1.28;
  letter-spacing: 0.06em;
  color: #fff8ec;
}

.hero-desc {
  margin-top: 14px;
  font-size: 15px;
  color: rgba(255, 246, 233, 0.82);
  letter-spacing: 0.04em;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

.hero-actions .ui-btn--ghost {
  background: rgba(255, 250, 240, 0.12);
  border-color: rgba(255, 250, 240, 0.45);
  color: #fff8ec;
}
.hero-actions .ui-btn--ghost:hover {
  background: rgba(255, 250, 240, 0.22);
  border-color: rgba(255, 250, 240, 0.7);
  color: #fff;
}

.hero-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 36px;
  margin-top: 34px;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 246, 233, 0.22);
}

.hero-date span {
  display: block;
  font-family: var(--font-serif);
  font-size: 22px;
  letter-spacing: 0.08em;
  color: #f6e4c8;
}

.hero-date small {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: rgba(255, 246, 233, 0.66);
}

/* ---------- 统计数据 ---------- */
.stat-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--line);
}

.stat-cell {
  padding: 22px 20px;
  background: var(--card);
  text-align: center;
}

.stat-value {
  font-family: var(--font-serif);
  font-size: 30px;
  font-weight: 700;
  color: var(--red-deep);
  line-height: 1.2;
}

.stat-value span {
  margin-left: 3px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 400;
  color: var(--muted);
}

.stat-label {
  margin-top: 4px;
  font-size: 13px;
  letter-spacing: 0.12em;
  color: var(--muted);
}

/* ---------- 区块 ---------- */
.home-section {
  padding-top: 2px;
}

/* ---------- 编年卡片 ---------- */
.chronicle-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.chronicle-card {
  display: flex;
  gap: 14px;
  padding: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--card);
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.chronicle-card:hover {
  transform: translateY(-2px);
  border-color: rgba(167, 56, 42, 0.35);
  box-shadow: 0 16px 30px -26px rgba(84, 48, 28, 0.7);
}

.chronicle-media {
  flex: 0 0 104px;
  height: 104px;
  overflow: hidden;
  border-radius: 12px;
  background: var(--paper-deep);
}

.chronicle-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.85) contrast(1.02);
}

.chronicle-body {
  min-width: 0;
}

.chronicle-date {
  font-family: var(--font-serif);
  font-size: 12px;
  letter-spacing: 0.12em;
  color: var(--red);
}

.chronicle-body h3 {
  margin-top: 4px;
  font-size: 16px;
  color: var(--ink);
}

.chronicle-body p {
  margin-top: 4px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ---------- 展厅 ---------- */
.exhibit-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.exhibit-card {
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--card);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.exhibit-card:hover {
  transform: translateY(-3px);
  border-color: rgba(167, 56, 42, 0.3);
  box-shadow: 0 26px 44px -38px rgba(84, 48, 28, 0.85);
}

.exhibit-media {
  position: relative;
  height: 190px;
  background: var(--paper-deep);
}

.exhibit-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.88);
  transition: transform 0.4s ease;
}

.exhibit-card:hover .exhibit-media img {
  transform: scale(1.03);
}

.exhibit-card:nth-child(4) .exhibit-media img {
  object-fit: contain;
  padding: 18px;
}

.exhibit-year {
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(255, 250, 240, 0.9);
  color: var(--red-deep);
  font-size: 11px;
  letter-spacing: 0.08em;
}

.exhibit-body {
  padding: 18px 20px 20px;
}

.exhibit-subtitle {
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--gold);
}

.exhibit-body h3 {
  margin-top: 4px;
  font-size: 22px;
  color: var(--ink);
}

.exhibit-body p {
  margin-top: 6px;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--ink-2);
}

.exhibit-more {
  display: inline-block;
  margin-top: 12px;
  font-family: var(--font-serif);
  font-size: 13px;
  color: var(--red);
}

/* ---------- 英雄卡片 ---------- */
.hero-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.hero-card {
  padding: 22px 16px 18px;
  text-align: center;
  cursor: pointer;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--card);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.hero-card:hover {
  transform: translateY(-3px);
  border-color: rgba(167, 56, 42, 0.35);
  box-shadow: 0 20px 36px -30px rgba(84, 48, 28, 0.8);
}

.hero-avatar {
  width: 84px;
  height: 84px;
  margin: 0 auto 12px;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--paper-deep);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.15) saturate(0.9);
}

.hero-card h3 {
  font-size: 18px;
  color: var(--ink);
}

.hero-title {
  margin-top: 3px;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.hero-party {
  display: inline-block;
  margin-top: 10px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 0.06em;
}

.hero-party.is-cpc {
  background: var(--red-soft);
  color: var(--red-deep);
}

.hero-party.is-kmt {
  background: var(--gold-soft);
  color: #7a5a2e;
}

.avatar-fallback {
  font-family: var(--font-serif);
  font-size: 26px;
  color: var(--red);
}

/* ---------- 结语 ---------- */
.home-cta {
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(167, 56, 42, 0.25);
  background:
    radial-gradient(80% 120% at 15% 0%, rgba(255, 240, 224, 0.16) 0%, transparent 55%),
    linear-gradient(115deg, #8a2c21 0%, #a7382a 60%, #b24a33 100%);
}

.cta-inner {
  padding: 40px 48px;
  color: #fdf3e3;
}

.cta-kicker {
  font-size: 12px;
  letter-spacing: 0.3em;
  color: rgba(253, 243, 227, 0.7);
}

.cta-inner h2 {
  margin-top: 12px;
  font-size: 26px;
  line-height: 1.6;
  color: #fff8ec;
  letter-spacing: 0.05em;
}

.cta-inner p {
  margin-top: 10px;
  font-size: 14px;
  color: rgba(253, 243, 227, 0.78);
}

.cta-inner .ui-btn--ghost {
  margin-top: 20px;
  background: rgba(255, 248, 236, 0.12);
  border-color: rgba(255, 248, 236, 0.5);
  color: #fff8ec;
}

.cta-inner .ui-btn--ghost:hover {
  background: rgba(255, 248, 236, 0.24);
  color: #fff;
}

/* ---------- 模态框 ---------- */
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(38, 24, 16, 0.55);
  backdrop-filter: blur(4px);
}

.preview-box {
  position: relative;
  max-width: 900px;
  max-height: 88vh;
  padding: 10px;
  border-radius: 16px;
  background: var(--card);
  border: 1px solid var(--line);
}

.preview-box img {
  display: block;
  max-width: 100%;
  max-height: 82vh;
  object-fit: contain;
  border-radius: 10px;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: rgba(255, 252, 245, 0.92);
  color: var(--ink-2);
  font-size: 14px;
}

.modal-close:hover {
  background: var(--red-soft);
  color: var(--red-deep);
}

.hero-modal {
  width: min(720px, 100%);
  max-height: 86vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: var(--card);
}

.hero-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px;
  border-bottom: 1px solid var(--line);
  background: var(--card-soft);
}

.hero-modal-head h3 {
  margin-top: 6px;
  font-size: 24px;
  color: var(--red-deep);
}

.hero-modal-head p {
  font-size: 13px;
  color: var(--muted);
}

.hero-modal-body {
  display: flex;
  gap: 24px;
  padding: 24px;
  overflow-y: auto;
}

.hero-modal-avatar {
  flex: 0 0 150px;
  width: 150px;
  height: 190px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--paper-deep);
}

.hero-modal-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-modal-text h4 {
  margin-top: 14px;
  font-size: 15px;
  color: var(--red-deep);
}

.hero-modal-text h4:first-child {
  margin-top: 0;
}

.hero-modal-text p {
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.85;
  color: var(--ink-2);
}

/* ---------- 响应式 ---------- */
@media (max-width: 1100px) {
  .chronicle-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .hero-body {
    padding: 32px 30px 28px;
  }
  .hero-body h1 {
    font-size: 34px;
  }
  .hero-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .home-page {
    gap: 26px;
  }
  .home-hero {
    min-height: 380px;
  }
  .hero-body {
    padding: 26px 20px 24px;
  }
  .hero-body h1 {
    font-size: 27px;
  }
  .hero-dates {
    gap: 20px;
  }
  .stat-strip {
    grid-template-columns: repeat(2, 1fr);
  }
  .chronicle-grid {
    grid-template-columns: 1fr;
  }
  .exhibit-grid {
    grid-template-columns: 1fr;
  }
  .exhibit-media {
    height: 170px;
  }
  .cta-inner {
    padding: 28px 22px;
  }
  .cta-inner h2 {
    font-size: 20px;
  }
  .hero-modal-body {
    flex-direction: column;
  }
  .hero-modal-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
}
</style>
