import {defineStore} from 'pinia';
import {ref , reactive} from "vue";

const userStore = defineStore(
  "user",
  ()=>{
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
    const setUserInfo = (info) : void =>{
      userSession.name=info.name;
      userSession.student_id=info.student_id;
      userSession.class=info.class;
      userSession.phone=info.phone;
      userSession.political_status=info.political_status;
      userSession.email=info.email;
      userSession.address=info.address;
      userSession.plan=info.plan;
      userSession.experience=info.experience;
      userSession.honor = info.honor;
      userSession.interest=info.interest;
      userSession.teacher_id=info.teacher_id;
    };
    return{
      userSession,
      setUserInfo,
    };
  }
);
export default userStore;