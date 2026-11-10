<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 纪念物品数据
const memorialItems = ref([
  {
    id: "victory-medal",
    title: "1945年南京国民政府颁授予萧毅肃的抗战胜利勋章",
    thumbnail:
      "/images/纪念物品/1945年南京国民政府颁授予萧毅肃的抗战胜利勋章.jpg",
    dynasty: "1945年",
    category: "勋章奖章",
    material: "金属",
    description:
      "这是1945年南京国民政府为表彰抗战功臣而颁发的胜利勋章，见证了中华民族抗战胜利的历史时刻。",
    historicalRecord:
      '萧毅肃（1899－1975），四川蓬州人，陆军二级上将。抗日战争爆发后率部参加"八一三"淞沪会战，进至浏河、蕴藻浜至大场一线布防。1945年8月21日，在湖南芷江主持了抗战胜利受降仪式。抗战胜利后，为表彰在抗战中建立功勋的有关人士，国民政府决定对抗战有功的文武官员和社会贤达人士颁给"胜利勋章"。此枚编号为55的勋章系1945年10月8日国民政府国防最高委员会通过《颁给胜利勋章案》，同年10月10日公布《颁给胜利勋章条例》后第一批授予时任陆军总参谋长萧毅肃中将的。同时被授予的还有：朱德、彭德怀、叶剑英等。',
    modelSrc:
      "/models/纪念物品/1945年南京国民政府颁授予萧毅肃的抗战胜利勋章.glb",
  },
  {
    id: "victory-certificate",
    title: "1945年南京国民政府颁授予萧毅肃的抗战胜利证书",
    thumbnail:
      "/images/纪念物品/1945年南京国民政府颁授予萧毅肃的抗战胜利证书.jpg",
    dynasty: "1945年",
    category: "证书文件",
    material: "纸质",
    description:
      "抗战胜利后，国民政府为表彰抗战英雄而颁发的证书，记录了那段波澜壮阔的历史。",
    historicalRecord:
      '抗战胜利后，国民政府为表彰在抗战中建立功勋的有关人士，决定对抗战有功的文武官员和社会贤达人士颁给"胜利勋章"。此枚编号为55的勋章系1945年10月8日国民政府国防最高委员会通过《颁给胜利勋章案》，同年10月10日公布《颁给胜利勋章条例》后第一批授予时任陆军总参谋长萧毅肃中将的。同时被授予的还有：朱德、彭德怀、叶剑英等。',
    modelSrc:
      "/models/纪念物品/1945年南京国民政府颁授予萧毅肃的抗战胜利证书.glb",
  },
  {
    id: "youth-ring",
    title: "三民主义青年团直属国立西南联合大学分团从军纪念戒指",
    thumbnail:
      "/images/纪念物品/三民主义青年团直属国立西南联合大学分团从军纪念戒指.jpg",
    dynasty: "1940年代",
    category: "纪念饰品",
    material: "金属",
    description:
      "西南联大学生投身抗战的珍贵纪念品，体现了知识分子的爱国情怀和民族担当。",
    historicalRecord:
      '叶铭汉，1944年9月考入西南联合大学土木系，第一学期结束后的寒假时提交了入伍申请，1945年初在学校加入了驻印军，之后便飞赴印度受训、服役。1945年8月日本投降后退伍，再次入学。这枚"三三年度从军纪念"银戒指是1945年初叶铭汉入伍时学校训导处发给他的。',
    modelSrc:
      "/models/纪念物品/三民主义青年团直属国立西南联合大学分团从军纪念戒指.glb",
  },
  {
    id: "literary-badge",
    title: "中华全国文艺界抗敌协会会徽",
    thumbnail: "/images/纪念物品/中华全国文艺界抗敌协会会徽.jpg",
    dynasty: "1938年",
    category: "会徽标识",
    material: "金属",
    description:
      "抗战时期文艺界团结抗敌的象征，展现了文化界人士的爱国热情和民族精神。",
    historicalRecord:
      '中华全国文艺界抗敌协会于1938年4月1日在汉口正式成立。周恩来在成立大会上发表了重要讲话。该会制定的《中华全国文艺界抗敌协会简章》明确规定了协会的宗旨，即"联合全国文艺作家共同反对日本帝国主义的侵略，完成中国民族自由解放，建设中国民族革命的文艺，并保障作家权益。"协会提出"文章下乡，文章入伍"的口号，鼓励作家深入生活，投身现实斗争。协会实行理事制度，理事会下设总务部、组织部、研究部和出版部。经过推举，由周恩来、孙科、陈立夫、于右任、叶楚伦等任名誉理事，由郭沫若、老舍、茅盾、丁玲、田汉、巴金、胡风、冯玉祥、邵力子、陈铭枢、郁达夫、老向、成仿吾、王平陵、张天翼、马彦祥、胡秋原等45人任理事，由周扬、吴溪如、罗锋、孔罗荪、舒群等15人任候补理事。在成都、昆明、延安、上海、广州、桂林、贵阳、香港等地先后建立了该会的分会组织。协会成立后，组织和派遣抗战文化工作团和作家战地慰问团，分赴西北战场和中原战场，开展战地访问和慰问工作，并于1938年5月创办了会刊《抗战文艺》，刊登抗战进步文章，推动抗日运动。中华全国文艺界抗敌协会的成立，标志着全国文艺界抗日民族统一战线的正式形成。在抗日救亡的旗帜下，协会根据文艺界的特点，利用文艺的形式，在开展群众性的抗日文化活动，推动中国文艺事业的发展方面，在反对国民党顽固派投降、分裂、倒退，坚持抗战、团结、进步的斗争中，在团结抗战力量，争取抗日民族解放战争的胜利中，都发挥了积极的作用。抗日战争胜利后，1945年10月14日，中华全国文艺界抗敌协会改称"中华全国文艺界协会"，以上海出版的《中国作家》作为机关刊物，利用文艺阵地继续开展活动。',
    modelSrc: "/models/纪念物品/中华全国文艺界抗敌协会会徽.glb",
  },
  {
    id: "eight-hundred-medal",
    title: "八百壮士忠贞奖章",
    thumbnail: "/images/纪念物品/八百壮士忠贞奖章.jpg",
    dynasty: "1937年",
    category: "勋章奖章",
    material: "金属",
    description:
      "为纪念淞沪会战中英勇抗敌的八百壮士而设立的奖章，象征着中华民族不屈不挠的抗战精神。",
    historicalRecord:
      '该纪念章呈鸣心形，铜制镀金。正面是国民党党旗，党旗下面是绿色橄榄枝，以红地为衬，橄榄枝左右各两枝，对称向外开放，象征和平。反面刻有"忠贞奖章"四字。1944年，八百壮士部分幸存者逃出日伪控制，陆续到达重庆，国民政府特意颁发了"忠贞奖章"表彰这些爱国勇士。',
    modelSrc: "/models/纪念物品/八百壮士忠贞奖章.glb",
  },
  {
    id: "iron-man-seal",
    title: "台儿庄战役期间,第73旅旅长戴安澜专门镌刻了铁汉印章",
    thumbnail:
      "/images/纪念物品/台儿庄战役期间,第73旅旅长戴安澜专门镌刻了铁汉印章.jpg",
    dynasty: "1938年",
    category: "个人印章",
    material: "石质",
    description:
      "戴安澜将军在台儿庄战役期间镌刻的印章，体现了抗战将领的铁血意志和民族气节。",
    historicalRecord:
      '卢沟桥事变后，日本开始全面侵华，中国人民奋起反击，在1938年的台儿庄战役中取得了抗日战争以来最大胜利，打击了日本侵略者的嚣张气焰，坚定了全国军民坚持抗战的信心。台儿庄战役期间，时任第73旅旅长戴安澜专门镌刻了"铁汉"印章，意指用钢铁般的意志和战斗力来抵抗日军的侵略。在艰苦卓绝的抗日战争中，戴安澜将军用实际行动践行和发扬了"铁汉精神"。',
    modelSrc:
      "/models/纪念物品/台儿庄战役期间,第73旅旅长戴安澜专门镌刻了铁汉印章.glb",
  },
  {
    id: "ye-ting-passport",
    title: "叶希夷（叶挺）前往越南护照",
    thumbnail: "/images/纪念物品/叶希夷（叶挺）前往越南护照.jpg",
    dynasty: "1940年代",
    category: "证书文件",
    material: "纸质",
    description:
      "叶挺将军前往越南的护照，记录了抗战时期国际交往的珍贵历史资料。",
    historicalRecord:
      "全国首个华侨护照：1937年抗日战争爆发后，北伐名将叶挺结束流亡生活回国，出任新四军军长，奔赴抗日前线。当时刚成立的新四军武器装备粗劣、弹药缺乏，还遭到国民党当局克扣军费。叶挺为解决这些困难，曾到香港、越南等地向海外华侨和爱国人士筹募抗日军事物资。",
    modelSrc: "/models/纪念物品/叶挺越南护照.glb",
  },
  {
    id: "overseas-chinese-award",
    title: "国民政府侨务委员会发给华侨机工彭海涌的奖状",
    thumbnail:
      "/images/纪念物品/国民政府侨务委员会发给华侨机工彭海涌的奖状.jpg",
    dynasty: "1940年代",
    category: "证书文件",
    material: "纸质",
    description:
      "表彰华侨机工为抗战贡献的奖状，体现了海外华人的爱国情怀和民族精神。",
    historicalRecord:
      "侨务委员会是国民政府管理华侨事务的最高机关。1928年4月25日，国民党中央政治会议决定成立，并通过组织法。侨务委员会掌理调查和统计侨民情况、指导侨民移殖、处理侨民纠纷、管理侨民团体、指导介绍归国华侨投资与办理实业及就学、游历、参观及宣传政府的政策、补助侨民教育经费等事项。下设秘书处和第一、第二科。1928年9月4日在南京正式成立，直隶于国民政府，同年10月改隶于行政院。11月25日，制定了《奖励华侨回国兴办实业条例》8条。1929年1月6日，林森任委员长，随后由陈耀垣继任。1929年4月，改隶于国民党中央执行委员会。1931年8月20日，国民党中央常会决定将原属中央党部的侨务委员会改隶于国民政府，以吴铁城为委员长，中央党部另组海外党务设计委员会。侨务委员会下设侨务管理处、侨民教育处、秘书处。1932年1月2日改隶行政院。1949年12月31日下令撤销。",
    modelSrc: "/models/纪念物品/国民政府侨务委员会发给华侨机工彭海涌的奖状.glb",
  },
  {
    id: "nanyuan-memorial",
    title: "第29军军事训练团北平南苑抗日纪念章",
    thumbnail: "/images/纪念物品/第29军军事训练团北平南苑抗日纪念章.jpg",
    dynasty: "1937年",
    category: "勋章奖章",
    material: "金属",
    description: "第29军在北平南苑抗日的纪念章，见证了七七事变前后的抗战历史。",
    historicalRecord:
      "1937年7月28日黎明，日军以第20师团为主力，在20架飞机的配合下猛攻北平近郊南苑。驻南苑的国民党第29军第132师一部、骑兵第9师一部和第29军军训团等部，在日军优势炮火和飞机的狂轰滥炸下，凭借围墙、营房顽强抵抗。激战至下午1时，中国守军因伤亡惨重，被迫退出阵地，南苑失守，29军副军长佟麟阁、132师师长赵登禹壮烈殉国。",
    modelSrc: "/models/纪念物品/第29军军事训练团北平南苑抗日纪念章.glb",
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
        纪念物品
      </h2>
      <p class="text-white/80 text-lg max-w-3xl mx-auto">
        这些珍贵的纪念物品记录着抗战英雄的光辉事迹，每一件都承载着深厚的历史意义和民族情感。
      </p>
      <div class="w-20 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
    </div>

    <!-- 纪念物品网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <div
        v-for="(item, index) in memorialItems"
        :key="item.id"
        :ref="
          (el) => {
            if (el) itemCards[index] = el;
          }
        "
        class="group bg-white/80 backdrop-blur-md rounded-xl overflow-hidden border border-yellow-200/30 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-yellow-300/50 transform hover:-translate-y-2 flex flex-col opacity-0 translate-y-5 cursor-pointer"
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
              class="bg-yellow-600/80 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-md"
            >
              纪念物品
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
            class="text-lg md:text-xl font-bold text-museum-dark mb-2 group-hover:text-yellow-600 transition-colors duration-300 line-clamp-2"
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
          <div class="mt-auto pt-3 border-t border-yellow-100/50">
            <button
              class="w-full text-center py-2 px-4 bg-yellow-600/10 hover:bg-yellow-600 text-yellow-600 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 group-hover:bg-yellow-600 group-hover:text-white"
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
