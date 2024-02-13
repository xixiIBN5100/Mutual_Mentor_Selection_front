import { createRouter, createWebHistory } from "vue-router";
import { Login, Home, Approval, EditInfo, passwordChange, suggestionSubmit,studentInfo, TeacherList, FirstCho, reasonBase, suggestionFeedback } from "@/views";

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
      path:"/teacherList",
      name:"teacharlist",
      component: TeacherList,
    },
    {
      path:"/firstCho",
      name:"firstCho",
      component: FirstCho,
    },{
      path: "/password",
      name: "passwordChange",
      component: passwordChange
    },
    {
      path: "/suggestion",
      name: "suggestionSubmit",
      component: suggestionSubmit
    },
    {
      path: "/studentInfo",
      name: "studentInfo",
      component: studentInfo
    },
    {
      path: "/reasonBase",
      name: "reasonBase",
      component: reasonBase
    },
    {
      path: "/suggestionFeedback",
      name: "suggestionFeedback",
      component: suggestionFeedback
    }
  ]
});


export default routes;
