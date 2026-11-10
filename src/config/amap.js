// 高德地图配置文件
export const AMAP_CONFIG = {
  // 高德地图API密钥 - 请在高德开放平台申请并替换
  key: 'YOUR_AMAP_KEY_HERE',
  
  // 高德地图API版本
  version: '1.4.15',
  
  // 需要加载的插件
  plugins: [
    'AMap.Scale',
    'AMap.OverView', 
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.Marker',
    'AMap.InfoWindow',
    'AMap.Polyline',
    'AMap.Polygon',
    'AMap.Circle'
  ],
  
  // 默认地图配置
  defaultMapOptions: {
    center: [116.397428, 39.90923], // 北京天安门
    zoom: 5,
    mapStyle: 'amap://styles/normal',
    features: ['bg', 'point', 'road', 'building'],
    viewMode: '2D'
  },
  
  // 静态地图配置
  staticMapConfig: {
    baseUrl: 'https://restapi.amap.com/v3/staticmap',
    defaultSize: '800*400',
    defaultScale: 2,
    maxMarkers: 10
  },
  
  // 标记图标配置
  markerIcons: {
    victory: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_g.png',
    defeat: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
    strategic_success: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
    default: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
  },
  
  // 地图样式选项
  mapStyles: {
    normal: 'amap://styles/normal',
    fresh: 'amap://styles/fresh',
    grey: 'amap://styles/grey',
    graffiti: 'amap://styles/graffiti',
    macaron: 'amap://styles/macaron',
    blue: 'amap://styles/blue',
    darkblue: 'amap://styles/darkblue',
    light: 'amap://styles/light'
  }
}

// 动态加载高德地图API
export const loadAmapAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
      return
    }
    
    const script = document.createElement('script')
    const pluginStr = AMAP_CONFIG.plugins.join(',')
    script.src = `https://webapi.amap.com/maps?v=${AMAP_CONFIG.version}&key=${AMAP_CONFIG.key}&plugin=${pluginStr}`
    
    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap)
      } else {
        reject(new Error('高德地图API加载失败'))
      }
    }
    
    script.onerror = () => {
      reject(new Error('高德地图API加载失败'))
    }
    
    document.head.appendChild(script)
  })
}

// 生成静态地图URL
export const generateStaticMapUrl = (options = {}) => {
  const {
    center = AMAP_CONFIG.defaultMapOptions.center,
    zoom = AMAP_CONFIG.defaultMapOptions.zoom,
    size = AMAP_CONFIG.staticMapConfig.defaultSize,
    scale = AMAP_CONFIG.staticMapConfig.defaultScale,
    markers = [],
    paths = [],
    labels = []
  } = options
  
  let url = `${AMAP_CONFIG.staticMapConfig.baseUrl}?`
  url += `location=${center[0]},${center[1]}`
  url += `&zoom=${zoom}`
  url += `&size=${size}`
  url += `&scale=${scale}`
  
  // 添加标记
  if (markers.length > 0) {
    const markerStr = markers.map(marker => {
      const { lng, lat, style = 'mid,0xFF0000,A' } = marker
      return `${lng},${lat}`
    }).join(';')
    url += `&markers=mid,0xFF0000,A:${markerStr}`
  }
  
  // 添加路径
  if (paths.length > 0) {
    const pathStr = paths.map(path => {
      const { coordinates, style = '5,0x0000FF,1' } = path
      const coordStr = coordinates.map(coord => `${coord[0]},${coord[1]}`).join(';')
      return `${style}:${coordStr}`
    }).join('|')
    url += `&paths=${pathStr}`
  }
  
  // 添加标签
  if (labels.length > 0) {
    const labelStr = labels.map(label => {
      const { lng, lat, content, style = '标签,0,0,16,0xFFFFFF,0x5288d8' } = label
      return `${style}:${lng},${lat}`
    }).join('|')
    url += `&labels=${labelStr}`
  }
  
  url += `&key=${AMAP_CONFIG.key}`
  
  return url
}

// 验证API密钥是否已配置
export const validateApiKey = () => {
  if (AMAP_CONFIG.key === 'YOUR_AMAP_KEY_HERE') {
    console.warn('请在 src/config/amap.js 中配置您的高德地图API密钥')
    return false
  }
  return true
}

// 获取标记图标URL
export const getMarkerIcon = (type) => {
  return AMAP_CONFIG.markerIcons[type] || AMAP_CONFIG.markerIcons.default
}
