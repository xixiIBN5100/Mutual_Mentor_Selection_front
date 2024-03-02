import { createRouter, createWebHistory } from "vue-router";
import { Login, Home, Approval, EditInfo, passwordChange, suggestionSubmit,studentInfo, TeacherList, FirstCho, reasonBase, suggestionFeedback, teacherSetTime, adminSetTime, secondCho, finalStu, chat, finishedSuggestion, avatar, checkFinishedApproval, checkWaitApproval,adminDeleteChoice,resetUserPass,} from "@/views";

import pinia from "@/stores/creatPinia";
import useLoginStore from "@/stores/service/loginStore";
import useUserStore from "@/stores/service/userStore";

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
    },
    {
      path:"/teacherSetTime",
      name:"teacherSetTime",
      component:teacherSetTime,
    },
    {
      path:"/adminSetTime",
      name:"adminSetTime",
      component:adminSetTime,
    },
    {
      path: "/secondCho",
      name: "secondCho",
      component: secondCho,
    },
    {
      path: "/finalStu",
      name: "finalStu",
      component: finalStu,
    },
    {
      path: "/chat",
      name: "chat",
      component: chat
    },
    {
      path: "/avatar",
      name: "avatar",
      component: avatar
    },
    {
      path: "/finishedSuggestion",
      name: "finishedSuggestion",
      component: finishedSuggestion,
    },
    {
      path: "/checkFinishedApproval",
      name: "checkFinishedApproval",
      component: checkFinishedApproval,
    },
    {
      path: "/checkWaitApproval",
      name: "checkWaitApproval",
      component: checkWaitApproval,
    },
    {
      path: "/adminDeleteChoice",
      name: "adminDeleteChoice",
      component: adminDeleteChoice,
    },
    {
      path: "/resetUserPass",
      name: "resetUserPass",
      component: resetUserPass,
    },

  ]
});

routes.beforeEach((to, _, next) => {
  const loginStore = useLoginStore(pinia);
  const userStore = useUserStore(pinia);
  if(loginStore.loginSession === false && to.path !== "/login"){
    next("/login");
  } else {
    next();
    if(userStore.userIdentity === "学生"){
      if(to.path === "/reasonBase" || to.path === "/suggestionFeedback" || to.path === "/teacherSetTime" || to.path === "/finalStu") {
        next("/home");
      } else {
        next();
      }
    } else if(userStore.userIdentity === "教师" || userStore.userIdentity === "管理员"){
      if(to.path === "/editInfo" || to.path === "/suggestion") {
        next("/home");
      } else {
        next();
      }
    }
  }
});

export default routes;
