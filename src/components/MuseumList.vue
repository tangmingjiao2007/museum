<template>
  <div class="museum-grid">
    <!-- 加载中显示 -->
    <div v-if="loading" class="loading-container">
      <div class="w-12 h-12 md:w-16 md:h-16 border-4 border-museum-accent/30 border-t-museum-accent rounded-full animate-spin"></div>
      <p class="text-museum-light/80 mt-4 text-sm md:text-base">正在加载展品...</p>
    </div>

    <h1 v-else-if="!exhibits || exhibits.length === 0" class="text-center text-xl md:text-2xl font-normal text-museum-light/80 mt-10">
      暂无展品
    </h1>

    <!-- 展品展示 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
      <div 
        v-for="exhibit in exhibits" 
        :key="exhibit.id" 
        class="p-4 md:p-5 bg-museum-primary/40 backdrop-blur-md rounded-2xl border border-museum-gold/10 hover:border-museum-gold/20 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer overflow-hidden flex flex-col"
        @click="navigateToExhibit(exhibit.id)"
      >
        <!-- 展品图片 -->
        <div class="relative overflow-hidden rounded-xl bg-museum-dark/40 mb-4 aspect-square">
          <img 
            v-if="exhibit.imageSrc" 
            :src="exhibit.imageSrc" 
            :alt="exhibit.title" 
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-museum-dark/40">
            <span class="text-museum-light/50 text-sm md:text-base">暂无图片</span>
          </div>
        </div>

        <!-- 展品信息 -->
        <h2 class="text-lg md:text-xl font-medium text-museum-light mb-2 line-clamp-1">{{ exhibit.title }}</h2>
        
        <div class="flex items-center text-museum-light/60 mb-3 text-xs md:text-sm">
          <span v-if="exhibit.material" class="bg-museum-primary/50 px-2 py-0.5 rounded-full mr-2">{{ exhibit.material }}</span>
          <span v-if="exhibit.yearRange" class="bg-museum-primary/50 px-2 py-0.5 rounded-full">{{ exhibit.yearRange }}</span>
        </div>
        
        <p class="text-museum-light/70 line-clamp-2 text-sm md:text-base">{{ exhibit.description || '暂无描述' }}</p>
        
        <!-- 查看详情按钮 -->
        <div class="mt-auto pt-4">
          <button class="w-full py-2 px-4 bg-museum-accent/20 hover:bg-museum-accent/30 text-museum-accent border border-museum-accent/20 rounded-lg transition-colors text-sm md:text-base">
            查看详情
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const exhibits = ref([]);
const loading = ref(true);

// 模拟从API获取展品数据
onMounted(async () => {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 这里应该替换为实际的API调用
    exhibits.value = [
      {
        id: '1',
        title: '青铜器·何尊',
        material: '青铜',
        yearRange: '西周',
        description: '何尊是中国西周时期的青铜礼器，出土于陕西宝鸡，铭文记载西周克商后的历史，是研究西周建都等重要历史事件的关键文物。',
        imageSrc: '/images/exhibits/hezun.jpg',
        modelSrc: '/models/hezun.glb'
      },
      {
        id: '2',
        title: '彩陶·人面鱼纹盆',
        material: '陶器',
        yearRange: '新石器时代',
        description: '人面鱼纹盆是中国史前时期的重要彩陶器物，出土于甘肃省临洮县马家窑文化遗址，内壁绘有人面和鱼纹图案，反映了先民崇拜自然的宗教观念。',
        imageSrc: '/images/exhibits/fishbowl.jpg',
        modelSrc: '/models/fishbowl.glb'
      },
      {
        id: '3',
        title: '玉器·玉琮',
        material: '玉石',
        yearRange: '商周时期',
        description: '玉琮是中国古代重要的玉礼器，呈方体形状，中间有圆孔，多用于祭祀天地的仪式。此玉琮工艺精湛，体现了先民对天地宇宙的认知和敬畏。',
        imageSrc: '/images/exhibits/yucong.jpg',
        modelSrc: '/models/yucong.glb'
      },
      {
        id: '4',
        title: '瓷器·青花瓷瓶',
        material: '瓷器',
        yearRange: '明朝',
        description: '明代青花瓷以其纯净的白底和鲜艳的钴蓝色彩绘装饰闻名于世。此青花瓶胎质坚硬细腻，绘制精美的花鸟纹样，体现了明代瓷器的高超工艺水平。',
        imageSrc: '/images/exhibits/qinghua.jpg',
        modelSrc: '/models/qinghua.glb'
      },
      {
        id: '5',
        title: '雕塑·唐三彩骆驼',
        material: '陶器',
        yearRange: '唐朝',
        description: '唐三彩是唐代的代表性陶器，以黄、绿、白三色为主。此骆驼俑生动地反映了当时丝绸之路的贸易往来，是研究唐代对外交流的重要实物资料。',
        imageSrc: '/images/exhibits/sancai.jpg',
        modelSrc: '/models/sancai.glb'
      },
      {
        id: '6',
        title: '书法·王羲之《兰亭序》',
        material: '纸本',
        yearRange: '东晋',
        description: '《兰亭序》被誉为"天下第一行书"，是王羲之在会稽山阴的兰亭参加曲水流觞雅集时所作。此作品笔法自然流畅，是中国书法艺术的巅峰之作。',
        imageSrc: '/images/exhibits/lanting.jpg',
        modelSrc: '/models/lanting.glb'
      }
    ];
  } catch (error) {
    console.error('Failed to load exhibits:', error);
  } finally {
    loading.value = false;
  }
});

// 导航到展品详情页
function navigateToExhibit(id) {
  router.push(`/exhibit/${id}`);
}
</script>

<style scoped>
.museum-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

@media (max-width: 640px) {
  .museum-grid {
    padding: 0.5rem;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

/* 美化滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 