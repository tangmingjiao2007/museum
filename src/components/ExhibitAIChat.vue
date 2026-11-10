<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const exhibitData = ref(null)
const modelError = ref(false)
const modelLoading = ref(true)
const chatMessages = ref([])
const userMessage = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)
const typingSpeed = 30 // 打字速度(ms)，使用流式时不太需要
const apiIsReady = ref(true) // API状态
const DEEPSEEK_API_KEY = 'sk-ef4d119673dc4c1b91e67a129e719a69'
const baseUrl = 'https://api.deepseek.com'
const model = 'deepseek-chat' // DeepSeek聊天模型

// 定义props接收展品数据
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

// 在组件挂载后获取展品数据
onMounted(() => {
  // 尝试从路由状态获取数据
  if (route.params.id && route.state && route.state.exhibit) {
    exhibitData.value = route.state.exhibit
    // 添加初始欢迎消息
    addBotMessage(
      `您好！我是${exhibitData.value.title}。很高兴能与您交流，请问您想了解关于我的什么信息呢？`
    )
  } else {
    // 如果没有状态数据，可以根据ID从API或预设数据中获取
    // 这里使用模拟数据，实际项目中应该从API获取
    const exhibits = [
      {
        id: 1,
        title: '哈尔滨工业大学（深圳）纪念盘',
        dynasty: '现代',
        category: '纪念品',
        size: '直径 30 厘米',
        material: '木质',
        description:
          '哈尔滨工业大学（深圳）校园纪念盘，呈圆形，盘面雕刻哈尔滨工业大学标志性建筑，中心嵌校徽，边缘刻中英校名。雕刻细腻，木纹与建筑线条融合，古朴雅致。以艺术形式展现学校建筑风貌与标识文化，既记录哈尔滨工业大学（深圳）的教育特色，也承载校际文化交流、精神传承的纪念价值，见证院校发展历程。',
        modelSrc: '/models/pz.glb'
      },
      {
        id: 2,
        title: '大象摆件',
        dynasty: '现代',
        category: '陶瓷',
        size: '高 25 厘米',
        material: '陶瓷',
        description:
          '藏品由Concordian International School提供，属陶瓷工艺品。以大象为原型，主体呈白色，耳部、背部饰金色，周身点缀彩色花纹，象鼻弯曲，造型精致灵动，装饰华丽。大象象征吉祥、稳重，承载文化寓意。摆件工艺精美，既展现艺术价值，也见证校际文化交流，是院校间友好互动的文化纽带，体现多元文化融合的意义。',
        modelSrc: '/models/dx.glb'
      },
      {
        id: 3,
        title: '明州越窑青瓷瓶',
        dynasty: '宋代',
        category: '陶瓷',
        size: '高 18 厘米',
        material: '陶瓷',
        description:
          '藏品名为"明州越窑青瓷"，由宁波大学提供，属古代瓷器类藏品。瓶体为玉壶春造型，颈细长，腹鼓圆，线条流畅。釉色青灰温润，表面布满自然开片纹理，如冰裂般雅致，尽显古朴之美。越窑青瓷代表古代制瓷工艺高度，开片是其独特美学符号。宁波大学捐赠此瓶，既展现传统工艺魅力，也见证校际文化交流，承载历史工艺传承的文化价值。',
        modelSrc: '/models/hp.glb'
      },
      {
        id: 4,
        title: '木质孔子雕像',
        dynasty: '明代',
        category: '雕塑',
        size: '高 40 厘米',
        material: '木质',
        description:
          '雕像呈现孔子拱手而立之姿，面容和蔼，衣袍线条流畅自然，雕刻细腻入微，将孔子的儒雅风范与庄重气质完美呈现，展现出传统木雕工艺的精湛技艺。孔子是儒家学派创始人，其思想影响深远。此雕像不仅是一件艺术作品，更承载着对儒家文化、教育理念的尊崇与传承，寓意着对知识、道德和智慧的追求，是文化传承与教育精神的象征。',
        modelSrc: '/models/kz.glb'
      },
      {
        id: 5,
        title: '同济大学纪念柱',
        dynasty: '现代',
        category: '纪念品',
        size: '高 15 厘米',
        material: '金属合金',
        description:
          '由同济大学提供，以柱体为造型，是校史文化的具象化藏品。柱身挺拔，顶部饰以精致构件，正面刻"国立同济大学"，侧面嵌"闳来"二字，整体融合建筑美学，底座稳固，雕刻细节考究，展现古朴庄重之态。纪念柱承载同济大学历史记忆，"闳来"寓意开阔进取，既见证学校发展历程，也彰显其学术追求与精神传承，是校史文化与教育理念的生动载体。',
        modelSrc: '/models/t.glb'
      },
      {
        id: 6,
        title: '泰国农业大学盖罐',
        dynasty: '现代',
        category: '陶瓷',
        size: '高 12 厘米',
        material: '陶瓷',
        description:
          '由泰国农业大学捐赠给西交利物浦大学，材质为陶瓷，是兼具实用与观赏价值的工艺品。整体为盖罐造型，罐体圆润饱满，搭配穹顶形盖子，线条流畅。罐身以棕褐色为主色调，装饰有精致繁复的花纹图案，包括几何纹与花卉纹等，局部点缀白色线条勾勒轮廓，还有一处圆形校徽样式标识，尽显异域风情与工艺之美。作为校际交流赠品，它承载着泰国农业大学与西交利物浦大学的友好情谊。',
        modelSrc: '/models/gz.glb'
      }
    ]

    exhibitData.value = exhibits.find(item => item.id == props.id) || {
      title: '未找到展品',
      dynasty: '未知',
      size: '未知',
      description: '未找到该展品的详细信息',
      modelSrc: '/models/t.glb'
    }

    // 添加初始欢迎消息
    addBotMessage(
      `您好！我是${exhibitData.value.title}。很高兴能与您交流，请问您想了解关于我的什么信息呢？`
    )
  }
})

