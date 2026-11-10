<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 统计数据
const stats = ref([
  { label: '珍贵文物', icon: '📜' },
  { label: '历史照片', icon: '🖼️' },
  { label: '3D展品', icon: '🏺' },
  { label: '英雄人物', icon: '👥' }
])

// 核心展览区域
const exhibitions = ref([
  {
    id: 'weapons',
    title: '铁血兵器',
    subtitle: '抗战武器装备展',
    description: '枪林弹雨中的钢铁意志，每一件武器都镌刻着血与火的传奇',
    route: '/war-weapons',
    year: '1931-1945'
  },
  {
    id: 'daily',
    title: '烽火岁月',
    subtitle: '战时生活用品展',
    description: '硝烟中的温情，见证着中华儿女在困境中的坚韧与希望',
    route: '/war-daily-items',
    year: '1937-1945'
  },
  {
    id: 'architecture',
    title: '历史遗迹',
    subtitle: '抗战建筑场景展',
    description: '砖瓦间的记忆，每一座建筑都是历史的见证者和守护者',
    route: '/war-architecture',
    year: '1638-1945'
  },
  {
    id: 'map',
    title: '抗战地图',
    subtitle: '十四年抗战全景',
    description: '全景展示中华民族十四年抗战的历史进程与地理变迁',
    route: '/war-map',
    year: '1931-1945'
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
  fallbackLetter.className = 'text-4xl font-bold text-yellow-400 font-serif'
  fallbackLetter.textContent = selectedHero.value.name.charAt(0)
  parentDiv.appendChild(fallbackLetter)
}

// 卡片头像加载错误处理
const handleCardAvatarError = (event) => {
  event.target.style.display = 'none'
  // 显示首字母作为后备
  const parentDiv = event.target.parentElement
  const fallbackLetter = document.createElement('span')
  fallbackLetter.className = 'text-2xl font-bold text-yellow-400 font-serif'
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

onMounted(() => {
  // 添加传统滚动动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  })
  
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el)
  })
})
</script>

