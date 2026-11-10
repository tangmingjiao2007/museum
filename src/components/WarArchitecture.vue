<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 建筑场景数据 - 基于真实抗战历史建筑
const architectureItems = ref([
  {
    id: 'wanping',
    title: '宛平城',
    thumbnail: '/images/建筑物/宛平城.png',
    dynasty: '明朝（1638-1640年建）',
    category: '历史要塞',
    size: '东西640米，南北320米',
    material: '砖石结构',
    description: '宛平城是明朝末年为防御李自成农民起义而建的军事要塞，位于北京丰台区。它是中国人民抗日战争全面爆发的历史见证地，1937年7月7日的卢沟桥事变就发生在这里。这座半方形的古城见证了中华民族14年抗战的开端，城内保存着大量抗战文物和历史遗迹。',
    modelSrc: '/models/建筑物/宛平城.glb',
    historicalContext: '七七事变的发生地，标志着中国人民抗日战争全面爆发。',
    historicalRecord: '宛平城建于1638-1640年，原为明朝防御农民起义的军事要塞。1937年7月7日夜，日军以一名士兵失踪为借口，要求进入宛平城搜查，遭到中国守军严词拒绝。随后日军向宛平城和卢沟桥发动攻击，中国守军第29军第37师第110旅第219团团长吉星文率部奋起抵抗。这就是震惊中外的"七七事变"，标志着中国人民抗日战争全面爆发。城墙上至今还保留着当年日军炮击留下的弹痕，成为日本侵华的铁证。',
    technicalSpecs: {
      建筑面积: '20.48万平方米',
      城墙高度: '约10米',
      设防时间: '明朝崇祯年间',
      历史地位: '抗战全面爆发见证地'
    }
  },
  {
    id: 'sihang',
    title: '四行仓库',
    thumbnail: '/images/建筑物/四行仓库.png',
    dynasty: '民国时期（1937年建）',
    category: '历史建筑',
    size: '高6层，建筑面积2万平方米',
    material: '钢筋混凝土',
    description: '四行仓库位于上海静安区，是抗战时期"八百壮士"英勇抗日的历史见证地。1937年10月26日至11月1日，中国军队第88师524团第1营官兵在副团长谢晋元指挥下，坚守四行仓库4昼夜，击退日军多次进攻，为掩护大部队撤退争取了宝贵时间。',
    modelSrc: '/models/建筑物/四行仓库.glb',
    historicalContext: '淞沪会战中"八百壮士"的英勇抗战地，展现了中华民族的不屈精神。',
    historicalRecord: '四行仓库保卫战是淞沪会战的尾声，也是整个战役中最为悲壮的一幕。1937年10月26日，国民革命军第88师524团副团长谢晋元率领"八百壮士"（实际414人）坚守四行仓库。他们与数倍于己的日军展开殊死搏斗，在国际社会瞩目下上演了一场惊心动魄的抗日英雄剧。战士陈树生身绑手榴弹从楼上跳下与敌同归于尽的壮举，至今仍被人们传颂。这场战斗极大地鼓舞了全国人民的抗战士气。',
    technicalSpecs: {
      建筑年代: '1935年',
      建筑风格: '装饰艺术风格',
      防御时间: '4昼夜',
      守军人数: '414人'
    }
  },
  {
    id: 'yanan-auditorium',
    title: '延安大礼堂',
    thumbnail: '/images/建筑物/延安大礼堂.png',
    dynasty: '抗战时期（1940年建）',
    category: '革命建筑',
    size: '能容纳2000余人',
    material: '砖木结构',
    description: '延安大礼堂是中国共产党在延安时期的重要活动场所，见证了中国革命的重要历史时刻。1945年4月23日至6月11日，中国共产党第七次全国代表大会在这里胜利召开，确立了毛泽东思想的指导地位，为夺取抗日战争和解放战争的胜利奠定了思想基础。',
    modelSrc: '/models/建筑物/延安大礼堂.glb',
    historicalContext: '中共七大召开地，确立了毛泽东思想的指导地位。',
    historicalRecord: '延安大礼堂建于1940年，是延安时期最重要的公共建筑之一。1945年中共七大在此召开，这次大会是中国共产党在民主革命时期召开的最重要的代表大会。大会确立了毛泽东思想作为党的指导思想，选举产生了以毛泽东为核心的中央领导集体。礼堂的建设体现了陕北窑洞建筑的特色，同时融入了现代建筑元素，是革命圣地延安的重要标志性建筑。',
    technicalSpecs: {
      建成时间: '1940年',
      容纳人数: '2000余人',
      建筑特色: '中西合璧',
      历史意义: '中共七大会址'
    }
  },
  {
    id: 'taierzhuang',
    title: '台儿庄战役遗址',
    thumbnail: '/images/建筑物/台儿庄战役.png',
    dynasty: '抗战时期（1938年）',
    category: '战役遗址',
    size: '古城面积2平方公里',
    material: '砖石结构',
    description: '台儿庄古城位于山东枣庄，是1938年台儿庄大战的主战场。这场战役是抗战以来中国军队取得的第一次重大胜利，极大地鼓舞了全国军民的抗战士气。台儿庄战役歼灭日军万余人，打破了日军不可战胜的神话，成为抗战史上的重要转折点。',
    modelSrc: '/models/建筑物/台儿庄战役.glb',
    historicalContext: '抗战以来第一次重大军事胜利，被誉为"台儿庄大捷"。',
    historicalRecord: '台儿庄战役发生在1938年3月-4月，是徐州会战的重要组成部分。在李宗仁指挥下，中国军队与日军展开激烈的巷战。战役中，中国军队充分利用台儿庄的地理优势和建筑特点，与敌人展开逐街逐屋的争夺战。经过半个多月的浴血奋战，中国军队歼灭日军万余人，取得了抗战以来的第一次重大胜利。这一胜利不仅在军事上具有重要意义，更在精神上极大地鼓舞了全国人民。',
    technicalSpecs: {
      战役时间: '1938年3-4月',
      歼敌数量: '万余人',
      参战部队: '第五战区',
      历史地位: '抗战首胜'
    }
  },
  {
    id: 'chengde',
    title: '避暑山庄',
    thumbnail: '/images/建筑物/避暑山庄.png',
    dynasty: '清朝（1703-1792年建）',
    category: '皇家园林',
    size: '占地564万平方米',
    material: '传统建筑材料',
    description: '承德避暑山庄是中国现存占地最大的古代帝王宫苑，被誉为"中国古典园林之最高范例"。抗战时期，这里见证了华北地区的抗日斗争。山庄的建筑艺术和园林设计体现了中华文化的博大精深，是中华民族宝贵的文化遗产。',
    modelSrc: '/models/建筑物/避暑山庄.glb',
    historicalContext: '清朝皇家园林，抗战期间华北地区的重要历史见证地。',
    historicalRecord: '承德避暑山庄始建于1703年，历时89年建成，是清朝皇帝夏日避暑和处理政务的场所。抗日战争期间，日军占领承德后，对避暑山庄进行了破坏和掠夺。许多珍贵文物被劫掠，部分建筑遭到损毁。尽管如此，避暑山庄作为中华文化的瑰宝，依然展现着中国古代建筑和园林艺术的精华，象征着中华民族深厚的文化底蕴和不屈的民族精神。',
    technicalSpecs: {
      建造年代: '1703-1792年',
      占地面积: '564万平方米',
      建筑风格: '古典园林',
      文化价值: '世界文化遗产'
    }
  },
  {
    id: 'datong-fort',
    title: '大协炮楼',
    thumbnail: '/images/建筑物/大协炮楼.png',
    dynasty: '抗战时期',
    category: '军事工事',
    size: '高度约15米',
    material: '钢筋混凝土',
    description: '大协炮楼是抗战时期重要的军事防御工事，见证了中国军民英勇抗击日本侵略者的悲壮历史。这些坚固的炮楼在敌后游击战中发挥了重要作用，成为保卫家园、抵抗侵略的坚强堡垒。每一座炮楼都承载着抗战军民的血泪与坚守。',
    modelSrc: '/models/建筑物/大协炮楼.glb',
    historicalContext: '抗日战争时期的重要军事防御设施。',
    historicalRecord: '大协炮楼建于抗战时期，是当时重要的军事防御工事。在日军的疯狂进攻下，守卫炮楼的中国军民以血肉之躯筑起钢铁防线，用生命诠释了中华民族不屈不挠的精神。这些炮楼不仅是军事设施，更是民族精神的象征，见证了中国人民在艰难岁月中的坚韧与勇敢。虽然岁月流逝，但这些建筑仍然屹立不倒，提醒着后人珍惜和平，勿忘历史。',
    technicalSpecs: {
      建造时期: '1937-1945年',
      防御等级: '重点工事',
      战略作用: '制高点控制',
      历史意义: '抗战防御见证'
    }
  },
  {
    id: 'dajingmen',
    title: '张家口大境门',
    thumbnail: '/images/建筑物/张家口大境门.png',
    dynasty: '清朝（1644年建）',
    category: '古城门',
    size: '高12米，底宽13米',
    material: '条石砌筑',
    description: '张家口大境门是万里长城的重要关口，素有"万里长城第一门"之称。抗战时期，这里是华北地区重要的交通枢纽和军事要地。大境门见证了张家口地区军民的英勇抗战，承载着深厚的历史文化内涵和爱国主义精神。',
    modelSrc: '/models/建筑物/张家口大境门.glb',
    historicalContext: '万里长城重要关口，抗战期间华北地区的战略要地。',
    historicalRecord: '张家口大境门建于清顺治元年（1644年），是长城沿线保存较为完整的重要关口。抗日战争全面爆发后，日军很快占领了张家口，大境门地区成为日军统治华北的重要据点。在日占期间，当地军民进行了不屈不挠的抗日斗争。八路军游击队经常在大境门一带活动，打击日伪军，保护人民群众。大境门不仅是古代军事防御的见证，更是近代中华民族抗击外侵的历史丰碑。',
    technicalSpecs: {
      建造年代: '清顺治元年（1644年）',
      门洞高度: '12米',
      门洞宽度: '13米',
      历史地位: '长城第一门'
    }
  },
  {
    id: 'huadu-bunker',
    title: '花都碉堡',
    thumbnail: '/images/建筑物/花都碉堡.png',
    dynasty: '抗战时期',
    category: '防御工事',
    size: '直径6米，高8米',
    material: '钢筋混凝土',
    description: '花都碉堡是华南地区抗战时期重要的军事防御设施，见证了粤北地区军民的英勇抗战。这些坚固的碉堡在抗日游击战中发挥了重要作用，成为保卫华南、抵抗日军的重要据点。每一座碉堡都凝结着抗战军民的智慧和勇气。',
    modelSrc: '/models/建筑物/花都碉堡.glb',
    historicalContext: '华南地区抗日游击战的重要军事设施。',
    historicalRecord: '花都碉堡建于抗战时期，是华南地区重要的军事防御工事。广东沦陷后，中国军队和游击队利用这些碉堡与日军进行顽强抗争。碉堡的设计充分考虑了华南地区的地理特点和气候条件，既能有效防御敌人攻击，又便于进行反击作战。在艰苦的游击战争中，这些碉堡为抗日武装提供了重要的据点和掩护，为最终赢得抗战胜利做出了重要贡献。',
    technicalSpecs: {
      建造时期: '1938-1945年',
      防御半径: '500米',
      驻军规模: '1个班',
      战术价值: '游击据点'
    }
  },
  {
    id: 'seven-bridge',
    title: '七号桥碉堡',
    thumbnail: '/images/建筑物/七号桥碉堡.png',
    dynasty: '抗战时期',
    category: '桥梁防御',
    size: '长30米，宽8米',
    material: '钢筋混凝土',
    description: '七号桥碉堡是抗战时期重要的桥梁防御工事，控制着重要的交通要道。在激烈的抗日战争中，这里发生过多次激烈的攻防战，中国军民以顽强的意志守卫着这一战略要地，阻击日军的进攻，为抗战胜利做出了重要贡献。',
    modelSrc: '/models/建筑物/七号桥碉堡.glb',
    historicalContext: '重要交通要道的军事防御设施，多次抗击日军进攻。',
    historicalRecord: '七号桥碉堡位于重要的交通要道上，是抗战时期的关键军事设施。日军为了打通运输线，多次向这里发动猛烈攻击，但都被中国守军击退。守军利用碉堡的坚固防护和有利地形，与日军展开殊死搏斗。无数英勇的战士在这里洒下热血，用生命守护着祖国的每一寸土地。七号桥碉堡见证了中华民族在危难时刻的团结一心和不屈不挠的斗争精神。',
    technicalSpecs: {
      建造目的: '桥梁防御',
      战略位置: '交通要道',
      防御特点: '地形优势',
      历史作用: '阻敌要冲'
    }
  },
  {
    id: 'meihua-bunker',
    title: '梅花碉堡',
    thumbnail: '/images/建筑物/梅花碉堡.png',
    dynasty: '抗战时期',
    category: '特色防御工事',
    size: '呈梅花形分布',
    material: '钢筋混凝土',
    description: '梅花碉堡以其独特的梅花形布局而得名，是抗战时期军事工程设计的杰作。这种布局不仅美观，更重要的是具有很强的军事防御价值，能够形成交叉火力网，有效抵御敌军的进攻。梅花碉堡体现了中国军民的聪明才智和不屈精神。',
    modelSrc: '/models/建筑物/梅花碉堡.glb',
    historicalContext: '独特的梅花形军事防御布局，展现了中国军事工程的智慧。',
    historicalRecord: '梅花碉堡是抗战时期军事工程设计的创新之作，其梅花形的布局设计既有文化寓意，又具有很强的实战价值。五个碉堡呈梅花状分布，能够形成完整的防御火力网，有效控制各个方向的进攻路线。这种设计体现了中国传统文化与现代军事科学的完美结合，是中华民族智慧的结晶。在抗战的烽火岁月中，梅花碉堡如梅花一样傲雪凌霜，坚韧不拔。',
    technicalSpecs: {
      布局特点: '梅花形分布',
      碉堡数量: '5座',
      火力覆盖: '360度',
      设计理念: '文化与军事结合'
    }
  },
  {
    id: 'south-gate',
    title: '南城门',
    thumbnail: '/images/建筑物/南城门.png',
    dynasty: '明清时期',
    category: '古城门',
    size: '高15米，宽10米',
    material: '青砖石料',
    description: '南城门是古城的重要组成部分，在抗战时期承担着重要的防御功能。这座雄伟的城门见证了历史的变迁，在抗日战争中，中国军民依托城门和城墙的坚固防御，与入侵的日军进行了英勇的斗争，谱写了可歌可泣的抗战篇章。',
    modelSrc: '/models/建筑物/南城门.glb',
    historicalContext: '古城重要防御设施，抗战时期的坚固屏障。',
    historicalRecord: '南城门始建于明代，是古城防御体系的重要组成部分。抗日战争爆发后，这里成为抵御日军进攻的重要据点。中国守军利用城门的坚固结构和有利地形，多次击退日军的进攻。城门上的弹痕累累，见证了那段血与火的历史。在最危急的时刻，守城将士宁死不屈，用血肉之躯守护着城门，保卫着人民的生命财产安全。南城门不仅是建筑艺术的珍品，更是中华民族不屈精神的象征。',
    technicalSpecs: {
      建造朝代: '明代',
      城门类型: '瓮城门',
      防御功能: '主要通道',
      文物价值: '重点保护'
    }
  }
])

