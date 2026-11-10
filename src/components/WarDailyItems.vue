<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 生活用品数据
const dailyItems = ref([
  {
    id: "camera-duan",
    title: "平北军分区政委段苏权用过的照相机",
    thumbnail: "/images/生活用品/平北军分区政委段苏权用过的照相机.jpg",
    dynasty: "抗战时期",
    category: "摄影器材",
    size: "长 15 厘米，宽 10 厘米",
    material: "金属、玻璃",
    description:
      "这是平北军分区政委段苏权在抗战时期使用过的照相机，见证了敌后抗日根据地的艰苦斗争。在物资极度匮乏的敌后战场，这台照相机成为了记录抗战历史、宣传抗日精神的重要工具。每一张照片都承载着军民团结抗战的珍贵记忆。",
    modelSrc: "/models/生活用品/平北军分区政委段苏权用过的照相机.glb",
    historicalContext:
      "敌后抗日根据地的摄影器材极其珍贵，主要用于记录抗战历史、宣传抗日精神。",
    historicalRecord:
      "段苏权（1916-1993），湖南茶陵人，1930年参加革命，1932年加入中国共产党。抗战时期任平北军分区政委，在极其艰苦的敌后环境中坚持抗日斗争。这台照相机见证了平北地区军民团结抗战的历史，记录了无数感人的抗战故事。在物资极度匮乏的敌后战场，摄影器材成为了宣传抗日、记录历史的重要工具。",
  },
  {
    id: "suitcase-ji",
    title: "吉鸿昌夫人胡红霞在抗日时期为吉鸿昌送武器时用的皮箱",
    thumbnail:
      "/images/生活用品/吉鸿昌夫人胡红霞在抗日时期为吉鸿昌送武器时用的皮箱.jpg",
    dynasty: "抗战时期",
    category: "个人用品",
    size: "长 50 厘米，宽 35 厘米，高 20 厘米",
    material: "皮革",
    description:
      "这是吉鸿昌将军夫人胡红霞在抗日时期为丈夫运送武器时使用的皮箱，承载着夫妻同仇敌忾、共赴国难的感人故事。在白色恐怖时期，胡红霞冒着生命危险，用这个皮箱秘密运送武器弹药，支持吉鸿昌的抗日活动。",
    modelSrc:
      "/models/生活用品/吉鸿昌夫人胡红霞在抗日时期为吉鸿昌送武器时用的皮箱.glb",
    historicalContext:
      "抗战时期，许多爱国人士的家属也积极参与抗日活动，为抗战胜利作出了重要贡献。",
    historicalRecord:
      "吉鸿昌（1895-1934），河南扶沟人，著名抗日爱国将领。1931年九一八事变后，积极投身抗日救亡运动。其夫人胡红霞在丈夫抗日期间，冒着极大风险，用这个皮箱秘密运送武器弹药，支持抗日活动。1934年吉鸿昌被国民党反动派杀害，胡红霞继续坚持抗日立场，这个皮箱成为了夫妻同仇敌忾、共赴国难的历史见证。",
  },
  {
    id: "telescope-zuo",
    title: "左权在太行山用过的望远镜",
    thumbnail: "/images/生活用品/左权在太行山用过的望远镜.png",
    dynasty: "抗战时期",
    category: "军用器材",
    size: "长 25 厘米，宽 15 厘米",
    material: "金属、玻璃",
    description:
      "这是左权将军在太行山抗日根据地使用过的望远镜，见证了八路军在敌后战场的艰苦斗争。在太行山的崇山峻岭中，左权将军用这台望远镜观察敌情、指挥作战，为抗日战争的胜利作出了重要贡献。",
    modelSrc: "/models/生活用品/左权在太行山用过的望远镜.glb",
    historicalContext:
      "望远镜是抗战时期重要的军事观察工具，在敌后游击战中发挥重要作用。",
    historicalRecord:
      "左权（1905-1942），湖南醴陵人，中国工农红军和八路军高级将领。抗战爆发后，任八路军副参谋长兼前方总部参谋长，协助朱德、彭德怀指挥八路军在华北敌后开展游击战争。1942年5月25日，在山西省辽县（今左权县）十字岭战斗中壮烈牺牲，年仅37岁。这台望远镜见证了左权将军在太行山指挥抗战的日日夜夜，是民族英雄精神的重要象征。",
  },
  {
    id: "microscope-mirror",
    title: "澳门镜湖医院用显微镜",
    thumbnail: "/images/生活用品/澳门镜湖医院用显微镜.png",
    dynasty: "抗战时期",
    category: "医疗设备",
    size: "高 30 厘米，底座直径 20 厘米",
    material: "金属、玻璃",
    description:
      "这是澳门镜湖医院在抗战时期使用的显微镜，见证了澳门同胞对抗战的支持。在抗战期间，澳门作为中立地区，成为了重要的医疗物资中转站，这台显微镜为救治伤病员、培养医疗人才发挥了重要作用。",
    modelSrc: "/models/生活用品/澳门镜湖医院用显微镜.glb",
    historicalContext:
      "抗战时期，澳门作为中立地区，在医疗救助和物资转运方面发挥了重要作用。",
    historicalRecord:
      "澳门镜湖医院成立于1871年，是澳门历史最悠久的医院之一。抗战期间，澳门作为葡萄牙殖民地保持中立，成为了重要的医疗物资中转站和伤病员救治基地。这台显微镜见证了澳门同胞对抗战的支持，许多内地伤病员在此得到救治，体现了中华民族同舟共济的民族精神。镜湖医院在抗战中为培养医疗人才、救治伤病员作出了重要贡献。",
  },
  {
    id: "resistance-meter",
    title: "晋察冀军区工业部使用过的电阻表",
    thumbnail: "/images/生活用品/晋察冀军区工业部使用过的电阻表.jpg",
    dynasty: "抗战时期",
    category: "工业设备",
    size: "长 20 厘米，宽 15 厘米",
    material: "金属、塑料",
    description:
      "这是晋察冀军区工业部在抗战时期使用过的电阻表，见证了敌后抗日根据地的工业发展。在极其艰苦的条件下，晋察冀军区建立了自己的军工生产体系，这台电阻表为生产武器弹药、维修通信设备提供了重要技术支持。",
    modelSrc: "/models/生活用品/晋察冀军区工业部使用过的电阻表.glb",
    historicalContext:
      "敌后抗日根据地建立了自己的军工生产体系，为抗战提供了重要的物质基础。",
    historicalRecord:
      "晋察冀边区是抗战时期重要的敌后抗日根据地，在聂荣臻等领导下，建立了较为完整的军工生产体系。工业部负责武器弹药的生产和维修，这台电阻表用于测量电阻值，为生产武器弹药、维修通信设备提供了重要技术支持。在物资极度匮乏的敌后环境中，根据地军民自力更生、艰苦奋斗，建立了自己的工业基础，为抗战胜利作出了重要贡献。",
  },
  {
    id: "compass-he",
    title: "抗战时期中国远征军何元清使用的怀表式指北针",
    thumbnail:
      "/images/生活用品/抗战时期中国远征军何元清使用的怀表式指北针.jpg",
    dynasty: "抗战时期",
    category: "军用器材",
    size: "直径 5 厘米",
    material: "金属、玻璃",
    description:
      "这是中国远征军何元清在缅甸战场使用过的怀表式指北针，见证了远征军在异国他乡的英勇抗战。在缅甸的丛林中，这台指北针为远征军指引方向、确定位置，是战士们生存和作战的重要工具。",
    modelSrc: "/models/生活用品/抗战时期中国远征军何元清使用的怀表式指北针.glb",
    historicalContext:
      "中国远征军在缅甸战场为支援盟军、保卫滇缅公路作出了重要贡献。",
    historicalRecord:
      "中国远征军是抗战时期中国派往缅甸支援盟军作战的部队。1942年3月，远征军入缅作战，在极其艰苦的条件下与日军展开激战。何元清作为远征军战士，在缅甸丛林中用这台指北针指引方向、确定位置，为部队的行军作战提供了重要帮助。远征军在缅甸的作战虽然最终失利，但为支援盟军、保卫滇缅公路作出了重要贡献，体现了中国军人的英勇无畏精神。",
  },
  {
    id: "water-bottle-chen",
    title: "南侨机工陈昭藻在滇缅路服务时用的水壶",
    thumbnail: "/images/生活用品/南侨机工陈昭藻在滇缅路服务时用的水壶.jpg",
    dynasty: "抗战时期",
    category: "个人用品",
    size: "高 25 厘米",
    material: "铝制",
    description:
      "这是南侨机工陈昭藻在滇缅公路运输抗战物资时使用的水壶，见证了海外华侨对抗战的巨大贡献。在滇缅公路的崇山峻岭中，陈昭藻等南侨机工冒着生命危险，用这个水壶在艰苦的环境中坚持运输，为抗战胜利提供了重要的物资保障。",
    modelSrc: "/models/生活用品/南侨机工陈昭藻在滇缅路服务时用的水壶.glb",
    historicalContext:
      "南侨机工在滇缅公路运输抗战物资中发挥了重要作用，为抗战胜利作出了巨大贡献。",
    historicalRecord:
      "南侨机工是抗战时期从东南亚回国支援抗战的华侨司机和技术工人。1939年，滇缅公路开通后，3200多名南侨机工响应号召回国服务，在极其艰苦的条件下运输抗战物资。陈昭藻作为其中一员，在滇缅公路的崇山峻岭中冒着生命危险坚持运输，这个水壶陪伴他度过了无数个艰苦的日日夜夜。南侨机工为抗战胜利作出了巨大贡献，体现了海外华侨的爱国情怀和民族精神。",
  },
  {
    id: "briefcase-li",
    title: "东北抗联第3路军总指挥李兆麟使用过的公文包",
    thumbnail: "/images/生活用品/东北抗联第3路军总指挥李兆麟使用过的公文包.jpg",
    dynasty: "抗战时期",
    category: "办公用品",
    size: "长 40 厘米，宽 30 厘米",
    material: "皮革",
    description:
      "这是东北抗联第3路军总指挥李兆麟使用过的公文包，见证了东北抗日联军在白山黑水间的艰苦斗争。在极其恶劣的环境中，李兆麟将军用这个公文包携带重要文件、指挥部队作战，为东北抗日战争的胜利作出了重要贡献。",
    modelSrc: "/models/生活用品/东北抗联第3路军总指挥李兆麟使用过的公文包.glb",
    historicalContext:
      "东北抗联在极其艰苦的条件下坚持抗日斗争，为全国抗战胜利作出了重要贡献。",
    historicalRecord:
      "李兆麟（1910-1946），辽宁辽阳人，东北抗日联军主要领导人之一。1931年九一八事变后，积极投身抗日救亡运动，历任东北抗联第3路军总指挥等职。在极其艰苦的东北抗日战场上，李兆麟将军用这个公文包携带重要文件、指挥部队作战，在白山黑水间与日伪军展开殊死搏斗。东北抗联在极其恶劣的环境中坚持抗日斗争，为全国抗战胜利作出了重要贡献，体现了中华民族不屈不挠的抗战精神。",
  },
  {
    id: "desk-fang",
    title: "方少奇使用过的桌子",
    thumbnail: "/images/生活用品/方少奇使用过的桌子.jpg",
    dynasty: "抗战时期",
    category: "办公家具",
    size: "长 120 厘米，宽 60 厘米，高 75 厘米",
    material: "木质",
    description:
      "这是方少奇在抗战时期使用过的办公桌，见证了敌后抗日根据地的办公环境。在简陋的窑洞或草房中，这张桌子成为了制定作战计划、处理日常事务的重要工具，承载着抗战时期军民团结抗战的珍贵记忆。",
    modelSrc: "/models/生活用品/方少奇使用过的桌子.glb",
    historicalContext:
      "敌后抗日根据地的办公条件极其简陋，但军民依然坚持抗战，体现了艰苦奋斗的精神。",
    historicalRecord:
      "方少奇是抗战时期敌后抗日根据地的重要干部，在极其简陋的条件下坚持工作。这张桌子见证了敌后抗日根据地的艰苦环境，在简陋的窑洞或草房中，方少奇等干部用这张桌子制定作战计划、处理日常事务、接待来访群众。敌后抗日根据地的办公条件虽然简陋，但军民团结一心、艰苦奋斗，为抗战胜利作出了重要贡献，体现了中华民族在困难面前不屈不挠的精神品质。",
  },
  {
    id: "uniform-new4",
    title: "抗战时期新四军军装",
    thumbnail: "/images/生活用品/抗战时期新四军军装.jpg",
    dynasty: "抗战时期",
    category: "军装服饰",
    size: "适合中等身材",
    material: "棉布",
    description:
      "这是抗战时期新四军战士穿着的军装，见证了新四军在华中敌后战场的英勇抗战。在物资极度匮乏的条件下，新四军战士穿着简朴的军装，在敌后战场与日伪军展开殊死搏斗，为抗战胜利作出了重要贡献。",
    modelSrc: "/models/生活用品/抗战时期新四军军装.glb",
    historicalContext:
      "新四军在华中敌后战场坚持抗战，为抗战胜利作出了重要贡献。",
    historicalRecord:
      "新四军是抗战时期中国共产党领导的重要抗日武装力量，在华中敌后战场坚持抗战。在物资极度匮乏的条件下，新四军战士穿着简朴的军装，克服重重困难，在敌后战场与日伪军展开殊死搏斗。新四军在叶挺、项英、陈毅等领导下，建立了华中抗日根据地，为抗战胜利作出了重要贡献。这套军装见证了新四军战士的英勇抗战，体现了中华民族不屈不挠的抗战精神和艰苦奋斗的优良作风。",
  },
]);

