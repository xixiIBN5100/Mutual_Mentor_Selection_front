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
  target_agree?: number,
  admin_agree?: number,

  teacher_id?: number,

  admin_id?: number,
}

const useUserStore = defineStore("user",() => {
  const userIdentity = ref<string|undefined>();
  const userSession = reactive<userSessionType>({});

  const setUserIdentity = (identity: string|undefined) => {
    userIdentity.value = identity;
  };

  const setUserInfo = (info: userSessionType) : void =>{
    Object.assign(userSession,info);
    userSession.target_name = info.target_name;
  };

  return{
    userIdentity,
    userSession,
    setUserInfo,
    setUserIdentity
  };
},{ persist: true });

export default useUserStore;