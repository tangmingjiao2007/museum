<script setup>
import { ref, onMounted, nextTick } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { battleStatistics } from '../data/warData.js'

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// 响应式数据
const activeTab = ref('forces') // forces, casualties, duration
const chartData = ref({})
const chartOptions = ref({})

// 组件挂载后初始化图表
onMounted(async () => {
  await nextTick()
  updateChart('forces')
})

// 更新图表数据
const updateChart = (type) => {
  activeTab.value = type
  
  switch (type) {
    case 'forces':
      setupForcesChart()
      break
    case 'casualties':
      setupCasualtiesChart()
      break
    case 'duration':
      setupDurationChart()
      break
  }
}

// 参战兵力对比图表
const setupForcesChart = () => {
  chartData.value = {
    labels: battleStatistics.map(battle => battle.name),
    datasets: [
      {
        label: '中国军队',
        data: battleStatistics.map(battle => battle.chineseForces),
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 1
      },
      {
        label: '日军',
        data: battleStatistics.map(battle => battle.japaneseForces),
        backgroundColor: 'rgba(75, 85, 99, 0.8)',
        borderColor: 'rgba(75, 85, 99, 1)',
        borderWidth: 1
      }
    ]
  }
  
  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '重要战役参战兵力对比',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#374151'
      },
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          },
          color: '#374151'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}人`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return (value / 10000).toFixed(0) + '万'
          },
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        }
      },
      x: {
        ticks: {
          color: '#6b7280',
          maxRotation: 45
        },
        grid: {
          display: false
        }
      }
    }
  }
}

// 伤亡对比图表
const setupCasualtiesChart = () => {
  chartData.value = {
    labels: battleStatistics.map(battle => battle.name),
    datasets: [
      {
        label: '中国军队伤亡',
        data: battleStatistics.map(battle => battle.chineseCasualties),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      },
      {
        label: '日军伤亡',
        data: battleStatistics.map(battle => battle.japaneseCasualties),
        backgroundColor: 'rgba(107, 114, 128, 0.8)',
        borderColor: 'rgba(107, 114, 128, 1)',
        borderWidth: 1
      }
    ]
  }
  
  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '重要战役伤亡对比',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#374151'
      },
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          },
          color: '#374151'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}人`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return (value / 10000).toFixed(0) + '万'
          },
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        }
      },
      x: {
        ticks: {
          color: '#6b7280',
          maxRotation: 45
        },
        grid: {
          display: false
        }
      }
    }
  }
}

// 战役持续时间图表
const setupDurationChart = () => {
  chartData.value = {
    labels: battleStatistics.map(battle => battle.name),
    datasets: [
      {
        label: '战役持续时间',
        data: battleStatistics.map(battle => battle.duration),
        backgroundColor: battleStatistics.map(battle => {
          // 根据战果设置颜色
          switch (battle.result) {
            case 'victory': return 'rgba(16, 185, 129, 0.8)'
            case 'strategic_success': return 'rgba(245, 158, 11, 0.8)'
            default: return 'rgba(107, 114, 128, 0.8)'
          }
        }),
        borderColor: battleStatistics.map(battle => {
          switch (battle.result) {
            case 'victory': return 'rgba(16, 185, 129, 1)'
            case 'strategic_success': return 'rgba(245, 158, 11, 1)'
            default: return 'rgba(107, 114, 128, 1)'
          }
        }),
        borderWidth: 1
      }
    ]
  }
  
  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '重要战役持续时间',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#374151'
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const battle = battleStatistics[context.dataIndex]
            const resultText = battle.result === 'victory' ? '胜利' : 
                             battle.result === 'strategic_success' ? '战略成功' : '其他'
            return [
              `持续时间: ${context.parsed.y}天`,
              `战果: ${resultText}`
            ]
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '天数',
          color: '#6b7280'
        },
        ticks: {
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        }
      },
      x: {
        ticks: {
          color: '#6b7280',
          maxRotation: 45
        },
        grid: {
          display: false
        }
      }
    }
  }
}
</script>

<template>
  <div class="battle-statistics-container">
    <!-- 标题区域 -->
    <div class="statistics-header text-center mb-8">
      <h2 class="text-3xl md:text-4xl font-bold text-museum-dark mb-4">
        重要战役统计分析
      </h2>
      <p class="text-museum-dark/70 text-lg max-w-3xl mx-auto">
        通过数据可视化展示抗战期间重要战役的规模、伤亡和持续时间，
        直观了解中华民族抗战的艰苦历程和伟大胜利。
      </p>
    </div>

    <!-- 选项卡 -->
    <div class="flex justify-center mb-8">
      <div class="bg-white/80 backdrop-blur-md rounded-lg p-1 border border-red-200/20 shadow-lg">
        <button
          @click="updateChart('forces')"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'forces' 
              ? 'bg-red-600 text-white shadow-md' 
              : 'text-museum-dark/70 hover:text-museum-dark hover:bg-red-50'
          ]"
        >
          参战兵力
        </button>
        <button
          @click="updateChart('casualties')"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'casualties' 
              ? 'bg-red-600 text-white shadow-md' 
              : 'text-museum-dark/70 hover:text-museum-dark hover:bg-red-50'
          ]"
        >
          伤亡对比
        </button>
        <button
          @click="updateChart('duration')"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === 'duration' 
              ? 'bg-red-600 text-white shadow-md' 
              : 'text-museum-dark/70 hover:text-museum-dark hover:bg-red-50'
          ]"
        >
          持续时间
        </button>
      </div>
    </div>

    <!-- 图表容器 -->
    <div class="chart-container bg-white/80 backdrop-blur-md rounded-xl p-6 border border-red-200/20 shadow-lg">
      <div class="chart-wrapper" style="height: 400px;">
        <Bar 
          :data="chartData" 
          :options="chartOptions"
          v-if="Object.keys(chartData).length > 0"
        />
      </div>
    </div>

    <!-- 数据说明 -->
    <div class="statistics-notes mt-8 bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-md rounded-xl p-6 border border-red-200/30 shadow-lg">
      <h3 class="text-lg font-semibold text-museum-dark mb-4">数据说明</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-museum-dark/70">
        <div>
          <h4 class="font-medium text-museum-dark mb-2">参战兵力</h4>
          <p>显示中日双方在重要战役中投入的兵力规模，体现战役的重要程度和激烈程度。</p>
        </div>
        <div>
          <h4 class="font-medium text-museum-dark mb-2">伤亡对比</h4>
          <p>展示战役中双方的伤亡情况，反映战争的残酷性和中国军民的巨大牺牲。</p>
        </div>
        <div>
          <h4 class="font-medium text-museum-dark mb-2">持续时间</h4>
          <p>战役持续的天数，颜色表示战果：绿色为胜利，橙色为战略成功。</p>
        </div>
        <div>
          <h4 class="font-medium text-museum-dark mb-2">历史意义</h4>
          <p>这些数据见证了中华民族14年抗战的艰苦历程和最终胜利的来之不易。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.battle-statistics-container {
  padding: 2rem 1rem;
}

.chart-wrapper {
  position: relative;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .statistics-notes .grid {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    padding: 1rem;
  }
}
</style>
