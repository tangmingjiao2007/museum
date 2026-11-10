<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 展品数据列表
const exhibits = ref([
  {
    id: 1,
    title: "哈尔滨工业大学（深圳）纪念盘",
    thumbnail: "/images/pz.png",
    dynasty: "现代",
    category: "纪念品",
    size: "直径 30 厘米",
    material: "木质",
    description:
      "哈尔滨工业大学（深圳）校园纪念盘，呈圆形，盘面雕刻哈尔滨工业大学标志性建筑，中心嵌校徽，边缘刻中英校名。雕刻细腻，木纹与建筑线条融合，古朴雅致。",
  },
  {
    id: 2,
    title: "大象摆件",
    thumbnail: "/images/dx.png",
    dynasty: "现代",
    category: "陶瓷",
    size: "高 25 厘米",
    material: "陶瓷",
    description:
      "藏品由Concordian International School提供，以大象为原型，主体呈白色，耳部、背部饰金色，周身点缀彩色花纹，象鼻弯曲，造型精致灵动，装饰华丽。",
  },
  {
    id: 3,
    title: "明州越窑青瓷瓶",
    thumbnail: "/images/hp.png",
    dynasty: "宋代",
    category: "陶瓷",
    size: "高 18 厘米",
    material: "陶瓷",
    description:
      '藏品名为"明州越窑青瓷"，由宁波大学提供。瓶体为玉壶春造型，颈细长，腹鼓圆，线条流畅。釉色青灰温润，表面布满自然开片纹理，如冰裂般雅致。',
  },
  {
    id: 4,
    title: "木质孔子雕像",
    thumbnail: "/images/kz.png",
    dynasty: "明代",
    category: "雕塑",
    size: "高 40 厘米",
    material: "木质",
    description:
      "雕像呈现孔子拱手而立之姿，面容和蔼，衣袍线条流畅自然，雕刻细腻入微，将孔子的儒雅风范与庄重气质完美呈现，展现出传统木雕工艺的精湛技艺。",
  },
  {
    id: 5,
    title: "同济大学纪念柱",
    thumbnail: "/images/t.png",
    dynasty: "现代",
    category: "纪念品",
    size: "高 15 厘米",
    material: "金属合金",
    description:
      '由同济大学提供，以柱体为造型，是校史文化的具象化藏品。柱身挺拔，顶部饰以精致构件，正面刻"国立同济大学"，侧面嵌"闳来"二字，整体融合建筑美学。',
  },
  {
    id: 6,
    title: "泰国农业大学盖罐",
    thumbnail: "/images/gz.png",
    dynasty: "现代",
    category: "陶瓷",
    size: "高 12 厘米",
    material: "陶瓷",
    description:
      "由泰国农业大学捐赠给西交 Liverpool大学，整体为盖罐造型，罐体圆润饱满，搭配穹顶形盖子，线条流畅。罐身以棕褐色为主色调，装饰有精致繁复的花纹图案。",
  },
]);

// 点击展品跳转到详情页
const navigateToExhibitChat = (exhibit) => {
  router.push({
    name: "exhibit-chat",
    params: { id: exhibit.id },
    // 通过 state 传递展品数据
    state: { exhibit },
  });
};

// 添加动画引用
const titleArea = ref(null);
const exhibitCards = ref([]); // 为卡片添加动画

onMounted(() => {
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
  const observerCallback = (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // 为标题区域和卡片添加延迟动画
        const delay = entry.target === titleArea.value ? 0 : index * 0.08;
        entry.target.style.animationDelay = `${delay}s`;
        entry.target.classList.add("animate-enter");
        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  if (titleArea.value) {
    observer.observe(titleArea.value);
  }
  // 观察卡片
  exhibitCards.value.forEach((card) => {
    if (card) observer.observe(card);
  });
});
</script>

<template>
  <div class="space-y-10 md:space-y-16">
    <!-- 更新后的页面标题区域 (居中 + 动画 + 移除斜杠) -->
    <div
      ref="titleArea"
      class="bg-white bg-opacity-60 backdrop-blur-md rounded-xl p-6 md:p-8 border border-museum-light-gold border-opacity-10 shadow-lg mx-2 md:mx-0 text-center opacity-0 transform translate-y-5"
    >
      <h2
        class="text-3xl md:text-4xl font-bold text-museum-dark mb-3 animate-content"
      >
        基础问答
      </h2>
      <p
        class="text-museum-dark text-opacity-70 text-base md:text-lg max-w-3xl mx-auto animate-content animation-delay-100"
      >
        选择一件文物，向它提问关于年代、材质、特点等基础问题，系统将根据预设知识库进行回答。
      </p>
    </div>

    <!-- 更新后的展品列表 (卡片动画 + 移除斜杠) -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-2 md:px-0"
    >
      <div
        v-for="(exhibit, index) in exhibits"
        :key="exhibit.id"
        :ref="
          (el) => {
            if (el) exhibitCards[index] = el;
          }
        "
        class="group bg-white bg-opacity-80 backdrop-blur-md rounded-xl overflow-hidden border border-museum-light-gold border-opacity-10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-museum-light-accent hover:border-opacity-20 transform hover:-translate-y-2 flex flex-col opacity-0 translate-y-5"
        @click="navigateToExhibitChat(exhibit)"
      >
        <!-- 展品图片区域 -->
        <div class="relative h-56 md:h-64 overflow-hidden cursor-pointer">
          <img
            :src="exhibit.thumbnail"
            :alt="exhibit.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <!-- 标签 (移除斜杠) -->
          <div
            class="absolute top-3 right-3 flex flex-col items-end space-y-1.5"
          >
            <span
              class="bg-blue-500 bg-opacity-80 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-md"
              >基础问答</span
            >
            <span
              style="background-color: rgba(200, 121, 65, 0.8)"
              class="backdrop-blur-sm text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-md"
              >{{ exhibit.category }}</span
            >
          </div>
          <!-- Hover时的覆盖层 (移除斜杠) -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black from-opacity-40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
          >
            <span class="text-white font-semibold">开始对话</span>
          </div>
        </div>

        <!-- 展品信息区域 (移除斜杠) -->
        <div class="p-4 md:p-5 flex flex-col flex-grow">
          <h3
            class="text-lg md:text-xl font-semibold text-museum-dark mb-1.5 group-hover:text-museum-light-accent transition-colors duration-300"
          >
            {{ exhibit.title }}
          </h3>
          <p class="text-museum-dark text-opacity-60 text-sm mb-3">
            {{ exhibit.material }}
            <span v-if="exhibit.dynasty">· {{ exhibit.dynasty }}</span>
          </p>
          <p
            class="text-museum-dark text-opacity-70 text-sm line-clamp-2 flex-grow mb-4"
          >
            {{ exhibit.description || "暂无简介" }}
          </p>
          <div
            class="mt-auto pt-3 border-t border-museum-light-gold border-opacity-10"
          >
            <button
              style="background-color: rgba(94, 129, 172, 0.1)"
              class="w-full text-center py-2 px-4 text-museum-light-accent rounded-lg text-sm font-medium transition-colors duration-300 group-hover:bg-museum-light-accent group-hover:text-white"
            >
              开始对话
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
  min-height: 2.5em; /* 适应两行文字的高度 */
}

/* 定义入场动画 */
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
  animation: fadeInSlideUp 0.5s ease-out forwards;
}

/* 文字动画 */
@keyframes fadeInText {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-content {
  opacity: 0;
  animation: fadeInText 0.6s ease-out forwards;
}

.animation-delay-100 {
  animation-delay: 0.1s;
}

/* 可以在这里添加更多自定义样式或动画 */
</style>
