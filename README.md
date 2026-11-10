# 抗战文物数字展示与战役数据可视化系统 V1.0

这是一个基于Vue 3的博物馆展示系统，专注于抗战历史的数字化展示。项目集成了高德地图API，提供交互式历史地图功能。

## 功能特性

### 核心功能
- 📚 **展品展示**: 丰富的抗战历史文物和资料展示
- 🗺️ **交互式地图**: 基于高德地图的抗战历史地图
- 📊 **数据可视化**: 战役统计和时间线展示
- 💬 **AI聊天**: 智能问答系统
- 📱 **响应式设计**: 支持多种设备访问

### 地图功能
- **动态地图**: 支持缩放、拖拽、标记点击等交互
- **静态地图**: 生成高质量的地图图片
- **历史时间线**: 按时间顺序展示抗战重要事件
- **战役标记**: 在地图上标注重要战役位置
- **信息窗体**: 详细的战役信息展示

## 技术栈

- **前端框架**: Vue 3 + Vite
- **路由管理**: Vue Router 4
- **样式框架**: Tailwind CSS
- **地图服务**: 高德地图API
- **图表库**: Chart.js + D3.js
- **3D模型**: Model Viewer

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置高德地图API

1. 访问 [高德开放平台](https://lbs.amap.com/) 申请API密钥
2. 在 `src/config/amap.js` 中配置您的密钥：

```javascript
export const AMAP_CONFIG = {
  key: 'YOUR_AMAP_KEY_HERE', // 替换为您的实际密钥
  // ... 其他配置
}
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/          # Vue组件
│   ├── AmapWarMap.vue      # 高德抗战地图组件
│   ├── StaticMapDemo.vue   # 静态地图演示
│   ├── ChinaMapDemo.vue    # 地图演示组件
│   └── ...                 # 其他组件
├── config/             # 配置文件
│   └── amap.js            # 高德地图配置
├── data/               # 数据文件
│   └── warData.js         # 抗战历史数据
├── router/             # 路由配置
└── assets/             # 静态资源
```

## 高德地图集成

### 配置说明

项目已集成高德地图API，支持以下功能：

1. **动态地图**: 完整的交互式地图功能
2. **静态地图**: 生成地图图片的API调用
3. **标记管理**: 添加、删除、自定义标记
4. **信息窗体**: 点击标记显示详细信息

### 使用示例

```javascript
// 动态加载地图API
import { loadAmapAPI } from '@/config/amap.js'

const initMap = async () => {
  await loadAmapAPI()
  const map = new window.AMap.Map('container', options)
}

// 生成静态地图
import { generateStaticMapUrl } from '@/config/amap.js'

const staticUrl = generateStaticMapUrl({
  center: [116.397428, 39.90923],
  zoom: 10,
  markers: [{ lng: 116.397428, lat: 39.90923 }]
})
```

### 页面导航

- `/amap-war` - 高德抗战历史地图
- `/static-map-demo` - 静态地图API演示
- `/china-map-demo` - 基础地图演示

## 数据格式

### 战役数据结构

```javascript
{
  id: 1,
  name: '九一八事变',
  date: '1931-09-18',
  coordinates: [123.4, 41.8], // [经度, 纬度]
  type: 'invasion',
  result: 'defeat', // victory, defeat, strategic_success
  description: '事件描述',
  casualties: {
    chinese: 400,
    japanese: 2
  }
}
```

## 开发指南

### 添加新的地图功能

1. 在 `src/config/amap.js` 中添加新的配置
2. 创建新的Vue组件
3. 在路由中注册新页面
4. 更新导航菜单

### 自定义地图样式

支持多种预设样式：
- `normal` - 标准地图
- `fresh` - 清新蓝绿
- `grey` - 幻影黑
- `macaron` - 马卡龙

### 添加新的战役数据

在 `src/data/warData.js` 中添加新的战役信息：

```javascript
export const battleLocations = [
  // 添加新的战役数据
  {
    id: newId,
    name: '战役名称',
    date: 'YYYY-MM-DD',
    coordinates: [经度, 纬度],
    // ... 其他字段
  }
]
```

## 注意事项

1. **API密钥安全**: 请妥善保管高德地图API密钥
2. **使用限制**: 注意API调用次数限制
3. **网络依赖**: 地图功能需要网络连接
4. **浏览器兼容**: 建议使用现代浏览器

## 故障排除

### 常见问题

1. **地图无法显示**
   - 检查API密钥配置
   - 确认网络连接
   - 查看控制台错误信息

2. **标记不显示**
   - 检查坐标格式
   - 确认坐标范围

3. **静态地图生成失败**
   - 检查参数格式
   - 确认标记数量限制

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 项目讨论区

---

*最后更新: 2024年12月*

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