// 返回列表页
const goBack = () => {
  router.push('/ailist')
}

// 处理模型加载错误
const handleModelError = event => {
  console.error('模型加载失败:', exhibitData.value?.modelSrc, event)
  modelError.value = true
  modelLoading.value = false
}

// 处理模型加载成功
const handleModelLoad = () => {
  modelError.value = false
  modelLoading.value = false
  console.log('模型加载成功:', exhibitData.value?.modelSrc)
}

// 添加机器人消息
const addBotMessage = text => {
  // 创建一个空消息，然后使用打字机效果逐字显示
  const messageId = Date.now()
  chatMessages.value.push({
    id: messageId,
    sender: 'bot',
    text: '',
    fullText: text,
    isTyping: true,
    time: new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  })
  scrollToBottom()

  // 开始逐字显示
  let index = 0
  const intervalId = setInterval(() => {
    // 查找对应ID的消息
    const messageIndex = chatMessages.value.findIndex(
      msg => msg.id === messageId
    )
    if (messageIndex === -1) {
      clearInterval(intervalId)
      return
    }

    const message = chatMessages.value[messageIndex]
    // 逐字添加文本
    if (index < message.fullText.length) {
      // 创建新对象避免响应式更新问题
      chatMessages.value[messageIndex] = {
        ...message,
        text: message.fullText.substring(0, index + 1)
      }
      index++
      scrollToBottom()
    } else {
      // 完成打字
      chatMessages.value[messageIndex] = {
        ...message,
        isTyping: false
      }
      clearInterval(intervalId)
    }
  }, typingSpeed)
}

// 流式添加机器人消息
const streamBotMessage = async messageId => {
  // 创建消息
  chatMessages.value.push({
    id: messageId,
    sender: 'bot',
    text: '',
    fullText: '',
    isTyping: true,
    time: new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  })
  scrollToBottom()
}