// 点击展品跳转到详情页
const navigateToDetail = (item) => {
  router.push({
    name: "war-detail",
    params: { id: item.id },
    state: { exhibit: item },
  });
};

// 动画相关引用
const itemCards = ref([]);

onMounted(() => {
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
  const observerCallback = (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = index * 0.1;
        entry.target.style.animationDelay = `${delay}s`;
        entry.target.classList.add("animate-enter");
        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  itemCards.value.forEach((card) => {
    if (card) observer.observe(card);
  });
});
</script>

<template>
  <div class="space-y-8">
    <!-- 板块标题 -->
    <div class="text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
        生活用品
      </h2>
      <p class="text-white/80 text-lg max-w-3xl mx-auto whitespace-nowrap">
        这些朴素的生活用品记录着抗战时期军民的日常生活，展现了在艰苦环境下的坚强意志和乐观精神。
      </p>
      <div class="w-20 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
    </div>

    <!-- 生活用品网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <div
        v-for="(item, index) in dailyItems"
        :key="item.id"
        :ref="
          (el) => {
            if (el) itemCards[index] = el;
          }
        "
        class="group bg-white/80 backdrop-blur-md rounded-xl overflow-hidden border border-blue-200/30 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-blue-300/50 transform hover:-translate-y-2 flex flex-col opacity-0 translate-y-5 cursor-pointer"
        @click="navigateToDetail(item)"
      >
        <!-- 物品图片区域 -->
        <div class="relative h-48 md:h-56 overflow-hidden">
          <img
            :src="item.thumbnail"
            :alt="item.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <!-- 标签 -->
          <div
            class="absolute top-3 right-3 flex flex-col items-end space-y-1.5"
          >
            <span
              class="bg-blue-600/80 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-md"
            >
              生活用品
            </span>
            <span
              class="bg-gray-700/80 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-md"
            >
              {{ item.category }}
            </span>
          </div>
          <!-- Hover覆盖层 -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
          >
            <span class="text-white font-semibold text-lg">查看3D模型</span>
          </div>
        </div>

        <!-- 物品信息区域 -->
        <div class="p-4 md:p-6 flex flex-col flex-grow">
          <h3
            class="text-lg md:text-xl font-bold text-museum-dark mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2"
          >
            {{ item.title }}
          </h3>
          <div class="flex items-center text-museum-dark/60 text-sm mb-3">
            <span>{{ item.material }}</span>
            <span class="mx-2">·</span>
            <span>{{ item.dynasty }}</span>
          </div>
          <p
            class="text-museum-dark/70 text-sm line-clamp-3 flex-grow mb-4 leading-relaxed"
          >
            {{ item.description }}
          </p>
          <div class="mt-auto pt-3 border-t border-blue-100/50">
            <button
              class="w-full text-center py-2 px-4 bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white"
            >
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
