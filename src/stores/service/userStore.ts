import {defineStore} from "pinia";
import {reactive, ref} from "vue";

export interface userSessionType {
  name?: string,
  studentID?: number,
  class?: string,
  phone?: number,
  political_status?: string,
  email?: string,
  address?: string,
  plan?: string,
  experience?: string,
  honor?: string,
  interest?: string,
  teacher_name?: string,
  target_name?: string,
  teacher_id?: number,
  target_agree?: number,
  admin_agree?: number,
  admin_id?: number,
}

const useUserStore = defineStore("user",() => {
  // const userIdentity = ref<string>();
  // const userSession = reactive<userSessionType>({});

  /* --- 测试用数据 --- */
  const userIdentity = ref<string>("学生");

  // userSession.student_id = 114514;
  const userSession = reactive<userSessionType>({
    name:"Rosyr",

    studentID: 114514,
    class: "1班",
    phone: 13711451419,
    political_status: "群众",
    email: "syr050301@qq.com",
    address:"xx区x-x-x0x",
    plan: "",
    experience: "",
    honor: "1",
    interest: "出国",
    target_name:"",
    teacher_id: -1,
    admin_id: -1,
  });
  /* --- 测试用数据 --- */

  const setUserIdentity = (identity: string) => {
    userIdentity.value = identity;
  };

  const setUserInfo = (info: userSessionType) : void =>{
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