// 更新流式消息
const updateStreamMessage = (messageId, chunk) => {
  const messageIndex = chatMessages.value.findIndex(msg => msg.id === messageId)
  if (messageIndex === -1) return

  const message = chatMessages.value[messageIndex]
  // 添加新的文本
  chatMessages.value[messageIndex] = {
    ...message,
    text: message.text + (chunk || ''),
    fullText: message.text + (chunk || '')
  }
  scrollToBottom()
}

// 完成流式消息
const completeStreamMessage = messageId => {
  const messageIndex = chatMessages.value.findIndex(msg => msg.id === messageId)
  if (messageIndex === -1) return

  const message = chatMessages.value[messageIndex]
  chatMessages.value[messageIndex] = {
    ...message,
    isTyping: false
  }
  scrollToBottom()
}

// 添加用户消息
const addUserMessage = text => {
  chatMessages.value.push({
    sender: 'user',
    text,
    time: new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  })
  scrollToBottom()
}

// 滚动到底部函数
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 监听消息变化和打字状态变化，自动滚动到底部
watch([chatMessages, isTyping], () => {
  scrollToBottom()
})

// 直接使用fetch API处理流式响应
async function* streamReader (reader) {
  const decoder = new TextDecoder()
  let done = false

  while (!done) {
    const { value, done: streamDone } = await reader.read()
    if (streamDone) {
      done = true
      continue
    }

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk
      .split('\n\n')
      .filter(line => line.trim().startsWith('data: '))

    for (const line of lines) {
      if (line.includes('[DONE]')) {
        break
      }

      try {
        const jsonStr = line.replace('data: ', '').trim()
        if (jsonStr) {
          const json = JSON.parse(jsonStr)
          if (json.choices && json.choices[0]?.delta?.content) {
            yield json.choices[0].delta.content
          }
        }
      } catch (e) {
        console.error('解析JSON失败:', e)
      }
    }
  }
}

// 使用Fetch API发送请求并处理响应
async function fetchAIResponse (messages) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      stream: true
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API请求失败: ${response.status} ${errorText}`)
  }

  return response.body.getReader()
}

// 使用AI API生成回复
const generateAIResponse = async userQuestion => {
  if (!apiIsReady.value) {
    addBotMessage('抱歉，AI服务暂时不可用，请稍后再试。')
    return
  }

  // 生成消息ID
  const messageId = Date.now()

  try {
    // 准备AI消息历史
    let contextMessages = [
      {
        role: 'system',
        content: `你是博物馆中的"${exhibitData.value.title}"文物，需要以第一人称方式回答游客的问题。
        
展品信息:
- 名称: ${exhibitData.value.title}
- 年代: ${exhibitData.value.dynasty}
- 类别: ${exhibitData.value.category}
- 尺寸: ${exhibitData.value.size}
- 材质: ${exhibitData.value.material}
- 描述: ${exhibitData.value.description}

