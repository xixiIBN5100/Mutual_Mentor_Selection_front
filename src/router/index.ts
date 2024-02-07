import firstCho from "../views/First_cho/index.vue";
import { createRouter, createWebHistory } from "vue-router";
import { Login, Home, Approval, EditInfo } from "@/views";

const routes = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/approval",
      name: "approval",
      component: Approval
    },
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/editInfo",
      name: "edit-info",
      component: EditInfo
    }
  ]
});


export default routes;