// 点击展品跳转到详情页
const navigateToDetail = (item) => {
  router.push({
    name: 'war-detail',
    params: { id: item.id },
    state: { exhibit: item }
  })
}

// 动画相关引用
const itemCards = ref([])

onMounted(() => {
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 }
  const observerCallback = (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = index * 0.1
        entry.target.style.animationDelay = `${delay}s`
        entry.target.classList.add('animate-enter')
        observer.unobserve(entry.target)
      }
    })
  }
  const observer = new IntersectionObserver(observerCallback, observerOptions)

  itemCards.value.forEach(card => {
    if (card) observer.observe(card)
  })
})
</script>

<template>
  <div class="space-y-8">
    <!-- 板块标题 -->
    <div class="text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
        建筑场景
      </h2>
      <p class="text-white/80 text-lg max-w-3xl mx-auto">
        这些历史建筑见证了抗战时期的烽火岁月，从卢沟桥的第一声枪响到台儿庄的首次大捷，每一座建筑都承载着民族记忆与英雄史诗
      </p>
      <div class="w-20 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
    </div>

    <!-- 建筑场景网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <div
        v-for="(item, index) in architectureItems"
        :key="item.id"
        :ref="el => { if (el) itemCards[index] = el }"
        class="group bg-white/80 backdrop-blur-md rounded-xl overflow-hidden border border-green-200/30 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-green-300/50 transform hover:-translate-y-2 flex flex-col opacity-0 translate-y-5 cursor-pointer"
        @click="navigateToDetail(item)"
      >
        <!-- 建筑图片区域 -->
        <div class="relative h-48 md:h-56 overflow-hidden">
          <img
            :src="item.thumbnail"
            :alt="item.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <!-- 标签 -->
          <div class="absolute top-3 right-3 flex flex-col items-end space-y-1.5">
            <span class="bg-green-600/80 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-md">
              建筑场景
            </span>
            <span class="bg-gray-700/80 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-md">
              {{ item.category }}
            </span>
          </div>
          <!-- Hover覆盖层 -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <span class="text-white font-semibold text-lg">查看3D模型</span>
          </div>
        </div>

        <!-- 建筑信息区域 -->
        <div class="p-4 md:p-6 flex flex-col flex-grow">
          <h3 class="text-lg md:text-xl font-bold text-museum-dark mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
            {{ item.title }}
          </h3>
          <div class="flex items-center text-museum-dark/60 text-sm mb-3">
            <span>{{ item.material }}</span>
            <span class="mx-2">·</span>
            <span>{{ item.dynasty }}</span>
            <span class="mx-2">·</span>
            <span>{{ item.size }}</span>
          </div>
          <p class="text-museum-dark/70 text-sm line-clamp-3 flex-grow mb-4 leading-relaxed">
            {{ item.description }}
          </p>
          <div class="bg-green-50/50 rounded-lg p-3 mb-4">
            <p class="text-green-700/80 text-xs md:text-sm italic">
              {{ item.historicalContext }}
            </p>
          </div>
          <div class="mt-auto pt-3 border-t border-green-100/50">
            <button class="w-full text-center py-2 px-4 bg-green-600/10 hover:bg-green-600 text-green-600 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 group-hover:bg-green-600 group-hover:text-white">
              查看详细信息
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.5em;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 3.75em;
}

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
</style>