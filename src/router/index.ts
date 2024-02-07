import { createRouter, createWebHistory } from 'vue-router'
import { Login, Home } from '@/views';
import firstCho from "../views/First_cho/index.vue";

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
    },
    {
      path:'/firstcho',
      name:'First_cho',
      component:firstCho,
    }
  ]
});


export default routes
