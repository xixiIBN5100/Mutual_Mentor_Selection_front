import { createRouter, createWebHistory } from "vue-router";
import { Login, Home, Approval, EditInfo, passwordChange } from "@/views";

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
      redirect: "/login",
    },
    {
      path: "/editInfo",
      name: "edit-info",
      component: EditInfo
    },
    {
      path: "/password",
      name: "passwordChange",
      component: passwordChange
    }
  ]
});


export default routes;
