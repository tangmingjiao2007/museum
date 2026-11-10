import { createRouter, createWebHistory } from 'vue-router'
import ExhibitList from '../components/ExhibitList.vue'
import CollectionList from '../components/CollectionList.vue'
import ExhibitChat from '../components/ExhibitChat.vue'
import About from '../components/About.vue'
import WarExhibit from '../components/WarExhibit.vue'
import WarExhibitDetail from '../components/WarExhibitDetail.vue'
import WarDataVisualization from '../components/WarDataVisualization.vue'
import ProvinceWarDetail from '../components/ProvinceWarDetail.vue'
import EChartsInteractiveChinaMap from '../components/EChartsInteractiveChinaMap.vue'
import WarWeapons from '../components/WarWeapons.vue'
import WarDailyItems from '../components/WarDailyItems.vue'
import WarArchitecture from '../components/WarArchitecture.vue'
import WarBattleDataViz from '../components/WarBattleDataViz.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/HomePage.vue')
  },
  {
    path: '/exhibit',
    name: 'exhibit',
    component: ExhibitList
  },
  {
    path: '/exhibit/:id',
    name: 'exhibit-detail',
    component: ExhibitList,
    props: true
  },
  {
    path: '/collection',
    name: 'collection',
    component: CollectionList
  },
  {
    path: '/exhibit-chat/:id',
    name: 'exhibit-chat',
    component: ExhibitChat,
    props: true
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/war-exhibit',
    name: 'war-exhibit',
    component: WarExhibit
  },
  {
    path: '/war-detail/:id',
    name: 'war-detail',
    component: WarExhibitDetail,
    props: true
  },
  {
    path: '/war-data',
    name: 'war-data',
    component: WarDataVisualization
  },

  {
    path: '/province/:id',
    name: 'province-detail-by-id',
    component: ProvinceWarDetail,
    props: true
  },
  {
    path: '/province/name/:name',
    name: 'province-detail-by-name',
    component: ProvinceWarDetail,
    props: true
  },
  {
    path: '/interactive-china-map',
    name: 'interactive-china-map',
    component: EChartsInteractiveChinaMap
  },
  {
    path: '/war-weapons',
    name: 'war-weapons',
    component: WarWeapons
  },
  {
    path: '/war-daily-items',
    name: 'war-daily-items',
    component: WarDailyItems
  },
  {
    path: '/war-architecture',
    name: 'war-architecture',
    component: WarArchitecture
  },
  {
    path: '/war-map',
    name: 'war-map',
    component: EChartsInteractiveChinaMap
  },
  {
    path: '/war-battle-dataviz',
    name: 'war-battle-dataviz',
    component: WarBattleDataViz
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（比如浏览器前进后退），则使用保存的位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则立即滚动到顶部
    return { top: 0, left: 0 }
  }
})

export default router
