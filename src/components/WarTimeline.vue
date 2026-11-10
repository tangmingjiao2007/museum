<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as d3 from 'd3'
import { timelineEvents, categoryColors, importanceConfig } from '../data/warData.js'

const timelineContainer = ref(null)
const selectedEvent = ref(null)
const showEventDetail = ref(false)

// 组件挂载后创建时间线
onMounted(async () => {
  await nextTick()
  createTimeline()
})

// 创建D3时间线
const createTimeline = () => {
  // 清空容器
  d3.select(timelineContainer.value).selectAll("*").remove()
  
  // 设置尺寸和边距
  const margin = { top: 60, right: 50, bottom: 60, left: 50 }
  const width = timelineContainer.value.clientWidth - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom
  
  // 创建SVG
  const svg = d3.select(timelineContainer.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
  
  // 时间比例尺
  const timeScale = d3.scaleTime()
    .domain(d3.extent(timelineEvents, d => new Date(d.date)))
    .range([0, width])
  
  // 创建时间轴
  const timeAxis = d3.axisBottom(timeScale)
    .tickFormat(d3.timeFormat('%Y年'))
    .ticks(d3.timeYear.every(2))
  
  g.append('g')
    .attr('class', 'time-axis')
    .attr('transform', `translate(0,${height/2})`)
    .call(timeAxis)
    .selectAll('text')
    .style('font-size', '12px')
    .style('fill', '#374151')
  
  // 主时间线
  g.append('line')
    .attr('class', 'timeline-main')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', height/2)
    .attr('y2', height/2)
    .style('stroke', '#d1d5db')
    .style('stroke-width', 3)
  
  // 事件节点
  const events = g.selectAll('.event-node')
    .data(timelineEvents)
    .enter()
    .append('g')
    .attr('class', 'event-node')
    .attr('transform', d => `translate(${timeScale(new Date(d.date))},${height/2})`)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      selectedEvent.value = d
      showEventDetail.value = true
    })
    .on('mouseover', function(event, d) {
      // 鼠标悬停效果
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', importanceConfig[d.importance].size + 4)
      
      // 显示简单提示
      showTooltip(event, d)
    })
    .on('mouseout', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', importanceConfig[d.importance].size)
      
      hideTooltip()
    })
  
  // 事件圆点
  events.append('circle')
    .attr('r', d => importanceConfig[d.importance].size)
    .style('fill', d => categoryColors[d.category])
    .style('stroke', '#ffffff')
    .style('stroke-width', 3)
    .style('opacity', 0)
    .transition()
    .delay((d, i) => i * 100)
    .duration(500)
    .style('opacity', 1)
  
  // 事件标签
  events.append('text')
    .attr('class', 'event-label')
    .attr('y', d => d.id % 2 === 0 ? -30 : 30)
    .attr('text-anchor', 'middle')
    .style('font-size', '11px')
    .style('font-weight', 'bold')
    .style('fill', '#374151')
    .style('opacity', 0)
    .text(d => d.title)
    .transition()
    .delay((d, i) => i * 100 + 300)
    .duration(500)
    .style('opacity', 1)
  
  // 连接线
  events.append('line')
    .attr('class', 'event-connector')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', d => d.id % 2 === 0 ? -20 : 20)
    .style('stroke', '#9ca3af')
    .style('stroke-width', 1)
    .style('opacity', 0)
    .transition()
    .delay((d, i) => i * 100 + 200)
    .duration(500)
    .style('opacity', 0.7)
}

// 显示提示框
const showTooltip = (event, data) => {
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'timeline-tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(0, 0, 0, 0.8)')
    .style('color', 'white')
    .style('padding', '8px 12px')
    .style('border-radius', '4px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('z-index', '1000')
    .style('opacity', 0)
  
  tooltip.html(`
    <div><strong>${data.title}</strong></div>
    <div>${data.date}</div>
    <div>${data.location}</div>
  `)
  .style('left', (event.pageX + 10) + 'px')
  .style('top', (event.pageY - 10) + 'px')
  .transition()
  .duration(200)
  .style('opacity', 1)
}

// 隐藏提示框
const hideTooltip = () => {
  d3.selectAll('.timeline-tooltip')
    .transition()
    .duration(200)
    .style('opacity', 0)
    .remove()
}

