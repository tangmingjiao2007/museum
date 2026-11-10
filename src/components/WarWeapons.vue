<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 武器装备数据 - 基于史料扩展
const weaponItems = ref([
  {
    id: 'rifle',
    title: '抗战时期步枪',
    thumbnail: '/images/步枪.jpg',
    dynasty: '抗战时期',
    category: '步兵武器',
    size: '长 110 厘米',
    material: '金属、木质',
    description: '这是一支抗战时期使用的步枪，见证了中华民族抗击侵略者的英勇历史。步枪结构精良，枪身坚固，是当时军队的重要装备。它不仅是一件军事装备，更是民族抗争精神的象征，承载着无数英雄儿女保家卫国的壮志豪情。',
    modelSrc: '/models/步枪.glb',
    historicalContext: '在抗日战争期间，这类步枪是中国军队的主要装备之一，在各大战役中发挥了重要作用。',
    historicalRecord: '抗战时期，中国军队使用的步枪主要来源于各国援助和自产，包括德制毛瑟步枪、苏制莫辛-纳甘步枪等。这些步枪虽然型号繁杂，但都承载着中国军民抗击日本侵略者的英勇意志。每一支步枪都见证了正面战场和敌后游击战的无数战斗，成为中华民族不屈抗战精神的重要象征。',
    technicalSpecs: {
      caliber: '7.92mm',
      weight: '约4.2公斤',
      length: '110厘米',
      capacity: '5发弹夹'
    }
  },
  {
    id: 'pistol',
    title: '八路军第四纵队司令宋时轮佩戴的驳壳枪',
    thumbnail: '/images/武器/手枪.jpg',
    dynasty: '抗战时期',
    category: '手枪',
    size: '长 28 厘米',
    material: '金属',
    description: '这是八路军第四纵队司令宋时轮佩戴过的驳壳枪，见证了抗战时期八路军将领的英勇抗战历程。驳壳枪作为当时军官的重要武器，不仅具有实战价值，更是指挥官身份和威信的象征。宋时轮将军用这支手枪指挥部队，在敌后战场建立不朽功勋。',
    modelSrc: '/models/武器/手枪.glb',
    historicalContext: '驳壳枪在抗战时期深受中国军官喜爱，射程远、威力大，被誉为"盒子炮"，是近战和指挥作战的重要武器。',
    historicalRecord: '宋时轮（1907-1991），湖南醴陵人，开国上将。抗战时期历任八路军第120师358旅716团团长、第4纵队司令员等职。这支驳壳枪伴随宋时轮将军转战华北敌后战场，参与了雁门关伏击战、百团大战等重要战役。驳壳枪因其独特的盒形弹夹和较长射程，成为抗战时期中国军队军官的标配武器，象征着中华民族抗击侵略的钢铁意志。',
    technicalSpecs: {
      caliber: '7.63mm',
      weight: '约1.24公斤',
      length: '28厘米',
      capacity: '10发弹夹'
    }
  },
  {
    id: 'machine-gun-yellow',
    title: '山东人民抗日救国军使用的"老黄牛"重机枪',
    thumbnail: '/images/武器/黄筒机关枪.jpg',
    dynasty: '抗战时期',
    category: '重机枪',
    size: '长 142 厘米，口径 7.92 厘米',
    material: '钢、铜',
    description: '这是山东人民抗日救国军第三军第一路军使用过的"老黄牛"重机枪，见证了山东人民抗日武装的英勇斗争。这门重机枪因威力巨大、枪身呈黄色而被战士们亲切地称为"老黄牛"。在抗击日伪军的战斗中，它用密集的火力为部队提供强有力的支援。',
    modelSrc: '/models/武器/黄筒机关枪.glb',
    historicalContext: '1938年初，山东人民抗日救国军第三军第一路军在搜查原直系军阀吴佩孚的老家大楼时，从地下室发现了这挺机枪。',
    historicalRecord: '1938年初，山东人民抗日救国军第三军第一路军在搜查原直系军阀吴佩孚的老家大楼时，从地下室一口棺材里发现了这挺二四式马克沁重机枪。同年10月，该部队携带此机枪在山东平度大青阳一带阻击日伪军进攻，用它击退敌人三次疯狂进攻，毙伤200余人。因为该机枪威力大，枪身又呈黄色，干是战士们给它起名"老黄牛"。这挺机枪随部队转战各地，参加战斗百余次，"老黄牛"的声名也在胶东广为流传。1958年，由济南军区移交军事博物馆。',
    technicalSpecs: {
      caliber: '7.92mm',
      weight: '约20公斤',
      length: '142厘米',
      fireRate: '600发/分钟'
    }
  },
  {
    id: 'grenade',
    title: '抗战时期手榴弹',
    thumbnail: '/images/武器/手榴弹.jpg',
    dynasty: '抗战时期',
    category: '爆炸武器',
    size: '长 10 厘米',
    material: '金属、炸药',
    description: '这是抗战时期广泛使用的手榴弹，结构简单但威力巨大。在近距离作战和阵地攻防中发挥重要作用。许多英雄战士在关键时刻用手榴弹与敌人同归于尽，展现了视死如归的英雄气概。手榴弹成为抗战军民最可靠的近战武器。',
    modelSrc: '/models/武器/手榴弹.glb',
    historicalContext: '手榴弹在抗战中被广泛使用，特别是在近距离作战和巷战中效果显著，是步兵班组的重要装备。',
    historicalRecord: '抗战时期，中国军队和民兵组织广泛使用手榴弹进行作战。由于其制造相对简单，许多根据地都能自制手榴弹。在著名的台儿庄战役、百团大战等重大战役中，手榴弹都发挥了重要作用。特别是在巷战和近距离作战中，手榴弹的威力得到充分发挥，成为抗战军民克敌制胜的重要武器。许多英雄战士在生命最后时刻，抱着手榴弹与敌人同归于尽，谱写了可歌可泣的英雄篇章。',
    technicalSpecs: {
      weight: '约0.6公斤',
      length: '10厘米',
      explosiveWeight: '50克',
      fuseTime: '4-5秒'
    }
  },
  {
    id: 'm3a3-tank',
    title: '华东野战军在鲁南战役中缴获的美M3A3式轻型坦克',
    thumbnail: '/images/武器/m3a3坦克.jpg',
    dynasty: '1947年',
    category: '装甲车辆',
    size: '长 502 厘米，宽 251 厘米，重 14.4 吨',
    material: '质地钢',
    description: '这是华东野战军在1947年1月鲁南战役中缴获的美制M3A3式轻型坦克。在鲁南战役中，我山东、华中野战军一举歼灭美械装备的国民党整编第二十六师和第一快速纵队，缴获了这辆轻型坦克。此坦克随后编入华东野战军坦克部队，先后参加了济南战役和淮海战役。',
    modelSrc: '/models/武器/m3a3坦克.glb',
    historicalContext: '这辆坦克后来参加了济南战役和淮海战役，在济南战役攻坚门战斗中，沈许驾驶这辆坦克出色地完成了战斗任务。',
    historicalRecord: '1947年1月鲁南战役，我山东、华中野战军一举歼灭美械装备的国民党整编第二十六师和第一快速纵队，缴获了这辆轻型坦克。该坦克随后编入华东野战军坦克部队，先后参加了济南战役和淮海战役。在济南战役攻坚门战斗中，沈许驾驶这辆坦克出色地完成了战斗任务。战后，这辆坦克被授予"功臣坦克"称号，沈许被誉为"铁人英雄"。1959年，由坦克一校移交军事博物馆。',
    technicalSpecs: {
      weight: '14.4吨',
      length: '502厘米',
      width: '251厘米',
      armor: '25mm装甲'
    }
  },
  {
    id: 'i-15-aircraft',
    title: '苏制伊-15战斗机',
    thumbnail: '/images/武器/苏制伊-15飞机.jpg',
    dynasty: '抗战时期',
    category: '战斗机',
    size: '翼展 9.7 米，机长 6.1 米',
    material: '金属、帆布',
    description: '这是抗战时期中国空军使用的苏制伊-15战斗机，见证了中国空军英勇抗击日本侵略者的光辉历史。伊-15战斗机机动性优良，在空战中表现出色，为保卫祖国领空作出了重要贡献。许多中国飞行员驾驶这种战机与敌机搏斗，谱写了可歌可泣的空战英雄篇章。',
    modelSrc: '/models/武器/苏制伊-15飞机.glb',
    historicalContext: '伊-15战斗机是苏联援华的重要武器，在抗战初期的空战中发挥了重要作用，为中国空军提供了宝贵的作战经验。',
    historicalRecord: '伊-15由苏联著名飞机设计师波利卡尔波夫设计，1933年10月完成首飞，1934年投产。其机身紧凑分紧构型与混合构建结构，翼展有布蒙皮，机翼则采用日本M-25发动机，1936年升级为700马力的M25发动机，极速367公里/小时，航程只有510公里，火力也只有两挺7.62mm机枪，后期又换装1100马力的M63发动机，升级为伊-153。尽管相比同时期其他苏联飞机，伊-15的机动性比较优越，但在当时世界上来说，其并无太大出众之处，不过伊-15bis和伊-153依然为中国空军的初期力量奉献了二一八大空战。1938年2月18日九点十五分，日本出动海军陆基航空兵的15架九六式陆基攻击机从京沪方向飞向武汉大校机场，在第十二、十三空队的12架九六式零战掩护下，向驻汉口空军大校机场发起攻击。当时中国空军的伊-15和伊-16共10架从16架战机迎敌，由于伊-15机群的有力性能，日军可以逃脱优势条件从遥远退敌，最终击落日机4架，中方损失惨重5架，取胜击落6比2战。',
    technicalSpecs: {
      wingspan: '9.7米',
      length: '6.1米',
      maxSpeed: '367公里/小时',
      armament: '2挺7.62mm机枪'
    }
  },
  {
    id: 'sword-chinese-scout',
    title: '中国童子军短刀',
    thumbnail: '/images/武器/中国童子军短刀.jpg',
    dynasty: '抗战时期',
    category: '近战武器',
    size: '全长 30 厘米，刀身长 20 厘米',
    material: '钢制刀身，木质刀柄',
    description: '这是抗战时期中国童子军使用的短刀，见证了青年学生积极参与抗日救亡运动的历史。中国童子军组织在抗战期间发挥了重要作用，广大童子军成员以实际行动支持抗战，体现了青年一代的爱国热情和民族精神。',
    modelSrc: '/models/武器/中国童子军短刀.glb',
    historicalContext: '中国童子军在抗战期间积极参与救亡运动，开展各种形式的抗日宣传和后勤支援活动。',
    historicalRecord: '中国童子军运动兴起于20世纪初，抗战爆发后，全国各地的童子军组织积极投身抗日救亡运动。他们不仅进行军事训练，还参与伤兵救护、难民救济、抗日宣传等各种活动。这把短刀是童子军的标准装备之一，既有实用价值，也象征着青年一代保卫祖国的决心。无数童子军成员在抗战中成长为抗日战士，为民族独立和人民解放事业贡献了青春和热血。',
    technicalSpecs: {
      totalLength: '30厘米',
      bladeLength: '20厘米',
      material: '碳钢',
      weight: '约0.3公斤'
    }
  },
  {
    id: 'japanese-missile',
    title: '日军侵华导弹',
    thumbnail: '/images/武器/日军侵华导弹.jpg',
    dynasty: '二战时期',
    category: '导弹武器',
    size: '长度未详',
    material: '金属',
    description: '这是二战时期日军研制的早期导弹武器，虽然技术尚不成熟，但体现了日军企图通过新型武器延续侵略战争的野心。幸运的是，这类武器并未对战争结果产生实质影响，日本法西斯最终走向失败。',
    modelSrc: '/models/武器/日军侵华导弹.glb',
    historicalContext: '二战后期，轴心国各国都在研发新型武器，试图扭转战争颓势，但为时已晚。',
    historicalRecord: '二战后期，面对盟军的强大攻势，日军也在研发各种新型武器，包括早期的火箭和导弹技术。虽然日军在这方面的研发远不如德国先进，但也进行了一些尝试。然而，由于技术水平限制和战争资源匮乏，这些武器并未形成实战能力。随着1945年日本投降，这些武器研发项目也宣告终结，成为日本军国主义失败的历史见证。',
    technicalSpecs: {
      type: '早期火箭弹',
      status: '实验阶段',
      range: '有限',
      effectiveness: '未投入实战'
    }
  },
  {
    id: 'japanese-sword',
    title: '侵华日军海南警备府长官伍贺启次即海军中将投降时交出的海军军刀',
    thumbnail: '/images/武器/日军太刀.jpg',
    dynasty: '1945年8月',
    category: '冷兵器',
    size: '全长 94 厘米、刀身长 75.8 厘米、刀刃长 60.3 厘米',
    material: '钢制',
    description: '这柄日本海军军刀是侵华日军海南警备府长官伍贺启次即海军中将在1945年日军投降时，呈交给国民党中将韩练成的。韩练成在1945年前后任海南岛防卫司令官，后于1948年脱离国民党部队，投奔解放区。1958年，由韩练成处征集。',
    modelSrc: '/models/武器/日军太刀.glb',
    historicalContext: '这柄军刀见证了日本侵略者的最终失败和中华民族抗战的伟大胜利，具有重要的历史意义。',
    historicalRecord: '这柄日本海军军刀是侵华日军海南警备府长官伍贺启次即海军中将在1945年日军投降时，呈交给国民党中将韩练成的。韩练成在1945年前后任海南岛防卫司令官，后于1948年脱离国民党部队，投奔解放区。这柄军刀见证了日本法西斯的彻底失败，象征着中华民族14年抗战的最终胜利。军刀的移交不仅是武器的缴获，更是侵略者向正义力量低头的历史见证。1958年，由韩练成处征集到军事博物馆保存。',
    technicalSpecs: {
      totalLength: '94厘米',
      bladeLength: '75.8厘米',
      edgeLength: '60.3厘米',
      material: '钢制刀身'
    }
  },
  {
    id: 'hunting-rifle-hongkong',
    title: '香港第一支群众武装南鹿联防队使用过的猎枪',
    thumbnail: '/images/武器/香港第一支群众武装南鹿联防队使用过的猎枪.jpg',
    dynasty: '抗战时期',
    category: '步枪',
    size: '长度未详',
    material: '金属、木质',
    description: '这是香港第一支群众武装南鹿联防队使用过的猎枪，见证了香港同胞积极参与抗日斗争的历史。在日军占领香港期间，南鹿联防队等群众武装组织英勇抗击侵略者，为香港的抗日斗争作出了重要贡献。',
    modelSrc: '/models/武器/香港第一支群众武装南鹿联防队使用过的猎枪.glb',
    historicalContext: '香港沦陷后，当地群众自发组织武装力量，开展抗日游击战争，显示了香港同胞的爱国精神。',
    historicalRecord: '1941年底，广东民众利用自卫团，1942年在港九地区设立了东江纵队港九独立大队。在日军占领香港期间，包括南鹿联防队在内的群众武装组织积极开展抗日斗争，这支猎枪就是当时使用的武器之一。联防队的队员冒着生命危险，在广九铁路沿线开展游击战，营救被困人员，运送抗日物资，为抗战胜利作出了重要贡献。这支猎枪见证了香港同胞的抗日精神，体现了中华民族团结抗战的强大力量。1998年香港回归一周年之际，由韩练成将军家属捐赠给军事博物馆。',
    technicalSpecs: {
      type: '民用猎枪改装',
      caliber: '待考证',
      range: '中短程',
      usage: '游击战武器'
    }
  },
  {
    id: 'water-bottle-songhu',
    title: '淞沪会战时期我国士兵用的水壶',
    thumbnail: '/images/武器/淞沪会战时期我国士兵用的水壶.jpg',
    dynasty: '1937年',
    category: '军用装备',
    size: '高 20 厘米',
    material: '铝制',
    description: '这是1937年淞沪会战时期中国士兵使用的水壶，见证了中国军队在淞沪战场上的英勇抗战。淞沪会战是抗战初期的重大战役，中国军队虽然装备落后，但士气高昂，用血肉之躯抵抗日军的疯狂进攻，展现了中华民族不屈不挠的抗战精神。',
    modelSrc: '/models/武器/淞沪会战时期我国士兵用的水壶.glb',
    historicalContext: '淞沪会战是抗战全面爆发后的第一场大规模会战，中国军队表现出顽强的战斗意志。',
    historicalRecord: '1937年8月13日，淞沪会战爆发，这是抗日战争中第一场大规模战役。中国军队投入约75万兵力，与日军展开激烈战斗。这个水壶就是当时中国士兵的标准装备，在炎热的夏秋季节为前线将士提供生命之源。淞沪会战历时3个月，中国军队虽然最终撤退，但沉重打击了日军的嚣张气焰，粉碎了日军"三个月灭亡中国"的狂妄计划，为全面抗战的展开奠定了基础。这个水壶见证了中国军人在极其艰苦条件下的英勇作战精神。',
    technicalSpecs: {
      capacity: '约1升',
      material: '铝制',
      weight: '约0.2公斤',
      type: '军用标准装备'
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
        武器装备
      </h2>
      <p class="text-white/80 text-lg max-w-3xl mx-auto">
        这些武器装备是抗战将士浴血奋战的见证，每一件都承载着保家卫国的使命和民族不屈的精神。
      </p>
      <div class="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full"></div>
    </div>

    <!-- 武器装备网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <div
        v-for="(item, index) in weaponItems"
        :key="item.id"
        :ref="el => { if (el) itemCards[index] = el }"
        class="group bg-white/80 backdrop-blur-md rounded-xl overflow-hidden border border-red-200/30 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-red-300/50 transform hover:-translate-y-2 flex flex-col opacity-0 translate-y-5 cursor-pointer"
        @click="navigateToDetail(item)"
      >
        <!-- 武器图片区域 -->
        <div class="relative h-48 md:h-56 overflow-hidden">
          <img
            :src="item.thumbnail"
            :alt="item.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <!-- 标签 -->
          <div class="absolute top-3 right-3 flex flex-col items-end space-y-1.5">
            <span class="bg-red-600/80 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-md">
              武器装备
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

        <!-- 武器信息区域 -->
        <div class="p-4 md:p-6 flex flex-col flex-grow">
          <h3 class="text-lg md:text-xl font-bold text-museum-dark mb-2 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
            {{ item.title }}
          </h3>
          <div class="flex items-center text-museum-dark/60 text-sm mb-3">
            <span>{{ item.material }}</span>
            <span class="mx-2">·</span>
            <span>{{ item.dynasty }}</span>
          </div>
          <p class="text-museum-dark/70 text-sm line-clamp-3 flex-grow mb-4 leading-relaxed">
            {{ item.description }}
          </p>
          <div class="bg-red-50/50 rounded-lg p-3 mb-4">
            <p class="text-red-700/80 text-xs md:text-sm italic">
              {{ item.historicalContext }}
            </p>
          </div>
          <div class="mt-auto pt-3 border-t border-red-100/50">
            <button class="w-full text-center py-2 px-4 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 group-hover:bg-red-600 group-hover:text-white">
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
