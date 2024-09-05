import { createRouter, createWebHistory } from 'vue-router'
import ExplorePageView from '../views/ExplorePageView.vue'
import LoginPageView from '../views/LoginPageView.vue'
import RegisterPageView from '../views/RegisterPageView.vue'
import VideoDetailPageView from '../views/VideoDetailPageView.vue'
import UserDetailPageView from '../views/UserDetailPageView.vue'
import TrendsPageView from '../views/TrendsPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/explore' },
    {
      path: '/explore',
      name: 'explore',
      component: ExplorePageView
    },
    {
      path: '/trends',
      name: 'trends',
      component: TrendsPageView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPageView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPageView
    },
    {
      path: '/:videoId',
      name: 'videoDetail',
      component: VideoDetailPageView
    },
    {
      path: '/user/:userId',
      name: 'userDetail',
      component: UserDetailPageView
    }
    
  ]
})

export default router
