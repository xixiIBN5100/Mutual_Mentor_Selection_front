import {defineStore} from 'pinia';
import {reactive} from "vue";

const useUserStore = defineStore("user",() => {
    const userSession = reactive({
      name:"",
      student_id:-1,
      class:"",
      phone:-1,
      political_status:"",
      email:"",
      address:"",
      plan:"",
      experience:"",
      honor:"",
      interest:"",
      teacher_id:-1,
    });
    const setUserInfo = (info:any) : void =>{
      Object.assign(userSession,info);
    };

    return{
      userSession,
      setUserInfo,
    };
  }
);

export default useUserStore;