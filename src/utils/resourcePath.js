/**
 * 获取正确的资源路径
 * @param {string} path - 相对于public目录的路径
 * @returns {string} - 完整的资源路径
 */
export const getPublicResourcePath = (path) => {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  // 简化处理，直接返回路径
  return normalizedPath
}

/**
 * 加载JSON资源的工具函数
 * @param {string} path - JSON文件路径
 * @returns {Promise<Object>} - JSON数据
 */
export const loadJsonResource = async (path) => {
  try {
    const fullPath = getPublicResourcePath(path)
    console.log(`正在加载资源: ${fullPath}`)
    
    const response = await fetch(fullPath)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('响应内容:', text.substring(0, 200))
      throw new Error('响应不是有效的JSON格式')
    }
    
    return await response.json()
  } catch (error) {
    console.error(`加载资源失败 (${path}):`, error)
    throw error
  }
} 