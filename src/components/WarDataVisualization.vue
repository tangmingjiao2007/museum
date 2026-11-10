<template>
  <div class="war-heroes-page">
    <!-- 页面头部 -->
    <section class="heroes-header">
      <div class="container">
        <div class="header-content">
          <div class="header-emblem">
            <div class="emblem-circle">
              <span class="emblem-icon">🎖️</span>
            </div>
          </div>
          <h1 class="page-title">抗战英雄人物</h1>
          <p class="page-subtitle">缅怀先烈英勇事迹 · 传承不朽民族精神</p>
          <div class="hero-quote">
            <span class="quote-mark">"</span>
            为有牺牲多壮志，敢教日月换新天
            <span class="quote-mark">"</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 英雄分类导航 -->
    <section class="heroes-navigation">
      <div class="container">
        <div class="nav-tabs">
          <button 
            v-for="category in heroCategories" 
            :key="category.id"
            :class="['nav-tab', { active: activeCategory === category.id }]"
            @click="setActiveCategory(category.id)"
          >
            <span class="tab-icon">{{ category.icon }}</span>
            <span class="tab-label">{{ category.name }}</span>
            <span class="tab-count">({{ category.count }})</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 英雄列表 -->
    <section class="heroes-list">
      <div class="container">
        <div class="heroes-grid">
          <div 
            v-for="hero in filteredHeroes" 
            :key="hero.id"
            :class="['hero-card', { selected: selectedHero?.id === hero.id }]"
            @click="selectHero(hero)"
          >
            <div class="hero-avatar">
              <img :src="hero.avatar" :alt="hero.name" @error="handleImageError" />
              <div class="hero-rank">{{ hero.rank }}</div>
            </div>
            <div class="hero-info">
              <h3 class="hero-name">{{ hero.name }}</h3>
              <p class="hero-title">{{ hero.title }}</p>
              <div class="hero-years">{{ hero.birthYear }} - {{ hero.deathYear || '在世' }}</div>
              <div class="hero-category">{{ hero.categoryName }}</div>
            </div>
            <div class="hero-actions">
              <button class="view-details-btn">详细信息</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 英雄详细信息面板 -->
    <div v-if="selectedHero" class="hero-detail-panel" @click="closeHeroDetail">
      <div class="detail-content" @click.stop>
        <button class="close-btn" @click="closeHeroDetail">✕</button>
        
        <div class="detail-header">
          <div class="detail-avatar">
            <img :src="selectedHero.avatar" :alt="selectedHero.name" @error="handleImageError" />
            <div class="detail-rank">{{ selectedHero.rank }}</div>
          </div>
          <div class="detail-basic-info">
            <h2 class="detail-name">{{ selectedHero.name }}</h2>
            <p class="detail-title">{{ selectedHero.title }}</p>
            <div class="detail-meta">
              <div class="meta-item">
                <span class="meta-label">出生年份：</span>
                <span class="meta-value">{{ selectedHero.birthYear }}年</span>
              </div>
              <div class="meta-item" v-if="selectedHero.deathYear">
                <span class="meta-label">牺牲年份：</span>
                <span class="meta-value">{{ selectedHero.deathYear }}年</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">籍贯：</span>
                <span class="meta-value">{{ selectedHero.hometown }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">类别：</span>
                <span class="meta-value">{{ selectedHero.categoryName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-body">
          <div class="detail-section">
            <h3 class="section-title">
              <span class="section-icon">📖</span>
              英雄事迹
            </h3>
            <div class="hero-story">
              <p v-for="paragraph in selectedHero.story" :key="paragraph" class="story-paragraph">
                {{ paragraph }}
              </p>
            </div>
          </div>

          <div class="detail-section">
            <h3 class="section-title">
              <span class="section-icon">🏆</span>
              主要贡献
            </h3>
            <ul class="contributions-list">
              <li v-for="contribution in selectedHero.contributions" :key="contribution" class="contribution-item">
                {{ contribution }}
              </li>
            </ul>
          </div>

          <div class="detail-section" v-if="selectedHero.timeline">
            <h3 class="section-title">
              <span class="section-icon">📅</span>
              重要时刻
            </h3>
            <div class="hero-timeline">
              <div v-for="event in selectedHero.timeline" :key="event.year" class="timeline-event">
                <div class="timeline-year">{{ event.year }}</div>
                <div class="timeline-description">{{ event.event }}</div>
              </div>
            </div>
          </div>

          <div class="detail-section" v-if="selectedHero.quotes">
            <h3 class="section-title">
              <span class="section-icon">💬</span>
              经典语录
            </h3>
            <div class="hero-quotes">
              <blockquote v-for="quote in selectedHero.quotes" :key="quote" class="hero-quote-item">
                "{{ quote }}"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 英雄统计 -->
    <section class="heroes-statistics">
      <div class="container">
        <h2 class="section-title">英雄统计</h2>
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in heroStats" :key="stat.label">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 英雄精神传承 -->
    <section class="heroes-legacy">
      <div class="container">
        <div class="legacy-content">
          <h2 class="legacy-title">传承英雄精神</h2>
          <p class="legacy-text">
            这些抗战英雄用生命和鲜血书写了中华民族不屈不挠的壮丽史诗。
            他们的英雄事迹和崇高精神，是我们民族最宝贵的精神财富，
            激励着一代又一代中华儿女为祖国的繁荣富强而奋斗。
          </p>
          <div class="spirit-values">
            <div class="value-item" v-for="value in heroicValues" :key="value.title">
              <div class="value-icon">{{ value.icon }}</div>
              <h3 class="value-title">{{ value.title }}</h3>
              <p class="value-desc">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式数据
const activeCategory = ref('all')
const selectedHero = ref(null)

// 英雄分类
const heroCategories = ref([
  { id: 'all', name: '民族英杰', icon: '🏮', count: 25 },
  { id: 'communist', name: '中共英烈', icon: '☭', count: 17 },
  { id: 'nationalist', name: '国军将士', icon: '🎖️', count: 5 },
  { id: 'martyrs', name: '革命先烈', icon: '🕯️', count: 12 },
  { id: 'generals', name: '将帅风采', icon: '👑', count: 8 },
  { id: 'fighters', name: '战斗豪杰', icon: '⚔️', count: 5 }
])

// 英雄人物数据
const heroes = ref([
  {
    id: 1,
    name: '叶挺',
    title: '新四军军长',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'generals'],
    rank: '军长',
    birthYear: 1896,
    deathYear: 1946,
    hometown: '广东惠阳',
    avatar: '/images/抗战英雄图片/叶挺.jpg',
    story: [
      '叶挺1918年毕业于保定陆军军官学校，1919年参加孙中山领导的粤军，同年加入中国国民党。1924年加入中国共产党，同年秋被派赴苏联学习。',
      '1925年8月回国，参与组建以共产党员、共青团员为骨干的第4军独立团，任团长。独立团成为中国共产党直接掌握的一支重要武装力量。',
      '1926年参加北伐战争，他率部勇往直前，连战皆捷，屡建战功，被誉为"北伐名将"，所部被称为"叶挺独立团"，为4军赢得"铁军"称号。',
      '抗日战争爆发后，出任新四军军长。1941年1月，在皖南事变中指挥部队奋起突围，浴血奋战8昼夜，后被扣押。面对蒋介石的威逼利诱，他坚贞不屈。',
      '1946年3月4日获释，5日即致电中共中央，要求重新加入中国共产党。4月8日，由重庆赴延安途中飞机失事，在山西兴县黑茶山遇难。'
    ],
    contributions: [
      '组建叶挺独立团，为4军赢得"铁军"称号',
      '担任南昌起义前敌总指挥',
      '担任广州起义军总司令',
      '出任新四军军长，领导抗日武装斗争',
      '在皖南事变中坚贞不屈，体现革命气节'
    ],
    timeline: [
      { year: '1924', event: '加入中国共产党' },
      { year: '1925', event: '组建第4军独立团' },
      { year: '1927', event: '担任南昌起义前敌总指挥' },
      { year: '1937', event: '出任新四军军长' },
      { year: '1946', event: '飞机失事遇难' }
    ],
    quotes: [
      '为人进出的门紧锁着，为狗爬出的洞敞开着',
      '一个声音高叫着：爬出来吧，给你自由！'
    ]
  },
  {
    id: 2,
    name: '马本斋',
    title: '冀鲁豫军区第三军分区司令员',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'generals'],
    rank: '司令员',
    birthYear: 1902,
    deathYear: 1944,
    hometown: '河北献县',
    avatar: '/images/抗战英雄图片/马本斋.jpg',
    story: [
      '马本斋早年投身奉军当兵，逐级升至团长。"九一八"事变后，因不满国民党蒋介石的不抵抗政策，毅然弃官返乡。',
      '1937年7月，全国抗战爆发后，在家乡组织回民抗日义勇队，奋起抵抗日本侵略军。1938年4月率队参加八路军，所部改编为冀中军区回民教导总队。',
      '1939年，回民教导总队改编为八路军第三纵队回民支队，任司令员。1942年8月任冀鲁豫军区第三军分区司令员兼回民支队司令员。',
      '他作战勇猛，身先士卒，在回民支队和广大群众中享有很高威望。从1937年至1944年，他率回民支队经历大小战斗870余次，歼灭日伪军3.6万余人。',
      '1944年1月底，在率部参加冀鲁豫抗日根据地反蚕食战斗中病逝于山东莘县，临终叮嘱"要跟着党，跟着毛主席，抗战到底！"'
    ],
    contributions: [
      '组织回民抗日义勇队，开展抗日斗争',
      '率回民支队参加大小战斗870余次',
      '歼灭日伪军3.6万余人',
      '发展回民支队至2000多人的抗日劲旅',
      '促进民族团结，维护抗日统一战线'
    ],
    timeline: [
      { year: '1937', event: '组织回民抗日义勇队' },
      { year: '1938', event: '率队参加八路军' },
      { year: '1939', event: '任回民支队司令员' },
      { year: '1942', event: '任冀鲁豫军区第三军分区司令员' },
      { year: '1944', event: '病逝于山东莘县' }
    ],
    quotes: [
      '要跟着党，跟着毛主席，抗战到底！',
      '回族人民要与汉族人民团结一致，共同抗日'
    ]
  },
  {
    id: 3,
    name: '李林',
    title: '雁北抗日游击队第8支队支队长',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'martyrs', 'fighters'],
    rank: '支队长',
    birthYear: 1916,
    deathYear: 1940,
    hometown: '福建龙溪',
    avatar: '/images/抗战英雄图片/李林.jpg',
    story: [
      '李林幼年侨居印度尼西亚。1929年回国后，积极参加抗日救亡运动。1936年考入北平民国大学，同年加入中国共产党。',
      '随即赴太原参加山西牺牲救国同盟会举办的国民师范学校军政训练班，任特委宣传委员兼女子第11连党支部书记。',
      '1937年抗日战争爆发后，坚决要求到前方杀敌，被派到大同，任牺盟会大同中心区委宣传部部长。11月，任雁北抗日游击队第8支队支队长兼政治主任。',
      '1938年春，改任整编后的独立支队骑兵营教导员，率部驰骋雁北、绥南与日伪军作战，屡建战功。后当选为晋绥边区第11行政专员公署委员。',
      '1940年4月26日，在晋绥边区反"扫荡"战斗中，为掩护机关和群众突围，率骑兵连勇猛冲杀，自己却被围困。在身负重伤后，将最后一发子弹射向自己，壮烈牺牲，年仅24岁。'
    ],
    contributions: [
      '积极开展抗日救亡运动宣传工作',
      '组织工人、农民、学生参加抗日武装',
      '率部在雁北、绥南与日伪军作战',
      '在反"扫荡"中掩护机关群众突围',
      '以身殉国，体现了巾帼英雄气概'
    ],
    timeline: [
      { year: '1936', event: '加入中国共产党' },
      { year: '1937', event: '任雁北抗日游击队第8支队支队长' },
      { year: '1938', event: '任独立支队骑兵营教导员' },
      { year: '1939', event: '当选晋绥边区专员公署委员' },
      { year: '1940', event: '在反"扫荡"战斗中壮烈牺牲' }
    ],
    quotes: [
      '甘愿征战血染衣，不平倭寇誓不休',
      '中华儿女多奇志，不爱红装爱武装'
    ]
  },
  {
    id: 4,
    name: '赵一曼',
    title: '东北抗日联军第3军第2团政治委员',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'martyrs'],
    rank: '政委',
    birthYear: 1905,
    deathYear: 1936,
    hometown: '四川宜宾',
    avatar: '/images/抗战英雄图片/赵一曼.jpg',
    story: [
      '赵一曼1923年加入中国社会主义青年团，1926年夏加入中国共产党。同年11月，入武汉中央军事政治学校学习。1927年9月，去苏联莫斯科中山大学学习。',
      '"九一八"事变后，被派往东北地区发动抗日斗争。先后任满洲总工会秘书、组织部长，中共滨江省珠河县中心县委特派员、铁北区委书记。',
      '1935年秋，任东北抗日联军第3军第2团政治委员。11月间，第2团被日伪军围困于一座山间。赵一曼为掩护部队突围，身负重伤，养伤期间被日军发现，战斗中再度负伤，昏迷被俘。',
      '日军对她施以酷刑，用钢针刺伤口，用烧红的烙铁烙皮肉，逼其招供。她宁死不屈，严词痛斥日军侵略罪行。',
      '1936年8月2日，在珠河被敌杀害。临刑前，她高呼"打倒日本帝国主义！""中国共产党万岁！"视死如归，从容就义，年仅31岁。'
    ],
    contributions: [
      '在东北组织领导抗日武装斗争',
      '担任抗日联军重要领导职务',
      '面对酷刑坚贞不屈，保守党的秘密',
      '体现了共产党人的崇高品格',
      '用生命诠释了革命者的铮铮铁骨'
    ],
    timeline: [
      { year: '1926', event: '加入中国共产党' },
      { year: '1931', event: '被派往东北领导抗日斗争' },
      { year: '1935', event: '任东北抗日联军第3军第2团政委' },
      { year: '1935.11', event: '在战斗中负伤被俘' },
      { year: '1936.8', event: '在珠河英勇就义' }
    ],
    quotes: [
      '甘愿分担你的艰难，我在九泉心也甘甜',
      '未惜头颅新故国，甘将热血沃中华'
    ]
  },
  {
    id: 5,
    name: '左权',
    title: '八路军副参谋长',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'generals', 'martyrs'],
    rank: '副参谋长',
    birthYear: 1905,
    deathYear: 1942,
    hometown: '湖南醴陵',
    avatar: '/images/抗战英雄图片/左权.jpg',
    story: [
      '左权1924年入黄埔军校学习。1925年加入中国共产党。同年12月赴苏联学习。1930年回国后到中央苏区工作，历任红军学校教育长、军长等职。',
      '全国抗战爆发后，担任八路军副参谋长、八路军前方总部参谋长，协助朱德、彭德怀指挥八路军开赴华北抗日前线，开展敌后游击战争。',
      '1940年秋，协助彭德怀指挥著名的百团大战。1941年11月指挥八路军总部特务团进行黄崖洞保卫战，经8昼夜激战，以较小的代价歼敌千余人。',
      '从1939年至1941年，他撰写了《论坚持华北抗战》等文章，总结敌后抗战经验。',
      '1942年5月25日，在山西省辽县麻田附近指挥部队突围转移时，在十字岭战斗中壮烈殉国，时年37岁。'
    ],
    contributions: [
      '协助指挥八路军开赴华北抗日前线',
      '参与建立敌后抗日根据地',
      '参与指挥百团大战等重要战役',
      '对八路军建设发展作出重大贡献',
      '撰写军事理论文章，总结抗战经验'
    ],
    timeline: [
      { year: '1925', event: '加入中国共产党' },
      { year: '1937', event: '任八路军副参谋长' },
      { year: '1940', event: '参与指挥百团大战' },
      { year: '1941', event: '指挥黄崖洞保卫战' },
      { year: '1942', event: '在辽县十字岭战斗中牺牲' }
    ],
    quotes: [
      '我们是为着解放全人类这一个目的而死',
      '中国一定有个可赞美的光明前途'
    ]
  },
  {
    id: 6,
    name: '杨靖宇',
    title: '东北抗日联军第1路军总司令',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'generals', 'martyrs'],
    rank: '总司令',
    birthYear: 1905,
    deathYear: 1940,
    hometown: '河南确山',
    avatar: '/images/抗战英雄图片/杨靖宇.jpg',
    story: [
      '杨靖宇是东北抗日联军的创建人和领导人之一。1926年加入中国共产主义青年团，1927年4月参与领导确山农民暴动，5月转为中国共产党党员。',
      '"九一八"事变后，任中共哈尔滨市委书记兼满洲省委军委代理书记。1932年秋被派往南满，组建中国工农红军第32军南满游击队，任政治委员。',
      '1934年4月联合17支抗日武装成立抗日联合军总指挥部，任总指挥。1936年7月任东北抗日联军第1路军总司令兼政治委员。',
      '他率部长期转战东北，有力配合了全国的抗日战争。在1939年秋冬季反"讨伐"作战中，他率警卫旅转战于濛江一带。',
      '1940年2月23日，最后只身与敌周旋5昼夜，以无比坚强的毅力顽强战斗，直至弹尽粮绝，壮烈牺牲。日军剖开他的胃，发现里面只有枯草、树皮和棉絮，竟无一粒粮食。'
    ],
    contributions: [
      '组建东北抗日联军，坚持长期游击战',
      '威震东北，有力配合全国抗战',
      '在极端困难条件下坚持斗争6年',
      '体现了中华民族不屈不挠的精神',
      '成为东北抗联的象征和旗帜'
    ],
    timeline: [
      { year: '1927', event: '转为中国共产党党员' },
      { year: '1932', event: '组建南满游击队' },
      { year: '1934', event: '成立抗日联合军总指挥部' },
      { year: '1936', event: '任东北抗日联军第1路军总司令' },
      { year: '1940', event: '在濛江壮烈牺牲' }
    ],
    quotes: [
      '我们中国人都投降了，还有中国吗？',
      '为了中华民族的解放，我们宁死不屈！'
    ]
  },
  {
    id: 7,
    name: '吴运铎',
    title: '华中军工处炮弹厂厂长',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist'],
    rank: '厂长',
    birthYear: 1917,
    deathYear: 1991,
    hometown: '湖北武汉',
    avatar: '/images/抗战英雄图片/吴运铎.jpg',
    story: [
      '吴运铎早年曾在安源煤矿当矿工。全国抗战爆发后，不远千里，奔向皖南云岭，1938年参加新四军，1939年加入中国共产党。',
      '历任新四军司令部修械所车间主任，淮南根据地子弹厂厂长、军工部副部长，华中军工处炮弹厂厂长等职。',
      '他心系兵工，为人民兵工事业无私奉献。在淮南根据地时因陋就简，带领职工自制土设备，扩大了枪弹生产。',
      '还主持设计研制成功枪榴筒，参与设计制造37毫米平射炮以及定时、踏火等各种地雷，为提高部队火力做出了贡献。',
      '在生产与研制武器弹药中多次负伤，失去了左眼，左手、右腿致残，经过20余次手术，身上还留有几十处弹片没有取出，仍以顽强毅力战胜伤残，坚持战斗在生产第一线。'
    ],
    contributions: [
      '为新四军建立兵工厂，保障武器供应',
      '设计研制枪榴筒、平射炮等武器',
      '发明多种地雷，提高部队战斗力',
      '在极端困难条件下坚持兵工生产',
      '被誉为中国的"保尔·柯察金"'
    ],
    timeline: [
      { year: '1938', event: '参加新四军' },
      { year: '1939', event: '加入中国共产党' },
      { year: '1940', event: '任淮南根据地子弹厂厂长' },
      { year: '1942', event: '任华中军工处炮弹厂厂长' },
      { year: '1951', event: '被授予特邀全国劳动模范称号' }
    ],
    quotes: [
      '只要我活着一天，我一定为党为人民工作一天',
      '把一切献给党'
    ]
  },
  {
    id: 8,
    name: '刘志丹',
    title: '西北革命军事委员会主席',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'generals', 'martyrs'],
    rank: '主席',
    birthYear: 1903,
    deathYear: 1936,
    hometown: '陕西保安',
    avatar: '/images/抗战英雄图片/刘志丹.jpg',
    story: [
      '刘志丹1924年加入中国社会主义青年团，1925年春转入中国共产党，同年冬受党指派进入黄埔军校第四期学习。',
      '1928年4月，参与领导渭华起义，任西北工农革命军军事委员会主席。后在陕甘边开展兵运工作。',
      '1931年10月，和谢子长等组建西北反帝同盟军，后改编为中国工农红军陕甘边游击队，任副总指挥、总指挥，开辟以照金、南梁为中心的陕甘边苏区。',
      '相继任陕甘边红军临时指挥部副总指挥兼参谋长、红26军42师师长、中共陕甘边军事委员会主席、西北革命军事委员会主席。',
      '1936年，刘志丹率红28军参加东征战役，挺进晋西北，屡克敌军。4月14日在中阳县三交镇战斗中牺牲。为纪念他，中共中央决定将保安县改名为志丹县。'
    ],
    contributions: [
      '参与领导渭华起义',
      '开辟陕甘边苏区',
      '建立西北红军',
      '为中央红军长征提供落脚点',
      '促进陕北与中央红军团结'
    ],
    timeline: [
      { year: '1925', event: '加入中国共产党' },
      { year: '1928', event: '参与领导渭华起义' },
      { year: '1931', event: '组建陕甘边游击队' },
      { year: '1935', event: '任红15军团副军团长' },
      { year: '1936', event: '在三交镇战斗中牺牲' }
    ]
  },
  {
    id: 9,
    name: '彭雪枫',
    title: '新四军第4师师长',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'generals', 'martyrs'],
    rank: '师长',
    birthYear: 1907,
    deathYear: 1944,
    hometown: '河南镇平',
    avatar: '/images/抗战英雄图片/彭雪枫.jpg',
    story: [
      '彭雪枫1925年加入中国共青团。1926年加入中国共产党。他辗转于各地，曾从事学运、兵运工作，参与领导农民暴动，开展党的秘密工作。',
      '1930年5月被派到苏区，先后任江西军区政委、红军大学政委等职。1934年10月参加长征，任红3军团5师师长等职。',
      '全国抗战爆发后，任八路军总部参谋处处长兼八路军驻晋办事处主任。1938年春调赴河南确山竹沟，兼任中共河南省委军事部部长。',
      '同年9月组建新四军游击支队，任司令员兼政委，领导开辟豫皖苏边区抗日根据地。1941年皖南事变后，任新四军4师师长、淮北军区司令员。',
      '1944年8月执行中央向河南敌后进军的指示，指挥所部进行西进战役。9月11日在河南夏邑八里庄指挥作战时壮烈牺牲。'
    ],
    contributions: [
      '参加长征，屡建战功',
      '开辟豫皖苏边区抗日根据地',
      '率领新四军第4师坚持敌后游击战',
      '发展壮大了新四军武装力量',
      '为抗日战争胜利作出重要贡献'
    ],
    timeline: [
      { year: '1926', event: '加入中国共产党' },
      { year: '1934', event: '参加长征' },
      { year: '1938', event: '组建新四军游击支队' },
      { year: '1941', event: '任新四军第4师师长' },
      { year: '1944', event: '在八里庄战斗中牺牲' }
    ]
  },
  {
    id: 10,
    name: '董存瑞',
    title: '某部6班班长',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'fighters', 'martyrs'],
    rank: '班长',
    birthYear: 1929,
    deathYear: 1948,
    hometown: '河北怀来',
    avatar: '/images/抗战英雄图片/董存瑞.jpg',
    story: [
      '董存瑞出身于贫苦农民家庭。抗日战争时期，当过儿童团长，曾机智地掩护区委书记躲过侵华日军的追捕，被誉为"抗日小英雄"。',
      '1945年7月参加八路军，任某部6班班长。1947年3月加入中国共产党。他军事技术过硬，作战机智勇敢，在一次战斗中只身俘敌10余人。',
      '1948年5月，我军攻打隆化城的战斗打响。他所在连队担负攻击国民党守军防御重点隆化中学的任务。他任爆破组组长，带领战友接连炸毁4座炮楼、5座碉堡。',
      '连队随即发起冲锋，但突然遭到敌人一隐蔽的桥型暗堡猛烈的火力封锁。在部队攻击受阻的危急关头，他毫不犹豫地用左手托起炸药包，右手拉燃导火索。',
      '高喊："为了新中国，冲啊！"敌人碉堡被炸毁，董存瑞以自己的生命为部队开辟了前进道路，牺牲时年仅19岁。'
    ],
    contributions: [
      '抗战时期担任儿童团长',
      '参加解放战争，屡建战功',
      '炸毁多座敌军炮楼、碉堡',
      '舍身炸暗堡，为部队开辟前进道路',
      '体现了革命战士的英勇无畏精神'
    ],
    timeline: [
      { year: '1943', event: '担任儿童团长' },
      { year: '1945', event: '参加八路军' },
      { year: '1947', event: '加入中国共产党' },
      { year: '1948', event: '在隆化战斗中牺牲' }
    ],
    quotes: [
      '为了新中国，冲啊！'
    ]
  },
  {
    id: 11,
    name: '赵尚志',
    title: '东北抗日联军第2路军副总指挥',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'generals', 'martyrs'],
    rank: '副总指挥',
    birthYear: 1908,
    deathYear: 1942,
    hometown: '辽宁朝阳',
    avatar: '/images/抗战英雄图片/赵尚志.jpg',
    story: [
      '赵尚志1925年夏加入中国共产党，是东北地区最早的共产党员之一。同年冬受党派遣南下广州进入黄埔军校第4期学习。',
      '1931年"九一八"事变后经党组织营救出狱，被任命为中共满洲省委常委、军委书记。1933年10月领导创建北满珠河反日游击队，任队长。',
      '1935年1月任东北人民革命军第3军军长。1936年1月任北满抗日联军总司令部总司令。同年8月任东北抗日联军第3军军长。',
      '后任中共北满临时省委执委会主席、东北抗日联军第2路军副总指挥。面对日伪军的疯狂"讨伐"、"清剿"，赵尚志率领抗联部队进行了英勇无比的艰苦战斗。',
      '远征松嫩平原，爬冰卧雪，餐风宿露，作战百余次，打破了敌人一次次重兵"讨伐"和"清剿"。1942年2月12日，在战斗中身负重伤被俘，他宁死不屈，壮烈牺牲。'
    ],
    contributions: [
      '是东北地区最早的共产党员之一',
      '创建北满珠河反日游击队',
      '建立珠河、汤原抗日游击根据地',
      '率部作战百余次，屡破敌军"讨伐"',
      '在极端困难条件下坚持抗日斗争'
    ],
    timeline: [
      { year: '1925', event: '加入中国共产党' },
      { year: '1933', event: '创建北满珠河反日游击队' },
      { year: '1935', event: '任东北人民革命军第3军军长' },
      { year: '1936', event: '任东北抗日联军第3军军长' },
      { year: '1942', event: '在战斗中身负重伤被俘牺牲' }
    ]
  },
  {
    id: 12,
    name: '罗忠毅',
    title: '新四军第6师参谋长兼16旅旅长',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'generals', 'martyrs'],
    rank: '参谋长',
    birthYear: 1907,
    deathYear: 1941,
    hometown: '湖北襄阳',
    avatar: '/images/抗战英雄图片/罗忠毅.jpg',
    story: [
      '罗忠毅1927年入冯玉祥部当兵。1931年参加宁都起义，编入中国工农红军第5军团。后到瑞金入红军学校学习。1932年加入中国共产党。',
      '1934年10月中央红军主力长征后，任福建军区第3分区副司令员兼参谋长、闽西南第1作战分区司令员、闽西南游击队第1纵队司令员，在闽西南地区坚持极其艰苦的3年游击战争。',
      '抗日战争全面爆发后，任新四军第2支队参谋长、江南指挥部参谋长，参与创建以茅山为中心的苏南抗日根据地。',
      '1940年7月新四军江南主力北渡长江后，任重建的江南指挥部指挥，留苏南坚持敌后抗日游击战争，指挥部队多次挫败日伪军"扫荡"、"清乡"。',
      '1941年11月28日，日伪军3000余人袭击溧阳塘马村，为了掩护苏南抗日根据地党、政、军干部安全转移，他率部与敌人展开殊死搏斗，壮烈牺牲，年仅34岁。'
    ],
    contributions: [
      '参加宁都起义，加入红军',
      '坚持闽西南3年游击战争',
      '参与创建苏南抗日根据地',
      '指挥水阳伏击战等重要战斗',
      '掩护根据地干部安全转移'
    ],
    timeline: [
      { year: '1931', event: '参加宁都起义' },
      { year: '1932', event: '加入中国共产党' },
      { year: '1937', event: '任新四军第2支队参谋长' },
      { year: '1940', event: '任江南指挥部指挥' },
      { year: '1941', event: '在塘马村战斗中牺牲' }
    ]
  },
  {
    id: 13,
    name: '江上青',
    title: '皖六区专署特别支部书记',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'martyrs'],
    rank: '特支书记',
    birthYear: 1911,
    deathYear: 1939,
    hometown: '江苏江都',
    avatar: '/images/抗战英雄图片/江上青.png',
    story: [
      '江上青1927年加入中国共产主义青年团，1929年就读于上海"艺大"，同年转为中国共产党党员，并担任"艺大"地下党支部书记。',
      '全国抗战爆发后，他和其他同志组织成立了江都县文化界救亡协会流动宣传团，从江都出发，溯江而上，广泛开展抗日宣传。',
      '1938年8月，遵照党的指示到安徽，在中共安徽省工委领导下，参加了安徽省抗日民众动员委员会第八工作团，在大别山区开展抗日宣传工作。',
      '1938年11月，受中共安徽省工委派遣，他和一批共产党员到皖东北泗县工作，担任专员秘书兼保安副司令、政治部主任，利用合法身份，积极开展抗日宣传。',
      '1939年7月29日，遭地主反动武装伏击，壮烈牺牲，年仅28岁。'
    ],
    contributions: [
      '组织文化界救亡协会宣传团',
      '在大别山区开展抗日宣传',
      '培训抗日干部，建立抗日武装',
      '推动皖东北抗日民族统一战线',
      '为开辟皖东北抗日根据地培养干部'
    ],
    timeline: [
      { year: '1929', event: '转为中国共产党党员' },
      { year: '1937', event: '组织抗日救亡宣传团' },
      { year: '1938', event: '到安徽开展抗日工作' },
      { year: '1939', event: '任皖六区专署特支书记' },
      { year: '1939.7', event: '遭反动武装伏击牺牲' }
    ]
  },
  {
    id: 14,
    name: '寻淮洲',
    title: '红7军团军团长',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'generals', 'martyrs'],
    rank: '军团长',
    birthYear: 1912,
    deathYear: 1934,
    hometown: '湖南浏阳',
    avatar: '/images/抗战英雄图片/寻淮洲.jpg',
    story: [
      '寻淮洲1927年9月随浏阳工农义勇队参加湘赣边界秋收起义，后到井冈山，参加开辟井冈山革命根据地斗争。1928年转入中国共产党。',
      '先后任中国工农红军第4军排长、连长，参加井冈山革命根据地反"会剿"作战。1929年春随红4军转战赣南、闽西。',
      '1932年3月任红1军团第15军45师师长，12月任第21军军长。率部参加中央苏区历次反"围剿"作战。',
      '1933年10月任红7军团军团长。1934年1月被选为中华苏维埃共和国中央执行委员。1934年7月，他和乐少华奉命转战闽浙皖赣边。',
      '1934年12月，在安徽太平谭家桥战斗中，他指挥部队同数倍于己之敌展开激战，不幸腹部中弹。在弥留之际，口中还在反复地念着："北上抗日！北上抗日！"壮烈牺牲。'
    ],
    contributions: [
      '参加秋收起义和井冈山斗争',
      '参加中央苏区历次反"围剿"',
      '率部北上抗日',
      '体现了为国家民族献身的精神',
      '临终仍念念不忘北上抗日'
    ],
    timeline: [
      { year: '1927', event: '参加秋收起义' },
      { year: '1928', event: '加入中国共产党' },
      { year: '1932', event: '任红21军军长' },
      { year: '1933', event: '任红7军团军团长' },
      { year: '1934', event: '在谭家桥战斗中牺牲' }
    ],
    quotes: [
      '北上抗日！北上抗日！'
    ]
  },
  {
    id: 15,
    name: '戎冠秀',
    title: '子弟兵的母亲',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist'],
    rank: '模范',
    birthYear: 1896,
    deathYear: 1989,
    hometown: '河北平山',
    avatar: '/images/抗战英雄图片/戎冠秀.jpg',
    story: [
      '戎冠秀1938年担任村妇救会长。1941年秋，在边区军民反"扫荡"斗争中，任村交通转运站站长。前方打仗，她带领妇救会员日夜忙碌，送水送饭，慰劳军队，抢救伤员。',
      '1943年秋，日军7万余人对根据地实行"大扫荡"。戎冠秀指挥群众转移出村后，发现一名负伤的八路军战士正被日军追赶，她急忙背起伤员往山上跑。',
      '在半山腰的一个山洞前，让伤员踩着她的双肩向里面爬，由于山洞太高，她用双手托起伤员的双脚将其送入山洞。',
      '在抗战中，她冒着生命危险抢救过多少伤员，像慈母一样护理过多少伤员，多少伤员喊过她娘，她自己也数不清。',
      '1944年2月，她出席了晋察冀边区群英大会，被晋察冀解放区政府和晋察冀军区授予"子弟兵的母亲"的光荣称号。'
    ],
    contributions: [
      '组织妇女支援抗日战争',
      '抢救护理无数八路军伤员',
      '在反"扫荡"中保护转移伤员',
      '体现了人民群众拥军爱民的精神',
      '被誉为"子弟兵的母亲"'
    ],
    timeline: [
      { year: '1938', event: '担任村妇救会长' },
      { year: '1941', event: '任村交通转运站站长' },
      { year: '1943', event: '在反"扫荡"中抢救伤员' },
      { year: '1944', event: '被授予"子弟兵的母亲"称号' },
      { year: '1949', event: '出席第一届政协会议' }
    ]
  },
  {
    id: 16,
    name: '杨子荣',
    title: '特级侦察英雄',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'fighters', 'martyrs'],
    rank: '侦察排长',
    birthYear: 1917,
    deathYear: 1947,
    hometown: '山东牟平',
    avatar: '/images/抗战英雄图片/杨子荣.jpg',
    story: [
      '杨子荣13岁时随父母闯关东，先后在鸭绿江上当船工，在鞍山、辽阳一带当矿工，因此对东北的三教九流、风俗人情、行帮黑话等都有所了解。',
      '1945年参加八路军。同年10月随部队开赴东北，被编入牡丹江军区第2团某部炊事班当战士，不久调到战斗班当班长。1946年1月加入中国共产党。',
      '由于在战斗中的突出表现，荣立特等功，并被团里评为战斗英雄，后提升为侦察排排长。',
      '1947年1月下旬，杨子荣等人到达夹皮沟的山林中，几番巧妙地与"座山雕"的坐探接触，经过用黑话联络，取得了土匪的信任，打入其隐居地。',
      '2月7日，一举将"座山雕"及其联络部长刘兆成、秘书官李义堂等25个土匪全部活捉，创造了深入匪巢以少胜多的战斗范例。同年2月23日，在继续追剿土匪的战斗中英勇牺牲。'
    ],
    contributions: [
      '参加东北剿匪战斗',
      '深入匪巢打入敌人内部',
      '一举活捉"座山雕"等25名土匪',
      '创造以少胜多的战斗范例',
      '被追授"特级侦察英雄"称号'
    ],
    timeline: [
      { year: '1945', event: '参加八路军' },
      { year: '1946', event: '加入中国共产党' },
      { year: '1947.1', event: '打入"座山雕"匪巢' },
      { year: '1947.2.7', event: '活捉"座山雕"等25名土匪' },
      { year: '1947.2.23', event: '在剿匪战斗中牺牲' }
    ]
  },
  {
    id: 17,
    name: '于化虎',
    title: '爆炸大王',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'fighters'],
    rank: '民兵英雄',
    birthYear: 1914,
    deathYear: 2004,
    hometown: '山东海阳',
    avatar: '/images/抗战英雄图片/于化虎.jpg',
    story: [
      '于化虎1942年组织基干民兵队伍，投身抗日行列。他带领民兵制造出踏雷、绊雷、连环雷、夹子雷、钉子雷、梅花雷等20多种地雷，有力地打击了日寇。',
      '1943年5月，他率领爆破组在村边埋下70多枚土制石头拉雷和石头拌雷，炸死炸伤前来袭击的日军17人。',
      '1945年夏的一天，日军聚集约400多人，对周围村庄进行"扫荡"。于化虎组织民兵，混入敌人内部，活捉敌人14个哨兵，穿上哨兵的衣服进村布雷。',
      '他积极传授布雷技术，1944年10月，于化虎等5人受胶东军区委派，到烟潍线开展地雷战，历时4个多月。',
      '他教给1000多名民兵埋雷技术，在蓬莱附近一次就炸死炸伤日伪军28人。一直到抗战胜利为止，他亲手培养起来的爆炸模范仅3个地区就有20多名。'
    ],
    contributions: [
      '制造20多种地雷打击日军',
      '率领民兵开展地雷战',
      '培养1000多名民兵爆炸手',
      '创造一枚地雷杀伤7名敌人的纪录',
      '被誉为"爆炸大王"和"胶东民兵英雄"'
    ],
    timeline: [
      { year: '1942', event: '组织基干民兵队伍' },
      { year: '1943', event: '率爆破组炸死炸伤日军17人' },
      { year: '1944', event: '到烟潍线开展地雷战' },
      { year: '1945', event: '被授予"爆炸大王"称号' },
      { year: '1950', event: '被评为"全国民兵英雄"' }
    ]
  },
  {
    id: 18,
    name: '关向应',
    title: '八路军第120师政委',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'generals'],
    rank: '政委',
    birthYear: 1902,
    deathYear: 1946,
    hometown: '辽宁大连',
    avatar: '/images/抗战英雄图片/关向应.jpg',
    story: [
      '关向应1924年春加入中国社会主义青年团。同年冬，赴苏联学习。1925年1月加入中国共产党。五卅运动后回国，在上海从事工人运动和共青团工作。',
      '1932年后任中共中央湘鄂西分局委员、湘鄂西军事委员会主席、红3军政委、红2军团副政委。1935年11月，同贺龙、任弼时等指挥红2、6军团开始长征。',
      '长征途中，同张国焘分裂党和红军的行径作了坚决斗争。后任红二方面军政委、中革军委委员。',
      '全国抗战爆发后，任八路军第120师政委，参与创建晋西北抗日根据地。1940年2月起任晋西北军区政委、晋绥军区和陕甘宁晋绥联防军政委。',
      '由于长期艰苦的战斗环境，积劳成疾，1941年秋到延安休养。1946年7月21日在延安病逝。'
    ],
    contributions: [
      '参与指挥红2、6军团长征',
      '坚决反对张国焘分裂行径',
      '参与创建晋西北抗日根据地',
      '担任八路军第120师政委',
      '为党和军队建设作出重大贡献'
    ],
    timeline: [
      { year: '1925', event: '加入中国共产党' },
      { year: '1932', event: '任红3军政委' },
      { year: '1935', event: '参与指挥红2、6军团长征' },
      { year: '1937', event: '任八路军第120师政委' },
      { year: '1946', event: '在延安病逝' }
    ]
  },
  {
    id: 19,
    name: '任常伦',
    title: '一等战斗英雄',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'fighters', 'martyrs'],
    rank: '副排长',
    birthYear: 1921,
    deathYear: 1944,
    hometown: '山东黄县',
    avatar: '/images/抗战英雄图片/任常伦.jpg',
    story: [
      '任常伦17岁加入本村抗日自卫团，19岁参加八路军，编入山东纵队。在战斗频繁、激烈的胶东抗日战场，他表现得十分突出。',
      '政治上积极进步，作战中勇猛顽强，冲锋在前，撤退在后，英勇善战，不怕牺牲。1941年加入中国共产党。1942年6月任班长。',
      '他参加大小战斗120余次，曾9次负伤，每次都是轻伤不下火线，重伤不叫苦，一直坚持战斗到底。',
      '1944年8月，任副排长，出席山东军区战斗英雄代表大会，被选为主席团成员，并获山东军区"一等战斗英雄"称号。',
      '在坚守小高地的战斗中，他带领战士们坚持在阵地前沿，子弹打光了，手榴弹用完了，他带头冲向日军，与日军展开激烈的白刃战，一人连续刺死5名日军，终因中弹壮烈牺牲，年仅23岁。'
    ],
    contributions: [
      '参加大小战斗120余次',
      '9次负伤仍坚持战斗',
      '获"一等战斗英雄"称号',
      '在白刃战中连续刺死5名日军',
      '体现了革命战士英勇顽强的精神'
    ],
    timeline: [
      { year: '1938', event: '加入抗日自卫团' },
      { year: '1940', event: '参加八路军' },
      { year: '1941', event: '加入中国共产党' },
      { year: '1944.8', event: '获"一等战斗英雄"称号' },
      { year: '1944.8', event: '在白刃战中壮烈牺牲' }
    ],
    quotes: [
      '我们没有子弹有刺刀，人在阵地在！'
    ]
  },
  {
    id: 20,
    name: '刘胡兰',
    title: '生的伟大，死的光荣',
    category: 'communist',
    categoryName: '中共英烈',
    categories: ['communist', 'martyrs'],
    rank: '候补党员',
    birthYear: 1932,
    deathYear: 1947,
    hometown: '山西文水',
    avatar: '/images/抗战英雄图片/刘胡兰.jpg',
    story: [
      '全国抗战爆发后，中国共产党领导山西人民开展救亡运动，文水县成立了抗日民主政府。刘胡兰积极参加村里的抗日儿童团，为八路军站岗、放哨、送情报。',
      '后来，刘胡兰当上了云周西村妇救会秘书，参加了党领导的送公粮、做军鞋等群众活动，还动员青年报名参加八路军。',
      '1945年11月，刘胡兰参加了党组织举办的妇女干部训练班，阶级觉悟有了进一步的提高。1946年2月，参加了我军反击阎锡山顽军作战的东庄战斗的支前工作。',
      '刘胡兰在斗争中经受了严峻考验，于1946年6月被批准为中共候补党员。',
      '1947年1月12日，刘胡兰被国民党军和地主武装抓获。在敌人威胁面前，她坚贞不屈，大义凛然地说："怕死不当共产党！"敌人将同时被捕的6位革命群众当场铡死，但她毫不畏惧，从容地躺在铡刀下，英勇牺牲。'
    ],
    contributions: [
      '积极参加抗日儿童团活动',
      '担任村妇救会秘书',
      '动员青年参加八路军',
      '参加支前工作',
      '面对敌人威胁坚贞不屈'
    ],
    timeline: [
      { year: '1937', event: '参加抗日儿童团' },
      { year: '1945', event: '参加妇女干部训练班' },
      { year: '1946.2', event: '参加东庄战斗支前工作' },
      { year: '1946.6', event: '被批准为中共候补党员' },
      { year: '1947.1', event: '英勇牺牲' }
    ],
    quotes: [
      '怕死不当共产党！'
    ]
  },
  // 国民党抗战将领
  {
    id: 21,
    name: '薛岳',
    title: '第九战区司令长官',
    category: 'nationalist',
    categoryName: '国军将士',
    categories: ['nationalist', 'generals'],
    rank: '一级上将',
    birthYear: 1896,
    deathYear: 1998,
    hometown: '广东乐昌',
    avatar: '/images/抗战英雄图片/薛岳.png',
    story: [
      '薛岳早年加入同盟会，并入黄埔陆军小学学习，1918年从保定军校肄业后入粤军。1921年任孙中山总统府警卫团营长。',
      '北伐战争中任国民革命军第一军第一师师长。全面抗战爆发后任第十九集团军总司令，参加淞沪会战。',
      '后任第九战区第一兵团总司令、第九战区副司令长官、司令长官，参加武汉会战，指挥南昌会战、三次长沙会战、长衡会战。',
      '薛岳在抗战期间参与或指挥多次会战，取得了万家岭大捷和第三次长沙会战的胜利，被称为"百战名将"、"中国最能干的战区司令"。',
      '1944年晋陆军二级上将。1998年去世，享年102岁。也有观点认为他是"抗战期间毙敌最多的中国将领"。'
    ],
    contributions: [
      '参加淞沪会战、武汉会战',
      '指挥三次长沙会战取得胜利',
      '取得万家岭大捷',
      '指挥南昌会战、长衡会战',
      '被誉为"抗战期间毙敌最多的中国将领"'
    ],
    timeline: [
      { year: '1918', event: '从保定军校肄业' },
      { year: '1937', event: '任第十九集团军总司令' },
      { year: '1939', event: '任第九战区司令长官' },
      { year: '1941', event: '指挥第三次长沙会战获胜' },
      { year: '1944', event: '晋陆军二级上将' }
    ]
  },
  {
    id: 22,
    name: '李宗仁',
    title: '第五战区司令长官',
    category: 'nationalist',
    categoryName: '国军将士',
    categories: ['nationalist', 'generals'],
    rank: '上将',
    birthYear: 1891,
    deathYear: 1969,
    hometown: '广西临桂',
    avatar: '/images/抗战英雄图片/李宗仁.jpg',
    story: [
      '李宗仁早年毕业于广西陆军小学堂、陆军速成中学堂，后任教官，其间加入同盟会。1925年统一广西，成为"新桂系"首领。',
      '全面抗战爆发后，出任第五战区司令长官，先后指挥徐州会战、随枣会战、枣宜会战、豫南会战，并于其中取得台儿庄大捷。',
      '李宗仁在抗战中，直接指挥过近百万军队。他善于团结"杂牌"部队，能发挥其战斗力，在全面抗战中取得不少成绩。',
      '1965年回归祖国大陆，1969年在北京逝世，享年78岁。后世评价其"青春戎马，晚节黄花"，是中国近现代史上的风云人物。'
    ],
    contributions: [
      '指挥徐州会战取得台儿庄大捷',
      '指挥随枣会战、枣宜会战',
      '善于团结各路军队共同抗日',
      '在抗战中指挥近百万军队',
      '晚年回归祖国大陆'
    ],
    timeline: [
      { year: '1925', event: '统一广西成为新桂系首领' },
      { year: '1937', event: '出任第五战区司令长官' },
      { year: '1938', event: '指挥徐州会战取得台儿庄大捷' },
      { year: '1948', event: '当选中华民国副总统' },
      { year: '1965', event: '回归祖国大陆' }
    ]
  },
  {
    id: 23,
    name: '张自忠',
    title: '第三十三集团军总司令',
    category: 'nationalist',
    categoryName: '国军将士',
    categories: ['nationalist', 'generals', 'martyrs'],
    rank: '上将',
    birthYear: 1891,
    deathYear: 1940,
    hometown: '山东临清',
    avatar: '/images/抗战英雄图片/张自忠.jpg',
    story: [
      '张自忠1916年入冯玉祥部，历任营长、团长、旅长、师长等职。1931年后任第29军38师师长。1933年参加长城抗战，任喜峰口第29军前线总指挥。',
      '七七事变后，代理冀察政务委员会委员长兼北平市长。日军占领平津后，化装出逃，表示誓死抗战。',
      '1938年3月，日军进犯台儿庄，奉命率第59军急行军增援台儿庄作战，为整个战役胜利赢得了时间。在武汉会战中，孤军坚守潢川，抗阻日军。',
      '1939年5月，随枣会战开始，张自忠率部取得"鄂北大捷"。12月，又率右翼兵团歼敌4500余人，取得"襄东大捷"。',
      '1940年5月16日，在枣宜会战中，他亲自率领部队与日军决战。在部队被敌层层包围的不利态势下，他身先士卒、冲锋在前、力战不退，最后身中7弹牺牲。'
    ],
    contributions: [
      '参加长城抗战，守住喜峰口',
      '增援台儿庄作战，赢得战役时间',
      '在武汉会战中孤军坚守潢川',
      '取得"鄂北大捷"和"襄东大捷"',
      '在枣宜会战中壮烈殉国'
    ],
    timeline: [
      { year: '1937', event: '参加淞沪会战' },
      { year: '1938', event: '参加徐州会战、武汉会战' },
      { year: '1939', event: '参加随枣会战' },
      { year: '1940', event: '在枣宜会战中壮烈牺牲' }
    ],
    quotes: [
      '只要还有一兵一卒，就要坚决抗战到底',
      '国家兴亡，匹夫有责'
    ]
  },
  {
    id: 24,
    name: '卫立煌',
    title: '中国远征军代司令长官',
    category: 'nationalist',
    categoryName: '国军将士',
    categories: ['nationalist', 'generals'],
    rank: '二级上将',
    birthYear: 1897,
    deathYear: 1960,
    hometown: '安徽合肥',
    avatar: '/images/抗战英雄图片/卫立煌.jpg',
    story: [
      '卫立煌1912年加入安徽和县革命军，1915年到广州投粤军，后任孙中山卫士、警卫团排长，参加镇压商团叛乱及东征陈炯明等役。',
      '"七七"事变后任第十四集团军总司令兼第二战区前敌总指挥，指挥忻口战役，打击日军气焰。1938年任第二战区副司令长官，次年任第一战区司令长官。',
      '1943年11月任中国远征军代司令长官，次年指挥所部击败侵占滇西的日军，收复失地。1945年1月，所部与中国驻印军在缅甸芒友会师，打通中印公路。',
      '卫立煌戎马一生，以能征惯战著称，是国民党中央军嫡系部队中的"五虎上将"之一。日军将领香月清司称赞他为"支那虎将"，美国方面也对其有"常胜将军"之誉。',
      '1955年回到北京，是第一个从海外归来的国民党高级将领。1960年在北京病逝，终年63岁，葬于八宝山革命公墓。'
    ],
    contributions: [
      '指挥忻口战役打击日军',
      '与八路军友好相处，相互支援',
      '指挥远征军击败滇西日军',
      '打通中印公路',
      '解放后回归祖国'
    ],
    timeline: [
      { year: '1937', event: '指挥忻口战役' },
      { year: '1938', event: '任第二战区副司令长官' },
      { year: '1943', event: '任中国远征军代司令长官' },
      { year: '1945', event: '与驻印军在芒友会师' },
      { year: '1955', event: '回到北京' }
    ]
  },
  {
    id: 25,
    name: '戴安澜',
    title: '第5军200师师长',
    category: 'nationalist',
    categoryName: '国军将士',
    categories: ['nationalist', 'generals', 'martyrs'],
    rank: '师长',
    birthYear: 1904,
    deathYear: 1942,
    hometown: '安徽无为',
    avatar: '/images/抗战英雄图片/戴安澜.png',
    story: [
      '戴安澜1924年12月，入黄埔军校第三期学习，在校期间曾参加东征。1925年，参加北伐战争。',
      '七七事变后，任国民党第73旅旅长，先后参加保定、漕河、台儿庄、中条山等战役。1938年，晋升为国民党第89师副师长，后参加武汉会战。',
      '1939年1月，升任国民革命军第5军200师师长；12月，参加桂南昆仑关战役。',
      '1941年，赴缅甸作战，先后参加同古保卫战、棠吉攻击战等战役。1942年5月18日，第200师遭遇敌第56师团两个大队兵力。',
      '戴安澜在战斗中胸部、腹部各中一弹。时值缅甸雨季，雨淋日晒，缺医少药，伤口化脓；5月26日，戴安澜在缅甸茅邦村殉国，年仅38岁。'
    ],
    contributions: [
      '参加台儿庄、中条山等重要战役',
      '参加武汉会战',
      '参加桂南昆仑关战役',
      '率部赴缅甸参加同古保卫战',
      '在缅甸作战中壮烈殉国'
    ],
    timeline: [
      { year: '1924', event: '入黄埔军校第三期' },
      { year: '1937', event: '参加台儿庄等战役' },
      { year: '1939', event: '任第5军200师师长' },
      { year: '1941', event: '赴缅甸作战' },
      { year: '1942', event: '在缅甸茅邦村殉国' }
    ]
  }
])