// 关闭事件详情
const closeEventDetail = () => {
  showEventDetail.value = false
  selectedEvent.value = null
}

// 窗口大小改变时重新绘制
const handleResize = () => {
  createTimeline()
}

// 监听窗口大小变化
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
</script>

<template>
  <div class="war-timeline-container">
    <!-- 标题区域 -->
    <div class="timeline-header text-center mb-8">
      <h2 class="text-3xl md:text-4xl font-bold text-museum-dark mb-4">
        抗战14年历史时间线
      </h2>
      <p class="text-museum-dark/70 text-lg max-w-3xl mx-auto">
        从1931年九一八事变到1945年抗战胜利，中华民族经历了14年艰苦卓绝的抗日战争。
        点击时间线上的事件节点，了解详细历史信息。
      </p>
    </div>

    <!-- 图例 -->
    <div class="timeline-legend flex flex-wrap justify-center gap-4 mb-8">
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
        <span class="text-sm text-museum-dark/70">侵略事件</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
        <span class="text-sm text-museum-dark/70">抵抗事件</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
        <span class="text-sm text-museum-dark/70">重要战役</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
        <span class="text-sm text-museum-dark/70">胜利事件</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
        <span class="text-sm text-museum-dark/70">悲剧事件</span>
      </div>
    </div>

    <!-- 时间线容器 -->
    <div 
      ref="timelineContainer" 
      class="timeline-svg-container bg-white/80 backdrop-blur-md rounded-xl p-6 border border-red-200/20 shadow-lg"
    ></div>

    <!-- 事件详情弹窗 -->
    <div 
      v-if="showEventDetail && selectedEvent"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="closeEventDetail"
    >
      <div 
        class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <!-- 关闭按钮 -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center">
              <div 
                class="w-4 h-4 rounded-full mr-3"
                :style="{ backgroundColor: categoryColors[selectedEvent.category] }"
              ></div>
              <h3 class="text-2xl font-bold text-museum-dark">{{ selectedEvent.title }}</h3>
            </div>
            <button 
              @click="closeEventDetail"
              class="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <!-- 事件信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-red-50/50 rounded-lg p-3">
              <p class="text-sm text-red-600 font-medium">时间</p>
              <p class="text-museum-dark font-semibold">{{ selectedEvent.date }}</p>
            </div>
            <div class="bg-red-50/50 rounded-lg p-3">
              <p class="text-sm text-red-600 font-medium">地点</p>
              <p class="text-museum-dark font-semibold">{{ selectedEvent.location }}</p>
            </div>
            <div class="bg-red-50/50 rounded-lg p-3" v-if="selectedEvent.casualties">
              <p class="text-sm text-red-600 font-medium">伤亡情况</p>
              <p class="text-museum-dark font-semibold">{{ selectedEvent.casualties }}</p>
            </div>
            <div class="bg-red-50/50 rounded-lg p-3">
              <p class="text-sm text-red-600 font-medium">重要程度</p>
              <p class="text-museum-dark font-semibold">{{ importanceConfig[selectedEvent.importance].label }}</p>
            </div>
          </div>

          <!-- 事件描述 -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-museum-dark mb-3">事件详情</h4>
            <p class="text-museum-dark/80 leading-relaxed">{{ selectedEvent.description }}</p>
          </div>

          <!-- 历史意义 -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-museum-dark mb-3">历史意义</h4>
            <p class="text-museum-dark/80 leading-relaxed">{{ selectedEvent.significance }}</p>
          </div>

          <!-- 相关文物 -->
          <div v-if="selectedEvent.relatedArtifacts && selectedEvent.relatedArtifacts.length > 0">
            <h4 class="text-lg font-semibold text-museum-dark mb-3">相关文物</h4>
            <div class="flex gap-2">
              <span 
                v-for="artifact in selectedEvent.relatedArtifacts" 
                :key="artifact"
                class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
              >
                {{ artifact === 'rifle' ? '抗战步枪' : artifact === 'pistol' ? '抗战手枪' : artifact }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.war-timeline-container {
  padding: 2rem 1rem;
}

.timeline-svg-container {
  min-height: 400px;
  overflow-x: auto;
}

/* D3 样式 */
:deep(.time-axis) {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

:deep(.event-label) {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-legend {
    flex-direction: column;
    align-items: center;
  }
  
  .timeline-svg-container {
    padding: 1rem;
  }
}
</style>
