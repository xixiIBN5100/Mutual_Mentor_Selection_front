import { createRouter, createWebHistory } from 'vue-router'
import { Login, Home,} from '@/views';

const routes = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path:'/',
      redirect:"/home",
    }
    
  ]
});


export default routes