// 英雄统计数据
const heroStats = ref([
  { icon: '🏮', value: '25', label: '民族英杰' },
  { icon: '☭', value: '17', label: '中共英烈' },
  { icon: '🎖️', value: '5', label: '国军将士' },
  { icon: '🕯️', value: '12', label: '革命先烈' },
  { icon: '🇨🇳', value: '数千万', label: '参战军民' }
])

// 英雄精神价值
const heroicValues = ref([
  {
    icon: '🏛️',
    title: '爱国主义精神',
    description: '为了祖国和民族的独立解放，不惜抛头颅洒热血'
  },
  {
    icon: '🛡️',
    title: '英勇无畏精神',
    description: '面对强敌毫不畏惧，敢于斗争敢于胜利'
  },
  {
    icon: '🤝',
    title: '团结协作精神',
    description: '万众一心，众志成城，形成抗击侵略的钢铁长城'
  },
  {
    icon: '🔥',
    title: '不屈不挠精神',
    description: '宁死不屈，坚持斗争到底的革命意志'
  },
  {
    icon: '⭐',
    title: '无私奉献精神',
    description: '舍小家为大家，为民族解放事业贡献一切'
  },
  {
    icon: '🌟',
    title: '国际主义精神',
    description: '支持世界反法西斯斗争，为人类和平正义而战'
  }
])