<template>
  <div class="min-h-screen">
    <!-- 主英雄区域 -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden" style="background-color:#4b0c0c;">
      <!-- 传统纹理背景 -->
      <div class="absolute inset-0 opacity-10">
        <div class="traditional-pattern"></div>
      </div>

      <!-- 主要内容 -->
      <div class="relative z-10 text-center max-w-6xl mx-auto px-6 py-20">
        <!-- 传统印章样式馆徽 -->
        <div class="mb-12">
          <div class="relative w-48 h-48 mx-auto">
            <!-- 外圆印章 -->
            <div class="absolute inset-0 border-8 border-red-600 rounded-full bg-red-700 shadow-2xl traditional-seal">
              <!-- 内圆装饰 -->
              <div class="absolute inset-4 border-4 border-yellow-300 rounded-full flex items-center justify-center">
                <div class="text-center">
                  <div class="text-6xl font-bold text-yellow-400 mb-3 font-serif">抗</div>
                  <div class="text-4xl font-bold text-yellow-300 text-4xl">战</div>
                </div>
              </div>
            </div>
            <!-- 印章底座效果 -->
            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-52 h-8 bg-red-900 rounded-full opacity-60 blur-sm"></div>
          </div>
        </div>
        <br><br>
        <!-- 主标题 - 传统书法风格 -->
        <div class="mb-8">
          <h1 class="text-6xl md:text-8xl font-bold text-red-100 mb-4 font-serif traditional-text-shadow">
            中国人民抗日战争
          </h1><br>
          <h2 class="text-5xl md:text-7xl font-bold text-yellow-400 font-serif traditional-text-shadow">
            纪念博物馆
          </h2>
        </div>
        <br><br>
        <br><br>
        <br><br>
        <br><br>
        <br><br>
        <br><br>
        <br><br>
        <br><br>
        <br><br>
        <br><br>
        
                 <!-- 重要时间节点 - 传统卷轴样式 -->
         <div class="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 mb-16">
           <div class="bg-red-700 hover:bg-red-600 border-yellow-600 rounded-lg px-10 py-8 transform hover:scale-105 transition-transform min-w-[280px]">
             <div class="text-yellow-400 font-bold text-4xl mb-3 font-serif text-center">1931.9.18</div>
             <div class="text-red-100 text-xl font-serif text-center mb-2">九一八事变</div>
             <div class="text-yellow-300 text-base text-center">十四年抗战始</div>
           </div>
           
           <div class="hidden md:flex flex-col items-center px-8">
             <div class="w-32 h-1 bg-gradient-to-r from-yellow-600 to-red-600 rounded-full"></div>
             <div class="text-center text-yellow-400 font-serif text-2xl py-4 font-bold">血雨腥风</div>
             <div class="w-32 h-1 bg-gradient-to-r from-red-600 to-yellow-600 rounded-full"></div>
           </div>
           
           <div class="bg-red-700 hover:bg-red-600 border-yellow-600 rounded-lg px-10 py-8 transform hover:scale-105 transition-transform min-w-[280px]">
             <div class="text-yellow-400 font-bold text-4xl mb-3 font-serif text-center">1945.8.15</div>
             <div class="text-red-100 text-xl font-serif text-center mb-2">抗战胜利</div>
             <div class="text-yellow-300 text-base text-center">民族获解放</div>
           </div>
         </div>

                 <!-- 主要操作按钮 - 传统样式 -->
         <div class="flex flex-col md:flex-row gap-12 justify-center items-center mt-8">
           <button 
             @click="navigateTo('/war-exhibit')"
             class="group bg-transparent border-4 border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-red-900 px-20 py-8 rounded-lg text-2xl font-bold transition-all duration-300 transform hover:scale-105 font-serif min-w-[300px]">
             <span class="relative z-10">踏入历史殿堂</span>
           </button>
           
           <button 
             @click="navigateTo('/war-map')"
             class="group bg-transparent border-4 border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-red-900 px-20 py-8 rounded-lg text-2xl font-bold transition-all duration-300 transform hover:scale-105 font-serif min-w-[300px]">
             浏览抗战地图
           </button>
         </div>
      </div>
    
    </section>

    <!-- 馆藏统计 - 传统算盘样式 -->
    <section class="py-20 bg-gradient-to-b from-red-950 to-red-900">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-yellow-400 mb-6 font-serif">馆藏珍品</h2>
          <div class="w-32 h-1 bg-yellow-600 mx-auto rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="text-center bg-red-800 bg-opacity-50 border-2 border-yellow-600 rounded-lg p-8 hover:bg-opacity-70 transition-all">
            <div class="text-5xl mb-4">{{ stat.icon }}</div>
            <div class="text-4xl font-bold text-yellow-400 mb-2 font-serif">{{ stat.value }}{{ stat.suffix }}</div>
            <div class="text-red-100 text-lg font-serif">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 历史时间轴 - 传统编年史样式 -->
    <section class="py-20 bg-red-900">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-yellow-400 mb-6 font-serif">抗战编年</h2>
          <p class="text-xl text-red-100 max-w-3xl mx-auto font-serif">
            血火十四载，从九一八之殇到八一五之胜，每一个日子都镌刻着民族的苦难与荣光。
          </p>
          <div class="w-32 h-1 bg-yellow-600 mx-auto mt-8 rounded-full"></div>
        </div>
        
        <div class="relative">
          <!-- 中轴线 -->
          <div class="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-yellow-600 rounded-full"></div>
          
          <div class="space-y-16">
            <div 
              v-for="(node, index) in historicalNodes" 
              :key="index"
              class="relative flex items-center"
              :class="index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
            >
              <!-- 时间节点 -->
              <div class="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-600 rounded-full border-4 border-red-700 z-10"></div>
              
              <!-- 内容卡片 -->
              <div class="w-5/12">
                <div class="bg-red-800 border-4 border-yellow-600 rounded-lg p-6 transform hover:scale-105 transition-transform">
                  <!-- 历史图片 -->
                  <div class="mb-4">
                    <img 
                      :src="node.image" 
                      :alt="node.event"
                      class="timeline-image w-full h-48 object-cover rounded-lg border-2 border-yellow-500 cursor-pointer hover:border-yellow-300 transition-colors"
                      @click="openImagePreview(node.image)"
                      @error="$event.target.style.display = 'none'"
                    />
                  </div>
                  
                  <!-- 文字信息 -->
                  <div class="text-yellow-400 font-bold text-xl mb-3 font-serif">{{ node.date }}</div>
                  <h3 class="text-2xl font-bold text-red-100 mb-3 font-serif">{{ node.event }}</h3>
                  <p class="text-red-200 text-base font-serif leading-relaxed">{{ node.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心展览 - 传统殿堂样式 -->
    <section class="py-20 bg-gradient-to-b from-red-900 to-red-950">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-yellow-400 mb-6 font-serif">展览殿堂</h2>
          <p class="text-xl text-red-100 max-w-4xl mx-auto font-serif leading-relaxed">
            四大展厅，分门别类展示抗战文物。从铁血兵器到烽火岁月，从历史遗迹到地图全景，
            每一处展览都承载着厚重的历史，每一件文物都诉说着英雄的故事。
          </p>
          <div class="w-32 h-1 bg-yellow-600 mx-auto mt-8 rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div 
            v-for="(exhibition, index) in exhibitions" 
            :key="exhibition.id"
            class="group relative bg-red-800 border-4 border-yellow-600 rounded-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-red-700"
            @click="navigateTo(exhibition.route)"
          >
            <!-- 年代标识 -->
            <div class="absolute top-4 right-4 bg-red-900 border-2 border-yellow-500 px-4 py-2 rounded-lg">
              <span class="text-yellow-400 font-bold text-sm font-serif">{{ exhibition.year }}</span>
            </div>
            
            <!-- 主要内容 -->
            <div class="pt-4">
              <h3 class="text-3xl font-bold text-yellow-400 mb-3 font-serif">{{ exhibition.title }}</h3>
              <p class="text-xl text-red-200 mb-4 font-serif">{{ exhibition.subtitle }}</p>
              <p class="text-red-100 leading-relaxed mb-6 font-serif">{{ exhibition.description }}</p>
              
              <!-- 进入按钮 -->
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 font-bold text-lg font-serif group-hover:text-yellow-300">深入参观</span>
                <div class="w-12 h-12 bg-yellow-600 bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-40">
                  <svg class="w-6 h-6 text-yellow-400 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 英雄人物 - 传统牌位样式 -->
    <section class="py-20 bg-red-950">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-yellow-400 mb-6 font-serif">英烈千秋</h2>
          <p class="text-xl text-red-100 max-w-3xl mx-auto font-serif whitespace-nowrap">
            缅怀为民族独立和人民解放英勇牺牲的英雄先烈，他们的精神如星辰般永远照耀着中华大地。
          </p>
          <div class="w-32 h-1 bg-yellow-600 mx-auto mt-8 rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div 
            v-for="(hero, index) in heroes" 
            :key="index"
            class="text-center cursor-pointer"
            @click="openHeroDetail(hero)">
            <div class="bg-red-800 border-4 border-yellow-600 rounded-lg p-6 mb-4 transform hover:scale-105 transition-transform">
              <div class="w-20 h-20 mx-auto mb-4 bg-red-900 border-2 border-yellow-500 rounded-full overflow-hidden">
                <img 
                  :src="hero.avatar" 
                  :alt="hero.name + '头像'"
                  class="w-full h-full object-cover"
                  @error="handleCardAvatarError"
                />
              </div>
              <h3 class="text-xl font-bold text-yellow-400 mb-2 font-serif">{{ hero.name }}</h3>
              <p class="text-red-200 text-sm font-serif">{{ hero.title }}</p>
              <div class="mt-2">
                <span 
                  :class="hero.party === '共产党' ? 'bg-red-600' : 'bg-blue-600'"
                  class="text-xs text-white px-2 py-1 rounded-full"
                >
                  {{ hero.party }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部昭示 - 传统碑文样式 -->
    <section class="py-20 bg-gradient-to-b from-red-950 to-red-900">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <div class="bg-red-800 border-8 border-yellow-600 rounded-lg p-12">
          <h2 class="text-4xl md:text-5xl font-bold text-yellow-400 mb-8 font-serif leading-tight">
            铭记历史，勿忘国耻
            <br>
            珍爱和平，振兴中华
          </h2>
          
          <p class="text-2xl text-red-100 mb-8 leading-relaxed font-serif">
            历史是最好的教科书，也是最好的清醒剂
          </p>
          
          <!-- 重要引言 -->
          <div class="bg-red-900 border-4 border-yellow-500 rounded-lg p-8 mb-8">
            <blockquote class="text-xl text-yellow-300 font-serif italic leading-relaxed">
              "一个有希望的民族不能没有英雄，<br>一个有前途的国家不能没有先锋。"
            </blockquote>
            <cite class="block mt-4 text-yellow-400 font-bold font-serif">——习近平</cite>
          </div>
          
          <button 
            @click="navigateTo('/war-exhibit')"
            class="bg-yellow-600 hover:bg-yellow-500 text-red-900 px-20 py-6 rounded-lg text-2xl font-bold transition-all duration-300 transform hover:scale-105 border-4 border-red-700 font-serif">
            开启历史征程
          </button>
        </div>
      </div>
    </section>

    <!-- 图片预览模态框 -->
    <div 
      v-if="showImagePreview"
      class="image-preview-modal fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      @click="closeImagePreview"
    >
      <div class="relative max-w-4xl max-h-screen p-4">
        <!-- 关闭按钮 -->
        <button 
          @click="closeImagePreview"
          class="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center z-10 transition-colors"
        >
          ✕
        </button>
        
        <!-- 预览图片 -->
        <img 
          :src="previewImage" 
          alt="历史图片预览"
          class="preview-image max-w-full max-h-full object-contain rounded-lg border-4 border-yellow-500"
          @click.stop
        />
      </div>
    </div>
  </div>

    <!-- 英雄详情模态框 -->
    <div 
      v-if="showHeroDetail && selectedHero" 
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      @click="closeHeroDetail"
    >
      <div 
        class="bg-gradient-to-b from-red-900 to-red-800 border-4 border-yellow-500 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        @click.stop
      >
        <!-- 模态框头部 -->
        <div class="bg-red-800 p-6 border-b-2 border-yellow-400">
          <div class="flex justify-between items-center">
            <h3 class="text-2xl font-bold text-yellow-400 font-serif">
              {{ selectedHero.name }} - {{ selectedHero.title }}
            </h3>
            <button 
              @click="closeHeroDetail"
              class="w-10 h-10 bg-red-700 hover:bg-red-600 rounded-full flex items-center justify-center text-yellow-400 transition-colors"
            >
              ✕
            </button>
          </div>
          <div class="mt-2">
            <span 
              :class="selectedHero.party === '共产党' ? 'bg-red-600' : 'bg-blue-600'"
              class="text-sm text-white px-3 py-1 rounded-full"
            >
              {{ selectedHero.party }}
            </span>
          </div>
        </div>
        
        <!-- 模态框内容 -->
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <div class="mb-6">
            <h4 class="text-xl font-bold text-yellow-400 mb-3 font-serif">英雄简介</h4>
            <p class="text-red-100 leading-relaxed font-serif text-lg">
              {{ selectedHero.description }}
            </p>
          </div>
          
          <div class="mb-6">
            <h4 class="text-xl font-bold text-yellow-400 mb-3 font-serif">详细事迹</h4>
            <p class="text-red-100 leading-relaxed font-serif text-lg">
              {{ selectedHero.details }}
            </p>
          </div>
          
          <!-- 英雄头像 -->
          <div class="text-center mb-6">
            <div class="w-32 h-32 mx-auto bg-red-700 border-4 border-yellow-500 rounded-full overflow-hidden flex items-center justify-center mb-4">
              <img 
                :src="selectedHero.avatar" 
                :alt="selectedHero.name + '头像'"
                class="w-full h-full object-cover"
                @error="handleAvatarError"
              />
            </div>
          </div>
        </div>
        
        <!-- 模态框底部 -->
        <div class="bg-red-800 p-4 border-t-2 border-yellow-400 text-center">
          <p class="text-yellow-400 font-serif italic">
            英雄不朽，精神永存
          </p>
        </div>
      </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700;900&display=swap');

/* 传统背景 */
.bg-traditional {
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 25%, #dc2626 50%, #991b1b 75%, #7f1d1d 100%);
}

/* 传统纹理图案 */
.traditional-pattern {
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25px 25px, rgba(255, 193, 7, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 75px 75px, rgba(255, 193, 7, 0.1) 2px, transparent 2px);
  background-size: 100px 100px;
}

/* 传统印章效果 */
.traditional-seal {
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.5),
    0 10px 30px rgba(0, 0, 0, 0.3);
}

/* 传统文字阴影 */
.traditional-text-shadow {
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(255, 193, 7, 0.3);
}

/* 传统按钮效果 */
.traditional-button {
  box-shadow: 
    inset 0 2px 4px rgba(255, 193, 7, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.3);
}

.traditional-button:hover {
  box-shadow: 
    inset 0 2px 4px rgba(255, 193, 7, 0.4),
    0 12px 24px rgba(0, 0, 0, 0.4);
}

/* 滚动显示动画 */
.scroll-reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 传统字体 */
.font-serif {
  font-family: 'Noto Serif SC', serif;
}

/* 传统悬浮效果 */
.traditional-hover {
  transition: all 0.3s ease;
}

.traditional-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

/* 传统边框 */
.traditional-border {
  border-image: linear-gradient(45deg, #dc2626, #fbbf24, #dc2626) 1;
}

/* 传统渐变 */
.traditional-gradient {
  background: linear-gradient(135deg, #7f1d1d, #dc2626, #fbbf24, #dc2626, #7f1d1d);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .traditional-text-shadow {
    font-size: 2.5rem;
  }
  
  .traditional-pattern {
    background-size: 50px 50px;
  }
}

/* 传统滚动条 */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #7f1d1d;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #fbbf24, #dc2626);
  border-radius: 6px;
  border: 2px solid #7f1d1d;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #f59e0b, #b91c1c);
}

/* 传统动画 */
@keyframes traditional-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.traditional-pulse {
  animation: traditional-pulse 3s ease-in-out infinite;
}

/* 历史图片样式 */
.timeline-image {
  transition: all 0.3s ease;
}

.timeline-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
}

/* 图片预览样式 */
.image-preview-modal {
  backdrop-filter: blur(8px);
}

.preview-image {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* 英雄详情模态框样式 */
.hero-detail-modal {
  backdrop-filter: blur(8px);
}

.hero-detail-content {
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.7);
  border-style: solid;
  border-width: 4px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .timeline-image {
    height: 120px;
  }
  
  .image-preview-modal .relative {
    max-width: 95vw;
    padding: 8px;
  }
  
  .preview-image {
    border-width: 2px;
  }
  
  /* 移动端时间线卡片调整 */
  .space-y-16 > div {
    margin-bottom: 2rem;
  }
  
  /* 调整时间线节点在移动端的显示 */
  .w-8 {
    width: 1.5rem;
    height: 1.5rem;
  }
}

#app, main {
  background: #1A0E12 !important;
  background-image: none !important;
}

