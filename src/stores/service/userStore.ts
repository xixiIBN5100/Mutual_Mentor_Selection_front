import {defineStore} from 'pinia';
import {reactive, ref} from "vue";

const useUserStore = defineStore("user",() => {
    const userIdentity = ref<string>();
    const userSession = reactive({
      name: "",
      student_id: -1,
      class: "",
      phone: -1,
      political_status: "",
      email: "",
      address: "",
      plan: "",
      experience: "",
      honor: "",
      interest: "",
      teacher_id: -1,
    });

    /* --- 测试用数据 --- */
    // const userIdentity = ref<string>("学生");
    // const userSession = reactive({
    //   name:"Rosyr",
    //   student_id: 114514,
    //   class: "1班",
    //   phone: 13711451419,
    //   political_status: "群众",
    //   email: "syr050301@qq.com",
    //   address:"xx区x-x-x0x",
    //   plan: "",
    //   experience: "",
    //   honor: "",
    //   interest: "出国",
    //   teacher_id:-1,
    // });
    /* --- 测试用数据 --- */

    const setUserIdentity = (identity: string) => {
      userIdentity.value = identity;
    };

    const setUserInfo = (info:any) : void =>{
      Object.assign(userSession,info);
    };

    return{
      userIdentity,
      userSession,
      setUserInfo,
      setUserIdentity
    };
  }
);

export default useUserStore;