// 计算属性 - 过滤后的英雄列表
const filteredHeroes = computed(() => {
  if (activeCategory.value === 'all') {
    return heroes.value
  }
  return heroes.value.filter(hero => 
    hero.categories && hero.categories.includes(activeCategory.value)
  )
})

// 方法
const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId
  selectedHero.value = null
}

const selectHero = (hero) => {
  selectedHero.value = hero
}

const closeHeroDetail = () => {
  selectedHero.value = null
}

const handleImageError = (event) => {
  event.target.src = '/images/default-hero.jpg'
}
</script>

<style scoped>
.war-heroes-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 25%, #dc2626 50%, #991b1b 75%, #7f1d1d 100%);
  color: #fef2f2;
  font-family: 'Noto Serif SC', serif;
}

/* 页面头部 */
.heroes-header {
  padding: 100px 0 80px;
  background: radial-gradient(circle at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%);
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-emblem {
  margin-bottom: 30px;
}

.emblem-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(145deg, #dc2626, #991b1b);
  border: 4px solid #fbbf24;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.emblem-icon {
  font-size: 3rem;
  color: #fbbf24;
}

.page-title {
  font-size: 3.5rem;
  font-weight: bold;
  color: #fbbf24;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.page-subtitle {
  font-size: 1.5rem;
  color: #fef2f2;
  margin-bottom: 30px;
  opacity: 0.9;
}

.hero-quote {
  font-size: 1.2rem;
  font-style: italic;
  color: #fbbf24;
  background: rgba(127, 29, 29, 0.5);
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #fbbf24;
  max-width: 600px;
  margin: 0 auto;
}

.quote-mark {
  font-size: 1.5rem;
  color: #dc2626;
  font-weight: bold;
}

/* 英雄分类导航 */
.heroes-navigation {
  padding: 40px 0;
  background: rgba(127, 29, 29, 0.2);
  border-top: 2px solid rgba(251, 191, 36, 0.3);
  border-bottom: 2px solid rgba(251, 191, 36, 0.3);
}

.nav-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.nav-tab {
  background: rgba(127, 29, 29, 0.6);
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 25px;
  padding: 15px 25px;
  color: #fef2f2;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
}

.nav-tab:hover,
.nav-tab.active {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #7f1d1d;
  border-color: #fbbf24;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(251, 191, 36, 0.3);
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-label {
  font-weight: bold;
}

.tab-count {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 英雄列表 */
.heroes-list {
  padding: 80px 0;
}

.heroes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.hero-card {
  background: linear-gradient(145deg, rgba(127, 29, 29, 0.8), rgba(153, 27, 27, 0.6));
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.hero-card:hover,
.hero-card.selected {
  border-color: #fbbf24;
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(251, 191, 36, 0.2);
}

.hero-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.hero-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #fbbf24;
  object-fit: cover;
}

.hero-rank {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: #fbbf24;
  color: #7f1d1d;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
}

.hero-info {
  text-align: center;
  margin-bottom: 20px;
}

.hero-name {
  font-size: 1.3rem;
  color: #fbbf24;
  margin-bottom: 8px;
  font-weight: bold;
}

.hero-title {
  color: #fef2f2;
  margin-bottom: 8px;
  font-size: 0.9rem;
  opacity: 0.9;
}

.hero-years {
  color: #fbbf24;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.hero-category {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  display: inline-block;
}

.hero-actions {
  text-align: center;
}

.view-details-btn {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #7f1d1d;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.view-details-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(251, 191, 36, 0.3);
}

/* 英雄详细信息面板 */
.hero-detail-panel {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.detail-content {
  background: linear-gradient(145deg, #7f1d1d, #991b1b);
  border: 3px solid #fbbf24;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #dc2626;
  color: #fef2f2;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  font-size: 1.2rem;
}

.close-btn:hover {
  background: #991b1b;
  transform: scale(1.1);
}

.detail-header {
  display: flex;
  align-items: flex-start;
  gap: 30px;
  padding: 40px 40px 20px;
  border-bottom: 2px solid rgba(251, 191, 36, 0.3);
}

.detail-avatar {
  position: relative;
  flex-shrink: 0;
}

.detail-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #fbbf24;
  object-fit: cover;
}

.detail-rank {
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: #fbbf24;
  color: #7f1d1d;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
}

.detail-basic-info {
  flex: 1;
}

.detail-name {
  font-size: 2.2rem;
  color: #fbbf24;
  margin-bottom: 10px;
  font-weight: bold;
}

.detail-title {
  color: #fef2f2;
  font-size: 1.1rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.detail-meta {
  display: grid;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-label {
  color: #fbbf24;
  font-weight: bold;
  min-width: 80px;
}

.meta-value {
  color: #fef2f2;
}

.detail-body {
  padding: 20px 40px 40px;
}

.detail-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  color: #fbbf24;
  margin-bottom: 20px;
  font-weight: bold;
}

.section-icon {
  font-size: 1.2rem;
}

.hero-story {
  background: rgba(127, 29, 29, 0.3);
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #fbbf24;
}

.story-paragraph {
  color: #fef2f2;
  line-height: 1.8;
  margin-bottom: 15px;
  opacity: 0.9;
}

.story-paragraph:last-child {
  margin-bottom: 0;
}

.contributions-list {
  list-style: none;
  padding: 0;
}

.contribution-item {
  background: rgba(127, 29, 29, 0.3);
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  border-left: 4px solid #fbbf24;
  color: #fef2f2;
  position: relative;
  padding-left: 45px;
}

.contribution-item::before {
  content: '★';
  position: absolute;
  left: 20px;
  color: #fbbf24;
  font-weight: bold;
}

.hero-timeline {
  display: grid;
  gap: 15px;
}

.timeline-event {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: rgba(127, 29, 29, 0.3);
  padding: 15px 20px;
  border-radius: 8px;
  border-left: 4px solid #fbbf24;
}

.timeline-year {
  background: #fbbf24;
  color: #7f1d1d;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.timeline-description {
  color: #fef2f2;
  flex: 1;
  opacity: 0.9;
}

.hero-quotes {
  display: grid;
  gap: 15px;
}

.hero-quote-item {
  background: rgba(127, 29, 29, 0.3);
  border-left: 4px solid #fbbf24;
  padding: 20px;
  border-radius: 8px;
  color: #fbbf24;
  font-style: italic;
  font-size: 1.1rem;
  margin: 0;
  position: relative;
}

.hero-quote-item::before {
  content: '"';
  font-size: 3rem;
  color: #dc2626;
  position: absolute;
  left: -5px;
  top: -10px;
  font-weight: bold;
}

/* 英雄统计 */
.heroes-statistics {
  padding: 80px 0;
  background: rgba(153, 27, 27, 0.1);
  border-top: 2px solid rgba(251, 191, 36, 0.3);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: #fbbf24;
  margin-bottom: 50px;
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.stat-card {
  background: linear-gradient(145deg, rgba(127, 29, 29, 0.8), rgba(153, 27, 27, 0.6));
  padding: 40px 20px;
  border-radius: 15px;
  border: 2px solid #fbbf24;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(251, 191, 36, 0.2);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fbbf24;
  margin-bottom: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.stat-label {
  color: #fef2f2;
  font-size: 1rem;
  opacity: 0.9;
}

/* 英雄精神传承 */
.heroes-legacy {
  padding: 80px 0;
  background: linear-gradient(135deg, #7f1d1d, #991b1b);
  border-top: 4px solid #fbbf24;
}

.legacy-content {
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
}

.legacy-title {
  font-size: 2.5rem;
  color: #fbbf24;
  margin-bottom: 30px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.legacy-text {
  font-size: 1.3rem;
  color: #fef2f2;
  line-height: 1.8;
  margin-bottom: 50px;
  opacity: 0.9;
  font-style: italic;
}

.spirit-values {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 30px;
}

.value-item {
  background: rgba(127, 29, 29, 0.5);
  padding: 30px 20px;
  border-radius: 15px;
  border: 2px solid rgba(251, 191, 36, 0.3);
  transition: all 0.3s ease;
}

.value-item:hover {
  border-color: #fbbf24;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.2);
}

.value-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.value-title {
  font-size: 1.2rem;
  color: #fbbf24;
  margin-bottom: 15px;
  font-weight: bold;
}

.value-desc {
  color: #fef2f2;
  line-height: 1.6;
  opacity: 0.9;
  font-size: 0.95rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .spirit-values {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .heroes-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-tabs {
    flex-direction: column;
    align-items: center;
  }
  
  .detail-header {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px 20px;
  }
  
  .detail-body {
    padding: 20px;
  }
  
  .timeline-event {
    flex-direction: column;
    gap: 10px;
  }
  
  .legacy-title {
    font-size: 1.8rem;
  }
  
  .legacy-text {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .spirit-values {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 15px;
  }
  
  .value-title {
    font-size: 1.1rem;
  }
  
  .value-desc {
    font-size: 0.9rem;
  }
  
  .container {
    padding: 0 15px;
  }
}
.war-heroes-page {
  background: transparent;
  color: #E8E3DA;
}

.heroes-header {
  background: linear-gradient(165deg, #241016 0%, #3A1620 60%, #2A1218 100%) !important;
  border-bottom: 1px solid rgba(212, 175, 55, 0.25);
}
.emblem-circle {
  background: radial-gradient(circle at 50% 35%, #5A212C 0%, #3A1620 60%, #241016 100%) !important;
  border: 1px solid rgba(212, 175, 55, 0.45) !important;
  box-shadow: 0 0 50px -12px rgba(212, 175, 55, 0.35), inset 0 0 30px rgba(0, 0, 0, 0.6) !important;
}
.emblem-icon { font-size: 2.5rem; }
.page-title {
  color: #D4AF37 !important;
  letter-spacing: 0.12em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.7);
}
.page-subtitle { color: #9AA5AC !important; letter-spacing: 0.1em; }
.hero-quote { color: #E8E3DA !important; }
.quote-mark { color: #D4AF37 !important; opacity: 0.7; }

.nav-tab {
  background: #3A1620 !important;
  color: #9AA5AC !important;
  border: 1px solid rgba(212, 175, 55, 0.22) !important;
  border-radius: 999px;
  transition: all 0.3s ease;
}
.nav-tab:hover {
  background: #1F2830 !important;
  color: #E8E3DA !important;
  border-color: rgba(212, 175, 55, 0.45) !important;
}
.nav-tab.active {
  background: linear-gradient(135deg, #5A212C, #451A24) !important;
  color: #D4AF37 !important;
  border-color: #D4AF37 !important;
  box-shadow: 0 4px 18px -6px rgba(212, 175, 55, 0.4);
}
.tab-count { color: #7E878E !important; }
.nav-tab.active .tab-count { color: #B87333 !important; }

.hero-card {
  background: linear-gradient(160deg, #451A24 0%, #3A1620 100%) !important;
  border: 1px solid rgba(212, 175, 55, 0.18) !important;
  border-radius: 12px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03) !important;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-card:hover {
  transform: translateY(-3px) scale(1.01);
  border-color: rgba(212, 175, 55, 0.5) !important;
  box-shadow: 0 12px 34px -14px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(212, 175, 55, 0.25) !important;
}
.hero-card.selected {
  border-color: #D4AF37 !important;
  box-shadow: 0 0 0 1px #D4AF37, 0 12px 34px -14px rgba(212, 175, 55, 0.4) !important;
}
.hero-avatar {
  border: 1px solid rgba(212, 175, 55, 0.25) !important;
  background: #241016;
}
.hero-avatar img { filter: saturate(0.85) brightness(0.95); }
.hero-rank {
  background: rgba(14, 20, 24, 0.9) !important;
  border: 1px solid rgba(212, 175, 55, 0.35) !important;
  color: #D4AF37 !important;
}
.hero-name { color: #E8E3DA !important; letter-spacing: 0.05em; }
.hero-title { color: #9AA5AC !important; }
.hero-years { color: #7E878E !important; }
.hero-category {
  background: rgba(212, 175, 55, 0.1) !important;
  color: #D4AF37 !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
}
.view-details-btn {
  background: linear-gradient(135deg, #5A212C, #451A24) !important;
  color: #E8E3DA !important;
  border: 1px solid rgba(212, 175, 55, 0.35) !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.view-details-btn:hover {
  background: rgba(212, 175, 55, 0.12) !important;
  color: #D4AF37 !important;
  border-color: #D4AF37 !important;
}

.hero-detail-panel {
  background: rgba(8, 12, 15, 0.85) !important;
  backdrop-filter: blur(6px);
}
.detail-content {
  background: linear-gradient(160deg, #451A24 0%, #2A1218 100%) !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.9) !important;
  color: #E8E3DA !important;
}
.close-btn { color: #9AA5AC !important; }
.close-btn:hover { color: #D4AF37 !important; }
.detail-name { color: #D4AF37 !important; }
.detail-title { color: #9AA5AC !important; }
.meta-label { color: #7E878E !important; }
.meta-value { color: #E8E3DA !important; }
.detail-avatar { border: 1px solid rgba(212, 175, 55, 0.3) !important; }
.detail-rank {
  background: rgba(14, 20, 24, 0.9) !important;
  color: #D4AF37 !important;
  border: 1px solid rgba(212, 175, 55, 0.35) !important;
}

.section-title { color: #D4AF37 !important; letter-spacing: 0.08em; }
.story-paragraph { color: #C3CAD0 !important; }
.contribution-item {
  color: #C3CAD0 !important;
  border-left: 2px solid rgba(212, 175, 55, 0.4) !important;
}
.hero-timeline { border-left: 1px solid rgba(212, 175, 55, 0.3) !important; }
.timeline-year { color: #D4AF37 !important; }
.timeline-description { color: #C3CAD0 !important; }
.hero-quote-item {
  background: rgba(212, 175, 55, 0.06) !important;
  border-left: 2px solid #D4AF37 !important;
  color: #E8E3DA !important;
}

.stat-card {
  background: linear-gradient(160deg, #451A24 0%, #3A1620 100%) !important;
  border: 1px solid rgba(212, 175, 55, 0.2) !important;
  border-radius: 12px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.5) !important;
}
.stat-number { color: #D4AF37 !important; }
.stat-label { color: #9AA5AC !important; }

.legacy-title { color: #D4AF37 !important; letter-spacing: 0.1em; }
.legacy-text { color: #C3CAD0 !important; }
.value-item {
  background: rgba(26, 34, 40, 0.6) !important;
  border: 1px solid rgba(212, 175, 55, 0.18) !important;
  border-radius: 12px;
}
.value-title { color: #E8E3DA !important; }
.value-desc { color: #9AA5AC !important; }
.hero-quote {
  background: rgba(212, 175, 55, 0.06) !important;
  border: 1px solid rgba(212, 175, 55, 0.25) !important;
  border-radius: 10px;
  padding: 14px 28px;
  display: inline-block;
}

.heroes-legacy {
  background: linear-gradient(165deg, #241016 0%, #3A1620 100%) !important;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}
.legacy-content {
  background: rgba(26, 34, 40, 0.5) !important;
  border: 1px solid rgba(212, 175, 55, 0.18) !important;
  border-radius: 14px;
  padding: 32px;
}

.heroes-statistics {
  background: transparent !important;
}
.heroes-navigation {
  background: transparent !important;
}
.heroes-list {
  background: transparent !important;
}

.war-heroes-page [class*="bg-red-"] {
  background-color: #3A1620 !important;
}
.war-heroes-page [class*="from-red-"] {
  --tw-gradient-from: #241016 !important;
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}
.war-heroes-page [class*="to-red-"] {
  --tw-gradient-to: #2A1218 !important;
  --tw-gradient-stops: #241016, #3A1620, #2A1218 !important;
}
.war-heroes-page [class*="border-red-"] {
  border-color: rgba(212, 175, 55, 0.22) !important;
}
.hero-card{
  background:linear-gradient(160deg,#451A24 0%,#3A1620 100%)!important;
  border:1px solid rgba(212,175,55,.28)!important;
  box-shadow:0 2px 14px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.04)!important}
.hero-card:hover{
  border-color:rgba(212,175,55,.55)!important;
  box-shadow:0 12px 34px -14px rgba(0,0,0,.8)!important}
.nav-tab{background:#3A1620!important;color:#C3CAD0!important;border:1px solid rgba(212,175,55,.25)!important}
.nav-tab.active{background:#5A212C!important;color:#EBC97A!important;border-color:#D4AF37!important}
.stat-card,.value-item,.hero-detail-panel .detail-content{
  background:linear-gradient(160deg,#451A24 0%,#3A1620 100%)!important;
  border:1px solid rgba(212,175,55,.25)!important}
.hero-avatar,.detail-avatar{background:#2A1218!important;border:1px solid rgba(212,175,55,.3)!important}
.hero-category{background:rgba(212,175,55,.12)!important;color:#EBC97A!important;border:1px solid rgba(212,175,55,.35)!important}
.view-details-btn{background:#5A212C!important;color:#E8E3DA!important;border:1px solid rgba(212,175,55,.4)!important}
.view-details-btn:hover{background:rgba(212,175,55,.15)!important;color:#EBC97A!important;border-color:#D4AF37!important}
.hero-quote-item,.significance{background:rgba(212,175,55,.08)!important;border-left:2px solid #D4AF37!important}


.war-heroes-page .hero-rank,
.war-heroes-page .detail-rank{
  background:transparent!important;
  border:none!important;
  box-shadow:none!important;
  color:#EBC97A!important;
  text-shadow:0 1px 6px rgba(0,0,0,.9)!important;
  padding:2px 0!important;
}


.war-heroes-page .hero-timeline .timeline-event{
  position:relative!important;padding-left:28px!important}
.war-heroes-page .hero-timeline .timeline-event::before{
  content:''!important;position:absolute!important;left:8px!important;top:50%!important;
  transform:translateY(-50%)!important;width:9px!important;height:9px!important;
  border-radius:50%!important;background:#D4AF37!important;
  box-shadow:0 0 0 3px rgba(212,175,55,.15),0 0 12px rgba(212,175,55,.45)!important;
  display:block!important}
.war-heroes-page .timeline-year{
  background:transparent!important;background-image:none!important;
  border:none!important;box-shadow:none!important;text-decoration:none!important;
  color:#EBC97A!important;font-weight:600!important}
.war-heroes-page .timeline-year::after,
.war-heroes-page .timeline-event::after{display:none!important}
.war-heroes-page .timeline-description{color:#C3CAD0!important}


.war-heroes-page .hero-avatar,
.war-heroes-page .detail-avatar{
  background:transparent!important;
  background-color:transparent!important;
  background-image:none!important;
  border:none!important;
  box-shadow:none!important;
  overflow:visible!important;
}
.war-heroes-page .hero-avatar img,
.war-heroes-page .detail-avatar img{
  background:transparent!important;
  border-radius:50%!important;
  border:2px solid #D4AF37!important;
  object-fit:cover!important;
  display:block!important;
  box-shadow:0 0 18px -4px rgba(212,175,55,.45)!important;
}


.war-heroes-page .hero-timeline .timeline-event{
  display:flex!important;
  align-items:center!important;
  gap:14px!important;
  line-height:1.6!important;
}
.war-heroes-page .hero-timeline .timeline-event > *{
  margin-top:0!important;margin-bottom:0!important;
  padding-top:0!important;padding-bottom:0!important;
  line-height:1.6!important;
  align-self:center!important;
}
.war-heroes-page .hero-timeline .timeline-event > [class*="year"],
.war-heroes-page .hero-timeline .timeline-event > [class*="date"]{
  flex:0 0 64px!important;
  color:#EBC97A!important;
}

</style>