请始终以第一人称("我")的方式回答问题，仿佛你就是这件展品。保持友好、专业的语气，提供丰富的历史文化背景和细节。回答应该体现文物的历史意义、文化价值和艺术特色。如果问题超出了展品信息范围，可以合理推测，但要表明这是推测内容。开场白已经介绍过你是什么展品，不要重复自我介绍。`
      }
    ]

    // 添加历史对话记录
    for (let i = 0; i < chatMessages.value.length; i++) {
      const msg = chatMessages.value[i]
      if (msg.sender === 'user') {
        contextMessages.push({
          role: 'user',
          content: msg.text
        })
      } else if (msg.sender === 'bot' && !msg.isTyping) {
        contextMessages.push({
          role: 'assistant',
          content: msg.fullText || msg.text
        })
      }
    }

    // 添加当前问题
    contextMessages.push({
      role: 'user',
      content: userQuestion
    })

    // 创建流消息
    await streamBotMessage(messageId)

    // 发送请求并处理流式响应
    const reader = await fetchAIResponse(contextMessages)

    // 处理流式响应
    for await (const content of streamReader(reader)) {
      updateStreamMessage(messageId, content)
    }

    // 完成流式消息
    completeStreamMessage(messageId)
  } catch (error) {
    console.error('AI API调用错误:', error)

    // 查找错误消息并移除
    const errorIndex = chatMessages.value.findIndex(msg => msg.id === messageId)
    if (errorIndex !== -1) {
      chatMessages.value.splice(errorIndex, 1)
    }

    // 添加错误提示
    addBotMessage('抱歉，AI服务出现了问题，请稍后再试。')

    // 标记API不可用
    apiIsReady.value = false

    // 30秒后重置状态
    setTimeout(() => {
      apiIsReady.value = true
    }, 30000)
  }
}

// 发送消息
const sendMessage = () => {
  if (!userMessage.value.trim()) return

  // 添加用户消息
  addUserMessage(userMessage.value)

  // 清空输入框
  const message = userMessage.value
  userMessage.value = ''

  // 模拟机器人正在输入
  isTyping.value = true

  // 等待动画显示一小段时间
  setTimeout(() => {
    isTyping.value = false

    // 使用AI生成回复
    generateAIResponse(message)
  }, 500)
}

// 监听Enter键发送消息
const handleKeyDown = event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// 初始化消息输入框引用
const messageInput = ref(null)

// 自动调整文本框高度
const adjustTextareaHeight = () => {
  if (!messageInput.value) return
  messageInput.value.style.height = 'auto'
  messageInput.value.style.height = messageInput.value.scrollHeight + 'px'
}

// 监听消息变化，自动调整文本框高度
watch(userMessage, () => {
  nextTick(() => {
    adjustTextareaHeight()
  })
})
</script>

<template>
  <div
    v-if="exhibitData"
    class="flex flex-col justify-center min-h-[calc(100vh-15rem)]"
  >
    <!-- 返回按钮 -->
    <div class="animate-fade-in">
      <button
        @click="goBack"
        class="flex items-center px-3 py-1.5 bg-museum-primary/40 hover:bg-museum-primary/60 text-museum-light rounded-full border border-museum-gold/20 transition-all duration-300 shadow-lg backdrop-blur-sm hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        返回列表
      </button>
    </div>

    <!-- 展品详情容器 - 优化移动端布局 -->
    <div class="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10">
      <!-- 3D模型展示区 - 在移动端减小高度 -->
      <div
        class="relative backdrop-blur-lg bg-museum-primary/20 rounded-2xl overflow-hidden border border-museum-gold/20 shadow-2xl h-[350px] md:h-[500px] animate-slide-up"
      >
        <!-- 展品标题 - 移动端优化 -->
        <div
          class="absolute top-0 left-0 right-0 z-10 backdrop-blur-md bg-museum-primary/40 p-3 md:p-4 border-b border-museum-gold/20 animate-fade-in"
        >
          <h2
            class="text-xl md:text-2xl font-bold text-museum-light animate-content"
          >
            {{ exhibitData.title }}
          </h2>
          <div
            class="flex flex-wrap gap-1 mt-1 animate-content animation-delay-100"
          >
            <span
              class="text-xs px-2 py-0.5 rounded-full bg-museum-gold/80 text-museum-primary transform transition-all duration-300 hover:scale-110 hover:bg-museum-gold"
              >{{ exhibitData.dynasty }}</span
            >
            <span
              class="text-xs px-2 py-0.5 rounded-full bg-museum-copper/80 text-white transform transition-all duration-300 hover:scale-110 hover:bg-museum-copper"
              >{{ exhibitData.category }}</span
            >
            <span
              class="text-xs px-2 py-0.5 rounded-full bg-green-500/80 text-white transform transition-all duration-300 hover:scale-110 hover:bg-green-500"
              >AI问答</span
            >
          </div>
        </div>

        <!-- 模型容器 - 添加内边距 -->
        <div class="w-full h-full pt-16 md:pt-20">
          <!-- 3D模型查看器 -->
          <model-viewer
            v-if="!modelError"
            :src="exhibitData.modelSrc"
            alt="3D model of the exhibit"
            auto-rotate
            camera-controls
            disable-tap
            disable-zoom
            ar
            interaction-policy="allow-when-focused"
            camera-orbit="0deg 75deg 105%"
            min-camera-orbit="auto auto 50%"
            max-camera-orbit="auto auto 150%"
            shadow-intensity="1"
            @error="handleModelError"
            @load="handleModelLoad"
            class="w-full h-full transform transition-transform duration-500 hover:scale-105"
            exposure="0.8"
            environment-image="neutral"
          ></model-viewer>
        </div>

        <!-- 模型加载错误显示 -->
        <div
          v-if="modelError"
          class="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
        >
          <img
            src="/images/Refunded.png"
            alt="Fallback image"
            class="max-w-full max-h-64 mb-4 rounded-lg shadow-lg"
          />
          <p
            class="text-museum-light/80 bg-museum-terra/20 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            3D模型加载失败
          </p>
        </div>

        <!-- 模型加载中显示 -->
        <div
          v-if="modelLoading && !modelError"
          class="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm animate-pulse-subtle"
        >
          <div
            class="w-16 h-16 border-4 border-museum-gold/30 border-t-museum-gold rounded-full animate-spin mb-4"
          ></div>
          <p class="text-museum-light/80">正在加载3D模型...</p>
        </div>
      </div>

      <!-- 对话区域 - 移动端高度优化 -->
      <div
        class="backdrop-blur-lg bg-museum-primary/20 rounded-2xl border border-museum-gold/20 shadow-2xl flex flex-col h-[400px] md:h-[500px] animate-slide-up animation-delay-200"
      >
        <!-- 对话标题 - 减小移动端内边距 -->
        <div
          class="p-3 md:p-4 border-b border-museum-gold/20 backdrop-blur-md bg-museum-primary/40 animate-fade-in"
        >
          <h3
            class="text-lg md:text-xl font-bold text-museum-light flex items-center animate-content"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-museum-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            AI文物对话
          </h3>
        </div>

        <!-- 消息列表区域 - 优化内边距 -->
        <div class="flex-grow p-3 md:p-4 overflow-y-auto" ref="chatContainer">
          <div
            v-for="(message, index) in chatMessages"
            :key="index"
            class="mb-3 md:mb-4 transition-all duration-300"
            :class="{
              'animate-slide-right': message.sender === 'bot',
              'animate-slide-left': message.sender === 'user'
            }"
          >
            <!-- 机器人消息 - 优化移动端大小 -->
            <div
              v-if="message.sender === 'bot'"
              class="flex items-start justify-start"
            >
              <div
                class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-500/80 flex items-center justify-center mr-2 flex-shrink-0 shadow-glow-green"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 md:h-5 md:w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div class="max-w-[85%] md:max-w-[80%]">
                <div
                  class="bg-museum-primary/40 backdrop-blur-sm p-2 md:p-3 rounded-lg rounded-tl-none text-museum-light text-left text-sm md:text-base shadow-md hover:bg-museum-primary/60 transition-all duration-300"
                >
                  {{ message.text }}
                  <span
                    v-if="message.isTyping"
                    class="inline-block w-1.5 h-4 bg-museum-light/70 ml-0.5 animate-pulse"
                  ></span>
                </div>
                <div class="text-xs text-museum-light/50 mt-1 text-left">
                  {{ message.time }}
                </div>
              </div>
            </div>

            <!-- 用户消息 - 优化移动端大小 -->
            <div v-else class="flex items-start justify-end">
              <div class="max-w-[85%] md:max-w-[80%]">
                <div
                  class="bg-museum-gold/20 backdrop-blur-sm p-2 md:p-3 rounded-lg rounded-tr-none text-museum-light text-sm md:text-base shadow-md hover:bg-museum-gold/30 transition-all duration-300"
                >
                  {{ message.text }}
                </div>
                <div class="text-xs text-museum-light/50 mt-1 text-right">
                  {{ message.time }}
                </div>
              </div>
              <div
                class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-museum-copper/80 flex items-center justify-center ml-2 flex-shrink-0 shadow-glow-copper"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 md:h-5 md:w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- 正在输入提示 - 优化移动端大小 -->
          <div
            v-if="isTyping"
            class="flex items-start mb-3 md:mb-4 animate-fade-in"
          >
            <div
              class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-500/80 flex items-center justify-center mr-2 flex-shrink-0 shadow-glow-green"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 md:h-5 md:w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div
              class="bg-museum-primary/40 backdrop-blur-sm p-2 md:p-3 rounded-lg rounded-tl-none text-museum-light shadow-md"
            >
              <div class="flex space-x-1">
                <div
                  class="w-2 h-2 bg-museum-light/70 rounded-full animate-bounce"
                ></div>
                <div
                  class="w-2 h-2 bg-museum-light/70 rounded-full animate-bounce"
                  style="animation-delay: 0.2s"
                ></div>
                <div
                  class="w-2 h-2 bg-museum-light/70 rounded-full animate-bounce"
                  style="animation-delay: 0.4s"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 - 优化移动端布局 -->
        <div
          class="p-3 md:p-4 border-t border-museum-gold/20 backdrop-blur-md bg-museum-primary/40 animate-slide-up animation-delay-300"
        >
          <div class="flex">
            <textarea
              v-model="userMessage"
              @keydown="handleKeyDown"
              class="flex-grow bg-museum-primary/40 backdrop-blur-sm text-museum-light border border-museum-gold/30 rounded-l-lg p-2 focus:outline-none focus:border-museum-gold/60 focus:shadow-glow-gold resize-none text-sm md:text-base transition-all duration-300"
              placeholder="询问AI智能助手..."
              rows="1"
              ref="messageInput"
            ></textarea>
            <button
              @click="sendMessage"
              class="bg-green-500 hover:bg-green-600 text-white font-bold px-3 md:px-4 rounded-r-lg transition-all duration-300 hover:shadow-glow-green hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <div class="mt-1 md:mt-2 text-xs text-museum-light/50 text-right">
            由豆包AI提供智能问答服务
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 加载中显示 -->
  <div
    v-else
    class="h-[500px] flex flex-col items-center justify-center animate-pulse-subtle"
  >
    <div
      class="w-16 h-16 border-4 border-museum-gold/30 border-t-museum-gold rounded-full animate-spin mb-4 shadow-glow-gold"
    ></div>
    <p class="text-museum-light/80">加载中...</p>
  </div>
</template>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(162, 123, 92, 0.5);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(162, 123, 92, 0.8);
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  background-color: #dcd7c9;
  animation: blink 1s step-end infinite;
  margin-left: 2px;
  vertical-align: middle;
}

/* 移动设备优化 */
@media (max-width: 640px) {
  ::-webkit-scrollbar {
    width: 3px;
  }

  textarea {
    font-size: 16px; /* 防止iOS缩放 */
  }
}

/* 新增动画样式 */
/* 基础淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 向上滑入动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 内容淡入动画 */
@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 从左滑入动画 */
@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 从右滑入动画 */
@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 脉冲微动画 */
@keyframes pulseSoft {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-slide-up {
  opacity: 0;
  animation: slideUp 0.8s ease-out forwards;
}

.animate-slide-left {
  animation: slideInFromLeft 0.4s ease-out forwards;
}

.animate-slide-right {
  animation: slideInFromRight 0.4s ease-out forwards;
}

.animate-content {
  opacity: 0;
  animation: contentFadeIn 0.6s ease-out forwards;
}

.animate-pulse-subtle {
  animation: pulseSoft 1.5s infinite;
}

/* 动画延迟类 */
.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

/* 发光效果 */
.shadow-glow-gold {
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.shadow-glow-green {
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.shadow-glow-copper {
  box-shadow: 0 0 10px rgba(162, 123, 92, 0.5);
}
</style>