section { background: transparent !important; }


[class*="bg-red-"] {
  background-color: #3A1620 !important;
  background-image: none !important;
}
.bg-red-950, .bg-red-900, .bg-red-800 {
  background-color: #1A0E12 !important;
}
[class*="from-red-"], [class*="via-red-"], [class*="to-red-"] {
  --tw-gradient-from: #241016 !important;
  --tw-gradient-to: #2A1218 !important;
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}
[class*="bg-gradient"] {
  background-image: linear-gradient(165deg, #241016 0%, #3A1620 60%, #2A1218 100%) !important;
}

[class*="from-purple-"], [class*="from-fuchsia-"], [class*="from-rose-"] {
  --tw-gradient-from: #241016 !important;
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}
[class*="via-purple-"], [class*="to-purple-"], [class*="to-fuchsia-"], [class*="to-rose-"] {
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}


[class*="bg-white"], [class*="bg-opacity"], [class*="bg-black"] {
  background-color: #451A24 !important;
}
[class*="border-red-"] { border-color: rgba(212,175,55,.25) !important; }
[class*="border-4"] { border-width: 1px !important; }


[class*="text-yellow-"], [class*="text-amber-"] { color: #EBC97A !important; }
[class*="text-red-"] { color: #E8E3DA !important; }

</style>
