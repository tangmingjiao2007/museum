import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import os from 'node:os'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/', // 恢复默认的绝对路径
  // 依赖缓存放到系统临时目录，避免项目目录写入受限
  cacheDir: path.join(os.tmpdir(), 'museum-vite-cache'),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // 确保public目录下的文件正确复制
  publicDir: 'public'
})
